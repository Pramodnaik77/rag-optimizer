#fastapi imports
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

#standard library imports
from datetime import datetime
from contextlib import asynccontextmanager
import time
import uvicorn
import os

#app specific imports
from app.services.embedding_service import embedding_service
from app.api.router import router
from app.utils.redis_client import redis_client

async def lifespan(app: FastAPI):
    # Startup: Load embedding model and connect to Redis
    print("🚀 Starting RAG Optimizer API...")
    redis_client.connect()
    # embedding_service.load_model()
    yield
    # Shutdown: cleanup if needed
    print("👋 Shutting down...")

app = FastAPI(
    title="RAG Pipeline Optimizer",
    description="Compare 6 RAG chunking strategies",
    version="0.1.0",
    lifespan=lifespan
)

# CORS Configuration
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    ALLOWED_ORIGINS.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    print(f"{request.method} {request.url.path} - {response.status_code} - {process_time:.2f}ms")
    return response

@app.get("/")
def root():
    return {
        "message": "RAG Optimizer API",
        "version": "0.1.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "RAG Optimizer API"
    }

@app.get("/health")  # Render prefers this path
def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "RAG Optimizer API"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
