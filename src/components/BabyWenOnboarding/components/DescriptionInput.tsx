import React from 'react';
import { Sparkles } from 'lucide-react';

interface DescriptionInputProps {
  onSelectOption: (option: string, data?: string) => void;
}

const DescriptionInput: React.FC<DescriptionInputProps> = ({ onSelectOption }: DescriptionInputProps) => {
  const [description, setDescription] = React.useState<string>('');
  const [isImproving, setIsImproving] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
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
    
    if (description.length > 500) {
      setError('Description should be less than 500 characters');
      return;
    }
    
    onSelectOption('submit', description);
  };
  
  const handleImproveWithAI = async () => {
    if (!description.trim()) {
      setError('Please enter a description to improve');
      return;
    }
    
    try {
      // Simulate improvement process
      setIsImproving(true);
      setError(null);
      
      // Wait for a small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Just update with "to do"
      const improvedText = "to do";
      setDescription(improvedText);
      
      
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to improve description');
    } finally {
      setIsImproving(false);
    }
  };
  
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
          <span>{description.length}/500 characters</span>
          {description.length > 250 && (
            <span className="text-amber-400">
              Recommended: Keep it under 250 characters
            </span>
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={handleImproveWithAI}
          disabled={isImproving || !description.trim()}
          className={`sm:flex-shrink-0 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
            isImproving || !description.trim()
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