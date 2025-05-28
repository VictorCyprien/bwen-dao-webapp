/**
 * DAOs Service
 * Handles all API interactions related to DAOs
 */

import { createConfiguration, DaosApi, DAO, DAOUpdate, DAOMembership, InputCreateDAO, UserDAOOwnershipResponse, InputInitDAO, DAOModule, DAOModulesList, DAOModuleResponse, InputCreateGovernance, DAOInvitation, DAOInvitationResponse, DAOInvitationAction, DAOInvitationList, FeaturedToggle, FeaturedResponse, DAOApplicationList, DAOApplicationResponse, DAOApplication, DAOApplicationAction } from '../core/modules/dao-api';
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
  // Add cache for DAOs with expiration
  private daosCache: Map<string, { data: DAO; timestamp: number }> = new Map();
  // Add cache for DAO applications
  private applicationsCache: Map<string, { data: DAOApplicationList; timestamp: number }> = new Map();
  private readonly CACHE_EXPIRY_MS = 60000; // Cache for 1 minute

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
      // Check cache first
      const cacheKey = `dao-${daoId}`;
      if (this.daosCache.has(cacheKey)) {
        const cached = this.daosCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached DAO data');
          return cached.data;
        }
      }

      // Not in cache or expired, fetch from API
      const response = await this.daosApi.getDAOById(daoId);
      
      // Cache the response if it exists
      if (response) {
        this.daosCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }
      
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
   * Get the blockchain address (pubkey) for a DAO
   * @param daoId The database ID of the DAO
   * @returns The Solana account public key for the DAO, or null if not found
   */
  async getDaoBlockchainAddress(daoId: string): Promise<string | null> {
    try {
      const dao = await this.getDaoById(daoId);
      // Access the pubkey field from the DAO object
      return dao?.pubkey || null;
    } catch (error) {
      console.error(`Error getting blockchain address for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get the token address for a DAO
   * @param daoId The database ID of the DAO
   * @returns The token address for the DAO, or null if not found
   */
  async getDaoTokenAddress(daoId: string): Promise<string | null> {
    try {
      const dao = await this.getDaoById(daoId);
      // Access the tokenAddress field from the DAO object
      return dao?.tokenAddress || null;
    } catch (error) {
      console.error(`Error getting token address for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Initialize DAO creation (Step 1)
   * This creates an initial DAO record with just the blockchain transaction details
   * @param pubkey The public key of the DAO (from Solana)
   * @param transaction The transaction signature
   * @returns The initialization response or null if there was an error
   */
  async initializeDAOCreation(pubkey: string, transaction: string): Promise<any | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Create the request payload
      const inputInitDAO = new InputInitDAO();
      inputInitDAO.pubkey = pubkey;
      inputInitDAO.transaction = transaction;

      const response = await apiClient.initializeDAOCreation(inputInitDAO);
      console.log('DAO initialization response:', response);
      return response || null;
    } catch (error) {
      console.error('Error initializing DAO creation:', error);
      return null;
    }
  }

  /**
   * Create a new DAO
   */
  async createDao(daoData: {
    name: string;
    description?: string;
    userId: string;
    discordServer?: string;
    twitter?: string;
    telegram?: string;
    instagram?: string;
    tiktok?: string;
    website?: string;
    profilePicture?: File;
    bannerPicture?: File;
    tokenAddress?: string; // Token address
  }): Promise<DAO | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const daoInput = new InputCreateDAO();
      daoInput.name = daoData.name;
      daoInput.description = daoData.description?.trim() || '';
      daoInput.discordServer = daoData.discordServer?.trim() ? daoData.discordServer : undefined;
      daoInput.twitter = daoData.twitter?.trim() ? daoData.twitter : undefined;
      daoInput.telegram = daoData.telegram?.trim() ? daoData.telegram : undefined;
      daoInput.instagram = daoData.instagram?.trim() ? daoData.instagram : undefined;
      daoInput.tiktok = daoData.tiktok?.trim() ? daoData.tiktok : undefined;
      daoInput.website = daoData.website?.trim() ? daoData.website : undefined;
      daoInput.tokenAddress = daoData.tokenAddress || '';
      
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
      daoUpdate.discordServer = daoData.discordServer?.trim() ? daoData.discordServer : undefined;
      daoUpdate.twitter = daoData.twitter?.trim() ? daoData.twitter : undefined;
      daoUpdate.telegram = daoData.telegram?.trim() ? daoData.telegram : undefined;
      daoUpdate.instagram = daoData.instagram?.trim() ? daoData.instagram : undefined;
      daoUpdate.tiktok = daoData.tiktok?.trim() ? daoData.tiktok : undefined;
      daoUpdate.website = daoData.website?.trim() ? daoData.website : undefined;
      
      // Process image fields if provided
      if (daoData.profilePicture) {
        daoUpdate.profile = await fileToMinioStorage(daoData.profilePicture);
      }

      const response = await apiClient.updateDAO(daoId, daoUpdate);
      
      // Clear the DAO cache after update
      this.clearDaoCache(daoId);
      
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
      
      // Clear the DAO cache after adding a member
      this.clearDaoCache(daoId);
      
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
      
      // Clear the DAO cache after removing a member
      this.clearDaoCache(daoId);
      
      return response?.dao || null;
    } catch (error) {
      console.error(`Error removing member from DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Check if the authenticated user owns a DAO
   * @returns A boolean indicating whether the user owns a DAO
   */
  async checkUserDaoOwnership(): Promise<boolean> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return false;

      const response: UserDAOOwnershipResponse = await apiClient.checkUserDAOOwnership();
      return response?.hasDao || false;
    } catch (error) {
      console.error('Error checking if user owns a DAO:', error);
      return false;
    }
  }

  /**
   * Check if the DAO initialization has already been done (Step 1)
   * This checks if the user has already created and stored a blockchain transaction
   * @returns A boolean indicating whether the DAO has been initialized or not
   */
  async checkDAOInitialization(): Promise<boolean> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return false;

      // Call the API to check if the DAO has been initialized
      const response = await apiClient.checkDAOInitialization();
      console.log('DAO initialization check response:', response);
      
      // The API returns a response with a status field
      // If status is "found", return true, otherwise false
      return !!response && response.status === "found";
    } catch (error) {
      console.error('Error checking DAO initialization:', error);
      return false;
    }
  }

  /**
   * Get all modules enabled for a DAO
   */
  async getDAOModules(daoId: string): Promise<DAOModulesList | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOModules(daoId);
      return response || null;
    } catch (error) {
      console.error(`Error getting modules for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Add a module to a DAO
   * @param daoId The ID of the DAO
   * @param moduleData The module data (module name/type)
   * @returns The module response or null if there was an error
   */
  async addDAOModule(daoId: string, moduleData: {
    module: string;
    pubkey?: string;
    transaction?: string;
  }): Promise<DAOModuleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Create a proper DAOModule object
      const daoModule = new DAOModule();
      daoModule.module = moduleData.module;
      
      // Include transaction data if provided - may be required in the future
      if (moduleData.pubkey && moduleData.transaction) {
        // Add these properties if the API is updated to require them
        // Currently these will be ignored by the API
        (daoModule as any).pubkey = moduleData.pubkey;
        (daoModule as any).transaction = moduleData.transaction;
      }

      const response = await apiClient.addDAOModule(daoId, daoModule);
      
      // Clear the DAO cache after adding a module
      this.clearDaoCache(daoId);
      
      return response || null;
    } catch (error) {
      console.error(`Error adding module to DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Remove a module from a DAO
   * @param daoId The ID of the DAO
   * @param moduleData The module data (module name/type)
   * @returns The module response or null if there was an error
   */
  async removeDAOModule(daoId: string, moduleData: {
    module: string;
    pubkey?: string;
    transaction?: string;
  }): Promise<DAOModuleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Create a proper DAOModule object
      const daoModule = new DAOModule();
      daoModule.module = moduleData.module;
      
      // Include transaction data if provided - may be required in the future
      if (moduleData.pubkey && moduleData.transaction) {
        // Add these properties if the API is updated to require them
        // Currently these will be ignored by the API
        (daoModule as any).pubkey = moduleData.pubkey;
        (daoModule as any).transaction = moduleData.transaction;
      }

      const response = await apiClient.removeDAOModule(daoId, daoModule);
      
      // Clear the DAO cache after removing a module
      this.clearDaoCache(daoId);
      
      return response || null;
    } catch (error) {
      console.error(`Error removing module from DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Initialize DAO governance model
   * @param daoId The ID of the DAO
   * @param governanceData The governance model data
   * @returns The initialization response or null if there was an error
   */
  async initializeDAOGovernance(
    daoId: string,
    governanceData: {
      governanceModel: number;
      votingPowerSystem: string;
      councilEntryCondition?: string;
      councilEntryThreshold?: number;
      daoEntryCondition: string;
      daoEntryThreshold?: number;
      quorumPercentage: number;
    }
  ): Promise<any | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Create the request payload
      const inputCreateGovernance = new InputCreateGovernance();
      inputCreateGovernance.governanceModel = governanceData.governanceModel;
      inputCreateGovernance.votingPowerSystem = governanceData.votingPowerSystem as any;
      
      if (governanceData.councilEntryCondition) {
        inputCreateGovernance.councilEntryCondition = governanceData.councilEntryCondition as any;
      }
      
      if (governanceData.councilEntryThreshold !== undefined) {
        inputCreateGovernance.councilEntryThreshold = governanceData.councilEntryThreshold;
      }
      
      inputCreateGovernance.daoEntryCondition = governanceData.daoEntryCondition as any;
      
      if (governanceData.daoEntryThreshold !== undefined) {
        inputCreateGovernance.daoEntryThreshold = governanceData.daoEntryThreshold;
      }
      
      inputCreateGovernance.quorumPercentage = governanceData.quorumPercentage;

      const response = await apiClient.initializeDAOGovernance(daoId, inputCreateGovernance);
      console.log('DAO governance initialization response:', response);
      return response || null;
    } catch (error) {
      console.error('Error initializing DAO governance:', error);
      return null;
    }
  }

  /**
   * Invite a user to join a DAO
   * @param daoId The ID of the DAO
   * @param userId The ID of the user to invite
   * @param expiresInDays Optional number of days before the invitation expires
   * @returns The invitation response or null if there was an error
   */
  async inviteUserToDAO(daoId: string, userId: string, expiresInDays?: number): Promise<DAOInvitationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const invitation = new DAOInvitation();
      invitation.userId = userId;
      if (expiresInDays !== undefined) {
        invitation.expiresInDays = expiresInDays;
      }

      const response = await apiClient.inviteUserToDAO(daoId, invitation);
      
      // Clear DAO cache as the pending invitations list might be considered part of DAO state
      this.clearDaoCache(daoId);
      
      return response || null;
    } catch (error) {
      console.error(`Error inviting user to DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Respond to a DAO invitation (accept/decline)
   * @param daoId The ID of the DAO
   * @param invitationId The ID of the invitation
   * @param action The action to take ('accept' or 'decline')
   * @returns The invitation response or null if there was an error
   */
  async respondToDAOInvitation(daoId: string, invitationId: string, action: 'accept' | 'decline'): Promise<DAOInvitationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const invitationAction = new DAOInvitationAction();
      invitationAction.action = action;

      const response = await apiClient.respondToDAOInvitation(daoId, invitationId, invitationAction);
      
      // Clear DAO cache if invitation is accepted as it will change members
      if (action === 'accept') {
        this.clearDaoCache(daoId);
      }
      
      return response || null;
    } catch (error) {
      console.error(`Error responding to invitation ${invitationId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all invitations for a DAO
   * @param daoId The ID of the DAO
   * @returns List of invitations for the DAO or null if there was an error
   */
  async getDAOInvitations(daoId: string): Promise<DAOInvitationList | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOInvitations(daoId);
      return response || null;
    } catch (error) {
      console.error(`Error getting invitations for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get details of a specific invitation
   * @param daoId The ID of the DAO
   * @param invitationId The ID of the invitation
   * @returns The invitation details or null if there was an error
   */
  async getDAOInvitation(daoId: string, invitationId: string): Promise<DAOInvitationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOInvitation(daoId, invitationId);
      return response || null;
    } catch (error) {
      console.error(`Error getting invitation ${invitationId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Cancel/delete a DAO invitation
   * @param daoId The ID of the DAO
   * @param invitationId The ID of the invitation to cancel
   * @returns The response or null if there was an error
   */
  async cancelDAOInvitation(daoId: string, invitationId: string): Promise<DAOInvitationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.cancelDAOInvitation(daoId, invitationId);
      
      // Clear DAO cache as the pending invitations list might be considered part of DAO state
      this.clearDaoCache(daoId);
      
      return response || null;
    } catch (error) {
      console.error(`Error canceling invitation ${invitationId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get the featured status of a DAO
   * @param daoId The ID of the DAO
   * @returns The featured status response or null if there was an error
   */
  async getDAOFeaturedStatus(daoId: string): Promise<FeaturedResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOFeaturedStatus(daoId);
      return response || null;
    } catch (error) {
      console.error(`Error getting featured status for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Enable or disable the featured status of a DAO
   * @param daoId The ID of the DAO
   * @param featuredData The featured toggle data
   * @returns The featured status response or null if there was an error
   */
  async enableDAOFeatured(daoId: string, featuredData: {
    featured: boolean;
    days?: number;
    pubkey: string;
    transaction: string;
  }): Promise<FeaturedResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const featuredToggle = new FeaturedToggle();
      
      // Set required fields
      featuredToggle.pubkey = featuredData.pubkey;
      featuredToggle.transaction = featuredData.transaction;

      if (featuredData.days !== undefined) {
        featuredToggle.days = featuredData.days;
      }

      const response = await apiClient.enableDAOFeatured(daoId, featuredToggle);
      
      // Clear the DAO cache after updating featured status
      this.clearDaoCache(daoId);
      
      return response || null;
    } catch (error) {
      console.error(`Error updating featured status for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all applications for a DAO
   * @param daoId The ID of the DAO
   * @returns List of applications for the DAO or null if there was an error
   */
  async getDAOApplications(daoId: string): Promise<DAOApplicationList | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      // Check cache first
      const cacheKey = `applications-${daoId}`;
      if (this.applicationsCache.has(cacheKey)) {
        const cached = this.applicationsCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached applications data');
          return cached.data;
        }
      }

      // Not in cache or expired, fetch from API
      const response = await apiClient.getDAOApplications(daoId);
      
      // Cache the response if it exists
      if (response) {
        this.applicationsCache.set(cacheKey, {
          data: response,
          timestamp: Date.now()
        });
      }
      
      return response || null;
    } catch (error) {
      console.error(`Error getting applications for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get details of a specific application
   * @param daoId The ID of the DAO
   * @param applicationId The ID of the application
   * @returns The application details or null if there was an error
   */
  async getDAOApplication(daoId: string, applicationId: string): Promise<DAOApplicationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOApplication(daoId, applicationId);
      return response || null;
    } catch (error) {
      console.error(`Error getting application ${applicationId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Respond to a DAO application (accept/reject)
   * @param daoId The ID of the DAO
   * @param applicationId The ID of the application
   * @param action The action to take ('accept' or 'reject')
   * @param response Optional response message
   * @returns The application response or null if there was an error
   */
  async respondToDAOApplication(
    daoId: string, 
    applicationId: string, 
    action: 'accept' | 'reject',
    responseMessage?: string
  ): Promise<DAOApplicationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const applicationAction = new DAOApplicationAction();
      applicationAction.action = action;
      if (responseMessage) {
        applicationAction.response = responseMessage;
      }

      const response = await apiClient.respondToDAOApplication(daoId, applicationId, applicationAction);
      
      // Clear applications cache since the status has changed
      this.clearApplicationsCache(daoId);
      
      // Clear DAO cache if application is accepted as it will change members
      if (action === 'accept') {
        this.clearDaoCache(daoId);
      }
      
      return response || null;
    } catch (error) {
      console.error(`Error responding to application ${applicationId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Delete a DAO application
   * @param daoId The ID of the DAO
   * @param applicationId The ID of the application to delete
   * @returns The response or null if there was an error
   */
  async deleteDAOApplication(daoId: string, applicationId: string): Promise<DAOApplicationResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.deleteDAOApplication(daoId, applicationId);
      
      // Clear applications cache since an application was deleted
      this.clearApplicationsCache(daoId);
      
      return response || null;
    } catch (error) {
      console.error(`Error deleting application ${applicationId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Clear applications cache for a specific DAO or all DAOs
   */
  clearApplicationsCache(daoId?: string): void {
    if (daoId) {
      // Clear applications for specific DAO
      this.applicationsCache.delete(`applications-${daoId}`);
    } else {
      // Clear all applications
      this.applicationsCache.clear();
    }
  }

  /**
   * Clear DAO cache
   */
  clearDaoCache(daoId?: string): void {
    if (daoId) {
      // Clear specific DAO
      this.daosCache.delete(`dao-${daoId}`);
    } else {
      // Clear all DAOs
      this.daosCache.clear();
    }
  }

  /**
   * Clear all caches - should be called on logout
   */
  clearCaches(): void {
    this.daosCache.clear();
    this.applicationsCache.clear();
  }

  /**
   * Get governance model for a DAO
   * @param daoId The ID of the DAO
   * @returns The governance model or null if there was an error
   */
  async getDAOGovernance(daoId: string): Promise<any | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOGovernance(daoId);
      return response || null;
    } catch (error) {
      console.error(`Error getting governance for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Create an application to join a DAO
   * @param daoId The ID of the DAO
   * @param application The application data (message)
   * @returns The application response or null if there was an error
   */
  async applyToDAO(daoId: string, application: { message: string }): Promise<any | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.applyToDAO(daoId, application);
      return response || null;
    } catch (error) {
      console.error(`Error applying to DAO ${daoId}:`, error);
      return null;
    }
  }
}

// Create a singleton instance
export const daosService = new DaosService();

// Export default for convenience
export default daosService; 