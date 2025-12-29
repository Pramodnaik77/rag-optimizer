# """
# Embedding Cache Service - Implements the "embed once" pattern

# This service:
# 1. Creates base chunks (sentences) from document
# 2. Embeds base chunks ONCE
# 3. Caches embeddings in Redis
# 4. Allows strategies to combine embeddings without re-embedding
# """

# from app.services.embedding_service import embedding_service
# from app.utils.redis_client import redis_client
# from app.utils.text_utils import clean_text
# import nltk
# import numpy as np
# from typing import List, Tuple
# import json

# class EmbeddingCacheService:
#     def __init__(self):
#         self.model_name = "sentence-transformers/all-MiniLM-L6-v2"
#         # Download NLTK data if needed
#         try:
#             nltk.data.find('tokenizers/punkt_tab')
#         except LookupError:
#             nltk.download('punkt_tab', quiet=True)

#     def create_base_chunks(self, document: str) -> List[str]:
#         """
#         Create base chunks from document (sentence level)

#         This is the atomic unit that gets embedded
#         """
#         cleaned = clean_text(document)
#         # Split into sentences
#         sentences = nltk.sent_tokenize(cleaned)
#         return [s.strip() for s in sentences if s.strip()]

#     def embed_base_chunks(self, document: str, doc_id: str = None) -> Tuple[List[str], np.ndarray]:
#         """
#         Create base chunks and embed them ONCE

#         Returns:
#             base_chunks: List of sentence strings
#             embeddings: numpy array of shape (n_chunks, embedding_dim)
#         """
#         # Step 1: Create base chunks
#         base_chunks = self.create_base_chunks(document)

#         if not base_chunks:
#             return [], np.array([])

#         # Step 2: Check if cached
#         if doc_id:
#             cached = redis_client.get_json(f"base_embeddings:{doc_id}")
#             if cached:
#                 print(f"✓ Using cached base embeddings for {doc_id}")
#                 return base_chunks, np.array(cached)

#         # Step 3: Embed base chunks (ONLY TIME WE CALL EMBEDDING API)
#         print(f"Embedding {len(base_chunks)} base chunks...")
#         embeddings = embedding_service.generate_embeddings(base_chunks)

#         # Step 4: Cache for future use (24 hour TTL)
#         if doc_id:
#             redis_client.set_json(
#                 f"base_embeddings:{doc_id}",
#                 embeddings.tolist(),
#                 ttl=86400
#             )
#             redis_client.set_json(
#                 f"base_chunks:{doc_id}",
#                 base_chunks,
#                 ttl=86400
#             )
#             print(f"✓ Cached {len(base_chunks)} base embeddings")

#         return base_chunks, embeddings

#     def get_cached_base_chunks(self, doc_id: str) -> Tuple[List[str], np.ndarray]:
#         """
#         Retrieve cached base chunks and embeddings
#         """
#         chunks = redis_client.get_json(f"base_chunks:{doc_id}")
#         embeddings = redis_client.get_json(f"base_embeddings:{doc_id}")

#         if chunks and embeddings:
#             return chunks, np.array(embeddings)
#         return None, None

#     def combine_embeddings(self, embedding_indices: List[int], embeddings: np.ndarray) -> np.ndarray:
#         """
#         Combine multiple base chunk embeddings into a group embedding

#         Uses averaging (mathematically valid and widely used in NLP)
#         """
#         if not embedding_indices:
#             return np.zeros(embeddings.shape[1])

#         selected_embeddings = embeddings[embedding_indices]
#         # Average the embeddings
#         combined = np.mean(selected_embeddings, axis=0)
#         # Normalize
#         combined = combined / (np.linalg.norm(combined) + 1e-8)
#         return combined

#     def get_group_embeddings_for_strategy(
#         self,
#         base_embeddings: np.ndarray,
#         grouped_chunks: List[List[int]]
#     ) -> np.ndarray:
#         """
#         Convert grouped chunks (indices into base chunks) to embeddings

#         Args:
#             base_embeddings: embeddings of all base chunks
#             grouped_chunks: List of lists, where each inner list contains
#                           indices into base chunks

#         Returns:
#             embeddings for each group (combined from base embeddings)
#         """
#         group_embeddings = []
#         for group_indices in grouped_chunks:
#             group_emb = self.combine_embeddings(group_indices, base_embeddings)
#             group_embeddings.append(group_emb)

#         return np.array(group_embeddings)

# # Singleton instance
# embedding_cache_service = EmbeddingCacheService()

"""
Embedding Cache Service
- Sentence-level base chunks
- Embed ONCE per document
- Cache embeddings + queries in Redis
"""

from app.services.embedding_service import embedding_service
from app.utils.redis_client import redis_client
from app.utils.text_utils import clean_text
import nltk
import numpy as np
from typing import List, Tuple

class EmbeddingCacheService:
    def __init__(self):
        try:
            nltk.data.find("tokenizers/punkt")
        except LookupError:
            nltk.download("punkt", quiet=True)

    def create_base_chunks(self, document: str, max_sentences: int = 85) -> List[str]:
        cleaned = clean_text(document)
        sentences = nltk.sent_tokenize(cleaned)
        return [s.strip() for s in sentences if s.strip()][:max_sentences]

    def embed_base_chunks(
        self, document: str, doc_id: str
    ) -> Tuple[List[str], np.ndarray]:

        cached_chunks = redis_client.get_json(f"base_chunks:{doc_id}")
        cached_embs = redis_client.get_json(f"base_embeddings:{doc_id}")

        if cached_chunks and cached_embs:
            print(f"✅ Base embedding cache hit")
            return cached_chunks, np.array(cached_embs)

        base_chunks = self.create_base_chunks(document)
        embeddings = embedding_service.embed_texts(base_chunks)

        redis_client.set_json(f"base_chunks:{doc_id}", base_chunks, ttl=86400)
        redis_client.set_json(
            f"base_embeddings:{doc_id}",
            embeddings.tolist(),
            ttl=86400
        )

        return base_chunks, embeddings

    def embed_query(self, query: str, doc_id: str) -> np.ndarray:
        q_hash = embedding_service.hash_text(query)
        key = f"query_embedding:{doc_id}:{q_hash}"

        cached = redis_client.get_json(key)
        if cached:
            print(f"✅ Query embedding cache hit")
            return np.array(cached)

        emb = embedding_service.embed_single(query)
        redis_client.set_json(key, emb.tolist(), ttl=86400)
        return emb

    def combine_embeddings(
        self, indices: List[int], base_embeddings: np.ndarray
    ) -> np.ndarray:
        if not indices:
            return np.zeros(base_embeddings.shape[1])

        vec = np.mean(base_embeddings[indices], axis=0)
        return vec / (np.linalg.norm(vec) + 1e-8)

    def build_group_embeddings(
        self, grouped_indices: List[List[int]], base_embeddings: np.ndarray
    ) -> np.ndarray:
        return np.array([
            self.combine_embeddings(indices, base_embeddings)
            for indices in grouped_indices
        ])


embedding_cache_service = EmbeddingCacheService()
