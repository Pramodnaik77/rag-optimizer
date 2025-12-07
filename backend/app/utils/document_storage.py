import uuid
from typing import Optional
from app.core.exceptions import ChunkingError
from app.utils.redis_client import redis_client

class DocumentStorage:
    def __init__(self):
        self.redis = redis_client

    def generate_document_id(self) -> str:
        """Generate unique document ID"""
        return str(uuid.uuid4())[:8]

    def save_document_metadata(self, doc_id: str, filename: str, word_count: int):
        """Save document metadata"""
        metadata = {
            "filename": filename,
            "word_count": word_count
        }
        self.redis.set_json(f"doc:{doc_id}:metadata", metadata)

    def save_cached_text(self, text: str, doc_id: str):
        """Save parsed text with 24h expiration"""
        self.redis.set_text(f"doc:{doc_id}:text", text)

    def load_cached_text(self, doc_id: str) -> str:
        """Load previously parsed text"""
        text = self.redis.get_text(f"doc:{doc_id}:text")

        if not text:
            raise ChunkingError(f"Document {doc_id} not found or expired")

        return text

    def get_document_metadata(self, doc_id: str) -> Optional[dict]:
        """Get document metadata"""
        return self.redis.get_json(f"doc:{doc_id}:metadata")

    def delete_document(self, doc_id: str):
        """Delete all data for a document"""
        self.redis.delete(f"doc:{doc_id}:text")
        self.redis.delete(f"doc:{doc_id}:metadata")

    def document_exists(self, doc_id: str) -> bool:
        """Check if document exists"""
        return self.redis.exists(f"doc:{doc_id}:text")

# Singleton
document_storage = DocumentStorage()
