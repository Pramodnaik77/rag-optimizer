from app.strategies.base import ChunkingStrategy
from app.utils.text_utils import clean_text
from app.services.embedding_service import embedding_service
from typing import List
import numpy as np

class SemanticChunkStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="Semantic Chunking",
            description="Splits based on meaning changes using embedding similarity"
        )
        self.threshold = 0.5  # Similarity threshold for splitting
        self.min_chunk_size = 200

    def chunk_document(self, document: str) -> List[str]:
        cleaned = clean_text(document)

        # Split into sentences first
        import nltk
        sentences = nltk.sent_tokenize(cleaned)

        if len(sentences) <= 1:
            return [cleaned]

        # Generate embeddings for each sentence
        embeddings = embedding_service.generate_embeddings(sentences)

        # Find split points based on similarity drops
        chunks = []
        current_chunk = [sentences[0]]

        for i in range(1, len(sentences)):
            # Calculate similarity between consecutive sentences
            similarity = embedding_service.calculate_similarity(
                embeddings[i-1],
                embeddings[i]
            )

            # If similarity drops below threshold and chunk is big enough, split
            current_text = ' '.join(current_chunk)
            if similarity < self.threshold and len(current_text) >= self.min_chunk_size:
                chunks.append(current_text)
                current_chunk = [sentences[i]]
            else:
                current_chunk.append(sentences[i])

        # Add remaining chunk
        if current_chunk:
            chunks.append(' '.join(current_chunk))

        return chunks
