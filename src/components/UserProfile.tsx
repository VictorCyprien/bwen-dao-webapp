import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/UserService';
import { socialConnectionService } from '../services/SocialConnectionService';
import { ui } from '../styles/theme';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { Upload, Key } from 'lucide-react';
import { validateImageFile } from '../utils/fileUtils';
import ApiKeyModal from './ApiKeyModal';

// Telegram Login Widget component
const TelegramLoginWidget: React.FC<{
  botName: string,
  size?: 'large' | 'medium' | 'small',
  showUserPic?: boolean,
  cornerRadius?: number,
  authUrl: string,
  onCallback?: (user: any) => void
}> = ({ botName, size = 'large', showUserPic = false, cornerRadius = 20, authUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Remove any existing script
    const container = containerRef.current;
    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      // Create and append the script element
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', botName);
      script.setAttribute('data-size', size);
      script.setAttribute('data-userpic', showUserPic.toString());
      script.setAttribute('data-radius', '9999'); // Override to make it fully rounded
      script.setAttribute('data-auth-url', authUrl);
      script.async = true;

      container.appendChild(script);
      
      // Add a style tag to apply Arial font to Telegram widget buttons
      const style = document.createElement('style');
      style.textContent = `
        .tgme_widget_login button {
          font-family: Arial, sans-serif !important;
          border-radius: 9999px !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }

    // Cleanup function
    return () => {
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
    };
  }, [botName, size, showUserPic, cornerRadius, authUrl]);

  return <div ref={containerRef} className="telegram-widget"></div>;
};

// Discord Login Button component that matches Telegram style
const DiscordLoginButton: React.FC<{
  size?: 'large' | 'medium' | 'small',
  onClick: () => void 
}> = ({ size = 'medium', onClick }: { size?: 'large' | 'medium' | 'small', onClick: () => void }) => {
  // Map size to actual dimensions
  const sizeClasses: Record<'large' | 'medium' | 'small', string> = {
    'large': 'h-12 text-base px-4',
    'medium': 'h-10 text-sm px-3',
    'small': 'h-8 text-xs px-2'
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full rounded-full bg-[#7289DA] text-white font-medium ${sizeClasses[size as 'large' | 'medium' | 'small']} hover:bg-[#5f73bb] transition-colors font-arial`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        className="mr-2" 
        width={size === 'small' ? 16 : 20} 
        height={size === 'small' ? 16 : 20} 
        viewBox="0 0 24 24" 
        fill="white" 
        stroke="none">
        <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.977-.608 1.414a15.932 15.932 0 0 0-4.746 0 9.698 9.698 0 0 0-.616-1.414.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055c1.998 1.483 3.948 2.388 5.851 2.98a.075.075 0 0 0 .082-.026c.446-.61.847-1.254 1.194-1.932a.075.075 0 0 0-.041-.104 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.127c.126-.095.252-.193.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.075.075 0 0 0-.041.105c.348.678.747 1.323 1.194 1.932a.076.076 0 0 0 .082.026c1.904-.592 3.854-1.497 5.852-2.98a.077.077 0 0 0 .032-.055c.505-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
      </svg>
      Log in with Discord
    </button>
  );
};

