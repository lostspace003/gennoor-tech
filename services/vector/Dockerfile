# Gennoor vector service — multilingual embeddings + FAISS.
#
# Layer order is deliberate: torch, then the rest of pip, then the model
# weights, then the app. Editing app.py rebuilds only the last (tiny) layer;
# the ~2 GB model layer is reused.
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    HF_HOME=/models \
    HF_HUB_DISABLE_TELEMETRY=1 \
    # CPU inference: let torch use both vCPUs but don't let OpenMP spawn a
    # thread per core and thrash a small container.
    OMP_NUM_THREADS=2 \
    TOKENIZERS_PARALLELISM=false

WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends curl \
 && rm -rf /var/lib/apt/lists/*

# CPU-only torch — the GPU build is several GB larger and useless here.
RUN pip install --no-cache-dir torch==2.5.1 --index-url https://download.pytorch.org/whl/cpu

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Bake the weights in. Downloading at boot would make every cold start pull
# ~2 GB from HuggingFace, and ACA cold starts are already the slow path.
# BAKE_MODELS can be "nomic,bge" — each extra model adds ~2 GB to the image.
ARG BAKE_MODELS=nomic
ENV BAKE_MODELS=${BAKE_MODELS}
COPY download_models.py .
RUN python download_models.py

COPY app.py .

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=180s --retries=3 \
  CMD curl -fsS http://localhost:8080/health || exit 1

# One worker: the model is loaded per process, so a second worker would double
# the memory for no throughput gain on 2 vCPUs.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1", "--timeout-keep-alive", "65"]
