# from app.services.embedding_service import embedding_service
# from app.services.embedding_cache_service import embedding_cache_service
# from app.services.llm_service import llm_service
# from app.strategies import get_all_strategies
# from app.strategies.base import ChunkingStrategy
# from app.core.constants import LLMProvider, StrategyType
# from app.models.responses import StrategyResult
# from typing import List
# import time
# import numpy as np

# class RAGService:
#     def __init__(self):
#         self.strategies = get_all_strategies()

#     def run_strategy_with_cached_embeddings(
#         self,
#         strategy: ChunkingStrategy,
#         base_chunks: List[str],
#         base_embeddings: np.ndarray,
#         query: str,
#         query_embedding: np.ndarray,
#         llm_provider: LLMProvider,
#         llm_model: str = None,
#         api_key: str = None,
#         top_k: int = 3
#     ) -> StrategyResult:
#         """
#         NEW: Run RAG pipeline using PRE-COMPUTED base embeddings

#         This implements the new architecture:
#         - Base chunks and embeddings already created
#         - Strategy groups base chunks (no new embeddings)
#         - Combines embeddings by averaging
#         """
#         start_time = time.time()

#         # 1. Group base chunks according to strategy
#         grouped_indices, grouped_chunks = strategy.group_base_chunks(base_chunks)

#         # 2. Get group embeddings by combining base embeddings (NO NEW API CALLS)
#         group_embeddings = embedding_cache_service.get_group_embeddings_for_strategy(
#             base_embeddings,
#             grouped_indices
#         )

#         # 3. Find top-k relevant groups
#         if len(group_embeddings) > 0:
#             from app.services.embedding_service import embedding_service as emb_svc
#             top_k_indices = emb_svc.find_top_k_similar(
#                 query_embedding,
#                 group_embeddings,
#                 k=min(top_k, len(group_embeddings))
#             )
#         else:
#             top_k_indices = []

#         # 4. Build context from top groups
#         retrieved_chunks = [grouped_chunks[i] for i in top_k_indices if i < len(grouped_chunks)]
#         context = "\n\n".join(retrieved_chunks)

#         # 5. Calculate relevance scores
#         relevance_scores = []
#         for i in top_k_indices:
#             if i < len(group_embeddings):
#                 relevance_scores.append(
#                     embedding_service.calculate_similarity(query_embedding, group_embeddings[i])
#                 )
#         avg_relevance = sum(relevance_scores) / len(relevance_scores) if relevance_scores else 0.0

#         # 6. Generate answer using LLM
#         answer, input_tokens, output_tokens, cost = llm_service.generate_answer(
#             query=query,
#             context=context,
#             provider=llm_provider,
#             model=llm_model,
#             api_key=api_key
#         )

#         # 7. Calculate accuracy (answer similarity to context)
#         # COMMENTED: Avoid extra embedding calls
#         # answer_embedding = embedding_service.generate_embedding(answer)
#         # context_embedding = embedding_service.generate_embedding(context)
#         # accuracy = embedding_service.calculate_similarity(answer_embedding, context_embedding)
#         accuracy = avg_relevance  # Use relevance as proxy for accuracy

#         # 8. Calculate processing time
#         processing_time = int((time.time() - start_time) * 1000)

#         # 9. Map strategy name to type
#         strategy_type_map = {
#             "Small Chunks": StrategyType.SMALL_CHUNKS,
#             "Medium Chunks": StrategyType.MEDIUM_CHUNKS,
#             "Large Chunks": StrategyType.LARGE_CHUNKS,
#             "High Overlap Chunks": StrategyType.HIGH_OVERLAP,
#             "Sentence-Based Chunking": StrategyType.SENTENCE_BASED,
#             "Semantic Chunking": StrategyType.SEMANTIC
#         }

