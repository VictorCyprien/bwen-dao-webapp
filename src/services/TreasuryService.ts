/**
 * Treasury Service
 * Handles all API interactions related to treasury, tokens, and transactions
 */

import { 
  createConfiguration, 
  TreasuryApi,
  Treasury,
  Token,
  Transfer,
  TransferCreate,
  TransferSchemaResponse
} from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';

// Default API endpoint - using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * TreasuryService handles treasury data operations
 */
export class TreasuryService {
  private apiEndpoint: string;
  private treasuryApi: TreasuryApi;

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API client
    this.treasuryApi = new TreasuryApi(configuration);
  }

  /**
   * Create an authenticated API client with the current token
   * @private
   */
  private createAuthenticatedApiClient(): TreasuryApi | null {
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
    return new TreasuryApi(configuration);
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
    this.treasuryApi = new TreasuryApi(configuration);
  }

  /**
   * Get treasury information for a specific DAO
   */
  async getTreasury(daoId: string): Promise<Treasury | null> {
    try {
      const response = await this.treasuryApi.getDAOTreasury(daoId);
      return response || null;
    } catch (error) {
      console.error(`Error getting treasury for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all tokens for a specific DAO
   */
  async getTokens(daoId: string): Promise<Token[]> {
    try {
      const response = await this.treasuryApi.getDAOTokens(daoId);
      return response || [];
    } catch (error) {
      console.error(`Error getting tokens for DAO ${daoId}:`, error);
      return [];
    }
  }

  /**
   * Get all transfers for a specific DAO
   */
  async getTransfers(daoId: string): Promise<Transfer[]> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return [];

      const response = await apiClient.getDAOTransfers(daoId);
      return response || [];
    } catch (error) {
      console.error(`Error getting transfers for DAO ${daoId}:`, error);
      return [];
    }
  }

  /**
   * Create a new transfer for a specific DAO
   */
  async createTransfer(daoId: string, transferData: {
    tokenId: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
  }): Promise<TransferSchemaResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const transfer = new TransferCreate();
      transfer.daoId = daoId;
      transfer.tokenId = transferData.tokenId;
      transfer.fromAddress = transferData.fromAddress;
      transfer.toAddress = transferData.toAddress;
      transfer.amount = transferData.amount;
      transfer.timestamp = new Date();

      const response = await apiClient.createDAOTransfer(daoId, transfer);
      return response || null;
    } catch (error) {
      console.error(`Error creating transfer in DAO ${daoId}:`, error);
      return null;
    }
  }
}

// Create a singleton instance
export const treasuryService = new TreasuryService();

// Export default for convenience
export default treasuryService; 