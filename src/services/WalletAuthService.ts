/**
 * Wallet Authentication Service
 * Uses the DAO-API SDK to authenticate users with wallet addresses
 */

import { createConfiguration, AuthApi, UsersApi, InputCreateUser, ChallengeRequest, VerifySignature } from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { userService } from '../services/UserService';
import { fileToMinioStorage } from '../utils/fileUtils';
// Default API endpoint - now using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * WalletAuthService handles authentication using wallet addresses
 */
export class WalletAuthService {
  private apiEndpoint: string;
  private authApi: AuthApi;
  private usersApi: UsersApi;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API clients
    this.authApi = new AuthApi(configuration);
    this.usersApi = new UsersApi(configuration);
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
    
    // Reinitialize API clients
    this.authApi = new AuthApi(configuration);
    this.usersApi = new UsersApi(configuration);
  }

  /**
   * Check if a user with the given wallet address exists
   */
  async checkUserExists(walletAddress: string): Promise<boolean> {
    try {
      const response = await this.usersApi.getUserWithWalletAddress(walletAddress);
      return (response as any)?.exists || false;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Request a challenge message from the server for wallet authentication
   */
  async requestChallenge(walletAddress: string): Promise<string | null> {
    try {
      // Create the request object using the SDK model
      const challengeRequest = new ChallengeRequest();
      challengeRequest.walletAddress = walletAddress;
      
      // Call the SDK method for getting a wallet challenge
      const response = await this.authApi.getWalletChallenge(challengeRequest);
      
      // Extract the challenge message from the response
      // ChallengeResponse has a 'message' field
      return response.message || null;
    } catch (error) {
      console.error('Error requesting challenge:', error);
      
      // Extract and return more detailed error information
      if (error instanceof Error) {
        console.error('Challenge request error details:', error.message);
      }
      
      return null;
    }
  }

  /**
   * Verify a signed message and get an access token
   */
  async verifySignature(walletAddress: string, signature: string, message: string): Promise<{token: string | null, refreshToken: string | null, user?: any}> {
    try {
      // Create the verify signature request object using the SDK model
      const verifyRequest = new VerifySignature();
      verifyRequest.walletAddress = walletAddress;
      verifyRequest.signature = signature;
      
      // API expects a "challenge" field, but the model doesn't include it
      // Cast to any to add the field manually
      (verifyRequest as any).challenge = message;
      
      console.log('Verification request payload:', verifyRequest);
      
      // Call the SDK method to verify the wallet signature
      const response = await this.authApi.verifyWalletSignature(verifyRequest);
      
      // Extract the tokens from the response
      const token = response.token;
      const refreshToken = response.refreshToken || null ;
      
      if (token) {
        this.setTokens(token, refreshToken);
        
        // Log full response for debugging
        console.log('Authentication response:', response);
      }
      
      // Return tokens and user info if available
      return { 
        token: token || null,
        refreshToken: refreshToken || null,
        user: (response as any).user || { walletAddress } // Use type assertion for potentially missing properties
      };
    } catch (error) {
      console.error('Error verifying signature:', error);
      return { token: null, refreshToken: null };
    }
  }

  /**
   * Set the access token and refresh token after login
   */
  setTokens(token: string, refreshToken: string | null): void {
    this.accessToken = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('daoAccessToken', token);
    
    if (refreshToken) {
      localStorage.setItem('daoRefreshToken', refreshToken);
    }
  }

  /**
   * Get the stored access token
   */
  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('daoAccessToken');
    }
    return this.accessToken;
  }

  /**
   * Get the stored refresh token
   */
  getRefreshToken(): string | null {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem('daoRefreshToken');
    }
    return this.refreshToken;
  }

  /**
   * Clear all tokens (logout)
   */
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('daoAccessToken');
    localStorage.removeItem('daoRefreshToken');
  }

  /**
   * Check if an access token exists without validating it with the API
   */
  hasAccessToken(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      console.error('No refresh token available');
      return false;
    }
    
    try {
      // Create a configuration with the refresh token in the authorization header
      const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
      const configuration = createConfiguration({
        baseServer: serverConfig,
        authMethods: {
          default: {
            getName: () => 'Bearer',
            applySecurityAuthentication: (context: any) => {
              context.setHeaderParam('Authorization', `Bearer ${refreshToken}`);
            }
          }
        }
      });
      
      // Create temporary API with the refresh token auth
      const tempAuthApi = new AuthApi(configuration);
      
      // Call the refreshAccessToken method
      const response = await tempAuthApi.refreshAccessToken();
      
      // Extract tokens from response
      const newAccessToken = response.token;
      const newRefreshToken = response.refreshToken || null;
      
      if (newAccessToken) {
        this.setTokens(newAccessToken, newRefreshToken || refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      
      // If refresh fails, clear tokens as they might be expired/invalid
      this.clearTokens();
      return false;
    }
  }

  /**
   * Check if the current token is valid, attempting a refresh if needed
   */
  async validateToken(): Promise<boolean> {
    // First check if a token exists
    if (!this.hasAccessToken()) {
      return false;
    }
    
    try {
      // We need to validate the token by making a request to a protected endpoint
      // For now we'll use the /auth/me endpoint if available, or just check if we have a refresh token
      if (this.getRefreshToken()) {
        // We have both an access token and a refresh token, so we're good
        return true;
      } else {
        // Try to refresh the token
        return this.refreshAccessToken();
      }
    } catch (error) {
      // If validation fails, try to refresh the token
      console.log('Token validation failed, attempting to refresh');
      return this.refreshAccessToken();
    }
  }

  /**
   * Begin the wallet authentication process
   * Note: This method doesn't handle the actual signing, as that must be done
   * by the wallet interface. It's expected that the signature is provided.
   */
  async authenticateWithWallet(
    walletAddress: string,
    signature?: string,
    message?: string,
    userInfo?: {
      username?: string;
      email?: string;
      memberName?: string;
      discordUsername?: string;
      twitterUsername?: string;
      telegramUsername?: string;
    }
  ): Promise<{ 
    success: boolean; 
    newUser: boolean; 
    challenge?: string;
    requiresSignature: boolean;
    error?: string;
    user?: any;
    token?: string;
    refreshToken?: string;
  }> {
    // If we already have a token, validate or refresh it
    if (this.hasAccessToken()) {
      const isValid = await this.validateToken();
      if (isValid) {
        console.log('Access token is valid or was refreshed successfully');
        return {
          success: true,
          newUser: false,
          requiresSignature: false,
          token: this.getAccessToken() || undefined,
          refreshToken: this.getRefreshToken() || undefined
        };
      }
      // If token validation/refresh failed, continue with the authentication flow
    }
    
    try {
      console.log(`Authenticating with wallet address: ${walletAddress}`);
      
      // If signature and message are provided, we're in the verification step
      if (signature && message) {
        const result = await this.verifySignature(walletAddress, signature, message);
        console.log('Authentication response:', result);
        return { 
          success: !!result.token, 
          newUser: false,
          requiresSignature: false,
          error: result.token ? undefined : 'Failed to verify signature',
          user: result.user,
          token: result.token || undefined, // Convert null to undefined
          refreshToken: result.refreshToken || undefined
        };
      }
      
      // Otherwise, we're in the initial authentication step - check if user exists
      const userExists = await this.checkUserExists(walletAddress);
      
      if (!userExists) {
        // User doesn't exist, need registration info
        return { 
          success: false, 
          newUser: true,
          requiresSignature: false
        };
      }
      
      // User exists, get a challenge for them to sign
      const challenge = await this.requestChallenge(walletAddress);
      
      if (!challenge) {
        return { 
          success: false, 
          newUser: false,
          requiresSignature: false,
          error: 'Failed to get challenge message'
        };
      }
      
      // Return the challenge for signing
      return { 
        success: false, 
        newUser: false,
        challenge,
        requiresSignature: true
      };
    } catch (error) {
      console.error('Authentication flow error:', error);
      return { 
        success: false, 
        newUser: false,
        requiresSignature: false,
        error: error instanceof Error ? error.message : 'Unknown authentication error'
      };
    }
  }

  /**
   * Log out the user from the API
   */
  async logout(): Promise<boolean> {
    try {
      // Only attempt to logout if we have an access token
      if (this.accessToken) {
        await this.authApi.logout();
        this.clearTokens();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error logging out:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const walletAuthService = new WalletAuthService();

// Export default for convenience
export default walletAuthService; 