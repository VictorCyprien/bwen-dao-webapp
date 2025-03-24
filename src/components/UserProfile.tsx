import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/UserService';
import { socialConnectionService } from '../services/SocialConnectionService';
import { ui } from '../styles/theme';
import { useEffectOnce } from '../hooks/useEffectOnce';

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
      script.setAttribute('data-radius', cornerRadius.toString());
      script.setAttribute('data-auth-url', authUrl);
      script.async = true;

      container.appendChild(script);
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

  return <div ref={containerRef}></div>;
};

const UserProfile: React.FC = () => {
  const { userInfo, refreshUserInfo, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
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

  // Check URL for Telegram login data when component mounts
  useEffectOnce(() => {
    async function processTelegramAuth() {
      // Get URL search parameters
      const searchParams = new URLSearchParams(window.location.search);
      
      // Check if Telegram auth data exists in URL
      if (
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
      processTelegramAuth();
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
        telegramUsername: formData.telegramUsername || undefined
      });

      if (result) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
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
            : 'bg-red-900/30 border border-red-800 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

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

        {/* Social Connections */}
        <div className="mt-6">
          <h2 className="text-base font-medium text-white mb-3">Social Connections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Discord */}
            <div className="p-3 bg-[#191919] border border-gray-800 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Discord</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8.5 14.5C10.5 13.5 11 12.5 11 12.5L15.5 14.5"></path>
                  <path d="M8.5 9.5H15.5"></path>
                </svg>
              </div>
              {userInfo?.discordUsername ? (
                <p className="text-xs text-gray-300">{userInfo.discordUsername}</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">Not connected</p>
              )}
              <button
                type="button"
                onClick={connectDiscord}
                className="mt-2 w-full py-1.5 px-3 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition"
              >
                {userInfo?.discordUsername ? 'Reconnect' : 'Connect'}
              </button>
            </div>

            {/* Twitter */}
            <div className="p-3 bg-[#191919] border border-gray-800 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </div>
              {userInfo?.twitterUsername ? (
                <p className="text-xs text-gray-300">{userInfo.twitterUsername}</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">Not connected</p>
              )}
              <button
                type="button"
                onClick={connectTwitter}
                className="mt-2 w-full py-1.5 px-3 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition"
              >
                {userInfo?.twitterUsername ? 'Reconnect' : 'Connect'}
              </button>
            </div>

            {/* Telegram */}
            <div className="p-3 bg-[#191919] border border-gray-800 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-white">Telegram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                  <path d="m15 10-4 4 6 6 4-16-18 7 4 2 2 6 3-4"></path>
                </svg>
              </div>
              {userInfo?.telegramUsername ? (
                <p className="text-xs text-gray-300">{userInfo.telegramUsername}</p>
              ) : (
                <p className="text-xs text-gray-500 mb-2">Not connected</p>
              )}
              {/* Telegram Login Widget */}
              <div className="mt-2">
                  <TelegramLoginWidget 
                    botName="BwenDaoBot"
                    size="medium"
                    showUserPic={false}
                    cornerRadius={20}
                    authUrl={window.location.origin + "/profile"}
                  />
                </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="py-2 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm rounded-md hover:opacity-90 transition-all"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile; 