#         return StrategyResult(
#             strategy_name=strategy.name,
#             strategy_type=strategy_type_map.get(strategy.name, StrategyType.SMALL_CHUNKS),
#             num_chunks=len(grouped_chunks),
#             avg_chunk_length=int(np.mean([len(c) for c in grouped_chunks])) if grouped_chunks else 0,
#             retrieval_score=avg_relevance,
#             accuracy=accuracy,
#             processing_time=processing_time,
#             tokens_used=input_tokens + output_tokens,
#             estimated_cost=cost,
#             answer=answer
#         )

#     def run_strategy(
#         self,
#         strategy: ChunkingStrategy,
#         document: str,
#         query: str,
#         llm_provider: LLMProvider,
#         llm_model: str = None,
#         api_key: str = None,
#         top_k: int = 3
#     ) -> StrategyResult:
#         """
#         DEPRECATED: Original method - kept for backwards compatibility

#         Use run_strategy_with_cached_embeddings instead
#         """
#         print(f"⚠️  Using deprecated run_strategy. Consider using run_strategy_with_cached_embeddings")
#         start_time = time.time()

#         # COMMENTED OUT: Original Voyage AI embedding calls
#         # # 1. Chunk the document
#         # chunks = strategy.chunk_document(document)
#         #
#         # # 2. Generate embeddings for chunks and query
#         # chunk_embeddings = embedding_service.generate_embeddings(chunks)
#         # query_embedding = embedding_service.generate_embedding(query)
#         #
#         # # 3. Find top-k relevant chunks
#         # top_k_indices = embedding_service.find_top_k_similar(
#         #     query_embedding,
#         #     chunk_embeddings,
#         #     k=min(top_k, len(chunks))
#         # )
#         #
#         # # 4. Build context from top chunks
#         # retrieved_chunks = [chunks[i] for i in top_k_indices]
#         # context = "\n\n".join(retrieved_chunks)
#         #
#         # # 5. Calculate relevance scores
#         # relevance_scores = [
#         #     embedding_service.calculate_similarity(query_embedding, chunk_embeddings[i])
#         #     for i in top_k_indices
#         # ]
#         # avg_relevance = sum(relevance_scores) / len(relevance_scores)
#         #
#         # # 6. Generate answer using LLM
#         # answer, input_tokens, output_tokens, cost = llm_service.generate_answer(
#         #     query=query,
#         #     context=context,
#         #     provider=llm_provider,
#         #     model=llm_model,
#         #     api_key=api_key
#         # )
#         #
#         # # 7. Calculate accuracy (answer similarity to context)
#         # answer_embedding = embedding_service.generate_embedding(answer)
#         # context_embedding = embedding_service.generate_embedding(context)
#         # accuracy = embedding_service.calculate_similarity(answer_embedding, context_embedding)

#         # Fallback: use embedding cache service
#         base_chunks, base_embeddings = embedding_cache_service.embed_base_chunks(document)
#         query_embedding = embedding_service.generate_embedding(query)

#         return self.run_strategy_with_cached_embeddings(
#             strategy=strategy,
#             base_chunks=base_chunks,
#             base_embeddings=base_embeddings,
#             query=query,
#             query_embedding=query_embedding,
#             llm_provider=llm_provider,
#             llm_model=llm_model,
#             api_key=api_key,
#             top_k=top_k
#         )

#     async def run_all_strategies(
#         self,
#         document: str,
#         query: str,
#         llm_provider: LLMProvider,
#         llm_model: str = None,
#         api_key: str = None
#     ) -> List[StrategyResult]:
#         """
#         NEW: Run all strategies using base embedding cache

#         This is the key optimization:
#         1. Embed document ONCE (create base chunks + embeddings)
#         2. Cache embeddings
#         3. Each strategy regroups base chunks + reuses embeddings
#         """
#         results = []

#         # STEP 1: Create base chunks and embed ONCE
#         print("\n📊 Creating base chunks and embeddings...")
#         base_chunks, base_embeddings = embedding_cache_service.embed_base_chunks(document)

