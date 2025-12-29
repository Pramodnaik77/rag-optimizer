// import { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Loader2, Trophy, Download, ChevronDown, ChevronUp } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import StrategyCard from '../components/StrategyCard';
// import { analyzeDocument } from '../services/api';

// export default function ResultsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const hasAnalyzed = useRef(false);  // ADD THIS

//   const { documentId, filename, wordCount, selectedQueries, customQueries } = location.state || {};

//   const [analyzing, setAnalyzing] = useState(true);
//   const [results, setResults] = useState(null);
//   const [error, setError] = useState('');
//   const [expandedQuery, setExpandedQuery] = useState(null);

// useEffect(() => {
//   if (!documentId) {
//     navigate('/');
//     return;
//   }

//   // PREVENT DOUBLE CALL
//   if (hasAnalyzed.current) {
//     return;
//   }
//   hasAnalyzed.current = true;

//   runAnalysis();
// }, [documentId, navigate]);

//   const runAnalysis = async () => {
//     setAnalyzing(true);
//     setError('');

//     try {
//       // Combine selected and custom queries
//       const allQueries = [...(selectedQueries || []), ...(customQueries || [])];

//       const response = await analyzeDocument(
//         documentId,
//         [], // selectedQueryIds not used - we send actual query text
//         allQueries,
//         'groq'
//       );

//       if (response.success) {
//         setResults(response);
//       } else {
//         setError(response.message || 'Analysis failed');
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Analysis failed. Please try again.');
//     } finally {
//       setAnalyzing(false);
//     }
//   };

//   const exportResults = () => {
//     const dataStr = JSON.stringify(results, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

//     const exportFileDefaultName = `rag-analysis-${documentId}.json`;

//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   if (!documentId) {
//     return null;
//   }

//   if (analyzing) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="card max-w-2xl w-full mx-6">
//           <div className="text-center py-12">
//             <Loader2 className="h-16 w-16 text-primary-500 animate-spin mx-auto mb-6" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">
//               Analyzing Document...
//             </h2>
//             <p className="text-gray-600 mb-6">
//               Running {(selectedQueries?.length || 0) + (customQueries?.length || 0)} queries across 6 chunking strategies
//             </p>

//             <div className="max-w-md mx-auto">
//               <div className="flex justify-between text-sm text-gray-600 mb-2">
//                 <span>Progress</span>
//                 <span>~2-3 minutes</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-primary-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
//               </div>
//             </div>

//             <div className="mt-8 grid grid-cols-3 gap-4 text-center">
//               <div>
//                 <div className="text-2xl font-bold text-primary-600">6</div>
//                 <div className="text-xs text-gray-500">Strategies</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-primary-600">
//                   {(selectedQueries?.length || 0) + (customQueries?.length || 0)}
//                 </div>
//                 <div className="text-xs text-gray-500">Queries</div>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-primary-600">
//                   {((selectedQueries?.length || 0) + (customQueries?.length || 0)) * 6}
//                 </div>
//                 <div className="text-xs text-gray-500">Total Tests</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="card max-w-2xl w-full mx-6">
//           <div className="text-center py-12">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">Analysis Failed</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button onClick={() => navigate('/')} className="btn-primary">
//               Start Over
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Prepare chart data
//   const chartData = results?.query_results?.[0]?.all_results.map(result => ({
//     name: result.strategy_name.replace(' Chunks', '').replace(' Chunking', ''),
//     accuracy: (result.accuracy * 100).toFixed(1),
//     relevance: (result.relevance * 100).toFixed(1),
//   })) || [];

//   // Get winner's full results
//   const winnerName = results?.aggregate_winner;
//   const winnerData = results?.query_results?.[0]?.all_results.find(r => r.strategy_name === winnerName);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Analysis Results</h1>
//               <p className="text-sm text-gray-600 mt-1">{filename}</p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button onClick={exportResults} className="btn-secondary flex items-center gap-2">
//                 <Download className="h-4 w-4" />
//                 Export
//               </button>
//               <button onClick={() => navigate('/')} className="btn-primary">
//                 New Analysis
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//         {/* Winner Banner */}
//         <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
//           <div className="flex items-center gap-4 mb-4">
//             <Trophy className="h-10 w-10 text-yellow-500" />
//             <div>
//               <div className="text-sm font-medium text-primary-700 mb-1">OVERALL WINNER</div>
//               <h2 className="text-3xl font-bold text-gray-900">{winnerName}</h2>
//             </div>
//           </div>

