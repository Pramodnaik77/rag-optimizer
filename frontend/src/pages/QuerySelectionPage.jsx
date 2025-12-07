// import { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Loader2, Plus, AlertCircle, Sparkles, Check } from 'lucide-react';
// import QueryCard from '../components/QueryCard';
// import { generateQueries } from '../services/api';

// export default function QuerySelectionPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const hasLoadedQueries = useRef(false);  // ADD THIS

//   const { documentId, filename, wordCount, mainQuery } = location.state || {};

//   const [queries, setQueries] = useState([]);
//   const [selectedIds, setSelectedIds] = useState([]);
//   const [customQuery, setCustomQuery] = useState('');
//   const [customQueries, setCustomQueries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     if (!documentId) {
//       navigate('/');
//       return;
//     }

//     // PREVENT DOUBLE CALL
//     if (hasLoadedQueries.current) {
//       return;
//     }
//     hasLoadedQueries.current = true;

//     const loadQueries = async () => {
//       setLoading(true);
//       setError('');

//       try {
//         const response = await generateQueries(documentId, mainQuery);

//         if (response.success) {
//           setQueries(response.queries);
//           // Auto-select main query
//           const mainQueryId = response.queries.find(q => q.is_main)?.id;
//           if (mainQueryId) {
//             setSelectedIds([mainQueryId]);
//           }
//         } else {
//           setError(response.message || 'Failed to generate queries');
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to generate queries');
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadQueries();
//   }, [documentId, navigate, mainQuery]);

//   // ... rest of the component stays the same

//   const toggleQuery = (queryId) => {
//     setSelectedIds(prev =>
//       prev.includes(queryId)
//         ? prev.filter(id => id !== queryId)
//         : [...prev, queryId]
//     );
//   };

//   const selectAll = () => {
//     setSelectedIds(queries.map(q => q.id));
//   };

//   const selectRecommended = () => {
//     // Select first 5 queries
//     setSelectedIds(queries.slice(0, 5).map(q => q.id));
//   };

//   const clearAll = () => {
//     setSelectedIds([]);
//   };

//   const addCustomQuery = () => {
//     if (!customQuery.trim()) return;

//     if (customQueries.length >= 3) {
//       setError('Maximum 3 custom queries allowed');
//       return;
//     }

//     setCustomQueries(prev => [...prev, customQuery.trim()]);
//     setCustomQuery('');
//     setError(''); // Clear error when successfully adding
//   };

//   const removeCustomQuery = (index) => {
//     setCustomQueries(prev => prev.filter((_, i) => i !== index));
//   };

//   const handleContinue = () => {
//     const totalSelected = selectedIds.length + customQueries.length;

//     if (totalSelected < 3) {
//       setError('Please select at least 3 queries');
//       return;
//     }

//     if (totalSelected > 10) {
//       setError('Maximum 10 queries allowed');
//       return;
//     }

//     // Navigate to results page with selections
//     navigate('/analyze', {
//       state: {
//         documentId,
//         filename,
//         wordCount,
//         selectedQueryIds: selectedIds,
//         selectedQueries: queries.filter(q => selectedIds.includes(q.id)).map(q => q.text),
//         customQueries
//       }
//     });
//   };

//   const totalSelected = selectedIds.length + customQueries.length;
//   const canContinue = totalSelected >= 3 && totalSelected <= 10;

//   if (!documentId) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-5xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold text-gray-900">
//               RAG Pipeline Optimizer
//             </h1>
//             <button
//               onClick={() => navigate('/')}
//               className="text-sm text-gray-600 hover:text-gray-900 font-medium"
//             >
//               ← Back
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-4xl mx-auto px-6 py-12">
//         {/* Step Indicator */}
//         <div className="flex items-center justify-center gap-2 mb-8">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
//               ✓
//             </div>
//             <span className="text-sm font-medium text-gray-500">Upload</span>
//           </div>
//           <div className="w-12 h-0.5 bg-primary-600"></div>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center text-sm font-semibold">
//               2
//             </div>
//             <span className="text-sm font-medium text-gray-900">Queries</span>
//           </div>
//           <div className="w-12 h-0.5 bg-gray-300"></div>
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-semibold">
//               3
//             </div>
//             <span className="text-sm font-medium text-gray-500">Results</span>
//           </div>
//         </div>

