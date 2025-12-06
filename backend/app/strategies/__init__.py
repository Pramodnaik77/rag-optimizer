from app.strategies.fixed_size import (
    SmallChunkStrategy,
    MediumChunkStrategy,
    LargeChunkStrategy,
    HighOverlapStrategy
)
from app.strategies.sentence import SentenceBasedStrategy
from app.strategies.semantic import SemanticChunkStrategy
from typing import List
from app.strategies.base import ChunkingStrategy

def get_all_strategies() -> List[ChunkingStrategy]:
    """Return all available chunking strategies"""
    return [
        SmallChunkStrategy(),
        MediumChunkStrategy(),
        LargeChunkStrategy(),
        HighOverlapStrategy(),
        SentenceBasedStrategy(),
        SemanticChunkStrategy()
    ]
