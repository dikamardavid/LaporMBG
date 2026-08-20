from fastapi import APIRouter

from ds_plate_waste.api.v1 import health, plate_waste_score, recommendations, waste_regression

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(plate_waste_score.router, prefix="/v1")
api_router.include_router(recommendations.router, prefix="/v1")
api_router.include_router(waste_regression.router, prefix="/v1")
