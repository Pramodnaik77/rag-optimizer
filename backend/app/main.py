#fastapi imports
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

#standard library imports
from datetime import datetime
import time
from contextlib import asynccontextmanager

#app specific imports
from app.services.embedding_service import embedding_service
from app.strategies.fixed_size import SmallChunkStrategy
from app.services.llm_service import llm_service
from app.core.constants import LLMProvider
from app.models.requests import AnalyzeRequest
from app.models.responses import AnalyzeResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Load model
    embedding_service.load_model()
    yield
    # Shutdown: cleanup if needed
    pass

app = FastAPI(
    title="RAG Pipeline Optimizer",
    description="Compare 6 RAG chunking strategies",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "RAG Optimizer API"
    }

@app.post("/api/test-embedding")
def test_embedding(text: str = "This is a test"):
    embedding = embedding_service.generate_embedding(text)
    return {
        "text": text,
        "embedding_shape": embedding.shape,
        "embedding_sample": embedding[:5].tolist()
    }

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_document(request: AnalyzeRequest):
    return {
        "success": True,
        "results": [],
        "best_strategy": "Coming soon",
        "insights": ["API contract defined"]
    }

@app.post("/api/test-chunking")
def test_chunking(document: str):
    strategy = SmallChunkStrategy()
    chunks = strategy.chunk_document(document)
    return {
        "strategy": strategy.name,
        "total_chunks": len(chunks),
        "first_3_chunks": chunks[:3],
        "chunk_lengths": [len(c) for c in chunks[:5]]
    }


@app.post("/api/test-llm")
def test_llm(query: str = "What is RAG?"):
    context = "RAG stands for Retrieval-Augmented Generation. It combines retrieval with generation.Another is Non rag which is different."
    answer, input_tokens, output_tokens, cost = llm_service.generate_answer(
        query=query,
        context=context,
        provider=LLMProvider.GROQ
    )
    return {
        "query": query,
        "answer": answer,
        "input_tokens": input_tokens,
        "output_tokens": output_tokens,
        "cost": cost
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
