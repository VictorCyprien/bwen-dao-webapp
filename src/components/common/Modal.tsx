import React, { useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | ReactNode;
  children: ReactNode;
  maxWidth?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'max-w-2xl',
  showCloseButton = true
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Aurora background effects for the modal backdrop */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-pink-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-teal-600/10 via-cyan-600/5 to-blue-600/10 rounded-full blur-[120px] animate-pulse-slow-delayed"></div>
      </div>
      
      {/* Overlay with backdrop blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0 }}
      />
      
      {/* Modal content */}
      <div 
        className={`relative ${maxWidth} w-full max-h-[90vh] animate-modalAppear transition-all duration-300`}
        style={{ 
          transform: isOpen ? 'scale(1)' : 'scale(0.95)', 
          opacity: isOpen ? 1 : 0 
        }}
      >
        <div className="rounded-2xl border border-indigo-800/30 bg-[#0f0f0f]/90 backdrop-blur-md hover:border-indigo-500/20 transition-all shadow-xl overflow-hidden">
          {/* Title section - only shown if title is provided */}
          {title && (
            <div className="border-b border-indigo-800/20 p-4 sm:p-5">
              <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
          )}
          
          {/* Close button */}
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#1a1a1a] border border-indigo-800/30 hover:border-indigo-500/50 text-gray-400 hover:text-white transition-all z-10"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          )}
          
          {/* Modal body - Scrollable content */}
          <div className={`p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-5rem)] ${!title ? 'pt-10' : ''}`}>
            {children}
          </div>
        </div>
      </div>
      
      {/* Add animation styles */}
      <style>{`
        @keyframes modalAppear {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
        
        .animate-modalAppear {
          animation: modalAppear 0.3s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 4s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
};

export default Modal; 