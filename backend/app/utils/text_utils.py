import re

def clean_text(text: str) -> str:
    """Clean and normalize text"""
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove special characters but keep punctuation
    text = re.sub(r'[^\w\s.,!?;:-]', '', text)
    return text.strip()

def split_into_chunks(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Split text into fixed-size chunks with overlap"""
    chunks = []
    start = 0
    text_length = len(text)

    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]

        if chunk.strip():  # Only add non-empty chunks
            chunks.append(chunk.strip())

        # Move start position
        start += chunk_size - overlap

        # Prevent infinite loop
        if start <= (start - chunk_size + overlap):
            break

    return chunks
