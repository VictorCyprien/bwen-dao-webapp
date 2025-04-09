import React from 'react';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreateMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMethod: (method: 'form' | 'babywen') => void;
}

const CreateMethodModal: React.FC<CreateMethodModalProps> = ({ isOpen, onClose, onSelectMethod }) => {
  const navigate = useNavigate();

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectBabyWen = () => {
    if (onSelectMethod) {
      onSelectMethod('babywen');
    } else {
      navigate('/create/babywen');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative bg-[#111] border border-gray-800 rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden z-10">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-semibold text-white">Create DAO</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Modal body - Choose method */}
        <div className="p-6">
          <p className="text-gray-300 mb-6 text-center">Choose how you want to create your DAO:</p>
          
          <div className="space-y-4">
            <button
              onClick={() => onSelectMethod('form')}
              className="w-full p-6 bg-[#1a1a1a] hover:bg-[#222] border border-gray-800 hover:border-purple-500 rounded-lg transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Fill the Form (Boring)</h3>
                <p className="text-gray-400 text-center text-sm">Create your DAO the traditional way by filling out all the details manually.</p>
              </div>
            </button>
            
            <button
              onClick={handleSelectBabyWen}
              className="w-full p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 hover:from-purple-900/70 hover:to-blue-900/70 border border-purple-700 hover:border-purple-500 rounded-lg transition-all"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
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
      </div>
    </div>
  );
};

export default CreateMethodModal; 