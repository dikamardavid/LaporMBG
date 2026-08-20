from ds_plate_waste.domain.recommendations import build_recommendation


def test_low_score_is_info_severity():
    data = build_recommendation(plate_waste_score=10.0, dominant_reason_tags=[], recipe_name="Nasi")
    assert data.severity == "INFO"


def test_watch_threshold_boundary():
    below = build_recommendation(plate_waste_score=39.9, dominant_reason_tags=[], recipe_name="Nasi")
    at = build_recommendation(plate_waste_score=40.0, dominant_reason_tags=[], recipe_name="Nasi")
    assert below.severity == "INFO"
    assert at.severity == "WATCH"


def test_action_required_threshold_boundary():
    below = build_recommendation(plate_waste_score=64.9, dominant_reason_tags=[], recipe_name="Nasi")
    at = build_recommendation(plate_waste_score=65.0, dominant_reason_tags=[], recipe_name="Nasi")
    assert below.severity == "WATCH"
    assert at.severity == "ACTION_REQUIRED"


def test_matched_tag_produces_specific_action_and_text():
    data = build_recommendation(
        plate_waste_score=70.0,
        dominant_reason_tags=["sayur_terlalu_lembek"],
        recipe_name="Tumis Kangkung",
    )
    assert data.suggested_action == "adjust_texture"
    assert "Tumis Kangkung" in data.recommendation_text_id
    assert data.trigger_tags == ["sayur_terlalu_lembek"]


def test_first_matched_tag_wins_when_multiple_present():
    data = build_recommendation(
        plate_waste_score=70.0,
        dominant_reason_tags=["dingin", "kurang_gurih"],
        recipe_name="Sup Ayam",
    )
    assert data.suggested_action == "review_temperature_control"
    assert data.trigger_tags == ["dingin", "kurang_gurih"]


def test_fallback_when_no_tags_match_but_score_is_high():
    data = build_recommendation(
        plate_waste_score=80.0,
        dominant_reason_tags=["unknown_tag"],
        recipe_name="Ayam Bakar",
    )
    assert data.suggested_action == "review_recipe"
    assert "Ayam Bakar" in data.recommendation_text_id
    assert data.trigger_tags == []


def test_fallback_uses_generic_recipe_name_when_missing():
    data = build_recommendation(plate_waste_score=80.0, dominant_reason_tags=[], recipe_name=None)
    assert "menu ini" in data.recommendation_text_id
