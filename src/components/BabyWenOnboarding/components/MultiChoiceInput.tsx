import React from 'react';
import { Info } from 'lucide-react';
import ReactDOM from 'react-dom';

export interface OptionDetail {
  title: string;
  description: string;
}

interface MultiChoiceInputProps {
  options: string[];
  onSelect: (option: string) => void;
  optionDetails?: Record<string, OptionDetail>;
}

// Modal component that renders at the root level
const InfoModal = ({ 
  isOpen, 
  onClose, 
  info 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  info: OptionDetail | null 
}) => {
  if (!isOpen || !info) return null;

  // Create portal to render at root level
  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-gradient-to-r from-[#1a1a1a] to-[#222] rounded-2xl p-6 max-w-md w-full mx-4 border border-indigo-500/30 shadow-xl animate-fadeIn" 
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-medium text-white">{info.title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#333] hover:bg-[#444] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="text-white/80 whitespace-pre-line">
          {info.description}
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Multiple choice input component that displays buttons for each option
 */
const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({ 
  options, 
  onSelect, 
  optionDetails = {} 
}: MultiChoiceInputProps) => {
  // State for modal
  const [showModal, setShowModal] = React.useState(false);
  const [selectedInfo, setSelectedInfo] = React.useState<OptionDetail | null>(null);

  // Function to check if an option is the custom option
  const isCustomOption = (option: string): boolean => {
    return option.toLowerCase().includes('custom');
  };

  // Function to parse option title and description
  const parseOption = (option: string): { title: string; description: string } => {
    if (option.includes(' - ')) {
      const [title, description] = option.split(' - ', 2);
      return { title, description };
    }
    return { title: option, description: '' };
  };

  // Function to get the base title (without description)
  const getBaseTitle = (title: string): string => {
    return title.trim();
  };

  // Function to handle info button click
  const handleInfoClick = (e: React.MouseEvent, title: string): void => {
    e.stopPropagation(); // Prevent the click from triggering the parent button
    const baseTitle = getBaseTitle(title);
    
    // Type assertion to satisfy TypeScript
    const details = optionDetails[baseTitle] as OptionDetail | undefined;
    if (details) {
      setSelectedInfo(details);
      setShowModal(true);
    }
  };

  // Close the modal
  const closeModal = (): void => {
    setShowModal(false);
    setSelectedInfo(null);
  };

  // Check if an option has details
  const hasDetails = (title: string): boolean => {
    const baseTitle = getBaseTitle(title);
    return !!optionDetails && !!optionDetails[baseTitle];
  };

  // Filter standard options (non-custom)
  const standardOptions = options.filter(option => !isCustomOption(option));
  const customOptions = options.filter(option => isCustomOption(option));
  const isOddCount = standardOptions.length % 2 !== 0;

  return (
    <>
      <div className="flex flex-col gap-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {standardOptions.map((option: string, index: number) => {
            const { title, description } = parseOption(option);
            const baseTitle = getBaseTitle(title);
            const showInfoButton = hasDetails(title);
            
            // For the last item in odd count, span 2 columns
            const isLastItem = isOddCount && index === standardOptions.length - 1;
            const colSpanClass = isLastItem ? "md:col-span-2 md:max-w-md md:mx-auto md:w-full" : "";
            
            return (
              <div
                key={index}
                onClick={() => onSelect(option)}
                className={`text-left p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 hover:from-indigo-600/30 hover:to-purple-600/30 border border-indigo-500/30 rounded-lg transition-colors relative cursor-pointer ${colSpanClass}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="font-medium text-white">{title}</div>
                  {showInfoButton && (
                    <div 
                      onClick={(e) => handleInfoClick(e, baseTitle)}
                      className="p-1 rounded-full bg-indigo-600/30 hover:bg-indigo-600/50 transition-colors cursor-pointer"
                      aria-label={`More info about ${baseTitle}`}
                    >
                      <Info size={16} className="text-white/80" />
                    </div>
                  )}
                </div>
                {description && (
                  <div className="text-white/70 text-sm">{description}</div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Custom option - displayed separately with different styling */}
        {customOptions.length > 0 && (
          <div className="flex justify-center mt-2">
            {customOptions.map((option: string, index: number) => {
              const { title, description } = parseOption(option);
              
              return (
                <div
                  key={`custom-${index}`}
                  onClick={() => onSelect(option)}
                  className="text-sm px-3 py-1.5 bg-[#222]/40 hover:bg-[#333]/60 border border-gray-700/20 rounded-md text-white/50 hover:text-white/70 transition-colors cursor-pointer"
                >
                  <span>{title}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Render modal at root level using portal */}
      <InfoModal 
        isOpen={showModal} 
        onClose={closeModal} 
        info={selectedInfo} 
      />
    </>
  );
};

export default MultiChoiceInput; 