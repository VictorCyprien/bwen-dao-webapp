/**
 * User Service
 * Handles all API interactions related to users
 */

import { 
  createConfiguration, 
  UsersApi, 
  InputUpdateUser, 
  UserResponse, 
  UserExistResponse, 
  User,
  InputCreateUser
} from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';
import { fileToMinioStorage } from '../utils/fileUtils';

// Default API endpoint - now using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * UserService handles user data operations
 */
export class UserService {
  private apiEndpoint: string;
  private usersApi: UsersApi;
  // Add cache for user data with expiration
  private userCache: { data: any; timestamp: number } | null = null;
  private readonly CACHE_EXPIRY_MS = 60000; // Cache for 1 minute

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API client
    this.usersApi = new UsersApi(configuration);
  }

  /**
   * Create an authenticated API client with the current token
   * @private
   */
  private createAuthenticatedApiClient(): UsersApi | null {
    const token = walletAuthService.getAccessToken();
    if (!token) {
      console.error('No authentication token available');
      return null;
    }

    // Create a custom configuration with the current token
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig,
      authMethods: {
        default: {
          getName: () => 'Bearer',
          applySecurityAuthentication: (context: any) => {
            context.setHeaderParam('Authorization', `Bearer ${token}`);
          }
        }
      }
    });

    // Return a new API client instance with the token
    return new UsersApi(configuration);
  }

  /**
   * Set the API endpoint and reinitialize API client
   */
  setApiEndpoint(endpoint: string): void {
    this.apiEndpoint = endpoint;
    
    // Create new configuration with updated endpoint
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Reinitialize API client
    this.usersApi = new UsersApi(configuration);
  }


  /**
   * Get a user by wallet address
   */
  async getUserByWalletAddress(walletAddress: string): Promise<UserExistResponse | null> {
    try {
      const response = await this.usersApi.getUserWithWalletAddress(walletAddress);
      return response || null;
    } catch (error) {
      console.error(`Error getting user with wallet address ${walletAddress}:`, error);
      return null;
    }
  }

  /**
   * Update a user's profile
   */
  async updateUser(userId: string, userData: {
    username?: string;
    email?: string;
    discordUsername?: string;
    memberName?: string;
    twitterUsername?: string;
    telegramUsername?: string;
    profilePicture?: File;
  }): Promise<UserResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Create the update input object
      const updateInput = new InputUpdateUser();
      
      // Only set properties that are provided
      if (userData.username !== undefined) updateInput.username = userData.username;
      if (userData.email !== undefined) updateInput.email = userData.email;
      if (userData.discordUsername !== undefined) updateInput.discordUsername = userData.discordUsername;
      if (userData.memberName !== undefined) updateInput.memberName = userData.memberName;
      if (userData.twitterUsername !== undefined) updateInput.twitterUsername = userData.twitterUsername;
      if (userData.telegramUsername !== undefined) updateInput.telegramUsername = userData.telegramUsername;
      
      // Process profile picture if provided
      if (userData.profilePicture) {
        updateInput.profilePicture = await fileToMinioStorage(userData.profilePicture);
      }
      
      console.log('updateInput', updateInput);
      console.log('userId', userId);
      const response = await apiClient.updateUser(userId, updateInput);
      return response || null;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      return null;
    }
  }

  /**
   * Get the current authenticated user using the @me endpoint
   */
  async getMe(): Promise<User | null> {
    try {
      // Return cached data if available and not expired
      if (this.userCache && (Date.now() - this.userCache.timestamp < this.CACHE_EXPIRY_MS)) {
        console.log('Returning cached user data (cached for 1 minute)');
        return this.userCache.data;
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Use the SDK's getAuthUserInfos method with proper authentication
      const response = await apiClient.getAuthUserInfos();
      
      // Cache the response
      this.userCache = {
        data: response,
        timestamp: Date.now()
      };
      
      return response;
    } catch (error) {
      console.error('Error fetching current user with getAuthUserInfos:', error);
      return null;
    }
  }

  /**
   * Create a new user with the wallet address and additional user info
   */
  async createUser(walletAddress: string, userInfo?: {
    username?: string;
    email?: string;
    memberName?: string;
    profilePicture?: File;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const userInput = new InputCreateUser();
      userInput.walletAddress = walletAddress;
      
      // Generate a username based on the wallet address if not provided
      if (userInfo?.username) {
        userInput.username = userInfo.username;
      } else {
        const shortenedWallet = walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4);
        userInput.username = `user_${shortenedWallet}`;
      }
      
      // Add optional user information if provided
      if (userInfo?.email) {
        userInput.email = userInfo.email;
      }

      // Map the additional fields to the fields in the API model
      if (userInfo?.memberName) {
        // If your API has a member_name field, map it here
        userInput.memberName = userInfo.memberName;
      }

      if (userInfo?.profilePicture) {
        userInput.profilePicture = await fileToMinioStorage(userInfo.profilePicture);
      }

      console.log('Creating user with input:', userInput);
      
      await this.usersApi.createUser(userInput);
      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error);
      
      // Extract error message from the API response if available
      let errorMessage = 'Failed to create user';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract API error message
        const anyError = error as any;
        if (anyError.body?.message) {
          errorMessage = anyError.body.message;
        } else if (anyError.message) {
          errorMessage = anyError.message;
        }
      }
      
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<any> {
    try {
      // Make sure we have an authentication token
      const token = walletAuthService.getAccessToken();
      if (!token) {
        console.error('No authentication token found. User is not logged in.');
        return null;
      }

      // Use the new @me endpoint to get current user
      const meData = await this.getMe();
      if (meData) {
        return meData;
      }

      // If @me endpoint fails, return minimal user info based on wallet address
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) {
        console.log("Falling back to minimal user object with wallet address");
        return { walletAddress };
      }

      return null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Clear the user cache - should be called on logout
   */
  clearUserCache(): void {
    this.userCache = null;
  }
}

// Create a singleton instance
export const userService = new UserService();

// Export default for convenience
export default userService; 