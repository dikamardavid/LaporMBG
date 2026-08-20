from datetime import date

from pydantic import BaseModel, Field, confloat, conint

from ds_plate_waste.schemas.common import (
    MenuComponentType,
    PlateWasteLevel,
    ReasonTagCategory,
)


class ReasonTag(BaseModel):
    tag_id: str = Field(..., examples=["kurang_gurih", "dingin", "porsi_pas"])
    category: ReasonTagCategory | None = None


class ComponentFeedbackEntry(BaseModel):
    """One student's rating for ONE menu component within a batch submission."""

    component_type: MenuComponentType
    waste_level: PlateWasteLevel
    taste_rating: conint(ge=1, le=5) | None = None
    reason_tags: list[ReasonTag] = Field(default_factory=list)


class StudentFeedbackSubmission(BaseModel):
    """One full 4-step form submission; multiple components rated independently."""

    submission_id: str
    components: list[ComponentFeedbackEntry] = Field(..., min_length=1)


class MenuComponentContext(BaseModel):
    """Per-component metadata for the batch, needed for regression features."""

    component_type: MenuComponentType
    recipe_name: str
    holding_time_minutes: float | None = Field(
        None, description="Cook-complete to school-arrival duration, minutes."
    )
    departure_temperature_celsius: float | None = None
    arrival_temperature_celsius: float | None = None


class PlateWasteScoreRequest(BaseModel):
    batch_id: str
    sppg_id: str
    school_id: str
    service_date: date
    day_of_week: int | None = Field(
        None, ge=0, le=6, description="0=Mon..6=Sun; derived from service_date if omitted"
    )
    menu_components: list[MenuComponentContext] = Field(..., min_length=1)
    feedback_submissions: list[StudentFeedbackSubmission] = Field(default_factory=list)
    portions_distributed: conint(ge=1) | None = None


class ComponentScoreResult(BaseModel):
    component_type: MenuComponentType
    recipe_name: str | None = None
    plate_waste_score: confloat(ge=0, le=100) = Field(
        ..., description="Weighted waste severity, 0=all eaten, 100=maximal waste"
    )
    response_count: int
    waste_level_distribution: dict[PlateWasteLevel, int] = Field(default_factory=dict)
    dominant_reason_tags: list[str] = Field(default_factory=list, max_length=5)
    confidence: confloat(ge=0, le=1) = Field(
        ..., description="Heuristic confidence based on response_count vs portions_distributed"
    )


class PlateWasteScoreResponse(BaseModel):
    batch_id: str
    service_date: date
    component_scores: list[ComponentScoreResult]
    overall_batch_score: confloat(ge=0, le=100)
    computed_at: str
    scoring_formula_version: str = "1.0.0"
