from collections import defaultdict
from datetime import UTC, datetime

from fastapi import APIRouter

from ds_plate_waste.domain.scoring import (
    FeedbackEntryData,
    compute_component_score,
    compute_overall_batch_score,
)
from ds_plate_waste.schemas.common import MenuComponentType
from ds_plate_waste.schemas.scoring import (
    ComponentScoreResult,
    PlateWasteScoreRequest,
    PlateWasteScoreResponse,
)

router = APIRouter(tags=["plate-waste-score"])


@router.post("/plate-waste-score", response_model=PlateWasteScoreResponse)
def compute_plate_waste_score(request: PlateWasteScoreRequest) -> PlateWasteScoreResponse:
    entries_by_component: dict[MenuComponentType, list[FeedbackEntryData]] = defaultdict(list)
    for submission in request.feedback_submissions:
        for component_entry in submission.components:
            entries_by_component[component_entry.component_type].append(
                FeedbackEntryData(
                    component_type=component_entry.component_type,
                    waste_level=component_entry.waste_level,
                    reason_tag_ids=[tag.tag_id for tag in component_entry.reason_tags],
                )
            )

    recipe_names = {mc.component_type: mc.recipe_name for mc in request.menu_components}

    component_score_data = [
        compute_component_score(
            component_type=mc.component_type,
            entries=entries_by_component.get(mc.component_type, []),
            portions_distributed=request.portions_distributed,
        )
        for mc in request.menu_components
    ]

    component_scores = [
        ComponentScoreResult(
            component_type=data.component_type,
            recipe_name=recipe_names.get(data.component_type),
            plate_waste_score=data.plate_waste_score,
            response_count=data.response_count,
            waste_level_distribution=data.waste_level_distribution,
            dominant_reason_tags=data.dominant_reason_tags,
            confidence=data.confidence,
        )
        for data in component_score_data
    ]

    overall_batch_score = compute_overall_batch_score(component_score_data)

    return PlateWasteScoreResponse(
        batch_id=request.batch_id,
        service_date=request.service_date,
        component_scores=component_scores,
        overall_batch_score=overall_batch_score,
        computed_at=datetime.now(UTC).isoformat(),
    )
