from app.services.embedding_service import embedding_service
from app.services.llm_service import llm_service
from app.strategies import get_all_strategies
from app.strategies.base import ChunkingStrategy
from app.core.constants import LLMProvider, StrategyType
from app.models.responses import StrategyResult
from typing import List
import time

class RAGService:
    def __init__(self):
        self.strategies = get_all_strategies()

    def run_strategy(
        self,
        strategy: ChunkingStrategy,
        document: str,
        query: str,
        llm_provider: LLMProvider,
        llm_model: str = None,
        api_key: str = None,
        top_k: int = 3
    ) -> StrategyResult:
        """Run RAG pipeline for a single strategy"""
        start_time = time.time()

        # 1. Chunk the document
        chunks = strategy.chunk_document(document)

        # 2. Generate embeddings for chunks and query
        chunk_embeddings = embedding_service.generate_embeddings(chunks)
        query_embedding = embedding_service.generate_embedding(query)

        # 3. Find top-k relevant chunks
        top_k_indices = embedding_service.find_top_k_similar(
            query_embedding,
            chunk_embeddings,
            k=min(top_k, len(chunks))
        )

        # 4. Build context from top chunks
        retrieved_chunks = [chunks[i] for i in top_k_indices]
        context = "\n\n".join(retrieved_chunks)

        # 5. Calculate relevance scores
        relevance_scores = [
            embedding_service.calculate_similarity(query_embedding, chunk_embeddings[i])
            for i in top_k_indices
        ]
        avg_relevance = sum(relevance_scores) / len(relevance_scores)

        # 6. Generate answer using LLM
        answer, input_tokens, output_tokens, cost = llm_service.generate_answer(
            query=query,
            context=context,
            provider=llm_provider,
            model=llm_model,
            api_key=api_key
        )

        # 7. Calculate accuracy (answer similarity to context)
        answer_embedding = embedding_service.generate_embedding(answer)
        context_embedding = embedding_service.generate_embedding(context)
        accuracy = embedding_service.calculate_similarity(answer_embedding, context_embedding)

        # 8. Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)

        # 9. Map strategy name to type
        strategy_type_map = {
            "Small Chunks": StrategyType.SMALL_CHUNKS,
            "Medium Chunks": StrategyType.MEDIUM_CHUNKS,
            "Large Chunks": StrategyType.LARGE_CHUNKS,
            "High Overlap Chunks": StrategyType.HIGH_OVERLAP,
            "Sentence-Based Chunking": StrategyType.SENTENCE_BASED,
            "Semantic Chunking": StrategyType.SEMANTIC
        }

        return StrategyResult(
            strategy_name=strategy.name,
            strategy_type=strategy_type_map[strategy.name],
            description=strategy.description,
            accuracy=round(accuracy, 3),
            relevance=round(avg_relevance, 3),
            cost=round(cost, 6),
            processing_time_ms=processing_time,
            chunks_used=len(retrieved_chunks),
            chunks_created=len(chunks),
            total_tokens=input_tokens + output_tokens,
            generated_answer=answer,
            retrieved_chunks=retrieved_chunks
        )

    async def run_all_strategies(
        self,
        document: str,
        query: str,
        llm_provider: LLMProvider,
        llm_model: str = None,
        api_key: str = None
    ) -> List[StrategyResult]:
        """Run all strategies and return results"""
        results = []

        for strategy in self.strategies:
            try:
                result = self.run_strategy(
                    strategy=strategy,
                    document=document,
                    query=query,
                    llm_provider=llm_provider,
                    llm_model=llm_model,
                    api_key=api_key
                )
                results.append(result)
            except Exception as e:
                print(f"Error running {strategy.name}: {str(e)}")
                continue

        return results

# Singleton
rag_service = RAGService()
