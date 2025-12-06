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
from app.services.rag_service import rag_service
from app.strategies.fixed_size import SmallChunkStrategy
from app.core.constants import LLMProvider
from app.services.rag_service import rag_service
from app.utils.metrics import generate_insights, find_best_strategy


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
    """Main analysis endpoint - runs all 6 strategies"""
    try:
        # Run all strategies
        results = await rag_service.run_all_strategies(
            document=request.document,
            query=request.query,
            llm_provider=request.llm_provider,
            llm_model=request.llm_model,
            api_key=request.api_key
        )

        if not results:
            return AnalyzeResponse(
                success=False,
                results=[],
                best_strategy="No results",
                insights=["All strategies failed - check document and query"]
            )

        # Generate insights and find best strategy
        insights = generate_insights(results)
        best_strategy = find_best_strategy(results)

        return AnalyzeResponse(
            success=True,
            results=results,
            best_strategy=best_strategy,
            insights=insights
        )

    except Exception as e:
        return AnalyzeResponse(
            success=False,
            results=[],
            best_strategy="Error",
            insights=[f"Error: {str(e)}"]
        )


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

@app.post("/api/test-rag")
async def test_rag(
    query: str = "What is RAG?",
    document: str = "Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with text generation. It first retrieves relevant documents, then uses them as context for generating accurate responses."
):
    """Test complete RAG pipeline with one strategy"""

    strategy = SmallChunkStrategy()
    result = rag_service.run_strategy(
        strategy=strategy,
        document=document,
        query=query,
        llm_provider=LLMProvider.GROQ
    )

    return {
        "strategy": result.strategy_name,
        "accuracy": result.accuracy,
        "relevance": result.relevance,
        "cost": result.cost,
        "time_ms": result.processing_time_ms,
        "chunks": f"{result.chunks_used}/{result.chunks_created}",
        "answer": result.generated_answer[:200] + "..."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