//         {/* Document Info */}
//         <div className="card mb-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-lg font-semibold text-gray-900">{filename}</h2>
//               <p className="text-sm text-gray-600 mt-1">
//                 {wordCount?.toLocaleString()} words • Document uploaded
//               </p>
//             </div>
//             <div className="text-sm text-primary-600 font-medium">
//               Ready for analysis
//             </div>
//           </div>
//         </div>

//         {loading ? (
//           <div className="card">
//             <div className="flex flex-col items-center justify-center py-12">
//               <Sparkles className="h-12 w-12 text-primary-500 mb-4 animate-pulse" />
//               <p className="text-lg font-medium text-gray-900 mb-2">
//                 Generating test queries...
//               </p>
//               <p className="text-sm text-gray-500">
//                 AI is analyzing your document to create diverse questions
//               </p>
//             </div>
//           </div>
//         ) : (
//           <>
//             <div className="card space-y-6">
//               {/* Header */}
//               <div className="flex items-center justify-between pb-4 border-b border-gray-200">
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-900 mb-1">
//                     Select Test Queries
//                   </h2>
//                   <p className="text-sm text-gray-600">
//                     Choose 5-7 queries to evaluate chunking strategies
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button onClick={selectRecommended} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
//                     Select Top 5
//                   </button>
//                   <span className="text-gray-300">|</span>
//                   <button onClick={selectAll} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
//                     Select All
//                   </button>
//                   <span className="text-gray-300">|</span>
//                   <button onClick={clearAll} className="text-sm text-gray-600 hover:text-gray-900 font-medium">
//                     Clear
//                   </button>
//                 </div>
//               </div>

//               {/* Generated Queries */}
//               <div className="space-y-3">
//                 {queries.map(query => (
//                   <QueryCard
//                     key={query.id}
//                     query={query}
//                     isSelected={selectedIds.includes(query.id)}
//                     isMain={query.is_main}
//                     onToggle={() => toggleQuery(query.id)}
//                   />
//                 ))}
//               </div>

//               {/* Custom Queries */}
//               <div className="pt-4 border-t border-gray-200">
//                 <label className="block text-sm font-semibold text-gray-900 mb-3">
//                   Add Custom Queries <span className="text-gray-500 font-normal">(Max 3)</span>
//                 </label>

//                 {customQueries.map((query, index) => (
//                   <div key={index} className="flex items-center gap-2 mb-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//                     <span className="flex-1 text-sm text-gray-900">{query}</span>
//                     <button
//                       onClick={() => removeCustomQuery(index)}
//                       className="text-sm text-red-600 hover:text-red-700 font-medium"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 ))}

//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Enter your custom question..."
//                     value={customQuery}
//                     onChange={(e) => setCustomQuery(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && addCustomQuery()}
//                     className="input flex-1"
//                     maxLength={200}
//                     disabled={customQueries.length >= 3}
//                   />
//                   <button
//                     onClick={addCustomQuery}
//                     disabled={!customQuery.trim() || customQueries.length >= 3}
//                     className="btn-secondary flex items-center gap-2"
//                   >
//                     <Plus className="h-4 w-4" />
//                     Add
//                   </button>
//                 </div>
//               </div>

//               {/* Selection Counter */}
//               <div className="pt-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm">
//                     <span className="font-semibold text-gray-900">
//                       {totalSelected} queries selected
//                     </span>
//                     <span className="text-gray-500 ml-2">
//                       {totalSelected < 3 && `(${3 - totalSelected} more needed)`}
//                       {totalSelected > 10 && `(${totalSelected - 10} too many)`}
//                     </span>
//                   </div>
//                   {canContinue && (
//                     <div className="flex items-center gap-2 text-sm text-green-700">
//                       <Check className="h-4 w-4" />
//                       Ready to analyze
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Error */}
//               {error && (
//                 <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
//                   <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
//                   <div className="text-sm text-red-700">{error}</div>
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex gap-3 pt-4">
//                 <button
//                   onClick={() => navigate('/')}
//                   className="btn-secondary flex-1"
//                 >
//                   ← Back to Upload
//                 </button>
//                 <button
//                   onClick={handleContinue}
//                   disabled={!canContinue}
//                   className="btn-primary flex-1"
//                 >
//                   Analyze Strategies →
//                 </button>
//               </div>
//             </div>

