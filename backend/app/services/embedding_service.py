# import voyageai
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# from typing import List
# from app.config import settings
# import os

# class EmbeddingService:
#     def __init__(self):
#         self.client = None
#         self.model_name = "voyage-3"

#     def load_model(self):
#         """Initialize Voyage AI client"""
#         if self.client is None:
#             if not settings.VOYAGE_API_KEY:
#                 raise ValueError("VOYAGE_API_KEY not set in environment")
#             # Initialize without proxies parameter to avoid compatibility issues

#             self.client = voyageai.Client(api_key=settings.VOYAGE_API_KEY)
#             print("✓ Voyage AI client initialized ", settings.VOYAGE_API_KEY)

#     def generate_embedding(self, text: str) -> np.ndarray:
#         """Generate embedding for single text using Voyage AI"""
#         if self.client is None:
#             self.load_model()
#         result = self.client.embed([text], model=self.model_name)
#         return np.array(result.embeddings[0])

#     def generate_embeddings(self, texts: List[str]) -> np.ndarray:
#         """Generate embeddings for multiple texts using Voyage AI"""
#         if self.client is None:
#             self.load_model()
#         result = self.client.embed(texts, model=self.model_name)
#         return np.array(result.embeddings)

#     def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
#         """Calculate cosine similarity between two embeddings"""
#         similarity = cosine_similarity(
#             embedding1.reshape(1, -1),
#             embedding2.reshape(1, -1)
#         )[0][0]
#         return float(similarity)

#     def find_top_k_similar(self, query_embedding: np.ndarray,
#                           chunk_embeddings: np.ndarray, k: int = 3) -> List[int]:
#         """Find indices of top-k most similar chunks to query"""
#         similarities = cosine_similarity(
#             query_embedding.reshape(1, -1),
#             chunk_embeddings
#         )[0]
#         top_k_indices = np.argsort(similarities)[-k:][::-1]
#         return top_k_indices.tolist()

# # Singleton instance
# embedding_service = EmbeddingService()

# app/services/embedding_service.py
from google import genai
import numpy as np
from typing import List
from app.config import settings
import time
import hashlib

class EmbeddingService:
    """
    Gemini-only embedding service.
    - Supports batch embeddings (≤100 texts)
    - Handles 429 rate-limit with exponential backoff (max 3 retries)
    - No strategy logic here
    """

    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not set")

        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = "gemini-embedding-001"
        self.max_retries = 3
        self.base_delay = 5  # Base delay in seconds

    def _embed_batch(self, texts: List[str]) -> np.ndarray:
        """Internal: embed up to 100 texts with retry logic"""
        if len(texts) > 100:
            raise ValueError("Gemini allows max 100 texts per embed request")

        retries = 0
        last_error = None

        while retries <= self.max_retries:
            try:
                resp = self.client.models.embed_content(
                    model=self.model,
                    contents=texts
                )
                return np.array([e.values for e in resp.embeddings])

            except Exception as e:
                error_str = str(e).lower()
                last_error = e

                # Check for rate-limit/quota exhaustion errors
                is_rate_limit = any(keyword in error_str for keyword in [
                    "retrydelay",
                    "429",
                    "quota",
                    "rate_limit",
                    "resource exhausted"
                ])

                if is_rate_limit and retries < self.max_retries:
                    # Exponential backoff: 5s, 10s, 20s
                    delay = self.base_delay * (2 ** retries)
                    retries += 1
                    print(f"⚠️  Gemini quota exhausted. Retry {retries}/{self.max_retries} after {delay}s delay...")
                    time.sleep(delay)
                    continue
                else:
                    # Non-rate-limit error or max retries exceeded
                    raise

        # Should not reach here, but safety fallback
        raise RuntimeError(f"Failed after {self.max_retries} retries: {last_error}")

    def embed_texts(self, texts: List[str]) -> np.ndarray:
        """Public API: batch-safe embedding"""
        if not texts:
            return np.array([])

        return self._embed_batch(texts)

    def embed_single(self, text: str) -> np.ndarray:
        """Single-text embedding"""
        return self._embed_batch([text])[0]

    @staticmethod
    def hash_text(text: str) -> str:
        """Stable hash for caching"""
        return hashlib.sha256(text.encode("utf-8")).hexdigest()


embedding_service = EmbeddingService()
