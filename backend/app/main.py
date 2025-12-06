from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.requests import AnalyzeRequest
from app.models.responses import AnalyzeResponse
app = FastAPI(
    title="RAG Pipeline Optimizer",
    description="Compare 6 RAG chunking strategies",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "RAG Optimizer API",
        "version": "0.1.0",
        "status": "running"
    }

@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_document(request: AnalyzeRequest):
    """Main analysis endpoint - returns mock data for now"""
    return {
        "success": True,
        "results": [],
        "best_strategy": "Coming soon",
        "insights": ["API contract defined", "Ready for implementation"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
