import React, { useState } from 'react';
import { Loader } from 'lucide-react';
import { daosService } from '../services/DaosService';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/UserService';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffectOnce } from '../hooks/useEffectOnce';

interface CreateDaoFormProps {
  onSuccess?: (daoId: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  isModal?: boolean;
}

const CreateDaoForm: React.FC<CreateDaoFormProps> = ({ 
  onSuccess, 
  onError, 
  className = '',
  isModal = false
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const { userInfo } = useAuth();
  const { publicKey } = useWallet();
  
  // Fetch current user ID on component mount
  useEffectOnce(() => {
    const fetchCurrentUser = async () => {
      setIsLoadingUser(true);
      try {
        // Get user data from the @me endpoint
        const userData = await userService.getMe();
        
        // Check if userData contains user_id (as seen in the console log)
        if (userData && userData.userId) {
          // Keep as string to preserve full precision of large numbers
          setUserId(String(userData.userId));
          setIsLoadingUser(false);
          return;
        }

        
        console.warn('Could not find user_id in API response, using fallback');
        // Using a default ID - for development only
        setUserId("1");
      } catch (err) {
        console.error('Error fetching user ID:', err);
        setUserId("1");
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchCurrentUser();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('DAO name is required');
      return;
    }
    
    if (!userId) {
      setError('User ID could not be determined. Please try again or contact support.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log(`Creating DAO with name: ${name}, description: ${description}, userId: ${userId}`);
      
      const result = await daosService.createDao({
        name,
        description,
        userId,
      });
      if (result) {
        setSuccess(`DAO "${name}" created successfully!`);
        setName('');
        setDescription('');
        if (onSuccess) onSuccess(result.daoId?.toString() || '');
      } else {
        throw new Error('Failed to create DAO. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      if (onError) onError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const displayUsername = userInfo?.username || userInfo?.walletAddress || 'Unknown User';
  
  // Common classes for both modal and standalone form
  const inputClasses = isModal
    ? "w-full px-3 py-2 bg-[#222] border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary"
    : "w-full p-2 border border-surface-300 rounded-md bg-surface-100 text-text focus:outline-none focus:ring-2 focus:ring-primary";
  
  const buttonClasses = isModal
    ? "w-full py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
    : `w-full py-3 rounded-lg text-text font-medium ${
        isSubmitting || isLoadingUser
          ? 'bg-primary cursor-not-allowed opacity-70'
          : 'bg-primary hover:bg-opacity-90 transition-colors'
      }`;
  
  const errorClasses = isModal
    ? "bg-red-900/30 border border-red-800 text-red-300 p-3 rounded-md"
    : "bg-error bg-opacity-20 border border-error text-error px-4 py-3 rounded mb-4";
  
  const successClasses = isModal
    ? "bg-green-900/30 border border-green-800 text-green-300 p-3 rounded-md"
    : "bg-success bg-opacity-20 border border-success text-success px-4 py-3 rounded mb-4";
  
  const labelClasses = isModal
    ? "block text-sm font-medium text-gray-300 mb-1"
    : "block text-sm font-medium text-surface-500 mb-1";
    
  return (
    <div className={className}>
      {!isModal && (
        <h2 className="text-2xl font-bold mb-6 text-center text-text">Create New DAO</h2>
      )}
      
      {success && (
        <div className={successClasses}>
          {success}
        </div>
      )}
      
      {error && (
        <div className={errorClasses}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className={labelClasses}>
            DAO Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClasses}
            placeholder="Enter a unique name for your DAO"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className={labelClasses}>
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClasses}
            placeholder="Describe the purpose of your DAO"
            rows={4}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="mb-4">
          <p className={isModal ? "text-sm text-gray-400" : "text-sm text-surface-400"}>
            Creating as: 
            <span className={isModal ? "text-white" : "text-text"}> {displayUsername}</span>
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || isLoadingUser}
          className={buttonClasses}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Creating...
            </>
          ) : isLoadingUser ? (
            <>
              <Loader className="animate-spin mr-2" size={16} />
              Loading User Info...
            </>
          ) : (
            'Create DAO'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateDaoForm; 