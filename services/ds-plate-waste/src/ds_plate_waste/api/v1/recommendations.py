from datetime import UTC, datetime

from fastapi import APIRouter

from ds_plate_waste.domain.recommendations import build_recommendation
from ds_plate_waste.schemas.recommendation import (
    MenuRecommendation,
    RecommendationRequest,
    RecommendationResponse,
    RecommendationSeverity,
)

router = APIRouter(tags=["menu-recommendations"])


@router.post("/menu-recommendations", response_model=RecommendationResponse)
def compute_menu_recommendations(request: RecommendationRequest) -> RecommendationResponse:
    recommendations = []
    for component_score in request.component_scores:
        data = build_recommendation(
            plate_waste_score=component_score.plate_waste_score,
            dominant_reason_tags=component_score.dominant_reason_tags,
            recipe_name=component_score.recipe_name,
        )
        recommendations.append(
            MenuRecommendation(
                component_type=component_score.component_type,
                recipe_name=component_score.recipe_name,
                severity=RecommendationSeverity(data.severity),
                plate_waste_score=component_score.plate_waste_score,
                trigger_tags=data.trigger_tags,
                recommendation_text_id=data.recommendation_text_id,
                suggested_action=data.suggested_action,
            )
        )

    return RecommendationResponse(
        batch_id=request.batch_id,
        generated_at=datetime.now(UTC).isoformat(),
        recommendations=recommendations,
    )
