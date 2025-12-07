from fastapi import APIRouter, UploadFile, File, Form
from typing import Optional
from app.models.requests import AnalyzeRequest
from app.models.responses import AnalyzeResponse, DocumentUploadResponse
from app.services.document_service import document_service
from app.services.rag_service import rag_service
from app.utils.document_storage import document_storage
from app.utils.metrics import generate_insights, find_best_strategy
from app.core.constants import LLMProvider
from app.services.query_generator import query_generator
from app.models.responses import GenerateQueriesResponse
from app.models.requests import BatchAnalyzeRequest
from app.models.responses import BatchAnalyzeResponse, QueryResult
from app.services.batch_rag_service import batch_rag_service
from app.utils.metrics import analyze_batch_results

router = APIRouter(prefix="/api", tags=["analysis"])


# @router.post("/upload", response_model=AnalyzeResponse)
# async def upload_and_analyze(
#     file: UploadFile = File(...),
#     query: str = Form(...),
#     llm_provider: str = Form("groq"),
#     llm_model: Optional[str] = Form(None),
#     api_key: Optional[str] = Form(None)
# ):
#     """Upload document and analyze"""
#     temp_file = None
#     try:
#         # Validate file type
#         file_extension = file.filename.split('.')[-1].lower()
#         if file_extension not in ['pdf', 'docx', 'txt']:
#             return AnalyzeResponse(
#                 success=False,
#                 results=[],
#                 best_strategy="Error",
#                 insights=["Only PDF, DOCX, and TXT files are supported"]
#             )

#         # Save uploaded file temporarily
#         with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{file_extension}') as temp:
#             content = await file.read()
#             temp.write(content)
#             temp_file = temp.name

#         # Parse document
#         document_text = document_service.parse_file(temp_file, file_extension)

#         # Validate document length
#         if len(document_text) < 50:
#             return AnalyzeResponse(
#                 success=False,
#                 results=[],
#                 best_strategy="Error",
#                 insights=["Document too short (minimum 50 characters)"]
#             )

#         if len(document_text) > 100000:
#             document_text = document_text[:100000]

#         # Run analysis
#         provider = LLMProvider(llm_provider)
#         results = await rag_service.run_all_strategies(
#             document=document_text,
#             query=query,
#             llm_provider=provider,
#             llm_model=llm_model,
#             api_key=api_key
#         )

#         if not results:
#             return AnalyzeResponse(
#                 success=False,
#                 results=[],
#                 best_strategy="No results",
#                 insights=["All strategies failed"]
#             )

#         insights = generate_insights(results)
#         best_strategy = find_best_strategy(results)

#         return AnalyzeResponse(
#             success=True,
#             results=results,
#             best_strategy=best_strategy,
#             insights=insights
#         )

#     except Exception as e:
#         return AnalyzeResponse(
#             success=False,
#             results=[],
#             best_strategy="Error",
#             insights=[f"Error: {str(e)}"]
#         )

#     finally:
#         # Cleanup temp file
#         if temp_file and os.path.exists(temp_file):
#             os.remove(temp_file)

@router.post("/documents", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    main_query: Optional[str] = Form(None)
):
    """Upload document and store in Redis for later analysis"""
    try:
        # Validate file type
        file_extension = file.filename.split('.')[-1].lower()
        if file_extension not in ['pdf', 'docx', 'txt']:
            return DocumentUploadResponse(
                success=False,
                document_id="",
                filename=file.filename,
                word_count=0,
                preview="Only PDF, DOCX, and TXT files are supported"
            )

        # Read file content
        file_content = await file.read()

        # Generate document ID
        doc_id = document_storage.generate_document_id()

        # Parse document based on type
        if file_extension == 'txt':
            document_text = file_content.decode('utf-8')
        elif file_extension == 'pdf':
            # Save temporarily for PDF parsing
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
                temp.write(file_content)
                temp_path = temp.name
            document_text = document_service.parse_pdf(temp_path)
            import os
            os.unlink(temp_path)
        elif file_extension == 'docx':
            # Save temporarily for DOCX parsing
            import tempfile
            with tempfile.NamedTemporaryFile(delete=False, suffix='.docx') as temp:
                temp.write(file_content)
                temp_path = temp.name
            document_text = document_service.parse_docx(temp_path)
            import os
            os.unlink(temp_path)

        # Validate document length
        if len(document_text) < 50:
            return DocumentUploadResponse(
                success=False,
                document_id="",
                filename=file.filename,
                word_count=0,
                preview="Document too short (minimum 50 characters)"
            )

        # Truncate if too long
        if len(document_text) > 100000:
            document_text = document_text[:100000]

        # Calculate word count
        word_count = len(document_text.split())

        # Store in Redis
        document_storage.save_cached_text(document_text, doc_id)
        document_storage.save_document_metadata(doc_id, file.filename, word_count)

        # Generate preview
        preview = document_text[:200].strip()
        if len(document_text) > 200:
            preview += "..."

        return DocumentUploadResponse(
            success=True,
            document_id=doc_id,
            filename=file.filename,
            word_count=word_count,
            preview=preview
        )

    except Exception as e:
        return DocumentUploadResponse(
            success=False,
            document_id="",
            filename=file.filename,
            word_count=0,
            preview=f"Error: {str(e)}"
        )


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_document(request: AnalyzeRequest):
    """Main analysis endpoint - runs all 6 strategies (legacy single query)"""
    try:
        results = await rag_service.run_all_strategies(
            document=request.document,
            query=request.query,
            llm_provider=request.llm_provider,
            llm_model=request.llm_model,
            api_key=request.api_key
        )

        if not results:
            return AnalyzeResponse(
                success=False,
                results=[],
                best_strategy="No results",
                insights=["All strategies failed - check document and query"]
            )

        insights = generate_insights(results)
        best_strategy = find_best_strategy(results)

        return AnalyzeResponse(
            success=True,
            results=results,
            best_strategy=best_strategy,
            insights=insights
        )

    except Exception as e:
        return AnalyzeResponse(
            success=False,
            results=[],
            best_strategy="Error",
            insights=[f"Error: {str(e)}"]
        )

