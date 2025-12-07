import { Check } from 'lucide-react';

export default function QueryCard({ query, isSelected, isMain, onToggle }) {
  const handleClick = () => {
    console.log('Clicked query:', query.id, query.text);
    try {
      onToggle();
    } catch (err) {
      console.error('Error in onToggle:', err);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-200 hover:border-gray-300 bg-white'
        }
      `}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5
          ${isSelected
            ? 'bg-primary-600 border-primary-600'
            : 'border-gray-300 bg-white'
          }
        `}>
          {isSelected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-900">
              {query.text}
            </span>
            {isMain && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                Main
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 capitalize">
            {query.category}
          </div>
        </div>
      </div>
    </div>
  );
}
