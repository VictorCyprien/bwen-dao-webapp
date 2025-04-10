import * as React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

/**
 * Text input component for chat messages
 */
const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChange, 
  onSend 
}: ChatInputProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Auto-focus the input when it's mounted
  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim() !== '') {
      onSend();
    }
  };
  
  return (
    <div className="px-4 py-3 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 flex shadow-lg">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your response here..."
        className="flex-1 bg-transparent border-none text-white focus:outline-none"
      />
      <button
        onClick={onSend}
        disabled={value.trim() === ''}
        className="ml-2 p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg disabled:opacity-50"
      >
        <Send size={18} className="text-white" />
      </button>
    </div>
  );
};

export default ChatInput; 