import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { uploadDocument } from '../services/api';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [mainQuery, setMainQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await uploadDocument(file, mainQuery);

      if (response.success) {
        // Navigate to query selection page with document data
        navigate('/queries', {
          state: {
            documentId: response.document_id,
            filename: response.filename,
            wordCount: response.word_count,
            mainQuery: mainQuery
          }
        });
      } else {
        setError(response.preview || 'Upload failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              RAG Pipeline Optimizer
            </h1>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Compare RAG Chunking Strategies
          </h2>
          <p className="text-lg text-gray-600">
            Upload your document and discover which chunking strategy works best
          </p>
        </div>

        <div className="card space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <span className="text-sm font-medium text-gray-900">Upload</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="text-sm font-medium text-gray-500">Queries</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <span className="text-sm font-medium text-gray-500">Results</span>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Upload Document
            </label>
            <FileUpload selectedFile={file} onFileSelect={setFile} />
          </div>

          {/* Main Query Input */}
          <div>
            <label htmlFor="mainQuery" className="block text-sm font-semibold text-gray-900 mb-3">
              Main Question <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <input
              id="mainQuery"
              type="text"
              placeholder="e.g., What are the benefits of RAG?"
              value={mainQuery}
              onChange={(e) => setMainQuery(e.target.value)}
              className="input"
              maxLength={500}
            />
            <p className="mt-2 text-sm text-gray-500">
              This will be used as the primary test query. Leave blank to auto-generate.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading || (file && file.size > 10 * 1024 * 1024)}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : (
              'Continue to Query Selection'
            )}
          </button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary-600 mb-1">6</div>
            <div className="text-sm text-gray-600">Strategies Tested</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary-600 mb-1">5-7</div>
            <div className="text-sm text-gray-600">Test Queries</div>
          </div>
          <div className="text-center p-4">
            <div className="text-2xl font-bold text-primary-600 mb-1">~2min</div>
            <div className="text-sm text-gray-600">Analysis Time</div>
          </div>
        </div>
      </main>
    </div>
  );
}