#         if len(base_chunks) == 0:
#             print("❌ No base chunks created")
#             return results

#         # STEP 2: Embed query ONCE
#         query_embedding = embedding_service.generate_embedding(query)

#         # STEP 3: Run all strategies using cached embeddings (no new embeddings needed)
#         for strategy in self.strategies:
#             try:
#                 print(f"\n🔄 Running {strategy.name}...")
#                 result = self.run_strategy_with_cached_embeddings(
#                     strategy=strategy,
#                     base_chunks=base_chunks,
#                     base_embeddings=base_embeddings,
#                     query=query,
#                     query_embedding=query_embedding,
#                     llm_provider=llm_provider,
#                     llm_model=llm_model,
#                     api_key=api_key
#                 )
#                 results.append(result)
#             except Exception as e:
#                 print(f"❌ Error running {strategy.name}: {str(e)}")
#                 continue

#         print(f"\n✅ Completed {len(results)}/{len(self.strategies)} strategies")
#         return results

# # Singleton
# rag_service = RAGService()

from app.services.embedding_cache_service import embedding_cache_service
from app.services.llm_service import llm_service
from app.strategies import get_all_strategies
from app.core.constants import LLMProvider, StrategyType
from app.models.responses import StrategyResult
import numpy as np
import time

class RAGService:
    def __init__(self):
        self.strategies = get_all_strategies()

    def _get_strategy_type(self, strategy_name: str) -> StrategyType:
        """Map strategy name to StrategyType enum"""
        strategy_type_map = {
            "Small Chunks": StrategyType.SMALL_CHUNKS,
            "Medium Chunks": StrategyType.MEDIUM_CHUNKS,
            "Large Chunks": StrategyType.LARGE_CHUNKS,
            "High Overlap Chunks": StrategyType.HIGH_OVERLAP,
            "Sentence-Based Chunking": StrategyType.SENTENCE_BASED,
            "Semantic Chunking": StrategyType.SEMANTIC
        }
        return strategy_type_map.get(strategy_name, StrategyType.SMALL_CHUNKS)

    async def run_all_strategies(
        self,
        document: str,
        document_id: str,
        query: str,
        llm_provider: LLMProvider,
        llm_model: str = None,
        api_key: str = None,
        top_k: int = 3
    ):
        results = []

        # 1️⃣ Embed document ONCE
        base_chunks, base_embeddings = embedding_cache_service.embed_base_chunks(
            document, document_id
        )

        # 2️⃣ Embed query ONCE (cached)
        query_embedding = embedding_cache_service.embed_query(query, document_id)

        for strategy in self.strategies:
            start = time.time()

            grouped_indices, grouped_text = strategy.group_base_chunks(base_chunks)
            group_embeddings = embedding_cache_service.build_group_embeddings(
                grouped_indices, base_embeddings
            )

            sims = np.dot(group_embeddings, query_embedding)
            top = np.argsort(sims)[-top_k:][::-1]

            context = "\n\n".join([grouped_text[i] for i in top])
            relevance = float(np.mean([sims[i] for i in top]))

            answer, in_tok, out_tok, cost = llm_service.generate_answer(
                query=query,
                context=context,
                provider=llm_provider.GROQ,
                model=llm_model,
                api_key=api_key
            )

            # Transform service output to StrategyResult using mapping
            result = StrategyResult.from_service_output(
                strategy_name=strategy.name,
                strategy_type=self._get_strategy_type(strategy.name),
                num_chunks=len(grouped_text),
                avg_chunk_length=int(np.mean([len(c) for c in grouped_text])),
                retrieval_score=relevance,
                accuracy=relevance,
                processing_time=int((time.time() - start) * 1000),
                tokens_used=in_tok + out_tok,
                estimated_cost=cost,
                answer=answer
            )
            results.append(result)

        return results


rag_service = RAGService()
