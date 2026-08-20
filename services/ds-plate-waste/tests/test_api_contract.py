def test_healthz(client):
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_plate_waste_score_valid_payload_returns_200(client, sample_score_request):
    response = client.post("/v1/plate-waste-score", json=sample_score_request)
    assert response.status_code == 200
    body = response.json()
    assert body["batch_id"] == "batch-001"
    assert len(body["component_scores"]) == 2
    assert "overall_batch_score" in body


def test_plate_waste_score_missing_required_field_returns_422(client, sample_score_request):
    del sample_score_request["batch_id"]
    response = client.post("/v1/plate-waste-score", json=sample_score_request)
    assert response.status_code == 422


def test_plate_waste_score_invalid_enum_returns_422(client, sample_score_request):
    sample_score_request["menu_components"][0]["component_type"] = "NOT_A_COMPONENT"
    response = client.post("/v1/plate-waste-score", json=sample_score_request)
    assert response.status_code == 422


def test_menu_recommendations_valid_payload_returns_200(client, sample_score_request):
    score_response = client.post("/v1/plate-waste-score", json=sample_score_request).json()
    rec_response = client.post(
        "/v1/menu-recommendations",
        json={"batch_id": "batch-001", "component_scores": score_response["component_scores"]},
    )
    assert rec_response.status_code == 200
    body = rec_response.json()
    assert len(body["recommendations"]) == 2
    assert all("severity" in r for r in body["recommendations"])


def test_menu_recommendations_missing_field_returns_422(client):
    response = client.post("/v1/menu-recommendations", json={"batch_id": "batch-001"})
    assert response.status_code == 422


def test_waste_regression_valid_payload_returns_200(client):
    training_rows = [
        {
            "component_type": "SAYUR",
            "day_of_week": i % 7,
            "holding_time_minutes": 60 + i * 5,
            "departure_temperature_celsius": 65,
            "plate_waste_score": min(100, 10 + i * 2),
        }
        for i in range(6)
    ]
    response = client.post(
        "/v1/waste-regression",
        json={"training_rows": training_rows, "predict_rows": []},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["n_observations"] == 6
    assert "coefficients" in body


def test_waste_regression_below_min_training_rows_returns_422(client):
    response = client.post(
        "/v1/waste-regression",
        json={"training_rows": [], "predict_rows": []},
    )
    assert response.status_code == 422
