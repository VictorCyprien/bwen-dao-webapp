import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { logoGenerationService, LOGO_STYLES } from '../../../services/LogoGenerationService';
import { toast } from 'react-hot-toast';

interface LogoGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLogo: (logoUrl: string) => void;
}

const LogoGenerationModal: React.FC<LogoGenerationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectLogo 
}: LogoGenerationModalProps) => {
  const [selectedStyle, setSelectedStyle] = React.useState<string>('minimalist');
  const [isGenerating, setIsGenerating] = React.useState<boolean>(false);
  const [generatedLogos, setGeneratedLogos] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  
  // Get the DAO name from sessionStorage - safely retrieve and show fallback if not found
  const [daoName, setDaoName] = React.useState<string>('My DAO');
  
  // Fetch DAO name from sessionStorage when the modal opens
  React.useEffect(() => {
    if (isOpen) {
      const storedName = sessionStorage.getItem('daoName');
      console.log('Retrieved DAO name from sessionStorage:', storedName);
      if (storedName) {
        setDaoName(storedName);
      }
      
      setSelectedStyle('minimalist');
      setError(null);
    }
  }, [isOpen]);
  
  const handleStyleSelect = (styleId: string): void => {
    setSelectedStyle(styleId);
  };
  
  const handleGenerateLogo = async (): Promise<void> => {
    try {
      setIsGenerating(true);
      setError(null);
      
      // Double-check the DAO name
      const currentDaoName = sessionStorage.getItem('daoName') || daoName;
      console.log('Generating logo for DAO name:', currentDaoName);
      
      // Generate logo
      toast.loading('Generating your logo...', { id: 'logo-generation' });
      const logoUrl = await logoGenerationService.generateLogo(currentDaoName, selectedStyle);
      
      // Update state
      setGeneratedLogos([...generatedLogos, logoUrl]);
      toast.success('Logo generated successfully!', { id: 'logo-generation' });
    } catch (err) {
      console.error('Error generating logo:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate logo');
      toast.error('Failed to generate logo', { id: 'logo-generation' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSelectLogo = (logoUrl: string): void => {
    onSelectLogo(logoUrl);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-indigo-500/30 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-indigo-500/20 flex justify-between items-center">
          <h3 className="text-xl font-medium text-white">Generate Logo for "{daoName}"</h3>
          <button 
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Style Selection */}
          <div className="space-y-2">
            <label className="block text-white/70 text-sm font-medium">
              Choose a Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {LOGO_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleStyleSelect(style.id)}
                  className={`p-3 rounded-lg flex flex-col items-start text-left gap-1 transition-colors ${
                    selectedStyle === style.id
                      ? 'border-2 border-indigo-500 text-indigo-300 shadow-lg'
                      : 'border border-indigo-500/30 text-indigo-400/70 hover:border-indigo-500/60 hover:text-indigo-300'
                  }`}
                >
                  <span className="font-medium">{style.name}</span>
                  <span className="text-xs text-white/50">{style.description}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Generation button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGenerateLogo}
              disabled={isGenerating}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isGenerating
                  ? 'bg-gray-600/50 cursor-not-allowed text-white/50'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Generating...
                </>
              ) : (
                'Generate Logo'
              )}
            </button>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          {/* Generated logos */}
          {generatedLogos.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Generated Logos</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {generatedLogos.map((logoUrl: string, index: number) => (
                  <div key={index} className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-[#222] border border-indigo-500/30 rounded-lg shadow-md">
                      <img 
                        src={logoUrl} 
                        alt={`Generated logo ${index + 1}`} 
                        className="max-h-32 max-w-full rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.png';
                        }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectLogo(logoUrl)}
                      className="px-4 py-1 rounded-lg text-sm border border-indigo-500 text-indigo-400 hover:border-indigo-400 hover:text-indigo-300"
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogoGenerationModal; 