from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List

class EmbeddingService:
    def __init__(self):
        self.model = None

    def load_model(self):
        """Load embedding model - called at startup"""
        if self.model is None:
            print("Loading embedding model...")
            # Using lightweight model to reduce storage (~60MB instead of ~450MB)
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
            print("Model loaded successfully")

    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for single text"""
        if self.model is None:
            self.load_model()
        return self.model.encode(text, convert_to_numpy=True)

    def generate_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for multiple texts"""
        if self.model is None:
            self.load_model()
        return self.model.encode(texts, convert_to_numpy=True)

    def calculate_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """Calculate cosine similarity between two embeddings"""
        similarity = cosine_similarity(
            embedding1.reshape(1, -1),
            embedding2.reshape(1, -1)
        )[0][0]
        return float(similarity)

    def find_top_k_similar(self, query_embedding: np.ndarray,
                          chunk_embeddings: np.ndarray, k: int = 3) -> List[int]:
        """Find indices of top-k most similar chunks to query"""
        similarities = cosine_similarity(
            query_embedding.reshape(1, -1),
            chunk_embeddings
        )[0]
        top_k_indices = np.argsort(similarities)[-k:][::-1]
        return top_k_indices.tolist()

# Singleton instance
embedding_service = EmbeddingService()
