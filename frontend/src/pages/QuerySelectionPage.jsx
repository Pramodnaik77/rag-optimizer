import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Plus, AlertCircle, Sparkles, Check } from 'lucide-react';
import QueryCard from '../components/QueryCard';
import { generateQueries } from '../services/api';

export default function QuerySelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasLoadedQueries = useRef(false);  // ADD THIS

  const { documentId, filename, wordCount, mainQuery } = location.state || {};

  const [queries, setQueries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [customQuery, setCustomQuery] = useState('');
  const [customQueries, setCustomQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!documentId) {
      navigate('/');
      return;
    }

    // PREVENT DOUBLE CALL
    if (hasLoadedQueries.current) {
      return;
    }
    hasLoadedQueries.current = true;

    const loadQueries = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await generateQueries(documentId, mainQuery);

        if (response.success) {
          setQueries(response.queries);
          // Auto-select main query
          const mainQueryId = response.queries.find(q => q.is_main)?.id;
          if (mainQueryId) {
            setSelectedIds([mainQueryId]);
          }
        } else {
          setError(response.message || 'Failed to generate queries');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to generate queries');
      } finally {
        setLoading(false);
      }
    };

    loadQueries();
  }, [documentId, navigate, mainQuery]);

  // ... rest of the component stays the same

  const toggleQuery = (queryId) => {
    setSelectedIds(prev =>
      prev.includes(queryId)
        ? prev.filter(id => id !== queryId)
        : [...prev, queryId]
    );
  };

  const selectAll = () => {
    setSelectedIds(queries.map(q => q.id));
  };

  const selectRecommended = () => {
    // Select first 5 queries
    setSelectedIds(queries.slice(0, 5).map(q => q.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const addCustomQuery = () => {
    if (!customQuery.trim()) return;

    if (customQueries.length >= 3) {
      setError('Maximum 3 custom queries allowed');
      return;
    }

    setCustomQueries(prev => [...prev, customQuery.trim()]);
    setCustomQuery('');
    setError(''); // Clear error when successfully adding
  };

  const removeCustomQuery = (index) => {
    setCustomQueries(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const totalSelected = selectedIds.length + customQueries.length;

    if (totalSelected < 3) {
      setError('Please select at least 3 queries');
      return;
    }

    if (totalSelected > 10) {
      setError('Maximum 10 queries allowed');
      return;
    }

    // Navigate to results page with selections
    navigate('/analyze', {
      state: {
        documentId,
        filename,
        wordCount,
        selectedQueryIds: selectedIds,
        selectedQueries: queries.filter(q => selectedIds.includes(q.id)).map(q => q.text),
        customQueries
      }
    });
  };

  const totalSelected = selectedIds.length + customQueries.length;
  const canContinue = totalSelected >= 3 && totalSelected <= 10;

  if (!documentId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              RAG Pipeline Optimizer
            </h1>
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
              ✓
            </div>
            <span className="text-sm font-medium text-gray-500">Upload</span>
          </div>
          <div className="w-12 h-0.5 bg-primary-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-gray-900">Queries</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-gray-500">Results</span>
          </div>
        </div>

        {/* Document Info */}
        <div className="card mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{filename}</h2>
              <p className="text-sm text-gray-600 mt-1">
                {wordCount?.toLocaleString()} words • Document uploaded
              </p>
            </div>
            <div className="text-sm text-primary-600 font-medium">
              Ready for analysis
            </div>
          </div>
        </div>

        {loading ? (
          <div className="card">
            <div className="flex flex-col items-center justify-center py-12">
              <Sparkles className="h-12 w-12 text-primary-500 mb-4 animate-pulse" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Generating test queries...
              </p>
              <p className="text-sm text-gray-500">
                AI is analyzing your document to create diverse questions
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="card space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Select Test Queries
                  </h2>
                  <p className="text-sm text-gray-600">
                    Choose 5-7 queries to evaluate chunking strategies
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={selectRecommended} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Select Top 5
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={selectAll} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                    Select All
                  </button>
                  <span className="text-gray-300">|</span>
                  <button onClick={clearAll} className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    Clear
                  </button>
                </div>
              </div>

              {/* Generated Queries */}
              <div className="space-y-3">
                {queries.map(query => (
                  <QueryCard
                    key={query.id}
                    query={query}
                    isSelected={selectedIds.includes(query.id)}
                    isMain={query.is_main}
                    onToggle={() => toggleQuery(query.id)}
                  />
                ))}
              </div>

              {/* Custom Queries */}
              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Add Custom Queries <span className="text-gray-500 font-normal">(Max 3)</span>
                </label>

                {customQueries.map((query, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="flex-1 text-sm text-gray-900">{query}</span>
                    <button
                      onClick={() => removeCustomQuery(index)}
                      className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter your custom question..."
                    value={customQuery}
                    onChange={(e) => setCustomQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomQuery()}
                    className="input flex-1"
                    maxLength={200}
                    disabled={customQueries.length >= 3}
                  />
                  <button
                    onClick={addCustomQuery}
                    disabled={!customQuery.trim() || customQueries.length >= 3}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Selection Counter */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900">
                      {totalSelected} queries selected
                    </span>
                    <span className="text-gray-500 ml-2">
                      {totalSelected < 3 && `(${3 - totalSelected} more needed)`}
                      {totalSelected > 10 && `(${totalSelected - 10} too many)`}
                    </span>
                  </div>
                  {canContinue && (
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Check className="h-4 w-4" />
                      Ready to analyze
                    </div>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-700">{error}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary flex-1"
                >
                  ← Back to Upload
                </button>
                <button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="btn-primary flex-1"
                >
                  Analyze Strategies →
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Diverse query types (summary, factual, reasoning) provide better strategy evaluation.
                The analysis will run all 6 chunking strategies on each selected query.
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
