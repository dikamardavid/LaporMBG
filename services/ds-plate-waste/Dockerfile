FROM python:3.12-slim AS base
WORKDIR /app

RUN pip install --no-cache-dir uv

COPY pyproject.toml uv.lock* ./
COPY src ./src
RUN uv sync --no-dev

ENV PYTHONUNBUFFERED=1 \
    PATH="/app/.venv/bin:$PATH"

EXPOSE 8001

CMD ["uvicorn", "ds_plate_waste.main:app", "--host", "0.0.0.0", "--port", "8001"]
