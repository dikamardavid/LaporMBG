from fastapi import APIRouter

from ds_plate_waste.domain.regression import fit_and_explain
from ds_plate_waste.schemas.regression import (
    FeatureCoefficient,
    WasteRegressionRequest,
    WasteRegressionResponse,
)

router = APIRouter(tags=["waste-regression"])


@router.post("/waste-regression", response_model=WasteRegressionResponse)
def compute_waste_regression(request: WasteRegressionRequest) -> WasteRegressionResponse:
    result = fit_and_explain(
        training_rows=[row.model_dump() for row in request.training_rows],
        predict_rows=[row.model_dump() for row in request.predict_rows],
    )

    return WasteRegressionResponse(
        r_squared=result.r_squared,
        n_observations=result.n_observations,
        coefficients=[
            FeatureCoefficient(
                feature_name=c.feature_name,
                coefficient=c.coefficient,
                standardized_importance=c.standardized_importance,
            )
            for c in result.coefficients
        ],
        predictions=result.predictions,
        warnings=result.warnings,
    )
