# from app.services.rag_service import rag_service
# from app.core.constants import LLMProvider
# from typing import List

# class BatchRAGService:
#     async def run_batch_analysis(
#         self,
#         document: str,
#         queries: List[str],
#         llm_provider: LLMProvider,
#         llm_model: str = None,
#         api_key: str = None
#     ) -> List[dict]:
#         """Run all strategies on multiple queries"""
#         query_results = []

#         for idx, query in enumerate(queries, 1):
#             print(f"Processing query {idx}/{len(queries)}: {query[:50]}...")

#             try:
#                 # Run all 6 strategies for this query
#                 results = await rag_service.run_all_strategies(
#                     document=document,
#                     query=query,
#                     llm_provider=llm_provider,
#                     llm_model=llm_model,
#                     api_key=api_key
#                 )

#                 if results:
#                     # Find best strategy for this query
#                     best = max(results, key=lambda x: x.accuracy)

#                     query_results.append({
#                         "query_id": idx,
#                         "query_text": query,
#                         "best_strategy": best.strategy_name,
#                         "best_accuracy": best.accuracy,
#                         "all_results": results
#                     })
#                 else:
#                     print(f"No results for query {idx}")

#             except Exception as e:
#                 print(f"Error processing query {idx}: {e}")
#                 continue

#         return query_results

# # Singleton
# batch_rag_service = BatchRAGService()

from app.services.rag_service import rag_service
from app.core.constants import LLMProvider
from typing import List


class BatchRAGService:
    async def run_batch_analysis(
        self,
        document: str,
        document_id: str,
        queries: List[str],
        llm_provider: LLMProvider,
        llm_model: str = None,
        api_key: str = None
    ) -> List[dict]:
        """
        Run RAG analysis for multiple queries on the SAME document.

        Guarantees:
        - Document embedded ONCE (cached via document_id)
        - Each query embedded ONCE (cached)
        - No per-strategy embedding calls
        """
        query_results = []

        for idx, query in enumerate(queries, start=1):
            print(f"🔍 Processing query {idx}/{len(queries)}")

            try:
                results = await rag_service.run_all_strategies(
                    document=document,
                    document_id=document_id,
                    query=query,
                    llm_provider=llm_provider,
                    llm_model=llm_model,
                    api_key=api_key
                )

                if not results:
                    continue

                best = max(results, key=lambda r: r.accuracy)

                query_results.append({
                    "query_id": idx,
                    "query_text": query,
                    "best_strategy": best.strategy_name,
                    "best_accuracy": best.accuracy,
                    "all_results": results
                })

            except Exception as e:
                print(f"❌ Query {idx} failed: {e}")
                continue

        return query_results


# Singleton
batch_rag_service = BatchRAGService()
