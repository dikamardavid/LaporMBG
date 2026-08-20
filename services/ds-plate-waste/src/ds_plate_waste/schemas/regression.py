from pydantic import BaseModel, Field

from ds_plate_waste.schemas.common import MenuComponentType


class RegressionFeatureRow(BaseModel):
    component_type: MenuComponentType
    day_of_week: int = Field(..., ge=0, le=6)
    holding_time_minutes: float
    departure_temperature_celsius: float
    arrival_temperature_celsius: float | None = None
    plate_waste_score: float = Field(..., ge=0, le=100, description="Regression target")


class RegressionPredictRow(BaseModel):
    component_type: MenuComponentType
    day_of_week: int = Field(..., ge=0, le=6)
    holding_time_minutes: float
    departure_temperature_celsius: float
    arrival_temperature_celsius: float | None = None


class WasteRegressionRequest(BaseModel):
    training_rows: list[RegressionFeatureRow] = Field(..., min_length=5)
    predict_rows: list[RegressionPredictRow] = Field(default_factory=list)


class FeatureCoefficient(BaseModel):
    feature_name: str
    coefficient: float
    standardized_importance: float = Field(..., ge=0, le=1)


class WasteRegressionResponse(BaseModel):
    model_type: str = "Ridge"
    r_squared: float
    n_observations: int
    coefficients: list[FeatureCoefficient]
    predictions: list[float]
    warnings: list[str] = Field(default_factory=list)
