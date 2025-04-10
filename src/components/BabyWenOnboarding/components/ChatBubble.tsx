import * as React from 'react';

interface ChatBubbleProps {
  message: string;
  options?: string[];
  onOptionClick: (option: string) => void;
}

/**
 * Chat bubble component that displays a message and optional choice buttons
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({ 
  message, 
  options, 
  onOptionClick 
}: ChatBubbleProps) => {
  return (
    <div className="mb-4 ml-4 max-w-2xl">
      <div className="bg-[#222] p-4 rounded-xl rounded-bl-none shadow-lg text-white">
        {message}
        
        {/* Options */}
        {options && options.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {options.map((option: string, index: number) => (
              <button
                key={index}
                onClick={() => onOptionClick(option)}
                className="bg-[#333] hover:bg-[#444] text-gray-200 text-sm py-2 px-4 rounded-lg transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBubble; 