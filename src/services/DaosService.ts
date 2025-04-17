/**
 * DAOs Service
 * Handles all API interactions related to DAOs
 */

import { createConfiguration, DaosApi, DAO, DAOUpdate, DAOMembership, InputCreateDAO } from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';
import { fileToMinioStorage } from '../utils/fileUtils';

// Default API endpoint - now using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * DaosService handles DAO data operations
 */
export class DaosService {
  private apiEndpoint: string;
  private daosApi: DaosApi;

  constructor(apiEndpoint: string = DEFAULT_API_ENDPOINT) {
    this.apiEndpoint = apiEndpoint;
    
    // Create configuration for the API with custom base URL
    const serverConfig = new ServerConfiguration(this.apiEndpoint, {});
    const configuration = createConfiguration({
      baseServer: serverConfig
    });
    
    // Initialize API client
    this.daosApi = new DaosApi(configuration);
  }

  /**
   * Create an authenticated API client with the current token
   * @private
   */
  private createAuthenticatedApiClient(): DaosApi | null {
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
    return new DaosApi(configuration);
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
    this.daosApi = new DaosApi(configuration);
  }

  /**
   * Get all DAOs
   */
  async getAllDaos(): Promise<DAO[]> {
    try {
      const response = await this.daosApi.getAllDAOs();
      return response || [];
    } catch (error) {
      console.error('Error getting all DAOs (public):', error);
      return [];
    }
  }

  /**
   * Get a DAO by ID
   */
  async getDaoById(daoId: string): Promise<DAO | null> {
    try {
      const response = await this.daosApi.getDAOById(daoId);
      return response || null;
    } catch (error) {
      console.error(`Error getting DAO with ID ${daoId} :`, error);
      return null;
    }
  }

  /**
   * Get members of a DAO
   */
  async getDaoMembers(daoId: string) {
    try {
      const dao = await this.getDaoById(daoId);
      return dao?.members || [];
    } catch (error) {
      console.error(`Error getting members of DAO ${daoId}:`, error);
      return [];
    }
  }

  /**
   * Create a new DAO
   */
  async createDao(daoData: {
    name: string;
    description?: string;
    userId: string;
    treasury?: string;
    discordServer?: string;
    twitter?: string;
    telegram?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
    profilePicture?: File;
    bannerPicture?: File;
  }): Promise<DAO | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const daoInput = new InputCreateDAO();
      daoInput.name = daoData.name;
      daoInput.description = daoData.description?.trim() || '';
      daoInput.ownerId = daoData.userId;
      daoInput.treasury = daoData.treasury;
      daoInput.discordServer = daoData.discordServer;
      daoInput.twitter = daoData.twitter;
      daoInput.telegram = daoData.telegram;
      daoInput.instagram = daoData.instagram;
      daoInput.tiktok = daoData.tiktok;
      daoInput.website = daoData.website;
      
      // Convert File objects to FileStorage objects for Minio
      if (daoData.profilePicture != undefined) {
        daoInput.profile = await fileToMinioStorage(daoData.profilePicture);
      }

      const response = await apiClient.createDAO(daoInput);
      console.log('DAO creation response:', response);
      return response.dao || null;
    } catch (error) {
      console.error('Error creating DAO:', error);
      return null;
    }
  }

  /**
   * Update a DAO by ID
   */
  async updateDao(daoId: string, daoData: {
    description?: string;
    name?: string;
    isActive?: boolean;
    treasury?: string;
    discordServer?: string;
    twitter?: string;
    telegram?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
    profilePicture?: File;
    bannerPicture?: File;
  }): Promise<DAO | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const daoUpdate = new DAOUpdate();
      
      // Required fields
      if (daoData.name !== undefined) daoUpdate.name = daoData.name;
      if (daoData.description !== undefined) daoUpdate.description = daoData.description;
      if (daoData.isActive !== undefined) daoUpdate.isActive = daoData.isActive;

      daoUpdate.treasury = daoData.treasury;
      daoUpdate.discordServer = daoData.discordServer;
      daoUpdate.twitter = daoData.twitter;
      daoUpdate.telegram = daoData.telegram;
      daoUpdate.instagram = daoData.instagram;
      daoUpdate.tiktok = daoData.tiktok;
      daoUpdate.website = daoData.website;
      
      // Process image fields if provided
      if (daoData.profilePicture) {
        daoUpdate.profile = await fileToMinioStorage(daoData.profilePicture);
      }

      const response = await apiClient.updateDAO(daoId, daoUpdate);
      return response?.dao || null;
    } catch (error) {
      console.error(`Error updating DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Add a member to a DAO
   */
  async addMemberToDao(daoId: string, userId: string): Promise<string | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.addMemberToDAO(daoId);
      return response.action || null;
    } catch (error) {
      console.error(`Error adding member to DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Remove a member from a DAO
   */
  async removeMemberFromDao(daoId: string, userId: string): Promise<DAO | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const membership = new DAOMembership();
      membership.userId = userId;
      // Note: userWhoMadeRequest is handled by the server

      const response = await apiClient.removeMemberFromDAO(daoId, membership);
      return response?.dao || null;
    } catch (error) {
      console.error(`Error removing member from DAO ${daoId}:`, error);
      return null;
    }
  }
}

// Create a singleton instance
export const daosService = new DaosService();

// Export default for convenience
export default daosService; 