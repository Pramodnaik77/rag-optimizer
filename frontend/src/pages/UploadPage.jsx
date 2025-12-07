import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Trophy, Zap, BarChart3, FileText, Sparkles, CheckCircle2, Github, Menu, X } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { uploadDocument } from '../services/api';
import Header from '../components/Header';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [mainQuery, setMainQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/* Premium Header with Gradient */}
        <Header />
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Info Section */}
        <div className="w-full lg:w-[38%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-8 lg:px-12 lg:py-10 border-b lg:border-b-0 lg:border-r border-blue-100 relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>

          <div className="relative z-10 max-w-xl mx-auto lg:max-w-none space-y-6 lg:space-y-8">
            {/* Hero Section */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-xs lg:text-sm font-semibold mb-4 shadow-lg shadow-blue-500/30">
                <Sparkles className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                AI-Powered Analysis
              </div>
              <h2 className="text-3xl lg:text-[42px] font-bold text-gray-900 mb-3 lg:mb-4 leading-tight">
                Compare 6 RAG<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Chunking Strategies
                </span>
              </h2>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                Get data-driven recommendations in under 3 minutes. No signup, no hassle.
              </p>
            </div>

            {/* What You Get - Premium Cards */}
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider">
                What You Get
              </h3>

              <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-yellow-500/30">
                  <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm lg:text-base text-gray-900 mb-0.5 lg:mb-1">Winner Recommendation</h4>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">Clear winner with confidence scores</p>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                  <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm lg:text-base text-gray-900 mb-0.5 lg:mb-1">6 Strategies Tested</h4>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">Small, medium, large, semantic</p>
                </div>
              </div>

              <div className="flex items-start gap-3 lg:gap-4 p-3 lg:p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                  <Zap className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm lg:text-base text-gray-900 mb-0.5 lg:mb-1">AI-Generated Queries</h4>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">7 diverse test questions</p>
                </div>
              </div>
            </div>

            {/* How It Works */}
            <div>
              <h3 className="text-xs lg:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 lg:mb-4">
                How It Works
              </h3>
              <div className="space-y-2.5 lg:space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs lg:text-sm flex-shrink-0 shadow-md">
                    1
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 font-medium">Upload your document</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs lg:text-sm flex-shrink-0 shadow-md">
                    2
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 font-medium">Select test queries</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-xs lg:text-sm flex-shrink-0 shadow-md">
                    3
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 font-medium">View detailed results</span>
                </div>
              </div>
            </div>

            {/* Sample Report Link
            <a href="#" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm lg:text-base group">
              <FileText className="h-4 w-4 lg:h-5 lg:w-5" />
              View sample report
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a> */}
          </div>
        </div>

        {/* Right Panel - Upload Form */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 lg:px-16 lg:py-10 bg-white">
          <div className="w-full max-w-2xl space-y-6 lg:space-y-8">
            {/* Step Indicator - Premium */}
            <div className="flex items-center justify-center gap-2 lg:gap-3 mb-4 lg:mb-6">
              <div className="flex items-center gap-1.5 lg:gap-2.5">
                <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xs lg:text-sm font-bold shadow-lg shadow-blue-500/30">
                  1
                </div>
                <span className="text-xs lg:text-sm font-semibold text-gray-900">Upload</span>
              </div>
              <div className="w-8 lg:w-16 h-0.5 lg:h-1 bg-gray-200 rounded-full"></div>
              <div className="flex items-center gap-1.5 lg:gap-2.5">
                <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs lg:text-sm font-bold">
                  2
                </div>
                <span className="text-xs lg:text-sm font-semibold text-gray-400">Queries</span>
              </div>
              <div className="w-8 lg:w-16 h-0.5 lg:h-1 bg-gray-200 rounded-full"></div>
              <div className="flex items-center gap-1.5 lg:gap-2.5">
                <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs lg:text-sm font-bold">
                  3
                </div>
                <span className="text-xs lg:text-sm font-semibold text-gray-400">Results</span>
              </div>
            </div>

            {/* Upload Section */}
            <div>
              <label className="block text-sm lg:text-base font-bold text-gray-900 mb-2 lg:mb-3">
                Upload Document
              </label>
              <FileUpload selectedFile={file} onFileSelect={setFile} />
            </div>

            {/* Main Query */}
            <div>
              <label htmlFor="mainQuery" className="block text-sm lg:text-base font-bold text-gray-900 mb-2 lg:mb-3">
                Main Question <span className="text-gray-500 font-normal text-xs lg:text-sm">(Optional)</span>
              </label>
              <input
                id="mainQuery"
                type="text"
                placeholder="e.g., What are the benefits of RAG?"
                value={mainQuery}
                onChange={(e) => setMainQuery(e.target.value)}
                className="w-full px-4 lg:px-5 py-3 lg:py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm lg:text-base"
                maxLength={500}
              />
              <p className="mt-1.5 lg:mt-2 text-xs lg:text-sm text-gray-500">
                Used as primary test query. Leave blank to auto-generate.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 lg:p-4 bg-red-50 border-2 border-red-200 rounded-xl text-xs lg:text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Premium Button */}
            <button
              onClick={handleUpload}
              disabled={!file || uploading || (file && file.size > 10 * 1024 * 1024)}
              className="w-full h-12 lg:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold text-sm lg:text-base rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 disabled:shadow-none flex items-center justify-center gap-2 lg:gap-3"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 lg:h-5 lg:w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Continue to Query Selection</span>
                  <span className="sm:hidden">Continue</span>
                  <span className="text-base lg:text-lg">→</span>
                </>
              )}
            </button>

            {/* Quick Info - Premium Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 pt-2">
              <div className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-green-50 border border-green-200 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-green-600" />
                <span className="text-xs lg:text-sm font-medium text-green-700">2-3 min</span>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-blue-50 border border-blue-200 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-blue-600" />
                <span className="text-xs lg:text-sm font-medium text-blue-700">No signup</span>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-purple-50 border border-purple-200 rounded-full">
                <CheckCircle2 className="h-3.5 w-3.5 lg:h-4 lg:w-4 text-purple-600" />
                <span className="text-xs lg:text-sm font-medium text-purple-700">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
