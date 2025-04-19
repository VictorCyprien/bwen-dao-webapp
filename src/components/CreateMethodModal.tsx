import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './common/Modal';

interface CreateMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: 'form' | 'babywen') => void;
}

interface EmojiPosition {
  id: number;
  left: string;
  top: string;
}

const CreateMethodModal: React.FC<CreateMethodModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMethod 
}: CreateMethodModalProps) => {
  const navigate = useNavigate();
  const [showJoke, setShowJoke] = React.useState<boolean>(false);
  const [emojis, setEmojis] = React.useState<EmojiPosition[]>([]);
  const [animationStarted, setAnimationStarted] = React.useState<boolean>(false);

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowJoke(false);
      setEmojis([]);
      setAnimationStarted(false);
    }
  }, [isOpen]);

  // Add keyframes for gradual inflation animation
  React.useEffect(() => {
    if (showJoke) {
      // Create and append the keyframes style
      const styleEl = document.createElement('style');
      styleEl.id = 'babywen-animation-style';
      styleEl.innerHTML = `
        @keyframes gradualInflate {
          0%, 40% { transform: scale(1); z-index: 10; }
          50% { z-index: 50; }
          100% { transform: scale(3); z-index: 50; }
        }
        
        @keyframes fadeAndOverflow {
          0%, 40% { overflow: hidden; }
          45% { overflow: visible; }
          100% { overflow: visible; }
        }
      `;
      document.head.appendChild(styleEl);
      
      // Start the animation after 2 seconds
      const timer = setTimeout(() => {
        setAnimationStarted(true);
      }, 2000);
      
      return () => {
        // Clean up
        clearTimeout(timer);
        const styleElement = document.getElementById('babywen-animation-style');
        if (styleElement) {
          styleElement.remove();
        }
      };
    }
  }, [showJoke]);

  const handleSelectBabyWen = () => {
    if (onSelectMethod) {
      onSelectMethod('babywen');
    } else {
      navigate('/create/babywen');
    }
    onClose();
  };

  const handleClickForm = () => {
    setShowJoke(true);
    
    // Create emojis at random positions around the modal
    const newEmojis = [];
    for (let i = 0; i < 70; i++) { // Increased from 30 to 70
      // Position emojis in different patterns
      let left, top;
      
      if (i < 30) {
        // Around the edges as before
        const position = Math.random() * 4; // 0-1: top, 1-2: right, 2-3: bottom, 3-4: left
        
        if (position < 1) { // top edge
          left = `${Math.random() * 100}%`;
          top = `${Math.random() * 15}%`;
        } else if (position < 2) { // right edge
          left = `${85 + Math.random() * 15}%`;
          top = `${Math.random() * 100}%`;
        } else if (position < 3) { // bottom edge
          left = `${Math.random() * 100}%`;
          top = `${85 + Math.random() * 15}%`;
        } else { // left edge
          left = `${Math.random() * 15}%`;
          top = `${Math.random() * 100}%`;
        }
      } else if (i < 50) {
        // Form a circle around the modal
        const angle = Math.random() * Math.PI * 2;
        const radius = 40 + Math.random() * 10; // Distance from center (%)
        left = `${50 + radius * Math.cos(angle)}%`;
        top = `${50 + radius * Math.sin(angle)}%`;
      } else {
        // Scattered randomly across the entire screen
        left = `${Math.random() * 100}%`;
        top = `${Math.random() * 100}%`;
      }
      
      newEmojis.push({
        id: i,
        left,
        top
      });
    }
    setEmojis(newEmojis);
  };

  return (
    <>
      {/* Joke emojis - keep these outside the Modal component */}
      {isOpen && showJoke && emojis.map((emoji: EmojiPosition) => (
        <div 
          key={emoji.id}
          className="fixed text-4xl z-[51] animate-bounce"
          style={{ 
            left: emoji.left, 
            top: emoji.top,
            animationDuration: `${0.5 + Math.random() * 1.5}s` // Varied bounce speeds
          }}
        >
          🖕
        </div>
      ))}
      
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Create DAO"
        maxWidth="max-w-lg"
      >
        <div
          style={animationStarted ? { animation: 'fadeAndOverflow 5s forwards' } : { overflow: 'hidden' }}
        >
          <p className="text-gray-300 mb-6 text-center">Choose how you want to create your DAO:</p>
          
          <div className="space-y-4">
            <button
              onClick={handleClickForm}
              className={`w-full p-6 ${showJoke ? 'bg-red-900 border-red-600' : 'bg-[#1a1a1a] hover:bg-[#222] border-gray-800 hover:border-purple-500'} border rounded-lg transition-all`}
            >
              <div className="flex flex-col items-center">
                {!showJoke ? (
                  <>
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Fill the Form (Boring)</h3>
                    <p className="text-gray-400 text-center text-sm">Create your DAO the traditional way by filling out all the details manually.</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <h3 className="text-5xl font-bold text-white mb-4">NO!</h3>
                    <p className="text-xl text-white text-center">We don't do that here.</p>
                  </div>
                )}
              </div>
            </button>
            
            <button
              onClick={handleSelectBabyWen}
              className="relative w-full p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 hover:from-purple-900/70 hover:to-blue-900/70 border border-purple-700 hover:border-purple-500 rounded-lg transition-all"
              style={animationStarted ? { 
                animation: 'gradualInflate 5s forwards ease-in-out',
                transformOrigin: 'center center',
                position: 'relative'
              } : undefined}
            >
              <div className="flex flex-col items-center">
                <div 
                  className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4 overflow-hidden"
                >
                  <video 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/assets/video_agent.webm" type="video/webm" />
                    <source src="/assets/video_agent.mp4" type="video/mp4" />
                  </video>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Do it with BabyWen!</h3>
                <p className="text-gray-400 text-center text-sm">Let our AI assistant help you create your DAO in a few simple steps.</p>
              </div>
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreateMethodModal; 