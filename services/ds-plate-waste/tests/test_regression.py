import random

from ds_plate_waste.domain.regression import fit_and_explain


def _synthetic_rows(n: int = 40, seed: int = 42) -> list[dict]:
    rng = random.Random(seed)
    rows = []
    for _ in range(n):
        holding_time = rng.uniform(30, 240)
        departure_temp = rng.uniform(55, 75)
        day_of_week = rng.randint(0, 6)
        component_type = rng.choice(["LAUK_UTAMA", "SAYUR", "NASI", "BUAH"])
        # known relationship: waste increases with holding_time, small noise
        waste_score = min(100.0, max(0.0, 0.3 * holding_time + rng.uniform(-5, 5)))
        rows.append(
            {
                "component_type": component_type,
                "day_of_week": day_of_week,
                "holding_time_minutes": holding_time,
                "departure_temperature_celsius": departure_temp,
                "plate_waste_score": waste_score,
            }
        )
    return rows


def test_fit_recovers_positive_holding_time_coefficient_sign():
    rows = _synthetic_rows()
    result = fit_and_explain(training_rows=rows, predict_rows=[])

    holding_coef = next(
        c for c in result.coefficients if c.feature_name == "num__holding_time_minutes"
    )
    assert holding_coef.coefficient > 0


def test_r_squared_and_n_observations_present():
    rows = _synthetic_rows()
    result = fit_and_explain(training_rows=rows, predict_rows=[])
    assert 0.0 <= result.r_squared <= 1.0
    assert result.n_observations == len(rows)


def test_warns_when_below_min_observations():
    rows = _synthetic_rows(n=6)
    result = fit_and_explain(training_rows=rows, predict_rows=[])
    assert any("< 20" in w for w in result.warnings)


def test_no_warning_when_at_or_above_min_observations():
    rows = _synthetic_rows(n=20)
    result = fit_and_explain(training_rows=rows, predict_rows=[])
    assert result.warnings == []


def test_predictions_returned_aligned_with_predict_rows():
    rows = _synthetic_rows()
    predict_rows = [
        {
            "component_type": "SAYUR",
            "day_of_week": 1,
            "holding_time_minutes": 60,
            "departure_temperature_celsius": 65,
        },
        {
            "component_type": "NASI",
            "day_of_week": 2,
            "holding_time_minutes": 200,
            "departure_temperature_celsius": 60,
        },
    ]
    result = fit_and_explain(training_rows=rows, predict_rows=predict_rows)
    assert len(result.predictions) == 2
    # higher holding_time_minutes row should predict higher waste, given the synthetic relationship
    assert result.predictions[1] > result.predictions[0]
