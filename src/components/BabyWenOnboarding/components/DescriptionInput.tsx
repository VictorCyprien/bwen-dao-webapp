import React from 'react';
import { Sparkles } from 'lucide-react';
import { replicateService } from '../../../services/ReplicateService';


interface DescriptionInputProps {
  onSelectOption: (option: string, data?: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ onSelectOption }: DescriptionInputProps) => {
  const [description, setDescription] = React.useState<string>('');
  const [isImproving, setIsImproving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const MIN_DESCRIPTION_LENGTH = 25; // Minimum length to attempt improvement
  
  // When component mounts, check sessionStorage for previously entered description
  React.useEffect(() => {
    const savedDescription = sessionStorage.getItem('daoDescription');
    if (savedDescription) {
      setDescription(savedDescription);
    }
  }, []);
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    // Clear any existing errors when the user starts typing
    if (error) setError(null);
  };
  
  const handleSubmit = () => {
    if (!description.trim()) {
      setError('Please enter a description for your DAO');
      return;
    }
    
    if (description.length > 300) {
      setError('Description should be less than 300 characters');
      return;
    }
    
    onSelectOption('submit', description);
  };
  
  const handleImprove = React.useCallback(async () => {
    console.log('=== Starting handleImprove function ===');
    console.log('Current description:', description);
    console.log('Current API token available:', !!import.meta.env.VITE_REPLICATE_API_TOKEN);

    if (description.length < 25) {
      setError('Description needs to be at least 50 characters for AI improvement');
      console.log('Error: Description too short for improvement');
      return;
    }

    try {
      setIsImproving(true);
      console.log('Setting isImproving to true');

      try {
        console.log('Calling replicateService.improveText...');
        const improvedDescription = await replicateService.improveText(description, 300);
        console.log('Received improved description:', improvedDescription);
        
        // Save to session storage but don't advance
        sessionStorage.setItem('daoDescription', improvedDescription);
        console.log('Saved improved description to sessionStorage');
        
        // Update local state with improved description
        setDescription(improvedDescription);
        console.log('Updated state with improved description');
        
        // Do not call handleNextStep here as requested
      } catch (apiError) {
        console.error('Replicate API error:', apiError);
        console.log('Falling back to client-side improvement');
        
        // Fallback to client-side improvement
        const improved = description
          .replace(/^\s+|\s+$/g, '')  // trim whitespace
          .replace(/\s+/g, ' ')       // normalize spaces
          .replace(/[,.!?]([^\s])/g, '$1 '); // add space after punctuation
          
        console.log('Client-side improved text:', improved);
        sessionStorage.setItem('daoDescription', improved);
        setDescription(improved);
      }
    } catch (e) {
      console.error('Error during improvement process:', e);
      setError('Failed to improve description. Please try again.');
    } finally {
      setIsImproving(false);
      console.log('Setting isImproving to false');
      console.log('=== Completed handleImprove function ===');
    }
  }, [description]);
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-white/70 text-sm font-medium">
          DAO Description
        </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Describe the purpose and goals of your DAO"
          rows={4}
          className="w-full px-4 py-2 bg-[#222] border border-indigo-500/30 rounded-lg text-white/70 placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:text-white transition-colors"
        />
        {error && (
          <div className="text-red-500 text-sm mt-1">
            {error}
          </div>
        )}
        <div className="text-xs text-white/50 flex justify-between">
          <span>{description.length}/300 characters</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={handleImprove}
          disabled={isImproving || !description.trim() || description.trim().length < MIN_DESCRIPTION_LENGTH}
          className={`sm:flex-shrink-0 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            isImproving || !description.trim() || description.trim().length < MIN_DESCRIPTION_LENGTH
              ? 'border border-gray-600 text-gray-500 cursor-not-allowed'
              : 'border border-indigo-500 text-indigo-400 hover:border-indigo-400 hover:text-indigo-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          {isImproving ? 'Improving...' : 'Improve with AI'}
        </button>
        
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!description.trim()}
          className={`sm:flex-shrink-0 px-6 py-2 rounded-lg font-medium transition-colors ${
            !description.trim()
              ? 'bg-gray-600/50 cursor-not-allowed text-white/50'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default DescriptionInput; 