import * as React from 'react';

interface MultiChoiceInputProps {
  options: string[];
  onSelect: (option: string) => void;
}

/**
 * Multiple choice input component that displays buttons for each option
 */
const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({ 
  options, 
  onSelect 
}: MultiChoiceInputProps) => {
  if (!options || options.length === 0) {
    return null;
  }
  
  return (
    <div className="px-4 py-4 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 flex flex-wrap gap-2 shadow-lg">
      {options.map((option: string, index: number) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className="flex-grow bg-[#333] hover:bg-[#444] text-gray-200 text-sm py-3 px-4 rounded-lg transition-colors"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default MultiChoiceInput; 