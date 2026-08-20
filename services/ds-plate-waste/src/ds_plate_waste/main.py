from fastapi import FastAPI

from ds_plate_waste.api.v1.router import api_router


def create_app() -> FastAPI:
    app = FastAPI(
        title="LaporMBG DS: Plate Waste",
        description="Plate Waste Score & Menu Waste Regression microservice",
        version="0.1.0",
    )
    app.include_router(api_router)
    return app


app = create_app()
