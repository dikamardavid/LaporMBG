"""Rule-based recommendation engine — explicit table lookups, not ML.

Explainable and directly unit-testable, matching the "not black-box" spirit
of the parent epic's scoring requirement.
"""

from dataclasses import dataclass

SEVERITY_THRESHOLDS = {"WATCH": 40.0, "ACTION_REQUIRED": 65.0}
"""plate_waste_score (0-100) thresholds. Below WATCH threshold -> INFO."""

TAG_ACTION_MAP: dict[str, tuple[str, str]] = {
    "kurang_gurih": (
        "adjust_seasoning",
        "Pertimbangkan menambah bumbu/penyedap rasa pada resep {recipe}.",
    ),
    "sayur_terlalu_lembek": (
        "adjust_texture",
        "Kurangi waktu perebusan/pengukusan pada {recipe} agar tekstur tidak terlalu lembek.",
    ),
    "dingin": (
        "review_temperature_control",
        "Periksa waktu holding dan insulasi wadah distribusi untuk {recipe}.",
    ),
    "porsi_kurang": (
        "increase_portion",
        "Pertimbangkan menambah takaran porsi {recipe}.",
    ),
    "porsi_berlebih": (
        "reduce_portion",
        "Pertimbangkan mengurangi takaran porsi {recipe} untuk menekan sisa makanan.",
    ),
}

FALLBACK_ACTION = "review_recipe"
FALLBACK_TEXT_TEMPLATE = "Tinjau resep {recipe} — skor sisa makanan tinggi."


@dataclass
class RecommendationData:
    severity: str
    suggested_action: str
    recommendation_text_id: str
    trigger_tags: list[str]


def _severity_for_score(score: float) -> str:
    if score >= SEVERITY_THRESHOLDS["ACTION_REQUIRED"]:
        return "ACTION_REQUIRED"
    if score >= SEVERITY_THRESHOLDS["WATCH"]:
        return "WATCH"
    return "INFO"


def build_recommendation(
    plate_waste_score: float,
    dominant_reason_tags: list[str],
    recipe_name: str | None,
) -> RecommendationData:
    severity = _severity_for_score(plate_waste_score)
    recipe = recipe_name or "menu ini"

    matched_tags = [tag for tag in dominant_reason_tags if tag in TAG_ACTION_MAP]
    if matched_tags:
        top_tag = matched_tags[0]
        action, template = TAG_ACTION_MAP[top_tag]
        text = template.format(recipe=recipe)
    else:
        action = FALLBACK_ACTION
        text = FALLBACK_TEXT_TEMPLATE.format(recipe=recipe)

    return RecommendationData(
        severity=severity,
        suggested_action=action,
        recommendation_text_id=text,
        trigger_tags=matched_tags,
    )
