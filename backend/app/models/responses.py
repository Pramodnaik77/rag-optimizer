from pydantic import BaseModel, Field
from typing import List, Optional
from app.core.constants import StrategyType

class StrategyResult(BaseModel):
    strategy_name: str = Field(..., description="Strategy display name")
    strategy_type: StrategyType = Field(..., description="Strategy type enum")
    description: str = Field(..., description="Strategy description")

    # Core metrics
    accuracy: float = Field(..., ge=0, le=1, description="Answer quality score")
    relevance: float = Field(..., ge=0, le=1, description="Chunk relevance score")
    cost: float = Field(..., ge=0, description="Estimated cost in USD")
    processing_time_ms: int = Field(..., gt=0, description="Processing time in ms")

    # Chunking info
    chunks_used: int = Field(..., gt=0, description="Number of chunks retrieved")
    chunks_created: int = Field(..., gt=0, description="Total chunks created")
    total_tokens: int = Field(..., gt=0, description="Total tokens used")

    # Results
    generated_answer: str = Field(..., description="LLM generated answer")
    retrieved_chunks: List[str] = Field(..., description="Top retrieved chunks")

    class Config:
        json_schema_extra = {
            "example": {
                "strategy_name": "Small Chunks",
                "strategy_type": "small_chunks",
                "description": "256 characters per chunk with 50 char overlap",
                "accuracy": 0.85,
                "relevance": 0.92,
                "cost": 0.000034,
                "processing_time_ms": 1823,
                "chunks_used": 3,
                "chunks_created": 42,
                "total_tokens": 456,
                "generated_answer": "RAG provides several benefits...",
                "retrieved_chunks": ["chunk1...", "chunk2...", "chunk3..."]
            }
        }

class AnalyzeResponse(BaseModel):
    success: bool = Field(..., description="Operation success status")
    results: List[StrategyResult] = Field(..., description="Results from all strategies")
    best_strategy: str = Field(..., description="Recommended strategy name")
    insights: List[str] = Field(..., description="Key insights from comparison")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "results": [],
                "best_strategy": "Semantic Chunking",
                "insights": [
                    "Semantic Chunking achieved highest accuracy at 92.3%",
                    "Small Chunks was most cost-effective at $0.000034"
                ]
            }
        }
