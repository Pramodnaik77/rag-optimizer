from app.strategies.base import ChunkingStrategy
from app.utils.text_utils import clean_text, split_into_chunks
from app.core.constants import CHUNK_CONFIGS
from typing import List

class SmallChunkStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="Small Chunks",
            description="256 characters per chunk with 50 char overlap"
        )
        self.config = CHUNK_CONFIGS["small_chunks"]

    def chunk_document(self, document: str) -> List[str]:
        cleaned = clean_text(document)
        return split_into_chunks(
            cleaned,
            self.config["size"],
            self.config["overlap"]
        )

class MediumChunkStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="Medium Chunks",
            description="512 characters per chunk with 100 char overlap"
        )
        self.config = CHUNK_CONFIGS["medium_chunks"]

    def chunk_document(self, document: str) -> List[str]:
        cleaned = clean_text(document)
        return split_into_chunks(
            cleaned,
            self.config["size"],
            self.config["overlap"]
        )

class LargeChunkStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="Large Chunks",
            description="1024 characters per chunk with 200 char overlap"
        )
        self.config = CHUNK_CONFIGS["large_chunks"]

    def chunk_document(self, document: str) -> List[str]:
        cleaned = clean_text(document)
        return split_into_chunks(
            cleaned,
            self.config["size"],
            self.config["overlap"]
        )

class HighOverlapStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="High Overlap Chunks",
            description="512 characters with 256 char overlap (50%)"
        )
        self.config = CHUNK_CONFIGS["high_overlap"]

    def chunk_document(self, document: str) -> List[str]:
        cleaned = clean_text(document)
        return split_into_chunks(
            cleaned,
            self.config["size"],
            self.config["overlap"]
        )
