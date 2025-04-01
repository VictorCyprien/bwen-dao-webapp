import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { walletAuthService } from '../services/WalletAuthService';
import { userService } from '../services/UserService';
import UserRegistrationForm from '../components/UserRegistrationForm';
import bs58 from 'bs58';
import { useEffectOnce } from '../hooks/useEffectOnce';

// Interface for user information
interface UserInfo {
  userId?: string;
  username?: string;
  walletAddress?: string;
  email?: string;
  memberName?: string;
  discordUsername?: string;
  twitterUsername?: string;
  telegramUsername?: string;
  profilePicture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  authenticateWithWallet: (walletAddress: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
  isLoading: boolean;
  challengeMessage: string | null;
  authError: string | null;
  userInfo: UserInfo | null; // Add user information
  refreshUserInfo: () => Promise<void>; // Add method to refresh user info
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  authenticateWithWallet: async () => false,
  logout: () => {},
  token: null,
  isLoading: false,
  challengeMessage: null,
  authError: null,
  userInfo: null, // Initialize user info as null
  refreshUserInfo: async () => {}, // Initialize refresh method
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
  children, 
  apiEndpoint = '/api' 
}) => {
  const { connected, publicKey, disconnect, signMessage } = useWallet();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState<boolean>(false);
  const [pendingWalletAddress, setPendingWalletAddress] = useState<string | null>(null);
  const [challengeMessage, setChallengeMessage] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); // Add user info state

  // Add a ref to track if we're already fetching user data
  const isFetchingUserInfo = useRef(false);
  
  // Initialize API services with the API endpoint and check for token
  useEffectOnce(() => {
    const initializeAuth = async () => {
      // Set API endpoints for services
      walletAuthService.setApiEndpoint(apiEndpoint);
      userService.setApiEndpoint(apiEndpoint);
      
      // Simply check if we have a token stored - no validation
      const hasToken = walletAuthService.hasAccessToken();
      
      if (hasToken) {
        console.log('Access token found, considering user authenticated');
        setToken(walletAuthService.getAccessToken());
        setIsAuthenticated(true);
        
        // Load user info from API
        fetchUserInfo();
      } else {
        console.log('No access token found, user needs to authenticate');
        // DO NOT disconnect wallet - let user initiate authentication
      }
    };
    
    initializeAuth();
  }, [apiEndpoint]);

  // Fetch user information from the API
  const fetchUserInfo = async () => {
    // Prevent multiple concurrent calls
    if (isFetchingUserInfo.current) {
      console.log('Already fetching user info, skipping duplicate call');
      return;
    }
    
    // Add a small delay to ensure any previous operations have completed
    // NOTE : This is a stupid hack to prevent getting previous user's data when changing wallets
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      isFetchingUserInfo.current = true;
      
      // Get the user from the API using the @me endpoint
      const userData = await userService.getCurrentUser();
      
      if (userData) {
        // Use type assertion to handle unknown properties
        const user = userData as any;
        
        // Log what we got from the API for debugging (just once)
        console.log('API returned user data from @me endpoint:', user);
        
        // Convert API response to UserInfo format with careful property access
        const userDataToStore: UserInfo = {
          userId: user.userId,
          username: user.username || user.name || 'Unknown',
          walletAddress: user.walletAddress || user.wallet_address || localStorage.getItem('walletAddress') || '',
          email: user.email || '',
          memberName: user.displayName || user.display_name || user.memberName || user.member_name || user.username || user.name || '',
          discordUsername: user.discordUsername || user.discord_username || user.discord || '',
          twitterUsername: user.twitterUsername || user.twitter_username || user.twitter || '',
          telegramUsername: user.telegramUsername || user.telegram_username || user.telegram || '',
          profilePicture: user.profilePicture || user.profile_picture || user.profile || user.avatar || user.profileUrl || ''
        };
        
        setUserInfo(userDataToStore);
        console.log(`User info set - username: ${userDataToStore.username}`);
      } else if (localStorage.getItem('walletAddress')) {
        // Fallback - set minimal user info with wallet address
        const walletAddress = localStorage.getItem('walletAddress') || '';
        const shortenedAddress = walletAddress ? 
          `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
          '';
        
        setUserInfo({
          username: shortenedAddress,
          walletAddress,
          profilePicture: ''
        });
      } else {
        setUserInfo(null);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUserInfo(null);
    } finally {
      // Reset the fetching flag when done
      isFetchingUserInfo.current = false;
    }
  };

  // Refresh user info method should also prevent duplicate calls
  const refreshUserInfo = async () => {
    fetchUserInfo();
  };

  // Handle wallet connection/disconnection
  useEffectOnce(() => {
    // Create a non-async wrapper function since useEffect callback shouldn't be async
    const handleWalletConnectionWrapper = () => {
      handleWalletConnection().catch(error => {
        console.error("Error handling wallet connection:", error);
      });
    };

    // Run any time wallet connection state changes
    console.log(`Wallet connection changed - connected: ${connected}, publicKey: ${publicKey?.toString() || 'none'}`);
    handleWalletConnectionWrapper();
    
  }, [connected, publicKey]); // Only run when wallet connection state changes

  // Handle challenge signature
  useEffectOnce(() => {
    const signChallenge = async () => {
      if (challengeMessage && publicKey && signMessage) {
        try {
          setIsLoading(true);
          
          console.log('Signing challenge message:', challengeMessage);
          
          // Convert the message to Uint8Array for signing
          const messageBytes = new TextEncoder().encode(challengeMessage);
          
          try {
            // Request user to sign the message with their wallet
            const signature = await signMessage(messageBytes);
            
            // Convert the signature to base58 string
            const signatureString = bs58.encode(signature);
            
            console.log('Signed message successfully');
            
            // Complete authentication with the signature
            const result = await walletAuthService.authenticateWithWallet(
              publicKey.toString(),
              signatureString,
              challengeMessage
            );
            
            if (result.success) {
              // Pass the result which should now include the token
              await handleSignatureSuccess({
                ...result,
                signature: signatureString
              });
            } else {
              console.error('Failed to verify signature:', result.error);
              setChallengeMessage(null); // Clear challenge to prevent further attempts
              setApiError(result.error || 'Failed to verify signature');
              
              // Record the time of failure to prevent immediate retry
              localStorage.setItem('lastSignatureFailTime', Date.now().toString());
              
              // If verification failed, disconnect wallet to prevent repeated popups
              if (disconnect && !result.success) {
                disconnect();
              }
            }
          } catch (error) {
            // User rejected the signature request or other wallet error
            console.error('User rejected signature or wallet error:', error);
            setChallengeMessage(null); // Clear challenge to prevent further attempts
            
            // Set a user-friendly error message
            let errorMessage = 'Signature request was rejected';
            if (error instanceof Error) {
              errorMessage = error.message;
            }
            setApiError(errorMessage);
            
            // Record the time of failure to prevent immediate retry
            localStorage.setItem('lastSignatureFailTime', Date.now().toString());
            
            // Disconnect wallet to prevent repeated popups
            if (disconnect) {
              disconnect();
            }
          }
        } catch (error) {
          console.error('Error in signature process:', error);
          setChallengeMessage(null);
          
          // Extract error message
          let errorMessage = 'Error signing message';
          if (error instanceof Error) {
            errorMessage = error.message;
          }
          setApiError(errorMessage);
          
          // Disconnect wallet to prevent repeated popups
          if (disconnect) {
            disconnect();
          }
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    signChallenge();
  }, [challengeMessage, publicKey, signMessage, disconnect]);

  // Start the authentication process for a wallet
  const startAuthenticationProcess = async (walletAddress: string) => {
    console.log('Starting authentication process for wallet:', walletAddress);
    setIsLoading(true);
    setApiError(null);
    
    try {
      // Check if a user with this wallet exists
      const userExists = await walletAuthService.checkUserExists(walletAddress);
      
      if (!userExists) {
        // User doesn't exist, show registration form
        console.log('User does not exist, showing registration form');
        setPendingWalletAddress(walletAddress);
        setShowRegistrationForm(true);
        return;
      }
      
      // User exists, request a challenge to sign
      console.log('Requesting wallet challenge...');
      const challenge = await walletAuthService.requestChallenge(walletAddress);
      
      if (!challenge) {
        throw new Error('Failed to get challenge message');
      }
      
      // Set the challenge to trigger the signature process
      console.log('Challenge received, signature required:', challenge);
      setChallengeMessage(challenge);
      
    } catch (error) {
      console.error('Authentication process error:', error);
      let errorMessage = 'Authentication failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setApiError(errorMessage);
      setIsLoading(false);
    }
  };

  // Update the signature verification success handler to fetch user info
  const handleSignatureSuccess = async (result: any) => {
    console.log('Signature success result:', result);
    
    try {
      setIsLoading(true);
      
      // The token should already be in the result, no need to verify again
      if (!result.token) {
        throw new Error('No token in signature verification result');
      }
      
      // Success! Update state
      setIsAuthenticated(true);
      setToken(result.token);
      setChallengeMessage(null);
      
      // Store the authenticated wallet address in localStorage
      if (publicKey) {
        const walletAddress = publicKey.toString();
        localStorage.setItem('authenticatedWalletAddress', walletAddress);
        console.log('Stored authenticated wallet address after successful signature:', walletAddress);
      }
      
      // Fetch user info from API
      await fetchUserInfo();
      
      console.log('Authentication complete!');
    } catch (error) {
      console.error('Signature verification error:', error);
      let errorMessage = 'Signature verification failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setApiError(errorMessage);
      
      // Store timestamp of failure to prevent immediate retry
      localStorage.setItem('lastSignatureFailTime', Date.now().toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationSubmit = async (userData: {
    username: string;
    email: string;
    memberName: string;
    discordUsername: string;
    twitterUsername: string;
    telegramUsername: string;
  }) => {
    try {
      setIsLoading(true);
      
      if (!pendingWalletAddress) {
        throw new Error('No wallet address for registration');
      }
      
      // Create the user with the wallet address and form data
      console.log('Creating user with wallet address:', pendingWalletAddress);
      const result = await userService.createUser(pendingWalletAddress, userData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      // User created successfully, now request a challenge to sign
      console.log('User created successfully, requesting challenge');
      const challenge = await walletAuthService.requestChallenge(pendingWalletAddress);
      
      if (!challenge) {
        throw new Error('Failed to get challenge message after registration');
      }
      
      // Set the challenge to trigger the signature process
      console.log('Setting challenge message for signature:', challenge);
      setShowRegistrationForm(false);
      setChallengeMessage(challenge);
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = 'Registration failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
    setPendingWalletAddress(null);
    setChallengeMessage(null);
    setApiError(null);
    setUserFormData(null);
    
    // Disconnect wallet since user canceled registration
    if (disconnect) {
      disconnect();
    }
  };

  /**
   * Authenticate with wallet address. This is called automatically when wallet is connected.
   */
  const authenticateWithWallet = async (walletAddress: string): Promise<boolean> => {
    try {
      // If we're already in the process of authentication, don't start again
      if (isLoading || challengeMessage || showRegistrationForm) {
        console.log('Authentication already in progress');
        return false;
      }
      
      // Clear any previous state
      setIsLoading(true);
      setApiError(null);
      setChallengeMessage(null);
      
      // First, check if we already have a token
      if (walletAuthService.hasAccessToken()) {
        console.log('Already have access token, using it');
        setIsAuthenticated(true);
        setToken(walletAuthService.getAccessToken());
        fetchUserInfo();
        return true;
      }
      
      console.log('Starting authentication process for wallet:', walletAddress);
      
      // Check if a user with this wallet exists
      const userExists = await walletAuthService.checkUserExists(walletAddress);
      
      if (!userExists) {
        // User doesn't exist, show registration form
        console.log('User does not exist, showing registration form');
        setPendingWalletAddress(walletAddress);
        setShowRegistrationForm(true);
        return false;
      }
      
      // User exists, request a challenge to sign
      console.log('Requesting wallet challenge...');
      const challenge = await walletAuthService.requestChallenge(walletAddress);
      
      if (!challenge) {
        throw new Error('Failed to get challenge message');
      }
      
      // Set the challenge to trigger the signature process
      console.log('Challenge received, signature required:', challenge);
      setChallengeMessage(challenge);
      
      // Return false since we're not authenticated yet (waiting for signature)
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle error
      let errorMessage = 'Authentication failed';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setApiError(errorMessage);
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the handleLogout function to prevent dependency issues
  const handleLogout = React.useCallback(async () => {
    try {
      // Call API logout if we have a token
      if (walletAuthService.getAccessToken()) {
        // Call the logout API endpoint
        try {
          await walletAuthService.logout();
          console.log('Successfully logged out from DAO API');
        } catch (error) {
          console.error('Error logging out from API:', error);
        }
      }
      
      // Clear local auth state
      walletAuthService.clearAccessToken();
      userService.clearUserCache(); // Clear user cache
      setIsAuthenticated(false);
      setToken(null);
      setChallengeMessage(null);
      setApiError(null);
      setUserInfo(null); // Clear user info
      localStorage.removeItem('authenticatedWalletAddress');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, []);
  
  // Handle wallet connection changes
  const handleWalletConnection = async () => {
    if (connected && publicKey) {
      const currentWalletAddress = publicKey.toString();
      console.log(`Connected with wallet: ${currentWalletAddress}`);
      
      // Get the authenticated wallet address (only stored after successful authentication)
      const authenticatedWalletAddress = localStorage.getItem('authenticatedWalletAddress');
      console.log('Authenticated wallet address:', authenticatedWalletAddress);
      
      // Check if we have a token
      if (walletAuthService.hasAccessToken()) {
        // We have a token, check if the current wallet matches the authenticated wallet
        if (authenticatedWalletAddress && authenticatedWalletAddress !== currentWalletAddress) {
          console.log('Wallet address mismatch! Connected:', currentWalletAddress, 'Authenticated wallet:', authenticatedWalletAddress);
          console.log('Logging out current user and authenticating with new wallet...');

          // First logout the current user
          await logout();
          // Immediately clear user info to prevent showing previous user's data
          setUserInfo(null);
          
          // Then authenticate with the new wallet address
          await authenticateWithWallet(currentWalletAddress);
        } else if (!isAuthenticated) {
          console.log('Found access token, setting authenticated state');
          setIsAuthenticated(true);
          setToken(walletAuthService.getAccessToken());
          await fetchUserInfo();
        }
      } else {
        // No token, automatically start authentication process
        console.log('No token found but wallet connected. Starting authentication process.');
        // Automatically authenticate on wallet connection
        await authenticateWithWallet(currentWalletAddress);
      }
    } else if (!connected) {
      // If wallet is disconnected, clear wallet address
      // If we were authenticated, log out
      if (isAuthenticated) {
        console.log('Wallet disconnected, logging out');
        logout();
      }
    }
  };

  // Update the main logout function to clear the stored authenticated wallet address
  const logout = async () => {
    try {
      // Clear authentication state
      setIsAuthenticated(false);
      setToken(null);
      setUserInfo(null);
      setShowRegistrationForm(false);
      setChallengeMessage(null);
      setApiError(null);
      
      // Clear localStorage and service data
      walletAuthService.clearAccessToken();
      userService.clearUserCache(); // Clear user cache on logout
      localStorage.removeItem('authenticatedWalletAddress');

      // Call logout on the auth service
      await walletAuthService.logout();
      
      console.log('Logged out successfully');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{
        isAuthenticated,
        authenticateWithWallet,
        logout,
        token,
        isLoading,
        challengeMessage,
        authError: apiError,
        userInfo,
        refreshUserInfo, // Expose the refresh method
      }}
    >
      {children}
      
      {/* Show registration form when needed */}
      {showRegistrationForm && pendingWalletAddress && (
        <UserRegistrationForm
          walletAddress={pendingWalletAddress}
          onSubmit={handleRegistrationSubmit}
          onCancel={handleRegistrationCancel}
          apiError={apiError}
          // Pre-fill with previous data if available (in case of errors)
          {...userFormData}
        />
      )}
      
      {/* Optionally show a challenge message dialog */}
      {challengeMessage && isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#252525] rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Wallet Signature Required</h2>
            <p className="text-gray-400 mb-4">
              Please sign the message with your wallet to verify ownership.
            </p>
            <div className="animate-pulse flex justify-center">
              <div className="h-10 w-10 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
            </div>
          </div>
        </div>
      )}
      
      {/* Show general error message if not in a form */}
      {apiError && !showRegistrationForm && !challengeMessage && (
        <div className="fixed bottom-4 right-4 bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{apiError}</p>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 