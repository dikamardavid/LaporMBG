"""In-request Ridge regression: a diagnostic tool for nutritionists, not a persisted model.

The service is stateless and has no DB, so there is nowhere to persist a trained
artifact yet, and no scheduled retraining pipeline exists. The caller (the future
Next.js backend) passes historical (feature, waste_score) observations it has
queried from Postgres; we fit a small Ridge pipeline per-request and return
coefficients/importances plus optional predictions. This trades cross-request
model caching for zero infrastructure and a composable contract: a later issue
can add a `/train` + artifact store endpoint without breaking this one's shape.
"""

from dataclasses import dataclass

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import Ridge
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

NUMERIC_FEATURES = ["day_of_week", "holding_time_minutes", "departure_temperature_celsius"]
CATEGORICAL_FEATURES = ["component_type"]
MIN_OBSERVATIONS_FOR_STABLE_FIT = 20


@dataclass
class FeatureCoefficientData:
    feature_name: str
    coefficient: float
    standardized_importance: float


@dataclass
class RegressionResultData:
    r_squared: float
    n_observations: int
    coefficients: list[FeatureCoefficientData]
    predictions: list[float]
    warnings: list[str]


def _rows_to_frame(rows: list[dict]) -> pd.DataFrame:
    return pd.DataFrame(rows)


def _build_pipeline() -> Pipeline:
    return Pipeline(
        [
            (
                "preprocess",
                ColumnTransformer(
                    [
                        ("num", StandardScaler(), NUMERIC_FEATURES),
                        ("cat", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
                    ]
                ),
            ),
            ("model", Ridge(alpha=1.0)),
        ]
    )


def _extract_coefficients(pipeline: Pipeline) -> list[FeatureCoefficientData]:
    feature_names = pipeline.named_steps["preprocess"].get_feature_names_out()
    coefs = pipeline.named_steps["model"].coef_
    max_abs = float(np.max(np.abs(coefs))) if len(coefs) else 1.0
    max_abs = max_abs or 1.0
    return [
        FeatureCoefficientData(
            feature_name=name,
            coefficient=round(float(coef), 6),
            standardized_importance=round(abs(float(coef)) / max_abs, 6),
        )
        for name, coef in zip(feature_names, coefs, strict=True)
    ]


def fit_and_explain(
    training_rows: list[dict],
    predict_rows: list[dict],
) -> RegressionResultData:
    training_df = _rows_to_frame(training_rows)
    y = training_df.pop("plate_waste_score")
    x = training_df[NUMERIC_FEATURES + CATEGORICAL_FEATURES]

    pipeline = _build_pipeline()
    pipeline.fit(x, y)

    r_squared = round(float(pipeline.score(x, y)), 4)
    coefficients = _extract_coefficients(pipeline)

    predictions: list[float] = []
    if predict_rows:
        predict_df = _rows_to_frame(predict_rows)[NUMERIC_FEATURES + CATEGORICAL_FEATURES]
        predictions = [round(float(p), 2) for p in pipeline.predict(predict_df)]

    warnings: list[str] = []
    if len(training_rows) < MIN_OBSERVATIONS_FOR_STABLE_FIT:
        warnings.append(
            f"n_observations ({len(training_rows)}) < {MIN_OBSERVATIONS_FOR_STABLE_FIT}; "
            "coefficients may be unstable"
        )

    return RegressionResultData(
        r_squared=r_squared,
        n_observations=len(training_rows),
        coefficients=coefficients,
        predictions=predictions,
        warnings=warnings,
    )
