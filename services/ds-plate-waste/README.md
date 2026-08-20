# ds-plate-waste

FastAPI microservice implementing GitHub issue [#27](https://github.com/dikamardavid/LaporMBG/issues/27):
**Plate Waste Score Index & Menu Waste Regression Model**.

## What this service is (and isn't)

- **Stateless, push-based REST.** The (future) Next.js backend queries Postgres for
  batch/manifest/feedback data and POSTs it to this service. This service has **no
  database connection of its own** and performs no auth/tenant-scoping — `sppg_id`
  and `school_id` fields are opaque passthrough identifiers, echoed back for
  audit/logging only. Tenant authorization is entirely the caller's responsibility.
- **A deliberate deviation from [ADR-0004](../../docs/adr/0004-nextjs-postgres-single-db-multitenant.md)**
  (single TypeScript/Next.js/Postgres stack), scoped to data-science workloads.
  See [ADR-0007](../../docs/adr/0007-ds-microservice-fastapi-deviation.md) for the
  rationale.
- Sibling DS issues [#28](https://github.com/dikamardavid/LaporMBG/issues/28) (NLP
  sentiment clustering) and [#29](https://github.com/dikamardavid/LaporMBG/issues/29)
  (SPPG risk radar) are **not** implemented here — this service is scoped to #27
  only, though its `domain/` structure leaves room for them as siblings or a later
  consolidation.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/healthz` | Liveness check |
| `GET` | `/readyz` | Readiness check |
| `POST` | `/v1/plate-waste-score` | Compute per-component + overall Plate Waste Score for one batch |
| `POST` | `/v1/menu-recommendations` | Turn component scores into portion/recipe recommendations for nutritionists |
| `POST` | `/v1/waste-regression` | Fit an in-request Ridge regression explaining which factors correlate with waste |

Full request/response schemas are available at `/docs` (Swagger UI) and
`/openapi.json` once the service is running — this is the canonical, versioned
contract the future Next.js integration should codegen a client against.

## Scoring formula

Each student feedback entry's `waste_level` (from the 4-step visual Plate Waste
Selector) maps to a documented severity weight:

| `waste_level` | Weight |
|---|---|
| `HABIS_TOTAL` (fully eaten) | 0 |
| `SISA_SEDIKIT` (little left) | 25 |
| `SISA_SEPARUH` (half left) | 60 |
| `HAMPIR_TIDAK_DIMAKAN` (barely eaten) | 100 |

Weights are front-loaded toward severity (60, not 50, for "half left") rather than
linear — these categories represent qualitatively worse food acceptance, not just
proportionally more mass left on the plate. Weights live in
`src/ds_plate_waste/domain/weights.py` as documented, tunable constants — not
values fit from data — so the formula stays explainable and auditable.

- `plate_waste_score` per component = arithmetic mean of severity weights across
  that component's feedback entries.
- `overall_batch_score` = average across components, weighted by each
  component's `response_count` (so components with more feedback dominate the
  batch score).
- `confidence` = `response_count / (portions_distributed * 0.3)`, capped at 1.0 —
  a heuristic flag for low-sample-size scores, since feedback submission is
  optional and quota-limited (ADR-0001/0003).

Recommendations (`/v1/menu-recommendations`) are **rule-based**, not ML: severity
(`INFO`/`WATCH`/`ACTION_REQUIRED`) comes from `plate_waste_score` thresholds, and
suggested actions/text come from a `TAG_ACTION_MAP` lookup table
(`domain/recommendations.py`) keyed on the component's dominant reason tags.

## Regression model trade-off

`/v1/waste-regression` fits a `scikit-learn` `Ridge` pipeline **per-request** on
`training_rows` the caller supplies, rather than a persisted, pre-trained
artifact. This is a deliberate choice, not an oversight:

- There is no real training data source yet — Epic 2 (Manifest) and Epic 4
  (Student Feedback) don't exist as real tables.
- The service is intentionally stateless with no DB — there's nowhere to persist
  a trained model or version it.
- Fitting in-request keeps the contract composable: request payloads are
  expected to be small (dozens to low-hundreds of batch-days), and a later issue
  can add a `/v1/waste-regression/train` + artifact store endpoint without
  breaking this one's shape.
- The trade-off: no cross-request model caching, and coefficients may be
  unstable below ~20 observations (the response includes a `warnings` field
  when this happens).

This endpoint is a **diagnostic tool** for nutritionists ("which factors
correlate with high waste?"), not a production scoring pipeline.

## Local development

Requires [`uv`](https://docs.astral.sh/uv/).

```bash
cd services/ds-plate-waste
uv sync --extra dev
uv run uvicorn ds_plate_waste.main:app --reload --port 8001
```

Smoke test:

```bash
curl -sS http://localhost:8001/healthz

curl -sS -X POST http://localhost:8001/v1/plate-waste-score \
  -H "Content-Type: application/json" \
  -d '{
    "batch_id": "batch-001", "sppg_id": "sppg-01", "school_id": "school-01",
    "service_date": "2026-08-20", "portions_distributed": 100,
    "menu_components": [
      {"component_type": "SAYUR", "recipe_name": "Tumis Kangkung",
       "holding_time_minutes": 90, "departure_temperature_celsius": 68}
    ],
    "feedback_submissions": [
      {"submission_id": "s1", "components": [
        {"component_type": "SAYUR", "waste_level": "SISA_SEPARUH", "taste_rating": 3,
         "reason_tags": [{"tag_id": "sayur_terlalu_lembek"}]}
      ]}
    ]
  }' | python3 -m json.tool
```

## Tests

```bash
uv run pytest -v
uv run ruff check src tests
```

- `tests/test_scoring_formula.py` — pure unit tests on the scoring formula
  (boundary cases, weighted averages, empty-input safety).
- `tests/test_recommendations.py` — severity threshold boundaries, tag-to-action
  lookups, fallback behavior.
- `tests/test_regression.py` — synthetic dataset with a known linear
  relationship; asserts coefficient sign and low-sample-size warnings.
- `tests/test_api_contract.py` — FastAPI `TestClient` integration tests across
  all three endpoints, including 422 validation failures.

## Docker

```bash
docker compose build ds-plate-waste
docker compose up ds-plate-waste
curl http://localhost:8001/healthz
```