// X (formerly Twitter) Login Button component that matches Telegram style
const TwitterLoginButton: React.FC<{
  size?: 'large' | 'medium' | 'small',
  onClick: () => void
}> = ({ size = 'medium', onClick }: { size?: 'large' | 'medium' | 'small', onClick: () => void }) => {
  // Map size to actual dimensions
  const sizeClasses: Record<'large' | 'medium' | 'small', string> = {
    'large': 'h-12 text-base px-4',
    'medium': 'h-10 text-sm px-3',
    'small': 'h-8 text-xs px-2'
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center w-full rounded-full bg-black text-white font-medium ${sizeClasses[size as 'large' | 'medium' | 'small']} hover:bg-[#333] transition-colors font-arial`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
        className="mr-2" 
        width={size === 'small' ? 16 : 20} 
        height={size === 'small' ? 16 : 20} 
        viewBox="0 0 24 24" 
        fill="white" 
        stroke="none">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      Log in with X
    </button>
  );
};

const UserProfile: React.FC = () => {
  const { userInfo, refreshUserInfo, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState({ text: '', type: '' });
  const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
  const [profilePictureError, setProfilePictureError] = React.useState<string | null>(null);
  const profileInputRef = React.useRef<HTMLInputElement>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = React.useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    email: null as string | null,
    memberName: '',
    discordUsername: null as string | null,
    twitterUsername: null as string | null,
    telegramUsername: null as string | null
  });

  // Add global styles for button styling
  useEffect(() => {
    // Add styles for Telegram widget
    const style = document.createElement('style');
    style.textContent = `
      /* Custom styling for social login buttons */
      .telegram-widget iframe {
        border-radius: 9999px !important;
      }
      
      /* Apply Arial font to all buttons */
      button, .telegram-widget button {
        font-family: Arial, sans-serif !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Check URL for auth callback data when component mounts
  useEffectOnce(() => {
    async function processAuthCallback() {
      // Get URL search parameters
      const searchParams = new URLSearchParams(window.location.search);
      
      // First check for standard success/error callbacks
      if (searchParams.has('success') || searchParams.has('error')) {
        const successStatus = searchParams.get('success');
        const errorStatus = searchParams.get('error');
        const errorMessage = searchParams.get('message');
        
        if (successStatus) {
          setIsLoading(true);
          try {
            // Handle success status codes
            switch (successStatus) {
              case 'discord_connected':
                setMessage({ text: 'Discord linked successfully!', type: 'success' });
                break;
              case 'twitter_connected':
                setMessage({ text: 'Twitter linked successfully!', type: 'success' });
                break;
              default:
                setMessage({ text: 'Account linked successfully!', type: 'success' });
            }
            
            // Refresh user info to get updated data
            await refreshUserInfo();
          } catch (error: any) {
            console.error('Error handling success callback:', error);
            setMessage({ 
              text: error.message || 'Failed to complete authentication', 
              type: 'error' 
            });
          } finally {
            setIsLoading(false);
            
            // Remove the query parameters from URL without refreshing page
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, document.title, url.toString());
          }
        } else if (errorStatus) {
          // Handle error status codes
          let errorText = 'Failed to connect your account. Please try again.';
          
          switch (errorStatus) {
            case 'db_error':
              errorText = 'Database error occurred. Please try again later.';
              break;
            case 'user_info_error':
              errorText = 'Failed to retrieve user information. Please try again.';
              break;
            case 'token_error':
              errorText = 'Authentication token error. Please try reconnecting.';
              break;
            case 'missing_verifier':
              errorText = 'Verification code missing. Please try again.';
              break;
            case 'invalid_state':
            case 'invalid_state_format':
              errorText = 'Security verification failed. Please try again.';
              break;
            case 'missing_parameters':
              errorText = 'Required parameters missing. Please try again.';
              break;
            case 'twitter_auth_error':
              errorText = errorMessage ? `Twitter authentication error: ${errorMessage}` : 'Twitter authentication failed. Please try again.';
              break;
            default:
              errorText = `Authentication error: ${errorStatus}`;
          }
          
          setMessage({ text: errorText, type: 'error' });
          
          // Remove the query parameters from URL without refreshing page
          const url = new URL(window.location.href);
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
        }
      }
      // Then check for Telegram-specific authentication data
      else if (
        searchParams.has('id') && 
        searchParams.has('first_name') && 
        searchParams.has('auth_date') && 
        searchParams.has('hash')
      ) {
        setIsLoading(true);
        setMessage({ text: 'Processing Telegram authentication...', type: 'info' });
        
        try {
          // Create auth data object from URL parameters
          const telegramAuth = {
            id: Number(searchParams.get('id')),
            first_name: searchParams.get('first_name') || '',
            last_name: searchParams.get('last_name') || '',
            username: searchParams.get('username') || undefined,
            photo_url: searchParams.get('photo_url') || undefined,
            auth_date: Number(searchParams.get('auth_date')),
            hash: searchParams.get('hash') || ''
          };
          
          // Call the handleTelegramAuth method from socialConnectionService
          await socialConnectionService.handleTelegramAuth(telegramAuth);
          
          // Update success message
          setMessage({ text: 'Telegram account connected successfully!', type: 'success' });
          
          // Refresh user info to get updated data
          await refreshUserInfo();
          
          // Remove the query parameters from URL without refreshing page
          // This prevents processing the same data again if user refreshes
          const url = new URL(window.location.href);
          url.search = '';
          window.history.replaceState({}, document.title, url.toString());
        } catch (error: any) {
          console.error('Error processing Telegram auth:', error);
          setMessage({ 
            text: error.message || 'Failed to connect Telegram account', 
            type: 'error' 
          });
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    if (isAuthenticated) {
      processAuthCallback();
    }
  }, [isAuthenticated, refreshUserInfo]);

  // Load user data when component mounts
  useEffect(() => {
    if (userInfo) {
      setFormData({
        userId: userInfo.userId || '',
        username: userInfo.username || '',
        email: userInfo.email !== undefined ? userInfo.email : null,
        memberName: userInfo.memberName || '',
        discordUsername: userInfo.discordUsername !== undefined ? userInfo.discordUsername : null,
        twitterUsername: userInfo.twitterUsername !== undefined ? userInfo.twitterUsername : null,
        telegramUsername: userInfo.telegramUsername !== undefined ? userInfo.telegramUsername : null
      });
    }
  }, [userInfo]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImageFile(file);
    if (error) {
      setProfilePictureError(error);
      return;
    }

    setProfilePicture(file);
    setProfilePictureError(null);
    setMessage({ text: '', type: '' });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !userInfo) {
      setMessage({ text: 'You must be logged in to update your profile', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const userId = userInfo.userId;
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Update user profile using the UserService
      const result = await userService.updateUser(userId, {
        username: formData.username,
        email: formData.email || undefined,
        memberName: formData.memberName,
        discordUsername: formData.discordUsername || undefined,
        twitterUsername: formData.twitterUsername || undefined,
        telegramUsername: formData.telegramUsername || undefined,
        profilePicture: profilePicture || undefined
      });

      if (result) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
        // Reset the profile picture file state after successful update
        setProfilePicture(null);
        // Refresh user info to get the updated data
        await refreshUserInfo();
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Error updating profile. Please try again later.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Connect social accounts using the service
  const connectDiscord = () => {
    try {
      socialConnectionService.connectDiscord();
    } catch (error: any) {
      setMessage({ text: error.message || 'Error connecting Discord', type: 'error' });
    }
  };

  const connectTwitter = () => {
    try {
      socialConnectionService.connectTwitter();
    } catch (error: any) {
      setMessage({ text: error.message || 'Error connecting Twitter', type: 'error' });
    }
  };

  // Manually trigger Telegram connection (used as backup in case URL params don't work)
  const connectTelegram = () => {
    try {
      socialConnectionService.connectTelegram();
    } catch (error: any) {
      setMessage({ text: error.message || 'Error connecting Telegram', type: 'error' });
    }
  };

  // Open API Key modal
  const openApiKeyModal = () => {
    setIsApiKeyModalOpen(true);
  };

  // Close API Key modal
  const closeApiKeyModal = () => {
    setIsApiKeyModalOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-300">Please connect your wallet to view your profile</p>
      </div>
    );
  }

  return (
    <div className="text-gray-300">
      {message.text && (
        <div className={`p-3 mb-4 rounded-md text-sm ${
          message.type === 'success' 
            ? 'bg-green-900/30 border border-green-800 text-green-400' 
            : message.type === 'info'
              ? 'bg-blue-900/30 border border-blue-800 text-blue-400'
              : 'bg-red-900/30 border border-red-800 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Picture Display */}
      <div className="flex items-center mb-6">
        <div className="mr-6">
          {userInfo?.profilePicture ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-purple-600">
              <img 
                src={userInfo.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-purple-600">
              <span className="text-2xl text-gray-400">{formData.username?.charAt(0)?.toUpperCase() || userInfo?.walletAddress?.charAt(0)?.toUpperCase() || '?'}</span>
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">{formData.memberName || formData.username}</h2>
          
          {/* Profile Picture Upload */}
          <div>
            <input
              type="file"
              id="profilePicture"
              ref={profileInputRef}
              onChange={handleProfilePictureUpload}
              accept="image/jpeg,image/png,image/gif"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => profileInputRef.current?.click()}
              className="px-3 py-1.5 bg-[#333] text-sm border border-gray-700 rounded-md text-white flex items-center hover:bg-[#444] transition-colors"
            >
              <Upload className="w-4 h-4 mr-1.5" />
              {profilePicture ? profilePicture.name : 'Change Profile Picture'}
            </button>
            
            {profilePictureError && (
              <p className="text-red-400 text-xs mt-1">{profilePictureError}</p>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#191919] border border-gray-800 rounded-md text-white focus:outline-none focus:border-purple-600"
              placeholder="Username"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#191919] border border-gray-800 rounded-md text-white focus:outline-none focus:border-purple-600"
              placeholder="Email address"
            />
          </div>

          {/* Member Name */}
          <div>
            <label htmlFor="memberName" className="block text-sm font-medium text-gray-400 mb-1">
              Member Name
            </label>
            <input
              type="text"
              id="memberName"
              name="memberName"
              value={formData.memberName}
              onChange={handleInputChange}
              className="w-full p-2 bg-[#191919] border border-gray-800 rounded-md text-white focus:outline-none focus:border-purple-600"
              placeholder="Display name"
            />
          </div>

          {/* Wallet Address (readonly) */}
          <div>
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-400 mb-1">
              Wallet Address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={userInfo?.walletAddress || ''}
              readOnly
              className="w-full p-2 bg-[#191919] border border-gray-800 rounded-md text-gray-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Save Changes Button - Centered */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-md hover:opacity-90 transition-all"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Social Connections */}
      <div className="mt-6">
        <h2 className="text-base font-medium text-white mb-3">Social Connections</h2>
        
        {/* Connection buttons in 3 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Discord Button */}
          <DiscordLoginButton 
            size="medium" 
            onClick={connectDiscord}
          />

          {/* Twitter Button */}
          <TwitterLoginButton 
            size="medium" 
            onClick={connectTwitter}
          />

          {/* Telegram Widget */}
          <TelegramLoginWidget 
            botName="BwenDaoBot"
            size="medium"
            showUserPic={false}
            cornerRadius={20}
            authUrl={window.location.origin}
          />
        </div>
      </div>

      {/* API Keys Button (centered) */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={openApiKeyModal}
          className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition"
        >
          <Key size={16} className="mr-2" />
          Manage API Keys
        </button>
      </div>

      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={closeApiKeyModal} />
    </div>
  );
};

export default UserProfile; 