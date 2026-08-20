"""Pure plate-waste scoring formula. No FastAPI/pydantic imports — unit-testable in isolation."""

from collections import Counter
from dataclasses import dataclass, field

from ds_plate_waste.domain.weights import (
    DOMINANT_TAG_LIMIT,
    EXPECTED_RESPONSE_RATE,
    WASTE_LEVEL_WEIGHTS,
)
from ds_plate_waste.schemas.common import MenuComponentType, PlateWasteLevel


@dataclass
class FeedbackEntryData:
    """Minimal shape scoring needs from a ComponentFeedbackEntry (avoids coupling to pydantic)."""

    component_type: MenuComponentType
    waste_level: PlateWasteLevel
    reason_tag_ids: list[str] = field(default_factory=list)


@dataclass
class ComponentScoreData:
    component_type: MenuComponentType
    plate_waste_score: float
    response_count: int
    waste_level_distribution: dict[PlateWasteLevel, int]
    dominant_reason_tags: list[str]
    confidence: float


def compute_component_score(
    component_type: MenuComponentType,
    entries: list[FeedbackEntryData],
    portions_distributed: int | None = None,
) -> ComponentScoreData:
    """plate_waste_score = mean of per-response WASTE_LEVEL_WEIGHTS for this component.

    Simple arithmetic mean of discrete severity weights — explainable and directly
    auditable against a hand-computed test dataset (matches the QA acceptance
    criterion in the parent epic).
    """
    if not entries:
        return ComponentScoreData(
            component_type=component_type,
            plate_waste_score=0.0,
            response_count=0,
            waste_level_distribution={},
            dominant_reason_tags=[],
            confidence=0.0,
        )

    total = sum(WASTE_LEVEL_WEIGHTS[e.waste_level] for e in entries)
    score = round(total / len(entries), 2)

    distribution = Counter(e.waste_level for e in entries)

    tag_counter: Counter[str] = Counter()
    for e in entries:
        if e.waste_level != PlateWasteLevel.HABIS_TOTAL:
            tag_counter.update(e.reason_tag_ids)
    dominant_tags = [tag for tag, _ in tag_counter.most_common(DOMINANT_TAG_LIMIT)]

    confidence = _compute_confidence(len(entries), portions_distributed)

    return ComponentScoreData(
        component_type=component_type,
        plate_waste_score=score,
        response_count=len(entries),
        waste_level_distribution=dict(distribution),
        dominant_reason_tags=dominant_tags,
        confidence=confidence,
    )


def _compute_confidence(response_count: int, portions_distributed: int | None) -> float:
    if not portions_distributed:
        return 0.0
    expected = max(1.0, portions_distributed * EXPECTED_RESPONSE_RATE)
    return round(min(1.0, response_count / expected), 2)


def compute_overall_batch_score(component_scores: list[ComponentScoreData]) -> float:
    """Weighted average across components, weighted by each component's response_count.

    Components with more feedback dominate the batch score rather than every
    component counting equally regardless of sample size.
    """
    scored = [c for c in component_scores if c.response_count > 0]
    if not scored:
        return 0.0
    total_weight = sum(c.response_count for c in scored)
    weighted_sum = sum(c.plate_waste_score * c.response_count for c in scored)
    return round(weighted_sum / total_weight, 2)