//           <div className="grid grid-cols-4 gap-4 mt-6">
//             <div className="text-center p-4 bg-white rounded-lg">
//               <div className="text-3xl font-bold text-primary-600">
//                 {winnerData ? (winnerData.accuracy * 100).toFixed(1) : '0'}%
//               </div>
//               <div className="text-sm text-gray-600 mt-1">Avg Accuracy</div>
//             </div>
//             <div className="text-center p-4 bg-white rounded-lg">
//               <div className="text-3xl font-bold text-green-600">
//                 {winnerData ? (winnerData.relevance * 100).toFixed(1) : '0'}%
//               </div>
//               <div className="text-sm text-gray-600 mt-1">Relevance</div>
//             </div>
//             <div className="text-center p-4 bg-white rounded-lg">
//               <div className="text-3xl font-bold text-blue-600">
//                 ${winnerData ? winnerData.cost.toFixed(6) : '0'}
//               </div>
//               <div className="text-sm text-gray-600 mt-1">Avg Cost</div>
//             </div>
//             <div className="text-center p-4 bg-white rounded-lg">
//               <div className="text-3xl font-bold text-purple-600">
//                 {results?.query_results?.filter(qr => qr.best_strategy === winnerName).length || 0}/
//                 {results?.query_results?.length || 0}
//               </div>
//               <div className="text-sm text-gray-600 mt-1">Wins</div>
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="card">
//           <h3 className="text-xl font-bold text-gray-900 mb-6">Strategy Performance Comparison</h3>
//           <ResponsiveContainer width="100%" height={350}>
//             <BarChart data={chartData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
//               <Tooltip
//                 contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
//                 formatter={(value) => `${value}%`}
//               />
//               <Legend />
//               <Bar dataKey="accuracy" fill="#0284c7" name="Accuracy (%)" radius={[4, 4, 0, 0]} />
//               <Bar dataKey="relevance" fill="#10b981" name="Relevance (%)" radius={[4, 4, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Key Insights */}
//         <div className="card bg-blue-50 border-blue-200">
//           <h3 className="text-lg font-bold text-gray-900 mb-3">📊 Key Insights</h3>
//           <ul className="space-y-2">
//             {results?.aggregate_insights?.map((insight, idx) => (
//               <li key={idx} className="text-sm text-gray-700">• {insight}</li>
//             ))}
//           </ul>
//         </div>

//         {/* Strategy Cards */}
//         <div>
//           <h3 className="text-xl font-bold text-gray-900 mb-4">All Strategies</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {results?.query_results?.[0]?.all_results
//               .sort((a, b) => b.accuracy - a.accuracy)
//               .map((result, idx) => (
//                 <StrategyCard
//                   key={idx}
//                   result={result}
//                   isWinner={result.strategy_name === winnerName}
//                 />
//               ))
//             }
//           </div>
//         </div>

//         {/* Per-Query Breakdown */}
//         <div className="card">
//           <h3 className="text-xl font-bold text-gray-900 mb-4">Per-Query Breakdown</h3>
//           <div className="space-y-3">
//             {results?.query_results?.map((queryResult, idx) => (
//               <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => setExpandedQuery(expandedQuery === idx ? null : idx)}
//                   className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
//                 >
//                   <div className="text-left">
//                     <div className="font-medium text-gray-900 mb-1">
//                       Query {idx + 1}: {queryResult.query_text}
//                     </div>
//                     <div className="text-sm text-gray-600">
//                       Winner: <span className="font-semibold text-primary-600">{queryResult.best_strategy}</span>
//                       {' '}({(queryResult.best_accuracy * 100).toFixed(1)}%)
//                     </div>
//                   </div>
//                   {expandedQuery === idx ? (
//                     <ChevronUp className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <ChevronDown className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>

//                 {expandedQuery === idx && (
//                   <div className="p-4 bg-gray-50 border-t border-gray-200">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="text-left text-gray-600 border-b border-gray-300">
//                           <th className="pb-2 font-semibold">Strategy</th>
//                           <th className="pb-2 font-semibold text-center">Accuracy</th>
//                           <th className="pb-2 font-semibold text-center">Relevance</th>
//                           <th className="pb-2 font-semibold text-center">Cost</th>
//                           <th className="pb-2 font-semibold text-center">Time</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {queryResult.all_results
//                           .sort((a, b) => b.accuracy - a.accuracy)
//                           .map((result, resultIdx) => (
//                             <tr key={resultIdx} className={`border-b border-gray-200 ${result.strategy_name === queryResult.best_strategy ? 'bg-primary-50' : ''}`}>
//                               <td className="py-2">
//                                 {result.strategy_name === queryResult.best_strategy && '🥇 '}
//                                 {result.strategy_name}
//                               </td>
//                               <td className="py-2 text-center font-medium">{(result.accuracy * 100).toFixed(1)}%</td>
//                               <td className="py-2 text-center">{(result.relevance * 100).toFixed(1)}%</td>
//                               <td className="py-2 text-center text-xs">${result.cost.toFixed(6)}</td>
//                               <td className="py-2 text-center">{(result.processing_time_ms / 1000).toFixed(2)}s</td>
//                             </tr>
//                           ))
//                         }
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }


// import { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Loader2, Trophy, Download, ChevronDown, ChevronUp, Sparkles, Zap, Target, Brain, BarChart3 } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import StrategyCard from '../components/StrategyCard';
// import Header from '../components/Header';
// import { analyzeDocument } from '../services/api';

// const strategies = [
//   { name: 'Small Chunks', icon: '📄', desc: 'Fine-grained retrieval' },
//   { name: 'Medium Chunks', icon: '📋', desc: 'Balanced approach' },
//   { name: 'Large Chunks', icon: '📚', desc: 'Context-rich' },
//   { name: 'Semantic Chunks', icon: '🧠', desc: 'Meaning-based' },
//   { name: 'Sentence Chunks', icon: '💬', desc: 'Natural boundaries' },
//   { name: 'Paragraph Chunks', icon: '📝', desc: 'Topic-focused' }
// ];

// export default function ResultsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const hasAnalyzed = useRef(false);

//   const { documentId, filename, wordCount, selectedQueries, customQueries } = location.state || {};

//   const [analyzing, setAnalyzing] = useState(true);
//   const [results, setResults] = useState(null);
//   const [error, setError] = useState('');
//   const [expandedQuery, setExpandedQuery] = useState(null);
//   const [currentStrategy, setCurrentStrategy] = useState(0);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (!documentId) {
//       navigate('/');
//       return;
//     }

