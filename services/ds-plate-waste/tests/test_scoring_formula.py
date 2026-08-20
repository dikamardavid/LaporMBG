from ds_plate_waste.domain.scoring import (
    FeedbackEntryData,
    compute_component_score,
    compute_overall_batch_score,
)
from ds_plate_waste.schemas.common import MenuComponentType, PlateWasteLevel


def entry(waste_level, tags=None):
    return FeedbackEntryData(
        component_type=MenuComponentType.SAYUR,
        waste_level=waste_level,
        reason_tag_ids=tags or [],
    )


def test_all_fully_eaten_scores_zero():
    entries = [entry(PlateWasteLevel.HABIS_TOTAL) for _ in range(5)]
    result = compute_component_score(MenuComponentType.SAYUR, entries)
    assert result.plate_waste_score == 0.0
    assert result.response_count == 5


def test_all_barely_eaten_scores_hundred():
    entries = [entry(PlateWasteLevel.HAMPIR_TIDAK_DIMAKAN) for _ in range(3)]
    result = compute_component_score(MenuComponentType.SAYUR, entries)
    assert result.plate_waste_score == 100.0


def test_mixed_distribution_matches_hand_computed_average():
    entries = [
        entry(PlateWasteLevel.HABIS_TOTAL),
        entry(PlateWasteLevel.SISA_SEDIKIT),
        entry(PlateWasteLevel.SISA_SEPARUH),
        entry(PlateWasteLevel.HAMPIR_TIDAK_DIMAKAN),
    ]
    # (0 + 25 + 60 + 100) / 4 = 46.25
    result = compute_component_score(MenuComponentType.SAYUR, entries)
    assert result.plate_waste_score == 46.25
    assert result.waste_level_distribution[PlateWasteLevel.HABIS_TOTAL] == 1
    assert result.waste_level_distribution[PlateWasteLevel.HAMPIR_TIDAK_DIMAKAN] == 1


def test_empty_entries_scores_zero_no_division_error():
    result = compute_component_score(MenuComponentType.SAYUR, [])
    assert result.plate_waste_score == 0.0
    assert result.response_count == 0
    assert result.confidence == 0.0


def test_dominant_reason_tags_excludes_fully_eaten_entries():
    entries = [
        entry(PlateWasteLevel.HABIS_TOTAL, tags=["enak_banget"]),
        entry(PlateWasteLevel.SISA_SEPARUH, tags=["sayur_terlalu_lembek"]),
        entry(PlateWasteLevel.SISA_SEPARUH, tags=["sayur_terlalu_lembek"]),
        entry(PlateWasteLevel.HAMPIR_TIDAK_DIMAKAN, tags=["kurang_gurih"]),
    ]
    result = compute_component_score(MenuComponentType.SAYUR, entries)
    assert "enak_banget" not in result.dominant_reason_tags
    assert result.dominant_reason_tags[0] == "sayur_terlalu_lembek"


def test_confidence_scales_with_response_rate_and_caps_at_one():
    entries = [entry(PlateWasteLevel.SISA_SEDIKIT) for _ in range(30)]
    result = compute_component_score(MenuComponentType.SAYUR, entries, portions_distributed=100)
    # expected responses = 100 * 0.3 = 30 -> 30/30 = 1.0
    assert result.confidence == 1.0

    result_low = compute_component_score(MenuComponentType.SAYUR, entries[:3], portions_distributed=100)
    assert 0 < result_low.confidence < 1.0

    result_no_portions = compute_component_score(MenuComponentType.SAYUR, entries)
    assert result_no_portions.confidence == 0.0


def test_overall_batch_score_weighted_by_response_count():
    sayur = compute_component_score(
        MenuComponentType.SAYUR,
        [entry(PlateWasteLevel.HAMPIR_TIDAK_DIMAKAN) for _ in range(10)],
    )
    nasi = compute_component_score(
        MenuComponentType.NASI,
        [entry(PlateWasteLevel.HABIS_TOTAL) for _ in range(90)],
    )
    # (100*10 + 0*90) / 100 = 10.0 -- dominated by the larger sample (nasi)
    overall = compute_overall_batch_score([sayur, nasi])
    assert overall == 10.0


def test_overall_batch_score_ignores_zero_response_components():
    scored = compute_component_score(
        MenuComponentType.SAYUR,
        [entry(PlateWasteLevel.SISA_SEPARUH) for _ in range(4)],
    )
    empty = compute_component_score(MenuComponentType.BUAH, [])
    overall = compute_overall_batch_score([scored, empty])
    assert overall == 60.0


def test_overall_batch_score_with_no_scored_components_is_zero():
    empty = compute_component_score(MenuComponentType.BUAH, [])
    assert compute_overall_batch_score([empty]) == 0.0