@router.post("/documents/{document_id}/generate-queries", response_model=GenerateQueriesResponse)
async def generate_queries(document_id: str, main_query: Optional[str] = Form(None)):
    """Generate test queries for a document"""
    try:
        # Check if document exists
        if not document_storage.document_exists(document_id):
            return GenerateQueriesResponse(
                success=False,
                document_id=document_id,
                queries=[],
                message="Document not found or expired"
            )

        # Load document text
        document_text = document_storage.load_cached_text(document_id)

        # Generate queries
        queries = query_generator.generate_queries(document_text, main_query)

        return GenerateQueriesResponse(
            success=True,
            document_id=document_id,
            queries=queries,
            message="Queries generated successfully"
        )

    except Exception as e:
        return GenerateQueriesResponse(
            success=False,
            document_id=document_id,
            queries=[],
            message=f"Error: {str(e)}"
        )

@router.post("/documents/{document_id}/analyze", response_model=BatchAnalyzeResponse)
async def batch_analyze_document(document_id: str, request: BatchAnalyzeRequest):
    """Run batch analysis on selected queries"""
    try:
        # Check if document exists
        if not document_storage.document_exists(document_id):
            return BatchAnalyzeResponse(
                success=False,
                document_id=document_id,
                query_results=[],
                aggregate_winner="",
                aggregate_insights=[],
                message="Document not found or expired"
            )

        # Load document
        document_text = document_storage.load_cached_text(document_id)

        # Get queries from Redis (generated queries stored temporarily)
        # For now, we'll expect frontend to send actual query texts
        # TODO: Store generated queries in Redis for retrieval by ID

        # Build query list from custom queries (for now)
        # In production, you'd retrieve by selected_query_ids
        queries = request.custom_queries

        if not queries:
            return BatchAnalyzeResponse(
                success=False,
                document_id=document_id,
                query_results=[],
                aggregate_winner="",
                aggregate_insights=[],
                message="No queries provided. Add custom_queries to request."
            )

        # Validate query count
        if len(queries) < 3:
            return BatchAnalyzeResponse(
                success=False,
                document_id=document_id,
                query_results=[],
                aggregate_winner="",
                aggregate_insights=[],
                message="Minimum 3 queries required for meaningful analysis"
            )

        if len(queries) > 10:
            queries = queries[:10]  # Limit to 10

        # Run batch analysis
        query_results = await batch_rag_service.run_batch_analysis(
            document=document_text,
            queries=queries,
            llm_provider=request.llm_provider,
            llm_model=request.llm_model,
            api_key=request.api_key
        )

        if not query_results:
            return BatchAnalyzeResponse(
                success=False,
                document_id=document_id,
                query_results=[],
                aggregate_winner="",
                aggregate_insights=[],
                message="All queries failed to process"
            )

        # Analyze aggregate results
        aggregate_winner, aggregate_insights = analyze_batch_results(query_results)

        # Convert to response format
        formatted_results = [
            QueryResult(
                query_id=qr["query_id"],
                query_text=qr["query_text"],
                best_strategy=qr["best_strategy"],
                best_accuracy=qr["best_accuracy"],
                all_results=qr["all_results"]
            )
            for qr in query_results
        ]

        return BatchAnalyzeResponse(
            success=True,
            document_id=document_id,
            query_results=formatted_results,
            aggregate_winner=aggregate_winner,
            aggregate_insights=aggregate_insights,
            message=f"Successfully analyzed {len(queries)} queries"
        )

    except Exception as e:
        return BatchAnalyzeResponse(
            success=False,
            document_id=document_id,
            query_results=[],
            aggregate_winner="",
            aggregate_insights=[],
            message=f"Error: {str(e)}"
        )
