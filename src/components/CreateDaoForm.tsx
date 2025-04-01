import React, { useState, useRef } from 'react';
import { Loader, Upload } from 'lucide-react';
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
  const [treasury, setTreasury] = useState('');
  const [discordServer, setDiscordServer] = useState('');
  const [twitter, setTwitter] = useState('');
  const [telegram, setTelegram] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [website, setWebsite] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [bannerPicture, setBannerPicture] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  
  const { userInfo } = useAuth();
  const { publicKey } = useWallet();
  
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
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
      const result = await daosService.createDao({
        name,
        description,
        userId,
        treasury: treasury || undefined,
        discordServer: discordServer || undefined,
        twitter: twitter || undefined,
        telegram: telegram || undefined,
        instagram: instagram || undefined,
        tiktok: tiktok || undefined,
        website: website || undefined,
        profilePicture: profilePicture || undefined,
        bannerPicture: bannerPicture || undefined,
      });
      
      if (result) {
        setSuccess(`DAO "${name}" created successfully!`);
        setName('');
        setDescription('');
        setTreasury('');
        setDiscordServer('');
        setTwitter('');
        setTelegram('');
        setInstagram('');
        setTiktok('');
        setWebsite('');
        setProfilePicture(null);
        setBannerPicture(null);
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError('Please upload an image file (JPEG, PNG)');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image file size must be less than 5MB');
      return;
    }

    if (type === 'profile') {
      setProfilePicture(file);
    } else {
      setBannerPicture(file);
    }
    setError(null);
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

        <div className="mb-6">
          <label htmlFor="treasury" className={labelClasses}>
            Treasury Wallet Address
          </label>
          <input
            type="text"
            id="treasury"
            value={treasury}
            onChange={(e) => setTreasury(e.target.value)}
            className={inputClasses}
            placeholder="Enter the wallet address for your DAO's treasury"
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="discordServer" className={labelClasses}>
              Discord Server
            </label>
            <input
              type="text"
              id="discordServer"
              value={discordServer}
              onChange={(e) => setDiscordServer(e.target.value)}
              className={inputClasses}
              placeholder="Discord server invite link"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="twitter" className={labelClasses}>
              Twitter
            </label>
            <input
              type="text"
              id="twitter"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className={inputClasses}
              placeholder="Twitter handle"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="telegram" className={labelClasses}>
              Telegram
            </label>
            <input
              type="text"
              id="telegram"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className={inputClasses}
              placeholder="Telegram group link"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="instagram" className={labelClasses}>
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className={inputClasses}
              placeholder="Instagram handle"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="tiktok" className={labelClasses}>
              TikTok
            </label>
            <input
              type="text"
              id="tiktok"
              value={tiktok}
              onChange={(e) => setTiktok(e.target.value)}
              className={inputClasses}
              placeholder="TikTok username"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="website" className={labelClasses}>
              Website
            </label>
            <input
              type="text"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputClasses}
              placeholder="Website URL"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="profilePicture" className={labelClasses}>
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              ref={profileInputRef}
              onChange={(e) => handleImageUpload(e, 'profile')}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className={`${inputClasses} flex items-center justify-center`}
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {profilePicture ? profilePicture.name : 'Upload Profile Picture'}
            </button>
          </div>
          
          <div>
            <label htmlFor="bannerPicture" className={labelClasses}>
              Banner Picture
            </label>
            <input
              type="file"
              id="bannerPicture"
              ref={bannerInputRef}
              onChange={(e) => handleImageUpload(e, 'banner')}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              className={`${inputClasses} flex items-center justify-center`}
              disabled={isSubmitting}
            >
              <Upload className="w-4 h-4 mr-2" />
              {bannerPicture ? bannerPicture.name : 'Upload Banner Picture'}
            </button>
          </div>
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