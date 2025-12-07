import { Sparkles, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ showBack = false, backTo = '/' }) {
  const navigate = useNavigate();

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg z-20 flex-shrink-0">
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                RAG Pipeline Optimizer
              </h1>
              <p className="text-xs text-blue-100 hidden sm:block">Powered by AI</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {showBack && (
              <button
                onClick={() => navigate(backTo)}
                className="text-sm text-white/90 hover:text-white font-medium transition-colors"
              >
                ← Back
              </button>
            )}
            <a href="#" className="hidden md:block text-sm text-white/90 hover:text-white font-medium transition-colors">
              Documentation
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm text-white font-medium transition-all"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
