import { Trophy, Clock, DollarSign, Target } from 'lucide-react';

export default function StrategyCard({ result, isWinner }) {
  return (
    <div className={`card transition-all duration-200 ${isWinner ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
            {result.strategy_name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{result.description}</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Accuracy */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">Accuracy</span>
            <span className="font-semibold text-gray-900">{(result.accuracy * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${result.accuracy * 100}%` }}
            />
          </div>
        </div>

        {/* Relevance */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">Relevance</span>
            <span className="font-semibold text-gray-900">{(result.relevance * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${result.relevance * 100}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-3 mt-3 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500">Cost</div>
            <div className="text-sm font-semibold text-gray-900">${result.cost.toFixed(6)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500">Latency</div>
            <div className="text-sm font-semibold text-gray-900">{(result.processing_time_ms / 1000).toFixed(2)}s</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500">Chunks</div>
            <div className="text-sm font-semibold text-gray-900">{result.chunks_used}/{result.chunks_created}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
