import * as React from 'react';

interface MultiSelectProps {
  options: string[];
  onSubmit: (selectedOptions: string[]) => void;
}

/**
 * Multi-select component that allows selecting multiple options
 */
const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  onSubmit 
}: MultiSelectProps) => {
  const [selectedOptions, setSelectedOptions] = React.useState<string[]>([]);

  const toggleOption = (option: string) => {
    setSelectedOptions(prev => {
      if (prev.includes(option)) {
        return prev.filter(o => o !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const handleSubmit = () => {
    if (selectedOptions.length > 0) {
      onSubmit(selectedOptions);
    }
  };

  return (
    <div className="px-4 py-4 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 shadow-lg">
      <div className="mb-2 text-sm text-gray-400">Select all that apply:</div>
      <div className="space-y-2">
        {options.map((option, index) => (
          <div 
            key={index}
            className="flex items-center"
          >
            <button
              type="button"
              onClick={() => toggleOption(option)}
              className={`flex items-center w-full p-3 rounded-lg ${
                selectedOptions.includes(option) 
                  ? 'bg-[#222] border border-purple-500'
                  : 'bg-[#222] border border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-5 h-5 rounded mr-3 flex items-center justify-center ${
                selectedOptions.includes(option)
                  ? 'bg-purple-600'
                  : 'border border-gray-600'
              }`}>
                {selectedOptions.includes(option) && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <span className="text-white text-sm">{option}</span>
            </button>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={selectedOptions.length === 0}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default MultiSelect; 