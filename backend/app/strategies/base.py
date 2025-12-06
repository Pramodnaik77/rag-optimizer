from abc import ABC, abstractmethod
from typing import List
import numpy as np

class ChunkingStrategy(ABC):
    """Base class for all chunking strategies"""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    def chunk_document(self, document: str) -> List[str]:
        """Split document into chunks - must be implemented by subclasses"""
        pass

    def get_info(self) -> dict:
        """Return strategy metadata"""
        return {
            "name": self.name,
            "description": self.description
        }
