from enum import Enum

class LLMProvider(str, Enum):
    GROQ = "groq"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

class StrategyType(str, Enum):
    SMALL_CHUNKS = "small_chunks"
    MEDIUM_CHUNKS = "medium_chunks"
    LARGE_CHUNKS = "large_chunks"
    HIGH_OVERLAP = "high_overlap"
    SENTENCE_BASED = "sentence_based"
    SEMANTIC = "semantic"

# LLM Model configurations
GROQ_MODELS = {
    "llama-3.1-8b-instant": {
        "name": "Llama 3.1 8B",
        "cost_per_1m_input": 0.05,
        "cost_per_1m_output": 0.08,
        "free": True
    }
}

OPENAI_MODELS = {
    "gpt-3.5-turbo": {
        "name": "GPT-3.5 Turbo",
        "cost_per_1m_input": 0.50,
        "cost_per_1m_output": 1.50,
        "free": False
    }
}

ANTHROPIC_MODELS = {
    "claude-3-haiku-20240307": {
        "name": "Claude 3 Haiku",
        "cost_per_1m_input": 0.25,
        "cost_per_1m_output": 1.25,
        "free": False
    }
}

# Chunking configurations
CHUNK_CONFIGS = {
    "small_chunks": {"size": 256, "overlap": 50},
    "medium_chunks": {"size": 512, "overlap": 100},
    "large_chunks": {"size": 1024, "overlap": 200},
    "high_overlap": {"size": 512, "overlap": 256},
    "sentence_based": {"sentences_per_chunk": 5},
}

RAG_PROMPT_TEMPLATE = """You are a helpful assistant. Answer the user's question based ONLY on the provided context.

Context:
{context}

Question: {query}

Answer:"""
