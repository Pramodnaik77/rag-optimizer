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

class DocumentUploadResponse(BaseModel):
    success: bool = Field(..., description="Upload success status")
    document_id: str = Field(..., description="Unique document identifier")
    filename: str = Field(..., description="Original filename")
    word_count: int = Field(..., description="Number of words in document")
    preview: str = Field(..., description="First 200 characters of document")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "document_id": "abc12345",
                "filename": "report.pdf",
                "word_count": 2340,
                "preview": "Retrieval-Augmented Generation (RAG) is a powerful..."
            }
        }

class GeneratedQuery(BaseModel):
    id: int = Field(..., description="Query ID for selection")
    text: str = Field(..., description="Query text")
    category: str = Field(..., description="Query category")
    is_main: bool = Field(default=False, description="Is this the main query")

class GenerateQueriesResponse(BaseModel):
    success: bool = Field(..., description="Success status")
    document_id: str = Field(..., description="Document ID")
    queries: list[GeneratedQuery] = Field(..., description="Generated queries")
    message: str = Field(default="", description="Error message if failed")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "document_id": "abc12345",
                "queries": [
                    {"id": 1, "text": "Summarize the key points", "category": "summary", "is_main": True},
                    {"id": 2, "text": "What are the main concepts?", "category": "concept", "is_main": False}
                ],
                "message": ""
            }
        }

class QueryResult(BaseModel):
    query_id: int = Field(..., description="Query identifier")
    query_text: str = Field(..., description="The actual question")
    best_strategy: str = Field(..., description="Winner for this query")
    best_accuracy: float = Field(..., description="Accuracy of winning strategy")
    all_results: list[StrategyResult] = Field(..., description="Results from all 6 strategies")

class BatchAnalyzeResponse(BaseModel):
    success: bool = Field(..., description="Success status")
    document_id: str = Field(..., description="Document ID analyzed")
    query_results: list[QueryResult] = Field(..., description="Per-query results")
    aggregate_winner: str = Field(..., description="Overall best strategy")
    aggregate_insights: list[str] = Field(..., description="Overall insights")
    message: str = Field(default="", description="Error message if failed")

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "document_id": "abc12345",
                "query_results": [],
                "aggregate_winner": "Semantic Chunking",
                "aggregate_insights": [
                    "Semantic Chunking won 4/5 queries",
                    "Average accuracy: 87%"
                ],
                "message": "Analysis completed"
            }
        }
