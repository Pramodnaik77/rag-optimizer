from pydantic import BaseModel, Field, field_validator
from typing import Optional
from app.core.constants import LLMProvider
from app.config import settings

class AnalyzeRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1000, description="User question")
    document: str = Field(..., min_length=50, max_length=100000, description="Document text")
    llm_provider: LLMProvider = Field(default=LLMProvider.GROQ, description="LLM provider")
    llm_model: Optional[str] = Field(default="llama-3.1-8b-instant", description="Specific model name")
    api_key: Optional[str] = Field(default=settings.GROQ_API_KEY, description="User API key for paid providers")

    @field_validator('query', 'document')
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()



class GenerateQueriesRequest(BaseModel):
    main_query: Optional[str] = Field(default=None, description="Main query for generating variations")

class BatchAnalyzeRequest(BaseModel):
    selected_query_ids: list[int] = Field(..., description="IDs of selected queries")
    custom_queries: list[str] = Field(default=[], description="Additional custom queries")
    llm_provider: LLMProvider = Field(default=LLMProvider.GROQ, description="LLM provider")
    llm_model: Optional[str] = Field(default="llama-3.1-8b-instant", description="Specific model name")
    api_key: Optional[str] = Field(default=settings.GROQ_API_KEY, description="User API key for paid providers")



# from pydantic import BaseModel, Field, field_validator
# from typing import Optional, List
# from app.core.constants import LLMProvider


# class GenerateQueriesRequest(BaseModel):
#     main_query: Optional[str] = Field(
#         default=None,
#         min_length=3,
#         description="Optional primary query to include"
#     )

#     @field_validator("main_query")
#     @classmethod
#     def strip_whitespace(cls, v: Optional[str]):
#         return v.strip() if v else v


# class BatchAnalyzeRequest(BaseModel):
#     custom_queries: List[str] = Field(
#         ...,
#         min_length=3,
#         max_length=10,
#         description="Final list of queries selected by the user"
#     )

#     llm_provider: LLMProvider = Field(
#         default=LLMProvider.GROQ,
#         description="LLM provider for answer generation"
#     )

#     llm_model: Optional[str] = Field(
#         default=None,
#         description="Specific LLM model"
#     )

#     api_key: Optional[str] = Field(
#         default=None,
#         description="Optional API key for paid providers"
#     )

#     @field_validator("custom_queries")
#     @classmethod
#     def validate_queries(cls, queries: List[str]):
#         cleaned = [q.strip() for q in queries if q.strip()]
#         if len(cleaned) < 3:
#             raise ValueError("At least 3 queries are required")
#         return cleaned

#     class Config:
#         json_schema_extra = {
#             "example": {
#                 "custom_queries": [
#                     "What problem does RAG solve?",
#                     "How does chunk size affect retrieval?",
#                     "What are the trade-offs between strategies?"
#                 ],
#                 "llm_provider": "groq",
#                 "llm_model": "llama-3.1-8b-instant"
#             }
#         }
