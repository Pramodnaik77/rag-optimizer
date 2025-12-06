from pydantic import BaseModel, Field, field_validator
from typing import Optional
from app.core.constants import LLMProvider

class AnalyzeRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000, description="User question")
    document: str = Field(..., min_length=50, max_length=100000, description="Document text")
    llm_provider: LLMProvider = Field(default=LLMProvider.GROQ, description="LLM provider")
    llm_model: Optional[str] = Field(default=None, description="Specific model name")
    api_key: Optional[str] = Field(default=None, description="User API key for paid providers")

    @field_validator('query', 'document')
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()

    class Config:
        json_schema_extra = {
            "example": {
                "query": "What are the benefits of RAG?",
                "document": "Retrieval-Augmented Generation (RAG) combines retrieval with generation...",
                "llm_provider": "groq",
                "llm_model": "llama-3.1-8b-instant"
            }
        }
