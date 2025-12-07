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
// import { Check } from 'lucide-react';

// const categoryColors = {
//   summary: 'bg-blue-100 text-blue-700 border-blue-200',
//   concept: 'bg-purple-100 text-purple-700 border-purple-200',
//   definition: 'bg-green-100 text-green-700 border-green-200',
//   reasoning: 'bg-orange-100 text-orange-700 border-orange-200',
//   comparison: 'bg-pink-100 text-pink-700 border-pink-200',
//   fact: 'bg-teal-100 text-teal-700 border-teal-200',
//   insight: 'bg-amber-100 text-amber-700 border-amber-200',
//   custom: 'bg-gray-100 text-gray-700 border-gray-200',
//   general: 'bg-gray-100 text-gray-700 border-gray-200'
// };

// const categoryIcons = {
//   summary: '🎯',
//   concept: '💡',
//   definition: '📖',
//   reasoning: '🧠',
//   comparison: '⚖️',
//   fact: '📊',
//   insight: '💎',
//   custom: '✨',
//   general: '📝'
// };

// export default function QueryCard({ query, isSelected, isMain, onToggle }) {
//   const colorClass = categoryColors[query.category] || categoryColors.general;

//   return (
//     <div
//       onClick={onToggle}
//       className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 group
//         ${isSelected
//           ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg shadow-blue-500/20 scale-[1.02]'
//           : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
//         }
//         ${isMain ? 'ring-2 ring-yellow-400 ring-offset-2' : ''}
//       `}
//     >
//       <div className="flex items-start gap-3">
//         {/* Animated Checkbox */}
//         <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 transition-all duration-300
//           ${isSelected
//             ? 'bg-gradient-to-br from-blue-600 to-purple-600 border-blue-600 scale-110'
//             : 'border-gray-300 bg-white group-hover:border-blue-400'
//           }
//         `}>
//           {isSelected && (
//             <Check className="h-4 w-4 text-white animate-in zoom-in duration-300" strokeWidth={3} />
//           )}
//         </div>

//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-start gap-2 mb-2">
//             <span className="text-base font-semibold text-gray-900 leading-snug flex-1">
//               {query.text}
//             </span>
//             {isMain && (
//               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-sm flex-shrink-0">
//                 👑 Main
//               </span>
//             )}
//           </div>

//           {/* Category Badge */}
//           <div className="flex items-center gap-2">
//             <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${colorClass}`}>
//               <span>{categoryIcons[query.category]}</span>
//               <span className="capitalize">{query.category}</span>
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
