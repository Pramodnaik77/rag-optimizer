<!-- # Deployment Configuration for Render

## Build Command
```
pip install -r backend/requirements.txt && cd backend && python download_models.py
```

## Start Command
```
cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Environment Variables to Set in Render
```
PYTHON_VERSION=3.11
PYTHONUNBUFFERED=1
PYTHONDONTWRITEBYTECODE=1
HF_HUB_DISABLE_PROGRESS_BARS=1
```

## Alternative: Using Docker
If you configure Render to use Docker, it will automatically use the Dockerfile in the root directory.

The Dockerfile includes:
- Lightweight Python 3.11 slim image
- Model pre-caching during build (not at runtime)
- Minimal layer size
- Health checks

## Storage Optimization Summary
- Model switched: paraphrase-MiniLM-L3-v2 (450MB) → all-MiniLM-L6-v2 (60MB)
- Removed duplicate NLTK downloads (saves 10-20MB)
- Pre-download models during build instead of runtime
- Cache cleanup to minimize image size

Expected final size: ~400-500MB (vs ~800-900MB before) -->
