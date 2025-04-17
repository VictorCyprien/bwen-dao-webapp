/**
 * API Key Service
 * Handles all API interactions related to API keys (devices)
 */

import { 
  createConfiguration, 
  ApiKeysApi, 
  CreateDeviceRequest, 
  CreateDeviceResponse, 
  DeleteDeviceResponse,
  DeviceList
} from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';

// Default API endpoint - now using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * ApiKeyService handles API key operations
 */
export class ApiKeyService {
  private apiEndpoint: string;
  private apiKeysApi: ApiKeysApi;
  private apiKeysCache: { data: DeviceList; timestamp: number } | null = null;
  private readonly CACHE_EXPIRY_MS = 60000; // Cache for 1 minute

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API client
    this.apiKeysApi = new ApiKeysApi(configuration);
  }

  /**
   * Create an authenticated API client with the current token
   * @private
   */
  private createAuthenticatedApiClient(): ApiKeysApi | null {
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
    return new ApiKeysApi(configuration);
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
    this.apiKeysApi = new ApiKeysApi(configuration);
  }

  /**
   * Get all API keys for the authenticated user
   */
  async getApiKeys(): Promise<DeviceList | null> {
    try {
      // Return cached data if available and not expired
      if (this.apiKeysCache && (Date.now() - this.apiKeysCache.timestamp < this.CACHE_EXPIRY_MS)) {
        console.log('Returning cached API keys data (cached for 1 minute)');
        return this.apiKeysCache.data;
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getAPIKeys();
      
      // Cache the response
      this.apiKeysCache = {
        data: response,
        timestamp: Date.now()
      };
      
      return response;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return null;
    }
  }

  /**
   * Create a new API key
   */
  async createApiKey(name: string): Promise<CreateDeviceResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const request = new CreateDeviceRequest();
      request.deviceName = name;

      const response = await apiClient.createAPIKey(request);
      
      // Invalidate cache
      this.apiKeysCache = null;
      
      return response;
    } catch (error) {
      console.error('Error creating API key:', error);
      return null;
    }
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(deviceId: string): Promise<DeleteDeviceResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.apikeysDeviceIdDelete(deviceId);
      
      // Invalidate cache
      this.apiKeysCache = null;
      
      return response;
    } catch (error) {
      console.error(`Error deleting API key with ID ${deviceId}:`, error);
      return null;
    }
  }

  /**
   * Clear the API keys cache
   */
  clearApiKeysCache(): void {
    this.apiKeysCache = null;
  }
}

// Create a singleton instance
export const apiKeyService = new ApiKeyService();

// Export default for convenience
export default apiKeyService; 