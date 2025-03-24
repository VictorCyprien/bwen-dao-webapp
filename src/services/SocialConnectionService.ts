/**
 * Social Connection Service
 * Handles all API interactions related to connecting social media accounts
 */

import { 
  createConfiguration, 
  DiscordOauthApi, 
  TwitterOauthApi, 
  TelegramAuthApi,
  TelegramAuth
} from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';

// Default API endpoint - using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * SocialConnectionService handles operations related to social media connections
 */
export class SocialConnectionService {
  private apiEndpoint: string;

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
  }

  /**
   * Create an authenticated API client with the current token
   * @private
   */
  private createClient<T>(api: new (config: any) => T): T | null {
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
            if (token) {
              context.setHeaderParam('Authorization', `Bearer ${token}`);
            }
          }
        }
      }
    });

    // Return a new API client instance with the token
    return new api(configuration);
  }

  /**
   * Connect Discord account
   */
  async connectDiscord(): Promise<void> {
    try {
      const discordClient = this.createClient(DiscordOauthApi);
      if (!discordClient) {
        throw new Error('Unable to create authenticated Discord client');
      }
      
      // Call the updated SDK method that now returns the OAuth URL
      const response = await discordClient.connectDiscord();
      console.log(response);
      
      // Redirect the user to the authorization URL
      if (response && response.authUrl) {
        window.location.href = response.authUrl;
      } else {
        throw new Error('Discord OAuth URL not received from API');
      }
      
    } catch (error) {
      console.error('Error connecting Discord:', error);
      throw new Error('Error connecting Discord. Please try again later.');
    }
  }

  /**
   * Connect Twitter account
   */
  async connectTwitter(): Promise<void> {
    try {
      const twitterClient = this.createClient(TwitterOauthApi);
      if (!twitterClient) {
        throw new Error('Unable to create authenticated Twitter client');
      }
      
      // The SDK will handle the redirect to Twitter's OAuth URL
      const response = await twitterClient.connectTwitter();
      console.log(response);

      // Redirect the user to the authorization URL
      if (response && response.authUrl) {
        window.location.href = response.authUrl;
      } else {
        throw new Error('Twitter OAuth URL not received from API');
      }
      
    } catch (error) {
      console.error('Error connecting Twitter:', error);
      throw new Error('Error connecting Twitter. Please try again later.');
    }
  }

  /**
   * Connect Telegram account
   * 
   * Note: Telegram uses a different authentication flow compared to Discord and Twitter.
   * Instead of OAuth, it uses a widget-based approach where:
   * 1. User is redirected to a page with the Telegram widget
   * 2. User authenticates with Telegram through the widget
   * 3. The widget provides authentication data that is sent back to our API
   */
  connectTelegram(): void {
    try {
      // Create the client to ensure we have valid authentication
      this.createClient(TelegramAuthApi);
      
      // Redirect to the page with the Telegram widget
      window.location.href = '/api/auth/telegram/widget';
    } catch (error) {
      console.error('Error connecting Telegram:', error);
      throw new Error('Error connecting Telegram. Please try again later.');
    }
  }

  /**
   * Handle Telegram authentication data received from the Telegram Login Widget
   * @param authData Telegram authentication data
   */
  async handleTelegramAuth(authData: {
    id: number;
    first_name: string;
    last_name: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }): Promise<void> {
    try {
      const telegramClient = this.createClient(TelegramAuthApi);
      if (!telegramClient) {
        throw new Error('Unable to create authenticated Telegram client');
      }
      
      // Create a TelegramAuth object from the auth data
      const telegramAuth = new TelegramAuth();
      telegramAuth.id = authData.id;
      telegramAuth.firstName = authData.first_name;
      telegramAuth.lastName = authData.last_name;
      telegramAuth.username = authData.username || '';
      telegramAuth.photoUrl = authData.photo_url;
      telegramAuth.authDate = authData.auth_date;
      telegramAuth.hash = authData.hash;
      
      // Send the authentication data to the backend
      const response = await telegramClient.telegramCallback(telegramAuth);
      console.log('Telegram connection response:', response);
      
      if (!response) {
        throw new Error('Failed to connect Telegram account');
      }
      
    } catch (error) {
      console.error('Error handling Telegram authentication:', error);
      throw new Error('Error connecting Telegram account. Please try again later.');
    }
  }
}

// Create a singleton instance
export const socialConnectionService = new SocialConnectionService();

// Export default for convenience
export default socialConnectionService; 