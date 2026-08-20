from enum import Enum

from pydantic import BaseModel, Field

from ds_plate_waste.schemas.common import MenuComponentType
from ds_plate_waste.schemas.scoring import ComponentScoreResult


class RecommendationRequest(BaseModel):
    batch_id: str
    component_scores: list[ComponentScoreResult] = Field(..., min_length=1)


class RecommendationSeverity(str, Enum):
    INFO = "INFO"
    WATCH = "WATCH"
    ACTION_REQUIRED = "ACTION_REQUIRED"


class MenuRecommendation(BaseModel):
    component_type: MenuComponentType
    recipe_name: str | None
    severity: RecommendationSeverity
    plate_waste_score: float
    trigger_tags: list[str]
    recommendation_text_id: str
    suggested_action: str


class RecommendationResponse(BaseModel):
    batch_id: str
    generated_at: str
    recommendations: list[MenuRecommendation]
