import React from 'react';
import { Upload, Zap, ArrowRight } from 'lucide-react';
import LogoGenerationModal from './LogoGenerationModal';

interface LogoButtonSelectProps {
  onSelectOption: (option: string, data?: File | string) => void;
}

const LogoButtonSelect: React.FC<LogoButtonSelectProps> = ({ onSelectOption }: LogoButtonSelectProps) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [logoFile, setLogoFile] = React.useState<File | null>(null);
  const [filePreview, setFilePreview] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = React.useState<boolean>(false);
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // When component mounts, check sessionStorage for previously selected options
  React.useEffect(() => {
    // Check if we've previously selected an option
    const savedLogoType = sessionStorage.getItem('daoLogoType');
    const savedFileName = sessionStorage.getItem('daoLogoFileName');
    const savedLogoFile = sessionStorage.getItem('daoLogoFile');
    const savedLogoUrl = sessionStorage.getItem('daoLogoUrl');
    
    if (savedLogoType) {
      setSelectedOption(savedLogoType);
      
      // If it was an uploaded file, try to restore from the saved file data
      if (savedLogoType === 'upload' && savedLogoFile) {
        try {
          const fileData = JSON.parse(savedLogoFile);
          
          // If we have a data URL, we can restore the preview
          if (fileData.dataUrl) {
            setFilePreview(fileData.dataUrl);
            
            // Optionally restore the file object if you need it
            if (window.File && window.Blob) {
              const byteString = atob(fileData.dataUrl.split(',')[1]);
              const mimeType = fileData.dataUrl.split(',')[0].split(':')[1].split(';')[0];
              const arrayBuffer = new ArrayBuffer(byteString.length);
              const uint8Array = new Uint8Array(arrayBuffer);
              
              for (let i = 0; i < byteString.length; i++) {
                uint8Array[i] = byteString.charCodeAt(i);
              }
              
              const blob = new Blob([arrayBuffer], { type: mimeType });
              setLogoFile(new File([blob], fileData.name, { type: fileData.type }));
            }
          }
          // If we don't have the data URL but have the file name, show a placeholder
          else if (savedFileName) {
            setFilePreview('/assets/placeholder-image.png');
          }
        } catch (error) {
          // Fallback to placeholder if there's an error
          if (savedFileName) {
            setFilePreview('/assets/placeholder-image.png');
          }
        }
      }
      // If it was a generated logo, restore from the saved URL
      else if (savedLogoType === 'generate' && savedLogoUrl) {
        setFilePreview(savedLogoUrl);
      }
    }
  }, []);
  
  // Helper to save file data to sessionStorage if it's a real file
  const saveFileToSessionStorage = (file: File | null) => {
    if (file) {
      // We can't directly store File objects in sessionStorage, but we need to store
      // the file info somehow. We'll create a FileReader to read the file as dataURL
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const fileData = {
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: e.target?.result
          };
          // Store as JSON string
          sessionStorage.setItem('daoLogoFile', JSON.stringify(fileData));
        } catch (err) {
          // Silently fail, non-critical error
        }
      };
      reader.readAsDataURL(file);
    } else {
      sessionStorage.removeItem('daoLogoFile');
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Please upload an image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    setLogoFile(file);
    setError(null);
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    setSelectedOption('upload');
  };
  
  // Submit handler for either uploaded or generated logos
  const handleSubmit = () => {
    try {
      if (selectedOption === 'upload' && logoFile) {
        sessionStorage.setItem('daoLogo', 'logo_uploaded');
        sessionStorage.setItem('daoLogoType', 'upload');
        sessionStorage.setItem('daoLogoFileName', logoFile.name);
        
        // Save file to sessionStorage
        saveFileToSessionStorage(logoFile);
        
        onSelectOption('upload', logoFile);
      } else if (selectedOption === 'generate' && filePreview) {
        // For a generated logo, pass the URL to the next step
        onSelectOption('generate', filePreview);
      }
    } catch (err) {
      // Silently fail, error handling already in parent component
    }
  };
  
  // Generate logo handler
  const handleGenerateClick = () => {
    setSelectedOption('generate');
    setIsGenerationModalOpen(true);
  };
  
  // Skip handler
  const handleSkipClick = () => {
    setSelectedOption('skip');
    // Immediately submit for options that don't need additional input
    setTimeout(() => {
      sessionStorage.setItem('daoLogo', 'skipped');
      sessionStorage.setItem('daoLogoType', 'skipped');
      
      // For skip, we need to clear any previous file data
      sessionStorage.removeItem('daoLogoFile');
      sessionStorage.removeItem('daoLogoUrl');
      
      onSelectOption('skip');
    }, 100);
  };
  
  // Add function to reset file upload
  const handleResetUpload = () => {
    setLogoFile(null);
    setFilePreview(null);
    setError(null);
    setSelectedOption(null);
    
    // Clear from sessionStorage
    sessionStorage.removeItem('daoLogoFile');
    sessionStorage.removeItem('daoLogoFileName');
    sessionStorage.removeItem('daoLogoType');
    sessionStorage.removeItem('daoLogo');
    sessionStorage.removeItem('daoLogoUrl');
  };
  
  // Handle logo selection from the modal
  const handleSelectLogo = (logoUrl: string) => {
    setFilePreview(logoUrl);
    setSelectedOption('generate');
    
    // Store the logo URL in sessionStorage
    sessionStorage.setItem('daoLogo', 'logo_generated');
    sessionStorage.setItem('daoLogoType', 'generate');
    sessionStorage.setItem('daoLogoUrl', logoUrl);
    
    // We don't need any file data for generated logos
    sessionStorage.removeItem('daoLogoFile');
    sessionStorage.removeItem('daoLogoFileName');
    
    // Close modal
    setIsGenerationModalOpen(false);
    
    // Don't auto-proceed anymore, let the user click "Continue"
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <button
          type="button"
          onClick={handleUploadClick}
          className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
            selectedOption === 'upload' 
              ? 'border-2 border-indigo-500 text-indigo-300 shadow-lg' 
              : 'border border-indigo-500/30 text-indigo-400/70 hover:border-indigo-500/60 hover:text-indigo-300'
          }`}
        >
          <Upload className="w-8 h-8" />
          <span className="font-medium">Upload</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
          />
        </button>
        
        <button
          type="button"
          onClick={handleGenerateClick}
          className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
            selectedOption === 'generate' 
              ? 'border-2 border-indigo-500 text-indigo-300 shadow-lg' 
              : 'border border-indigo-500/30 text-indigo-400/70 hover:border-indigo-500/60 hover:text-indigo-300'
          }`}
        >
          <Zap className="w-8 h-8" />
          <span className="font-medium">Generate</span>
        </button>
        
        <button
          type="button"
          onClick={handleSkipClick}
          className={`p-4 rounded-lg flex flex-col items-center justify-center gap-2 transition-colors ${
            selectedOption === 'skip' 
              ? 'border-2 border-indigo-500 text-indigo-300 shadow-lg'
              : 'border border-indigo-500/30 text-indigo-400/70 hover:border-indigo-500/60 hover:text-indigo-300'
          }`}
        >
          <ArrowRight className="w-8 h-8" />
          <span className="font-medium">Skip</span>
        </button>
      </div>
      
      {/* Preview for uploaded files */}
      {selectedOption === 'upload' && filePreview && (
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-[#222] border border-indigo-500/30 rounded-lg shadow-md relative">
              <img 
                src={filePreview} 
                alt="Logo preview" 
                className="max-h-24 max-w-full rounded-lg"
              />
              <button
                type="button"
                onClick={handleResetUpload}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                aria-label="Remove uploaded image"
              >
                ×
              </button>
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!!error}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                error
                  ? 'bg-gray-600/50 cursor-not-allowed text-white/50'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Preview for generated logos */}
      {selectedOption === 'generate' && filePreview && (
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-[#222] border border-indigo-500/30 rounded-lg shadow-md relative">
              <img 
                src={filePreview} 
                alt="Generated logo" 
                className="max-h-24 max-w-full rounded-lg"
              />
              <button
                type="button"
                onClick={handleResetUpload}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 focus:outline-none"
                aria-label="Remove generated logo"
              >
                ×
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              Continue
            </button>
          </div>
        </div>
      )}
      
      {/* Logo Generation Modal */}
      <LogoGenerationModal
        isOpen={isGenerationModalOpen}
        onClose={() => setIsGenerationModalOpen(false)}
        onSelectLogo={handleSelectLogo}
      />
    </div>
  );
};

export default LogoButtonSelect; 