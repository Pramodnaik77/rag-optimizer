"""
Pre-download models for faster deployment and to avoid runtime downloads.
This script should be run during the build process to cache models.
"""

import os
import sys

# Suppress download progress bars
os.environ['HF_HUB_DISABLE_PROGRESS_BARS'] = '1'

try:
    print("Pre-downloading embedding model...")
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    print(f"✓ Embedding model cached successfully")

    print("Pre-downloading NLTK data...")
    import nltk
    nltk.download('punkt_tab', quiet=True)
    print(f"✓ NLTK punkt_tab cached successfully")

    print("\n✅ All models pre-downloaded and cached!")
    sys.exit(0)

except Exception as e:
    print(f"❌ Error pre-downloading models: {e}", file=sys.stderr)
    sys.exit(1)
