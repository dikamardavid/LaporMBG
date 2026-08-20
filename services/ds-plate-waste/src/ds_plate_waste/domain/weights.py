"""Documented, tunable scoring constants — the "weighted formula" this service implements.

These are explicit domain judgment calls, not values fit from data, so the formula
stays explainable and auditable by QA against a hand-computed test dataset.
"""

from ds_plate_waste.schemas.common import PlateWasteLevel

WASTE_LEVEL_WEIGHTS: dict[PlateWasteLevel, float] = {
    PlateWasteLevel.HABIS_TOTAL: 0.0,
    PlateWasteLevel.SISA_SEDIKIT: 25.0,
    PlateWasteLevel.SISA_SEPARUH: 60.0,
    PlateWasteLevel.HAMPIR_TIDAK_DIMAKAN: 100.0,
}
"""Per-response waste severity, 0 (nothing wasted) to 100 (maximal waste).

Front-loaded toward severity rather than linear (0/33/67/100): "half left"
(SISA_SEPARUH) is weighted 60 not 50, and "barely eaten" is a full 100,
reflecting that these categories represent qualitatively worse food
acceptance, not just proportionally more mass left on the plate.
"""

EXPECTED_RESPONSE_RATE = 0.3
"""Assumed fraction of distributed portions that will yield a feedback submission.

Used only to compute a confidence heuristic (response_count vs portions_distributed),
since submission is optional and quota-limited per ADR-0001/0003.
"""

DOMINANT_TAG_LIMIT = 5
"""Max number of dominant_reason_tags returned per component score."""
