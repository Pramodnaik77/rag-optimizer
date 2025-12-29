# from app.strategies.base import ChunkingStrategy
# from app.utils.text_utils import clean_text, split_into_chunks
# from app.core.constants import CHUNK_CONFIGS
# from typing import List

# class SmallChunkStrategy(ChunkingStrategy):
#     def __init__(self):
#         super().__init__(
#             name="Small Chunks",
#             description="256 characters per chunk with 50 char overlap"
#         )
#         self.config = CHUNK_CONFIGS["small_chunks"]

#     def chunk_document(self, document: str) -> List[str]:
#         cleaned = clean_text(document)
#         return split_into_chunks(
#             cleaned,
#             self.config["size"],
#             self.config["overlap"]
#         )

# class MediumChunkStrategy(ChunkingStrategy):
#     def __init__(self):
#         super().__init__(
#             name="Medium Chunks",
#             description="512 characters per chunk with 100 char overlap"
#         )
#         self.config = CHUNK_CONFIGS["medium_chunks"]

#     def chunk_document(self, document: str) -> List[str]:
#         cleaned = clean_text(document)
#         return split_into_chunks(
#             cleaned,
#             self.config["size"],
#             self.config["overlap"]
#         )

# class LargeChunkStrategy(ChunkingStrategy):
#     def __init__(self):
#         super().__init__(
#             name="Large Chunks",
#             description="1024 characters per chunk with 200 char overlap"
#         )
#         self.config = CHUNK_CONFIGS["large_chunks"]

#     def chunk_document(self, document: str) -> List[str]:
#         cleaned = clean_text(document)
#         return split_into_chunks(
#             cleaned,
#             self.config["size"],
#             self.config["overlap"]
#         )

# class HighOverlapStrategy(ChunkingStrategy):
#     def __init__(self):
#         super().__init__(
#             name="High Overlap Chunks",
#             description="512 characters with 256 char overlap (50%)"
#         )
#         self.config = CHUNK_CONFIGS["high_overlap"]

#     def chunk_document(self, document: str) -> List[str]:
#         cleaned = clean_text(document)
#         return split_into_chunks(
#             cleaned,
#             self.config["size"],
#             self.config["overlap"]
#         )

from app.strategies.base import ChunkingStrategy
from app.core.constants import CHUNK_CONFIGS
from typing import List, Tuple

class FixedSizeStrategy(ChunkingStrategy):
    def __init__(self, name: str, description: str, sentences_per_chunk: int):
        super().__init__(name=name, description=description)
        self.sentences_per_chunk = sentences_per_chunk

    def group_base_chunks(
        self, base_chunks: List[str]
    ) -> Tuple[List[List[int]], List[str]]:
        grouped_indices = []
        grouped_text = []

        for i in range(0, len(base_chunks), self.sentences_per_chunk):
            indices = list(range(i, min(i + self.sentences_per_chunk, len(base_chunks))))
            text = " ".join(base_chunks[j] for j in indices)

            grouped_indices.append(indices)
            grouped_text.append(text)

        return grouped_indices, grouped_text


class SmallChunkStrategy(FixedSizeStrategy):
    def __init__(self):
        super().__init__(
            name="Small Chunks",
            description="Small sentence groups (fine-grained context)",
            sentences_per_chunk=2
        )


class MediumChunkStrategy(FixedSizeStrategy):
    def __init__(self):
        super().__init__(
            name="Medium Chunks",
            description="Balanced sentence grouping",
            sentences_per_chunk=4
        )


class LargeChunkStrategy(FixedSizeStrategy):
    def __init__(self):
        super().__init__(
            name="Large Chunks",
            description="Large context windows",
            sentences_per_chunk=8
        )


class HighOverlapStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="High Overlap Chunks",
            description="Overlapping sentence windows (50% overlap)"
        )
        self.window = 6
        self.step = 3  # 50% overlap

    def group_base_chunks(
        self, base_chunks: List[str]
    ) -> Tuple[List[List[int]], List[str]]:
        grouped_indices = []
        grouped_text = []

        i = 0
        while i < len(base_chunks):
            indices = list(range(i, min(i + self.window, len(base_chunks))))
            text = " ".join(base_chunks[j] for j in indices)

            grouped_indices.append(indices)
            grouped_text.append(text)
            i += self.step

        return grouped_indices, grouped_text
