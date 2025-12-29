# from app.strategies.base import ChunkingStrategy
# from app.utils.text_utils import clean_text
# from typing import List
# import nltk

# # Download NLTK data (happens once)
# try:
#     nltk.data.find('tokenizers/punkt_tab')
# except LookupError:
#     nltk.download('punkt_tab', quiet=True)

# # try:
# #     nltk.data.find('tokenizers/punkt')
# # except LookupError:
# #     nltk.download('punkt', quiet=True)

# class SentenceBasedStrategy(ChunkingStrategy):
#     def __init__(self):
#         super().__init__(
#             name="Sentence-Based Chunking",
#             description="Groups 5 sentences per chunk, respects sentence boundaries"
#         )
#         self.sentences_per_chunk = 5

#     def chunk_document(self, document: str) -> List[str]:
#         cleaned = clean_text(document)

#         # Split into sentences
#         sentences = nltk.sent_tokenize(cleaned)

#         # Group sentences
#         chunks = []
#         for i in range(0, len(sentences), self.sentences_per_chunk):
#             chunk = ' '.join(sentences[i:i + self.sentences_per_chunk])
#             if chunk.strip():
#                 chunks.append(chunk.strip())

#         return chunks


from app.strategies.base import ChunkingStrategy
from typing import List, Tuple

class SentenceBasedStrategy(ChunkingStrategy):
    def __init__(self):
        super().__init__(
            name="Sentence-Based Chunking",
            description="Groups sentences while respecting boundaries"
        )
        self.sentences_per_chunk = 5

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
