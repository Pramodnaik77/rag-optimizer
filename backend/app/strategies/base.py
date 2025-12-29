# from abc import ABC, abstractmethod
# from typing import List, Tuple
# import numpy as np

# class ChunkingStrategy(ABC):
#     """Base class for all chunking strategies"""

#     def __init__(self, name: str, description: str):
#         self.name = name
#         self.description = description

#     @abstractmethod
#     def chunk_document(self, document: str) -> List[str]:
#         """Split document into chunks - must be implemented by subclasses (legacy)"""
#         pass

#     def group_base_chunks(self, base_chunks: List[str]) -> Tuple[List[List[int]], List[str]]:
#         """
#         NEW METHOD: Group base chunks by strategy, returning indices

#         Args:
#             base_chunks: List of atomic chunks (sentences)

#         Returns:
#             grouped_indices: List of lists, each containing indices into base_chunks
#             grouped_text: List of grouped text (for display/debugging)
#         """
#         # Default: group by original chunk_document logic, then map to indices
#         chunks = self.chunk_document(" ".join(base_chunks))

#         grouped_indices = []
#         grouped_text = []

#         for chunk in chunks:
#             # Find which base chunks make up this group
#             indices = []
#             for i, base_chunk in enumerate(base_chunks):
#                 if base_chunk in chunk:
#                     indices.append(i)
#             if indices:
#                 grouped_indices.append(indices)
#                 grouped_text.append(chunk)

#         return grouped_indices, grouped_text

#     def get_info(self) -> dict:
#         """Return strategy metadata"""
#         return {
#             "name": self.name,
#             "description": self.description
#         }

from abc import ABC, abstractmethod
from typing import List, Tuple

class ChunkingStrategy(ABC):
    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    def group_base_chunks(self, base_chunks: List[str]) -> Tuple[List[List[int]], List[str]]:
        """
        MUST return:
        - grouped_indices: indices into base_chunks
        - grouped_text: joined text for context
        """
        pass

    def get_info(self) -> dict:
        return {"name": self.name, "description": self.description}
