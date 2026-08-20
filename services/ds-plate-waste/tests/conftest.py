import pytest
from fastapi.testclient import TestClient

from ds_plate_waste.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def sample_score_request() -> dict:
    return {
        "batch_id": "batch-001",
        "sppg_id": "sppg-01",
        "school_id": "school-01",
        "service_date": "2026-08-20",
        "portions_distributed": 100,
        "menu_components": [
            {
                "component_type": "SAYUR",
                "recipe_name": "Tumis Kangkung",
                "holding_time_minutes": 90,
                "departure_temperature_celsius": 68,
            },
            {
                "component_type": "NASI",
                "recipe_name": "Nasi Putih",
                "holding_time_minutes": 90,
                "departure_temperature_celsius": 70,
            },
        ],
        "feedback_submissions": [
            {
                "submission_id": "s1",
                "components": [
                    {
                        "component_type": "SAYUR",
                        "waste_level": "SISA_SEPARUH",
                        "taste_rating": 3,
                        "reason_tags": [{"tag_id": "sayur_terlalu_lembek"}],
                    },
                    {
                        "component_type": "NASI",
                        "waste_level": "HABIS_TOTAL",
                        "taste_rating": 5,
                        "reason_tags": [],
                    },
                ],
            },
            {
                "submission_id": "s2",
                "components": [
                    {
                        "component_type": "SAYUR",
                        "waste_level": "HAMPIR_TIDAK_DIMAKAN",
                        "reason_tags": [{"tag_id": "sayur_terlalu_lembek"}],
                    }
                ],
            },
        ],
    }
