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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };
  
  return (
    <div className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message..."
        className="flex-1 bg-[#222] text-white text-sm focus:outline-none px-3 py-2 rounded-md"
      />
      <button
        onClick={onSend}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default ChatInput; 