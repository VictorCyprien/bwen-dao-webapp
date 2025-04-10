import React, { useState } from 'react';
import { ui, utils, typography } from '../styles/theme';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "How can I help you with your DAO today?", 
      sender: "bot" 
    }
  ]);
  const [inputText, setInputText] = useState("");
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = () => {
    if (inputText.trim() === "") return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      sender: "user"
    };
    
    // Add bot response (simulated)
    const newBotMessage: Message = {
      id: messages.length + 2,
      text: "I'm processing your request about DAO governance. How can I assist you further?",
      sender: "bot"
    };
    
    setMessages([...messages, newUserMessage, newBotMessage]);
    setInputText("");
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div className={`${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'} 
        ${utils.glassmorphism} rounded-xl shadow-lg p-5 mb-4 w-[30vw] h-[50vh] flex flex-col ${utils.transition} absolute bottom-16 right-0`}>
        <div className="flex justify-center items-center border-b border-gray-800/60 pb-3 mb-3">
          <h3 className={typography.h3}>Ask BabyWen</h3>
        </div>
        <div className="flex-1 overflow-y-auto mb-3 bg-[#111]/40 rounded-lg p-4 border border-gray-800/20">
          {/* Chat messages with bubbles */}
          <div className="flex flex-col space-y-4">
            {messages.map((message: Message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                    message.sender === 'user' 
                      ? 'bg-[#222]/80 border border-gray-800/60 text-gray-300' 
                      : ui.gradients.purple + ' text-white'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex border border-gray-800/60 rounded-lg overflow-hidden">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className={ui.input + " flex-1 border-0"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="px-4 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90"
            onClick={handleSendMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Floating Button - Always in the same position */}
      <button 
        onClick={toggleChat}
        className={`${ui.gradients.purple} text-white rounded-full w-16 h-16 flex items-center justify-center ${utils.shadow} ${utils.transition} hover:scale-105`}
      >
        {!isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatBot; 