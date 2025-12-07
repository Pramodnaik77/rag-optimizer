class RAGException(Exception):
    """Base exception for RAG operations"""
    pass

class LLMProviderError(RAGException):
    """LLM provider API error"""
    pass

class EmbeddingError(RAGException):
    """Embedding generation error"""
    pass

class ChunkingError(RAGException):
    """Document chunking error"""
    pass