//             {/* Info */}
//             <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 <strong>Tip:</strong> Diverse query types (summary, factual, reasoning) provide better strategy evaluation.
//                 The analysis will run all 6 chunking strategies on each selected query.
//               </p>
//             </div>
//           </>
//         )}
//       </main>
//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Plus, AlertCircle, Sparkles, Check, FileText, BarChart3, Target, TrendingUp, Github, X } from 'lucide-react';
import QueryCard from '../components/QueryCard';
import { generateQueries } from '../services/api';

const categoryInfo = {
  summary: { icon: '🎯', name: 'Summary', desc: 'High-level overview' },
  concept: { icon: '💡', name: 'Concept', desc: 'Key ideas extraction' },
  definition: { icon: '📖', name: 'Definition', desc: 'Term explanations' },
  reasoning: { icon: '🧠', name: 'Reasoning', desc: 'How/why questions' },
  comparison: { icon: '⚖️', name: 'Comparison', desc: 'Compare/contrast' },
  fact: { icon: '📊', name: 'Factual', desc: 'Data and numbers' },
  insight: { icon: '💎', name: 'Insight', desc: 'Conclusions/implications' }
};

export default function QuerySelectionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasLoadedQueries = useRef(false);

  const { documentId, filename, wordCount, mainQuery } = location.state || {};

  const [queries, setQueries] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [customQuery, setCustomQuery] = useState('');
  const [customQueries, setCustomQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [documentPreview, setDocumentPreview] = useState('');

  useEffect(() => {
    if (!documentId) {
      navigate('/');
      return;
    }

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
    setSelectedIds(queries.slice(0, 5).map(q => q.id));
  };

  const clearAll = () => {
    setSelectedIds([]);
  };

  const addCustomQuery = () => {
    if (!customQuery.trim()) return;

    if (customQueries.length >= 3) {
      setError('Maximum 3 custom queries allowed');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setCustomQueries(prev => [...prev, customQuery.trim()]);
    setCustomQuery('');
  };

  const removeCustomQuery = (index) => {
    setCustomQueries(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const totalSelected = selectedIds.length + customQueries.length;

    if (totalSelected < 3) {
      setError('Please select at least 3 queries');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (totalSelected > 10) {
      setError('Maximum 10 queries allowed');
      setTimeout(() => setError(''), 3000);
      return;
    }

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
  const progress = Math.min((totalSelected / 7) * 100, 100);

  // Get unique categories in selected queries
  const selectedCategories = new Set(
    queries.filter(q => selectedIds.includes(q.id)).map(q => q.category)
  );
  const diversityScore = selectedCategories.size;

  if (!documentId) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 shadow-lg z-20">
        <div className="px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base lg:text-xl font-bold text-white">
                  RAG Pipeline Optimizer
                </h1>
                <p className="text-[10px] lg:text-xs text-blue-100 hidden sm:block">Powered by AI</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="text-xs lg:text-sm text-white/90 hover:text-white font-medium transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Document & Info */}
        <div className="w-full lg:w-[35%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-blue-100 overflow-y-auto">
          <div className="max-w-xl mx-auto lg:max-w-none space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 lg:hidden mb-4">
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="text-xs font-semibold text-gray-500">Upload</span>
              </div>
              <div className="w-8 h-0.5 bg-blue-600 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                  2
                </div>
                <span className="text-xs font-semibold text-gray-900">Queries</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <span className="text-xs font-semibold text-gray-400">Results</span>
              </div>
            </div>

            {/* Document Preview Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-5 lg:p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{filename}</h3>
                  <p className="text-sm text-gray-600">
                    {wordCount?.toLocaleString()} words • Ready for analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 w-full"></div>
                </div>
                <span className="text-xs font-semibold text-green-600">Uploaded</span>
              </div>
            </div>

            {/* Query Categories Guide */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-5 lg:p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Query Categories
              </h3>
              <div className="space-y-3">
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <div key={key} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{info.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900">{info.name}</h4>
                      <p className="text-xs text-gray-600">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-blue-100 p-5 lg:p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Selection Progress
              </h3>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">{totalSelected}/7</span>
                  <span className="text-sm font-medium text-gray-600">
                    {totalSelected < 3 ? `${3 - totalSelected} more needed` : 'Good to go!'}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Diversity Score */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-gray-700">Diversity Score</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i <= diversityScore ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              {diversityScore >= 4 && (
                <p className="text-xs text-green-600 font-medium mt-2 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Great mix of query types!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Query Selection */}
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Step Indicator - Desktop */}
            <div className="hidden lg:flex items-center justify-center gap-3 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <span className="text-sm font-semibold text-gray-500">Upload</span>
              </div>
              <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/30">
                  2
                </div>
                <span className="text-sm font-semibold text-gray-900">Queries</span>
              </div>
              <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-sm font-semibold text-gray-400">Results</span>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Sparkles className="h-16 w-16 text-blue-500 animate-pulse mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Generating Test Queries...
                </h2>
                <p className="text-gray-600">
                  AI is analyzing your document to create diverse questions
                </p>
              </div>
            ) : (
              <>
                {/* Header with Actions */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                      Select Test Queries
                    </h2>
                    <p className="text-sm lg:text-base text-gray-600">
                      Choose 5-7 queries to evaluate chunking strategies
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <button onClick={selectRecommended} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                      Top 5
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={selectAll} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                      All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={clearAll} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-colors">
                      Clear
                    </button>
                  </div>
                </div>

                {/* Main Query (if exists) */}
                {queries.filter(q => q.is_main).map(query => (
                  <div key={query.id}>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <span className="text-lg">👑</span> Primary Query
                    </h3>
                    <QueryCard
                      query={query}
                      isSelected={selectedIds.includes(query.id)}
                      isMain={true}
                      onToggle={() => toggleQuery(query.id)}
                    />
                  </div>
                ))}

                {/* Core Queries */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Core Queries
                  </h3>
                  <div className="space-y-3">
                    {queries
                      .filter(q => !q.is_main)
                      .slice(0, 3)
                      .map(query => (
                        <QueryCard
                          key={query.id}
                          query={query}
                          isSelected={selectedIds.includes(query.id)}
                          isMain={false}
                          onToggle={() => toggleQuery(query.id)}
                        />
                      ))
                    }
                  </div>
                </div>

                {/* Advanced Queries */}
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                    Advanced Queries
                  </h3>
                  <div className="space-y-3">
                    {queries
                      .filter(q => !q.is_main)
                      .slice(3)
                      .map(query => (
                        <QueryCard
                          key={query.id}
                          query={query}
                          isSelected={selectedIds.includes(query.id)}
                          isMain={false}
                          onToggle={() => toggleQuery(query.id)}
                        />
                      ))
                    }
                  </div>
                </div>

                {/* Custom Queries */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6">
                  <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    Add Custom Queries
                    <span className="text-sm font-normal text-gray-600">(Max 3)</span>
                  </h3>

                  {customQueries.map((query, index) => (
                    <div key={index} className="flex items-center gap-2 mb-3 p-3 bg-white border border-green-300 rounded-lg shadow-sm">
                      <span className="flex-1 text-sm text-gray-900 font-medium">{query}</span>
                      <button
                        onClick={() => removeCustomQuery(index)}
                        className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
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
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm"
                      maxLength={200}
                      disabled={customQueries.length >= 3}
                    />
                    <button
                      onClick={addCustomQuery}
                      disabled={!customQuery.trim() || customQueries.length >= 3}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold rounded-xl transition-all shadow-lg disabled:shadow-none flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-in slide-in-from-top duration-300">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-700 font-medium">{error}</div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/')}
                    className="sm:flex-1 px-6 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all"
                  >
                    ← Back to Upload
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={!canContinue}
                    className="sm:flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    Analyze Strategies
                    <span className="text-lg">→</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