//     if (hasAnalyzed.current) {
//       return;
//     }
//     hasAnalyzed.current = true;

//     runAnalysis();
//   }, [documentId, navigate]);

//   // Simulate progress animation
//   useEffect(() => {
//     if (analyzing) {
//       const progressInterval = setInterval(() => {
//         setProgress(prev => {
//           if (prev >= 95) return prev;
//           return prev + 1;
//         });
//       }, 1500);

//       const strategyInterval = setInterval(() => {
//         setCurrentStrategy(prev => (prev + 1) % strategies.length);
//       }, 3000);

//       return () => {
//         clearInterval(progressInterval);
//         clearInterval(strategyInterval);
//       };
//     }
//   }, [analyzing]);

//   const runAnalysis = async () => {
//     setAnalyzing(true);
//     setError('');

//     try {
//       const allQueries = [...(selectedQueries || []), ...(customQueries || [])];

//       const response = await analyzeDocument(
//         documentId,
//         [],
//         allQueries,
//         'groq'
//       );

//       if (response.success) {
//         setProgress(100);
//         setTimeout(() => {
//           setResults(response);
//           setAnalyzing(false);
//         }, 500);
//       } else {
//         setError(response.message || 'Analysis failed');
//         setAnalyzing(false);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Analysis failed. Please try again.');
//       setAnalyzing(false);
//     }
//   };

//   const exportResults = () => {
//     const dataStr = JSON.stringify(results, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

//     const exportFileDefaultName = `rag-analysis-${documentId}.json`;

//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   if (!documentId) {
//     return null;
//   }

//   const totalQueries = (selectedQueries?.length || 0) + (customQueries?.length || 0);
//   const totalTests = totalQueries * 6;

//   if (analyzing) {
//     return (
//       <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
//         {/* Header */}
//         <Header />

//         {/* Analyzing Content - Split Layout */}
//         <div className="flex-1 flex overflow-hidden">
//           {/* Left Panel - What's Happening */}
//           <div className="w-[40%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-10 flex flex-col justify-center border-r border-blue-100 relative overflow-hidden">
//             {/* Decorative Pattern */}
//             <div className="absolute inset-0 opacity-[0.03]" style={{
//               backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
//               backgroundSize: '40px 40px'
//             }}></div>

//             <div className="relative z-10 space-y-8">
//               {/* Main Status */}
//               <div>
//                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg shadow-blue-500/30 animate-pulse">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Processing
//                 </div>
//                 <h2 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
//                   Analyzing<br />Your Document
//                 </h2>
//                 <p className="text-xl text-gray-600">
//                   Running {totalQueries} queries across 6 chunking strategies
//                 </p>
//               </div>

//               {/* Progress Stats */}
//               <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-200 p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="text-sm font-semibold text-gray-600">Overall Progress</span>
//                   <span className="text-2xl font-bold text-blue-600">{progress}%</span>
//                 </div>
//                 <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-6">
//                   <div
//                     className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full transition-all duration-500 relative overflow-hidden"
//                     style={{ width: `${progress}%` }}
//                   >
//                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-100">
//                     <div className="text-3xl font-bold text-blue-600">6</div>
//                     <div className="text-xs text-gray-600 mt-1">Strategies</div>
//                   </div>
//                   <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
//                     <div className="text-3xl font-bold text-purple-600">{totalQueries}</div>
//                     <div className="text-xs text-gray-600 mt-1">Queries</div>
//                   </div>
//                   <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
//                     <div className="text-3xl font-bold text-indigo-600">{totalTests}</div>
//                     <div className="text-xs text-gray-600 mt-1">Total Tests</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Current Strategy */}
//               <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-200 p-6">
//                 <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
//                   <Zap className="h-4 w-4" />
//                   Currently Testing
//                 </h3>
//                 <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-300">
//                   <div className="text-4xl animate-bounce">{strategies[currentStrategy].icon}</div>
//                   <div>
//                     <div className="font-bold text-lg text-gray-900">{strategies[currentStrategy].name}</div>
//                     <div className="text-sm text-gray-600">{strategies[currentStrategy].desc}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Fun Fact */}
//               <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
//                 <h3 className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-2">
//                   <Sparkles className="h-4 w-4" />
//                   Did You Know?
//                 </h3>
//                 <p className="text-sm text-gray-700 leading-relaxed">
//                   Chunk size can impact retrieval accuracy by up to 40%. We're testing 6 different strategies to find your optimal configuration.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Right Panel - Visual Feedback */}
//           <div className="flex-1 bg-white flex items-center justify-center p-12">
//             <div className="max-w-2xl w-full space-y-12">
//               {/* Animated Loader */}
//               <div className="text-center">
//                 <div className="relative inline-block">
//                   <div className="w-32 h-32 rounded-full border-8 border-gray-200"></div>
//                   <div className="w-32 h-32 rounded-full border-8 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
//                   </div>
//                 </div>
//               </div>

