from app.services.llm_service import llm_service
from app.core.constants import LLMProvider

QUERY_GENERATION_PROMPT = """Based on the following document, generate exactly 7 diverse test questions that would help evaluate a RAG system's performance.

Document:
{document}

Generate questions in these categories:
1. Summary - Ask for a high-level summary
2. Concept Extraction - Ask about main concepts or ideas
3. Definition - Ask to define key terms or terminology
4. Reasoning - Ask "how" or "why" questions requiring analysis
5. Comparison - Ask to compare or contrast ideas/approaches
6. Fact Extraction - Ask for specific data, numbers, or entities
7. Insight - Ask for implications or conclusions

Return ONLY the 7 questions, one per line, numbered 1-7. No explanations, no extra text.

Example format:
1. What is the main topic discussed in this document?
2. How does concept A relate to concept B?
3. Define the key terminology used in the document.
4. Why is the approach described important?
5. Compare the benefits and drawbacks mentioned.
6. What specific data or numbers are provided?
7. What are the main conclusions or implications?

Your 7 questions:"""

class QueryGenerator:
    def generate_queries(self, document: str, main_query: str = None) -> list[dict]:
        """Generate 7 diverse test queries from document"""
        try:
            # Use Groq for query generation (free)
            prompt = QUERY_GENERATION_PROMPT.format(document=document[:3000])  # Limit context

            answer, _, _, _ = llm_service.generate_answer(
                query=prompt,
                context="",  # No context needed
                provider=LLMProvider.GROQ,
                model="llama-3.1-8b-instant"
            )

            # Parse response into queries
            lines = [line.strip() for line in answer.split('\n') if line.strip()]

            queries = []
            categories = ["summary", "concept", "definition", "reasoning", "comparison", "fact", "insight"]

            for idx, line in enumerate(lines[:7]):  # Take first 7
                # Remove numbering like "1.", "1)", etc.
                text = line
                for prefix in [f"{idx+1}.", f"{idx+1})", f"{idx+1} -", f"{idx+1}:"]:
                    if text.startswith(prefix):
                        text = text[len(prefix):].strip()
                        break

                if text:
                    queries.append({
                        "id": idx + 1,
                        "text": text,
                        "category": categories[idx] if idx < len(categories) else "general",
                        "is_main": False
                    })

            # If we got less than 7, add fallback queries
            while len(queries) < 7:
                queries.append({
                    "id": len(queries) + 1,
                    "text": "What are the key insights from this document?",
                    "category": "general",
                    "is_main": False
                })

            # If main_query provided, make it the first query and mark as main
            if main_query and main_query.strip():
                queries[0] = {
                    "id": 1,
                    "text": main_query.strip(),
                    "category": "custom",
                    "is_main": True
                }
            else:
                # Mark first query as main by default
                queries[0]["is_main"] = True

            return queries[:7]  # Ensure exactly 7

        except Exception as e:
            print(f"Query generation error: {e}")
            # Return fallback queries
            return self._get_fallback_queries(main_query)

    def _get_fallback_queries(self, main_query: str = None) -> list[dict]:
        """Return generic fallback queries if generation fails"""
        fallback = [
            {"id": 1, "text": main_query or "What is the main topic of this document?", "category": "summary", "is_main": True},
            {"id": 2, "text": "What are the key concepts discussed?", "category": "concept", "is_main": False},
            {"id": 3, "text": "Define the primary terms used in the document.", "category": "definition", "is_main": False},
            {"id": 4, "text": "How does the document explain its main ideas?", "category": "reasoning", "is_main": False},
            {"id": 5, "text": "What comparisons or contrasts are made?", "category": "comparison", "is_main": False},
            {"id": 6, "text": "What specific facts or data are mentioned?", "category": "fact", "is_main": False},
            {"id": 7, "text": "What are the conclusions or implications?", "category": "insight", "is_main": False}
        ]
        return fallback

# Singleton
query_generator = QueryGenerator()
