# FROM python:3.11-slim

# # Set environment variables
# ENV PYTHONUNBUFFERED=1 \
#     PYTHONDONTWRITEBYTECODE=1 \
#     HF_HUB_DISABLE_PROGRESS_BARS=1 \
#     HUGGINGFACE_HUB_CACHE=/app/.cache/huggingface

# WORKDIR /app

# # Copy requirements first for better caching
# COPY backend/requirements.txt .

# # Install dependencies and pre-download models
# RUN pip install --no-cache-dir -r requirements.txt && \
#     python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')" && \
#     python -c "import nltk; nltk.download('punkt_tab', quiet=True)" && \
#     rm -rf /root/.cache/pip && \
#     rm -rf /tmp/*

# # Copy application code
# COPY backend/app ./app

# # Health check
# HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
#     CMD python -c "import requests; requests.get('http://localhost:8000/health')" || exit 1

# # Run the application
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