//               {/* What's Being Analyzed */}
//               <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">What We're Evaluating</h3>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//                       <Target className="h-5 w-5 text-blue-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm text-gray-900 mb-1">Accuracy</h4>
//                       <p className="text-xs text-gray-600">Answer correctness</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
//                       <Sparkles className="h-5 w-5 text-green-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm text-gray-900 mb-1">Relevance</h4>
//                       <p className="text-xs text-gray-600">Context quality</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
//                       <BarChart3 className="h-5 w-5 text-purple-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm text-gray-900 mb-1">Cost</h4>
//                       <p className="text-xs text-gray-600">Token efficiency</p>
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
//                       <Zap className="h-5 w-5 text-orange-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-sm text-gray-900 mb-1">Latency</h4>
//                       <p className="text-xs text-gray-600">Response speed</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Estimated Time */}
//               <div className="text-center">
//                 <p className="text-sm text-gray-600 mb-2">Estimated Time Remaining</p>
//                 <p className="text-3xl font-bold text-gray-900">
//                   {Math.ceil((100 - progress) / 50 * 3)} - {Math.ceil((100 - progress) / 50 * 3) + 1} minutes
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Add shimmer animation to CSS */}
//         <style jsx>{`
//           @keyframes shimmer {
//             0% { transform: translateX(-100%); }
//             100% { transform: translateX(100%); }
//           }
//           .animate-shimmer {
//             animation: shimmer 2s infinite;
//           }
//         `}</style>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//         <div className="card max-w-2xl w-full mx-6">
//           <div className="text-center py-12">
//             <div className="text-red-500 text-5xl mb-4">⚠️</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">Analysis Failed</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button onClick={() => navigate('/')} className="btn-primary">
//               Start Over
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Prepare chart data (RESULTS VIEW - we'll enhance this next)
//   const chartData = results?.query_results?.[0]?.all_results.map(result => ({
//     name: result.strategy_name.replace(' Chunks', '').replace(' Chunking', ''),
//     accuracy: (result.accuracy * 100).toFixed(1),
//     relevance: (result.relevance * 100).toFixed(1),
//   })) || [];

//   const winnerName = results?.aggregate_winner;
//   const winnerData = results?.query_results?.[0]?.all_results.find(r => r.strategy_name === winnerName);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <Header />

//       {/* RESULTS CONTENT - We'll enhance this in next step */}
//       <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//         {/* ... existing results rendering ... */}
//         <div className="text-center py-20">
//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Results Loading...</h2>
//           <p className="text-gray-600">Dashboard will be enhanced next</p>
//         </div>
//       </main>
//     </div>
//   );
// }

// import { useState, useEffect, useRef } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Loader2, Trophy, Download, ChevronDown, ChevronUp, Sparkles, Target, Brain, BarChart3, Clock } from 'lucide-react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import StrategyCard from '../components/StrategyCard';
// import Header from '../components/Header';
// import { analyzeDocument } from '../services/api';

// export default function ResultsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const hasAnalyzed = useRef(false);

//   const { documentId, filename, wordCount, selectedQueries, customQueries } = location.state || {};

//   const [analyzing, setAnalyzing] = useState(true);
//   const [results, setResults] = useState(null);
//   const [error, setError] = useState('');
//   const [expandedQuery, setExpandedQuery] = useState(null);

//   useEffect(() => {
//     if (!documentId) {
//       navigate('/');
//       return;
//     }

//     if (hasAnalyzed.current) {
//       return;
//     }
//     hasAnalyzed.current = true;

//     runAnalysis();
//   }, [documentId, navigate]);

//   const runAnalysis = async () => {
//     setAnalyzing(true);
//     setError('');

//     try {
//       const allQueries = [...(selectedQueries || []), ...(customQueries || [])];

//       const response = await analyzeDocument(
//         documentId,
//         [],
//         allQueries,
//         'groq'
//       );

//       if (response.success) {
//         setResults(response);
//         setAnalyzing(false);
//       } else {
//         setError(response.message || 'Analysis failed');
//         setAnalyzing(false);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'Analysis failed. Please try again.');
//       setAnalyzing(false);
//     }
//   };

//   const exportResults = () => {
//     const dataStr = JSON.stringify(results, null, 2);
//     const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

//     const exportFileDefaultName = `rag-analysis-${documentId}.json`;

//     const linkElement = document.createElement('a');
//     linkElement.setAttribute('href', dataUri);
//     linkElement.setAttribute('download', exportFileDefaultName);
//     linkElement.click();
//   };

//   if (!documentId) {
//     return null;
//   }

//   const totalQueries = (selectedQueries?.length || 0) + (customQueries?.length || 0);
//   const totalTests = totalQueries * 6;

//   if (analyzing) {
//     return (
//       <div className="min-h-screen flex flex-col bg-gray-50">
//         {/* Header */}
//         <Header />

//         {/* Analyzing Content - Mobile Responsive */}
//         <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
//           <div className="w-full max-w-3xl">
//             <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-8 lg:p-12">
//               {/* Animated Loader */}
//               <div className="text-center mb-8">
//                 <div className="relative inline-block mb-6">
//                   <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border-8 border-gray-200"></div>
//                   <div className="w-20 h-20 lg:w-28 lg:h-28 rounded-full border-8 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <Brain className="h-8 w-8 lg:h-12 lg:w-12 text-blue-600 animate-pulse" />
//                   </div>
//                 </div>

//                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-4 shadow-lg">
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Processing
//                 </div>

//                 <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
//                   Analyzing Your Document
//                 </h2>
//                 <p className="text-base lg:text-lg text-gray-600 mb-2">
//                   Running {totalQueries} queries across 6 chunking strategies
//                 </p>
//                 <p className="text-sm text-gray-500">
//                   This may take 2-3 minutes
//                 </p>
//               </div>

//               {/* Stats Grid */}
//               <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-8">
//                 <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
//                   <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">6</div>
//                   <div className="text-xs lg:text-sm text-gray-700 font-medium">Strategies</div>
//                 </div>
//                 <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
//                   <div className="text-3xl lg:text-4xl font-bold text-purple-600 mb-1">{totalQueries}</div>
//                   <div className="text-xs lg:text-sm text-gray-700 font-medium">Queries</div>
//                 </div>
//                 <div className="text-center p-4 lg:p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200">
//                   <div className="text-3xl lg:text-4xl font-bold text-indigo-600 mb-1">{totalTests}</div>
//                   <div className="text-xs lg:text-sm text-gray-700 font-medium">Total Tests</div>
//                 </div>
//               </div>

//               {/* What We're Evaluating */}
//               <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 lg:p-8 mb-6">
//                 <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6 text-center">What We're Evaluating</h3>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
//                   <div className="flex items-center gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//                       <Target className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
//                     </div>
//                     <div className="min-w-0">
//                       <h4 className="font-semibold text-sm lg:text-base text-gray-900 mb-0.5">Accuracy</h4>
//                       <p className="text-xs lg:text-sm text-gray-600 truncate">Answer correctness</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
//                       <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
//                     </div>
//                     <div className="min-w-0">
//                       <h4 className="font-semibold text-sm lg:text-base text-gray-900 mb-0.5">Relevance</h4>
//                       <p className="text-xs lg:text-sm text-gray-600 truncate">Context quality</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
//                       <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
//                     </div>
//                     <div className="min-w-0">
//                       <h4 className="font-semibold text-sm lg:text-base text-gray-900 mb-0.5">Cost</h4>
//                       <p className="text-xs lg:text-sm text-gray-600 truncate">Token efficiency</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3 p-3 lg:p-4 bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
//                       <Clock className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
//                     </div>
//                     <div className="min-w-0">
//                       <h4 className="font-semibold text-sm lg:text-base text-gray-900 mb-0.5">Latency</h4>
//                       <p className="text-xs lg:text-sm text-gray-600 truncate">Response speed</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Info Box */}
//               <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 lg:p-6">
//                 <div className="flex items-start gap-3">
//                   <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
//                   <div>
//                     <h4 className="font-bold text-sm lg:text-base text-amber-900 mb-1">Did You Know?</h4>
//                     <p className="text-xs lg:text-sm text-gray-700 leading-relaxed">
//                       Chunk size can impact retrieval accuracy by up to 40%. We're testing 6 different strategies to find your optimal configuration.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex flex-col">
//         <Header />
//         <div className="flex-1 flex items-center justify-center p-6">
//           <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 p-8 lg:p-12 max-w-2xl w-full text-center">
//             <div className="text-5xl lg:text-6xl mb-6">⚠️</div>
//             <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Analysis Failed</h2>
//             <p className="text-base lg:text-lg text-gray-600 mb-8">{error}</p>
//             <button
//               onClick={() => navigate('/')}
//               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
//             >
//               Start Over
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Prepare chart data for results view
//   const chartData = results?.query_results?.[0]?.all_results.map(result => ({
//     name: result.strategy_name.replace(' Chunks', '').replace(' Chunking', ''),
//     accuracy: (result.accuracy * 100).toFixed(1),
//     relevance: (result.relevance * 100).toFixed(1),
//   })) || [];

//   const winnerName = results?.aggregate_winner;
//   const winnerData = results?.query_results?.[0]?.all_results.find(r => r.strategy_name === winnerName);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 lg:space-y-8">
//         {/* Winner Banner */}
//         <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-xl lg:rounded-2xl p-6 lg:p-8 shadow-xl">
//           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
//             <Trophy className="h-10 w-10 lg:h-12 lg:w-12 text-yellow-500 flex-shrink-0" />
//             <div className="flex-1 min-w-0">
//               <div className="text-xs lg:text-sm font-bold text-primary-700 mb-2 uppercase tracking-wide">OVERALL WINNER</div>
//               <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 truncate">{winnerName}</h2>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
//             <div className="text-center p-4 lg:p-6 bg-white rounded-lg shadow-sm">
//               <div className="text-2xl lg:text-4xl font-bold text-primary-600">
//                 {winnerData ? (winnerData.accuracy * 100).toFixed(1) : '0'}%
//               </div>
//               <div className="text-xs lg:text-sm text-gray-600 mt-1 lg:mt-2">Avg Accuracy</div>
//             </div>
//             <div className="text-center p-4 lg:p-6 bg-white rounded-lg shadow-sm">
//               <div className="text-2xl lg:text-4xl font-bold text-green-600">
//                 {winnerData ? (winnerData.relevance * 100).toFixed(1) : '0'}%
//               </div>
//               <div className="text-xs lg:text-sm text-gray-600 mt-1 lg:mt-2">Relevance</div>
//             </div>
//             <div className="text-center p-4 lg:p-6 bg-white rounded-lg shadow-sm">
//               <div className="text-2xl lg:text-4xl font-bold text-blue-600">
//                 ${winnerData ? winnerData.cost.toFixed(6) : '0'}
//               </div>
//               <div className="text-xs lg:text-sm text-gray-600 mt-1 lg:mt-2">Avg Cost</div>
//             </div>
//             <div className="text-center p-4 lg:p-6 bg-white rounded-lg shadow-sm">
//               <div className="text-2xl lg:text-4xl font-bold text-purple-600">
//                 {results?.query_results?.filter(qr => qr.best_strategy === winnerName).length || 0}/
//                 {results?.query_results?.length || 0}
//               </div>
//               <div className="text-xs lg:text-sm text-gray-600 mt-1 lg:mt-2">Wins</div>
//             </div>
//           </div>
//         </div>

//         {/* Chart */}
//         <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl border-2 border-gray-200 p-4 lg:p-8">
//           <h3 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Strategy Performance Comparison</h3>
//           <div className="h-64 lg:h-96">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//                 <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
//                 <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
//                 <Tooltip
//                   contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
//                   formatter={(value) => `${value}%`}
//                 />
//                 <Legend wrapperStyle={{ fontSize: '12px' }} />
//                 <Bar dataKey="accuracy" fill="#0284c7" name="Accuracy (%)" radius={[4, 4, 0, 0]} />
//                 <Bar dataKey="relevance" fill="#10b981" name="Relevance (%)" radius={[4, 4, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Key Insights */}
//         <div className="bg-blue-50 border-2 border-blue-200 rounded-xl lg:rounded-2xl p-6 lg:p-8">
//           <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
//             <span className="text-xl lg:text-2xl">📊</span> Key Insights
//           </h3>
//           <ul className="space-y-2 lg:space-y-3">
//             {results?.aggregate_insights?.map((insight, idx) => (
//               <li key={idx} className="text-sm lg:text-base text-gray-700">• {insight}</li>
//             ))}
//           </ul>
//         </div>

//         {/* Strategy Cards */}
//         <div>
//           <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">All Strategies</h3>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
//             {results?.query_results?.[0]?.all_results
//               .sort((a, b) => b.accuracy - a.accuracy)
//               .map((result, idx) => (
//                 <StrategyCard
//                   key={idx}
//                   result={result}
//                   isWinner={result.strategy_name === winnerName}
//                 />
//               ))
//             }
//           </div>
//         </div>

//         {/* Per-Query Breakdown */}
//         <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl border-2 border-gray-200 p-6 lg:p-8">
//           <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Per-Query Breakdown</h3>
//           <div className="space-y-3 lg:space-y-4">
//             {results?.query_results?.map((queryResult, idx) => (
//               <div key={idx} className="border-2 border-gray-200 rounded-xl overflow-hidden">
//                 <button
//                   onClick={() => setExpandedQuery(expandedQuery === idx ? null : idx)}
//                   className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-gray-50 transition-colors text-left"
//                 >
//                   <div className="flex-1 min-w-0 pr-4">
//                     <div className="font-semibold text-sm lg:text-base text-gray-900 mb-1 break-words">
//                       Query {idx + 1}: {queryResult.query_text}
//                     </div>
//                     <div className="text-xs lg:text-sm text-gray-600">
//                       Winner: <span className="font-semibold text-primary-600">{queryResult.best_strategy}</span>
//                       {' '}({(queryResult.best_accuracy * 100).toFixed(1)}%)
//                     </div>
//                   </div>
//                   {expandedQuery === idx ? (
//                     <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
//                   ) : (
//                     <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
//                   )}
//                 </button>

//                 {expandedQuery === idx && (
//                   <div className="p-4 lg:p-5 bg-gray-50 border-t-2 border-gray-200 overflow-x-auto">
//                     <table className="w-full text-xs lg:text-sm min-w-[600px]">
//                       <thead>
//                         <tr className="text-left text-gray-600 border-b-2 border-gray-300">
//                           <th className="pb-2 font-semibold">Strategy</th>
//                           <th className="pb-2 font-semibold text-center">Accuracy</th>
//                           <th className="pb-2 font-semibold text-center">Relevance</th>
//                           <th className="pb-2 font-semibold text-center">Cost</th>
//                           <th className="pb-2 font-semibold text-center">Time</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {queryResult.all_results
//                           .sort((a, b) => b.accuracy - a.accuracy)
//                           .map((result, resultIdx) => (
//                             <tr key={resultIdx} className={`border-b border-gray-200 ${result.strategy_name === queryResult.best_strategy ? 'bg-primary-50' : ''}`}>
//                               <td className="py-2 lg:py-3">
//                                 {result.strategy_name === queryResult.best_strategy && '🥇 '}
//                                 {result.strategy_name}
//                               </td>
//                               <td className="py-2 lg:py-3 text-center font-medium">{(result.accuracy * 100).toFixed(1)}%</td>
//                               <td className="py-2 lg:py-3 text-center">{(result.relevance * 100).toFixed(1)}%</td>
//                               <td className="py-2 lg:py-3 text-center text-xs">${result.cost.toFixed(6)}</td>
//                               <td className="py-2 lg:py-3 text-center">{(result.processing_time_ms / 1000).toFixed(2)}s</td>
//                             </tr>
//                           ))
//                         }
//                       </tbody>
//                     </table>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4">
//           <button
//             onClick={exportResults}
//             className="flex-1 px-6 py-4 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
//           >
//             <Download className="h-5 w-5" />
//             Export Results
//           </button>
//           <button
//             onClick={() => navigate('/')}
//             className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
//           >
//             New Analysis
//           </button>
//         </div>
//       </main>
//     </div>
//   );
// }



import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Trophy, Download, ChevronDown, ChevronUp, Sparkles, Target, Brain, BarChart3, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StrategyCard from '../components/StrategyCard';
import Header from '../components/Header';
import { analyzeDocument } from '../services/api';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const hasAnalyzed = useRef(false);

  const { documentId, filename, wordCount, selectedQueries, customQueries } = location.state || {};

  const [analyzing, setAnalyzing] = useState(true);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedQuery, setExpandedQuery] = useState(null);

  useEffect(() => {
    if (!documentId) {
      navigate('/');
      return;
    }

    if (hasAnalyzed.current) {
      return;
    }
    hasAnalyzed.current = true;

    runAnalysis();
  }, [documentId, navigate]);

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError('');

    try {
      const allQueries = [...(selectedQueries || []), ...(customQueries || [])];

      const response = await analyzeDocument(
        documentId,
        [],
        allQueries,
        'groq'
      );

      if (response.success) {
        setResults(response);
        setAnalyzing(false);
      } else {
        setError(response.message || 'Analysis failed');
        setAnalyzing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
      setAnalyzing(false);
    }
  };

  const exportResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `rag-analysis-${documentId}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!documentId) {
    return null;
  }

  const totalQueries = (selectedQueries?.length || 0) + (customQueries?.length || 0);
  const totalTests = totalQueries * 6;

  // ANALYZING STATE - Split Layout
  if (analyzing) {
    return (
      <div className="h-screen flex flex-col bg-gray-50">
        {/* Header */}
        <Header />

        {/* Split Layout - Matches Other Pages */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Panel - 35% */}
          <div className="w-full lg:w-[35%] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 lg:p-10 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-blue-100 relative overflow-y-auto min-h-0">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}></div>

            <div className="relative z-10 space-y-6 max-w-xl mx-auto lg:max-w-none">
              {/* Main Status */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Analyzing Your<br />Document
                </h2>
                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Running {totalQueries} queries across 6 chunking strategies
                </p>
              </div>

              {/* Stats Grid */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-200 p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-1">6</div>
                    <div className="text-xs text-gray-700 font-medium">Strategies</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border-2 border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-1">{totalQueries}</div>
                    <div className="text-xs text-gray-700 font-medium">Queries</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border-2 border-indigo-200">
                    <div className="text-4xl font-bold text-indigo-600 mb-1">{totalTests}</div>
                    <div className="text-xs text-gray-700 font-medium">Total Tests</div>
                  </div>
                </div>
              </div>

              {/* Time Estimate */}
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-blue-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Estimated Time
                  </h3>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-900 mb-1">2-3 minutes</div>
                  <div className="text-sm text-gray-600">Please wait while we analyze</div>
                </div>
              </div>

              {/* Did You Know */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-amber-900 mb-2 uppercase tracking-wide">Did You Know?</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Chunk size can impact retrieval accuracy by up to 40%. We're testing 6 different strategies to find your optimal configuration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - 65% */}
          <div className="flex-1 bg-white p-6 lg:p-10 flex flex-col justify-center overflow-y-auto min-h-0">
            <div className="max-w-3xl mx-auto w-full space-y-8">
              {/* Animated Loader */}
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full border-8 border-gray-200"></div>
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-full border-8 border-blue-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-12 w-12 lg:h-14 lg:w-14 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <p className="text-lg lg:text-xl text-gray-600 font-medium">
                  Processing your document...
                </p>
              </div>

              {/* What We're Evaluating */}
              <div className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 lg:p-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6 text-center">
                  What We're Evaluating
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 mb-1">Accuracy</h4>
                      <p className="text-sm text-gray-600">How correct are the generated answers?</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 mb-1">Relevance</h4>
                      <p className="text-sm text-gray-600">Quality of retrieved context</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 mb-1">Cost</h4>
                      <p className="text-sm text-gray-600">Token usage and efficiency</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-900 mb-1">Latency</h4>
                      <p className="text-sm text-gray-600">Response generation speed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Testing all {totalTests} combinations to find the optimal strategy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-red-200 p-8 lg:p-12 max-w-2xl w-full text-center">
            <div className="text-5xl lg:text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">Analysis Failed</h2>
            <p className="text-base lg:text-lg text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }
   // RESULTS STATE - Fixed Issues
  const chartData = results?.query_results?.[0]?.all_results.map(result => ({
    name: result.strategy_name.replace(' Chunks', '').replace(' Chunking', ''),
    accuracy: (result.accuracy * 100).toFixed(1),
    relevance: (result.relevance * 100).toFixed(1),
  })) || [];

  const winnerName = results?.aggregate_winner;
  const winnerData = results?.query_results?.[0]?.all_results.find(r => r.strategy_name === winnerName);
  const sortedStrategies = results?.query_results?.[0]?.all_results
    .sort((a, b) => b.accuracy - a.accuracy) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <Header />

      {/* Top Bar - NO STICKY */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900">{filename}</h1>
                <p className="text-xs text-gray-600">{results?.query_results?.length || 0} queries • 6 strategies</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportResults}
                className="px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium rounded-lg transition-all flex items-center gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all text-xs"
              >
                New Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard */}
      <main className="max-w-[1400px] mx-auto px-6 py-6">
        <div className="space-y-6">
          {/* COMPACT Winner Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 rounded-xl p-4 shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-lg bg-white/90 flex items-center justify-center shadow-md">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-yellow-900 uppercase tracking-wide mb-0.5">
                    🏆 Recommended
                  </div>
                  <h2 className="text-xl font-black text-gray-900">{winnerName}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black text-blue-600">
                    {winnerData ? (winnerData.accuracy * 100).toFixed(1) : '0'}%
                  </div>
                  <div className="text-[10px] text-gray-600 font-medium">Accuracy</div>
                </div>
                <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black text-green-600">
                    {winnerData ? (winnerData.relevance * 100).toFixed(1) : '0'}%
                  </div>
                  <div className="text-[10px] text-gray-600 font-medium">Relevance</div>
                </div>
                <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-center">
                  <div className="text-base font-black text-purple-600">
                    ${winnerData ? winnerData.cost.toFixed(6) : '0'}
                  </div>
                  <div className="text-[10px] text-gray-600 font-medium">Cost</div>
                </div>
                <div className="bg-white/90 backdrop-blur rounded-lg px-3 py-2 text-center">
                  <div className="text-lg font-black text-orange-600">
                    {results?.query_results?.filter(qr => qr.best_strategy === winnerName).length || 0}/
                    {results?.query_results?.length || 0}
                  </div>
                  <div className="text-[10px] text-gray-600 font-medium">Wins</div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Column Layout - NO GAPS */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: Chart + Rankings */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              {/* Compact Chart */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Performance Overview</h3>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-blue-500"></div>
                      <span className="text-gray-600">Accuracy</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-green-500"></div>
                      <span className="text-gray-600">Relevance</span>
                    </div>
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} width={35} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '2px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '11px',
                          padding: '8px'
                        }}
                        formatter={(value) => [`${value}%`, '']}
                      />
                      <Bar dataKey="accuracy" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="relevance" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Strategy Cards - Compact Grid */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Strategy Rankings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sortedStrategies.map((result, idx) => (
                    <div
                      key={idx}
                      className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                        result.strategy_name === winnerName
                          ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-400'
                          : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {/* Rank Badge */}
                      <div className="absolute -top-2 -left-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-lg ${
                          idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                          idx === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500 text-white' :
                          idx === 2 ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white' :
                          'bg-gray-200 text-gray-600'
                        }`}>
                          {idx + 1}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h4 className="text-sm font-bold text-gray-900 mb-1">{result.strategy_name}</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold">
                            {(result.accuracy * 100).toFixed(1)}%
                          </span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">
                            {(result.relevance * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* Compact Metrics */}
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="text-gray-500">Cost: </span>
                          <span className="font-bold text-gray-900">${result.cost.toFixed(6)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Time: </span>
                          <span className="font-bold text-gray-900">{(result.processing_time_ms / 1000).toFixed(2)}s</span>
                        </div>
                      </div>

                      {/* Mini Progress Bars */}
                      <div className="flex gap-2 mt-3">
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${result.accuracy * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ width: `${result.relevance * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Insights + Stats - FLEX COLUMN NO GAPS */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Key Insights */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200 p-5 flex-shrink-0">
                <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  Key Insights
                </h3>
                <ul className="space-y-2.5">
                  {results?.aggregate_insights?.slice(0, 4).map((insight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700 leading-relaxed">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[10px] font-bold">{idx + 1}</span>
                      </div>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Stats - NO GAP */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 flex-shrink-0">
                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                  Analysis Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">Strategies</span>
                    <span className="text-xl font-black text-blue-600">6</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">Queries</span>
                    <span className="text-xl font-black text-purple-600">{results?.query_results?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">Total Tests</span>
                    <span className="text-xl font-black text-green-600">{(results?.query_results?.length || 0) * 6}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                    <span className="text-sm text-gray-700 font-medium">Document</span>
                    <span className="text-base font-black text-orange-600">{wordCount?.toLocaleString()}w</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Query Details - Ultra Compact */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Query Results</h3>
            <div className="space-y-2">
              {results?.query_results?.map((queryResult, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors">
                  <button
                    onClick={() => setExpandedQuery(expandedQuery === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex-1 flex items-center gap-3 min-w-0">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-900 truncate flex-1">
                        {queryResult.query_text}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-600">{queryResult.best_strategy}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                          {(queryResult.best_accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${expandedQuery === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {expandedQuery === idx && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200 overflow-x-auto">
                      <table className="w-full text-xs min-w-[600px]">
                        <thead>
                          <tr className="text-left text-gray-600 border-b border-gray-300">
                            <th className="pb-2 font-bold">#</th>
                            <th className="pb-2 font-bold">Strategy</th>
                            <th className="pb-2 font-bold text-center">Accuracy</th>
                            <th className="pb-2 font-bold text-center">Relevance</th>
                            <th className="pb-2 font-bold text-center">Cost</th>
                            <th className="pb-2 font-bold text-center">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {queryResult.all_results
                            .sort((a, b) => b.accuracy - a.accuracy)
                            .map((result, resultIdx) => (
                              <tr
                                key={resultIdx}
                                className={`border-b border-gray-200 ${
                                  result.strategy_name === queryResult.best_strategy ? 'bg-blue-50' : ''
                                }`}
                              >
                                <td className="py-2">
                                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold ${
                                    resultIdx === 0 ? 'bg-yellow-400 text-yellow-900' :
                                    resultIdx === 1 ? 'bg-gray-300 text-gray-700' :
                                    resultIdx === 2 ? 'bg-orange-300 text-orange-900' :
                                    'bg-gray-100 text-gray-600'
                                  }`}>
                                    {resultIdx + 1}
                                  </span>
                                </td>
                                <td className="py-2 font-medium text-gray-900">{result.strategy_name}</td>
                                <td className="py-2 text-center font-bold text-blue-600">{(result.accuracy * 100).toFixed(1)}%</td>
                                <td className="py-2 text-center font-bold text-green-600">{(result.relevance * 100).toFixed(1)}%</td>
                                <td className="py-2 text-center text-gray-600">${result.cost.toFixed(6)}</td>
                                <td className="py-2 text-center text-gray-900">{(result.processing_time_ms / 1000).toFixed(2)}s</td>
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
