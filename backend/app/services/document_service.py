import pdfplumber
from docx import Document
from typing import Optional
from app.core.exceptions import ChunkingError

class DocumentService:
    def parse_pdf(self, file_path: str) -> str:
        """Extract text from PDF"""
        try:
            text = ""
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
            return text.strip()
        except Exception as e:
            raise ChunkingError(f"PDF parsing failed: {str(e)}")

    def parse_docx(self, file_path: str) -> str:
        """Extract text from DOCX"""
        try:
            doc = Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            raise ChunkingError(f"DOCX parsing failed: {str(e)}")

    def parse_txt(self, file_path: str) -> str:
        """Extract text from TXT"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                return f.read().strip()
        except Exception as e:
            raise ChunkingError(f"TXT parsing failed: {str(e)}")

    def parse_file(self, file_path: str, file_type: str) -> str:
        """Parse file based on type"""
        if file_type == "pdf":
            return self.parse_pdf(file_path)
        elif file_type == "docx":
            return self.parse_docx(file_path)
        elif file_type == "txt":
            return self.parse_txt(file_path)
        else:
            raise ChunkingError(f"Unsupported file type: {file_type}")

# Singleton
document_service = DocumentService()
