/**
 * Role Permission Service
 * Handles all API interactions related to roles, permissions, and governance structures
 */

import { 
  createConfiguration, 
  DaosApi, 
  RoleListResponse,
  PermissionListResponse,
  Role,
  GovernanceModelsList,
  InputCreateRole,
  RoleResponse,
  UserRoleAssignment,
  UserRoleResponse,
  RolePermissionAssignment,
  RolePermissionResponse,
  InputUpdateRole
} from '../core/modules/dao-api';
import { ServerConfiguration } from '../core/modules/dao-api/servers';
import { walletAuthService } from './WalletAuthService';

// Default API endpoint - using the proxy URL
const DEFAULT_API_ENDPOINT = '/api';

/**
 * RolePermissionService handles role and permission operations for DAOs
 */
export class RolePermissionService {
  private apiEndpoint: string;
  private daosApi: DaosApi;
  // Add cache for various data with expiration
  private rolesCache: Map<string, { data: RoleListResponse; timestamp: number }> = new Map();
  private permissionsCache: Map<string, { data: PermissionListResponse; timestamp: number }> = new Map();
  private rolePermissionsCache: Map<string, { data: PermissionListResponse; timestamp: number }> = new Map();
  private userRolesCache: Map<string, { data: RoleListResponse; timestamp: number }> = new Map();
  private userPermissionsCache: Map<string, { data: PermissionListResponse; timestamp: number }> = new Map();
  private governanceModelsCache: { data: GovernanceModelsList; timestamp: number } | null = null;
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
   * Get all roles for a specific DAO
   */
  async getDAORoles(daoId: string): Promise<RoleListResponse | null> {
    try {
      // Check cache first
      const cacheKey = `roles-${daoId}`;
      if (this.rolesCache.has(cacheKey)) {
        const cached = this.rolesCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached roles data');
          return cached.data;
        }
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAORoles(daoId);
      
      // Cache the response
      this.rolesCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching roles for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get a specific role by ID
   */
  async getDAORole(daoId: string, roleId: string): Promise<Role | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      return await apiClient.getDAORole(daoId, roleId);
    } catch (error) {
      console.error(`Error fetching role ${roleId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all permissions available for a DAO
   */
  async getDAOPermissions(daoId: string): Promise<PermissionListResponse | null> {
    try {
      // Check cache first
      const cacheKey = `permissions-${daoId}`;
      if (this.permissionsCache.has(cacheKey)) {
        const cached = this.permissionsCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached permissions data');
          return cached.data;
        }
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getDAOPermissions(daoId);
      
      // Cache the response
      this.permissionsCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching permissions for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all permissions for a specific role
   */
  async getRolePermissions(daoId: string, roleId: string): Promise<PermissionListResponse | null> {
    try {
      // Check cache first
      const cacheKey = `role-permissions-${daoId}-${roleId}`;
      if (this.rolePermissionsCache.has(cacheKey)) {
        const cached = this.rolePermissionsCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached role permissions data');
          return cached.data;
        }
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getRolePermissions(daoId, roleId);
      
      // Cache the response
      this.rolePermissionsCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching permissions for role ${roleId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get roles for a specific user in a DAO
   */
  async getUserRoles(daoId: string, userId: string): Promise<RoleListResponse | null> {
    try {
      // Check cache first
      const cacheKey = `user-roles-${daoId}-${userId}`;
      if (this.userRolesCache.has(cacheKey)) {
        const cached = this.userRolesCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached user roles data');
          return cached.data;
        }
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getUserRoles(daoId, userId);
      
      // Cache the response
      this.userRolesCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching roles for user ${userId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all permissions a user has in a DAO
   */
  async getUserPermissions(daoId: string, userId: string): Promise<PermissionListResponse | null> {
    try {
      // Check cache first
      const cacheKey = `user-permissions-${daoId}-${userId}`;
      if (this.userPermissionsCache.has(cacheKey)) {
        const cached = this.userPermissionsCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp < this.CACHE_EXPIRY_MS) {
          console.log('Returning cached user permissions data');
          return cached.data;
        }
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getUserPermissions(daoId, userId);
      
      // Cache the response
      this.userPermissionsCache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    } catch (error) {
      console.error(`Error fetching permissions for user ${userId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Get all available governance models
   */
  async getGovernanceModels(): Promise<GovernanceModelsList | null> {
    try {
      // Return cached data if available and not expired
      if (this.governanceModelsCache && (Date.now() - this.governanceModelsCache.timestamp < this.CACHE_EXPIRY_MS)) {
        console.log('Returning cached governance models data');
        return this.governanceModelsCache.data;
      }

      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const response = await apiClient.getGovernanceModels();
      
      // Cache the response
      this.governanceModelsCache = {
        data: response,
        timestamp: Date.now()
      };
      
      return response;
    } catch (error) {
      console.error('Error fetching governance models:', error);
      return null;
    }
  }

  /**
   * Create a new role for a DAO
   */
  async createDAORole(daoId: string, roleData: {
    name: string;
    description?: string;
  }): Promise<RoleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const inputCreateRole = new InputCreateRole();
      inputCreateRole.name = roleData.name;
      
      if (roleData.description !== undefined) {
        inputCreateRole.description = roleData.description;
      }

      return await apiClient.createDAORole(daoId, inputCreateRole);
    } catch (error) {
      console.error(`Error creating role for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Update a role for a DAO
   */
  async updateDAORole(daoId: string, roleId: string, roleData: {
    name?: string;
    description?: string;
  }): Promise<RoleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const inputUpdateRole = new InputUpdateRole();
      
      if (roleData.name !== undefined) {
        inputUpdateRole.name = roleData.name;
      }
      
      if (roleData.description !== undefined) {
        inputUpdateRole.description = roleData.description;
      }

      return await apiClient.updateDAORole(daoId, roleId, inputUpdateRole);
    } catch (error) {
      console.error(`Error updating role ${roleId} for DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Assign a role to a user in a DAO
   */
  async assignRoleToUser(daoId: string, userId: string, roleId: string): Promise<UserRoleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const userRoleAssignment = new UserRoleAssignment();
      userRoleAssignment.roleId = roleId;
      userRoleAssignment.userId = userId;

      return await apiClient.assignRoleToUser(daoId, userId, userRoleAssignment);
    } catch (error) {
      console.error(`Error assigning role ${roleId} to user ${userId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Assign a permission to a role in a DAO
   */
  async assignPermissionToRole(daoId: string, roleId: string, permissionId: string): Promise<RolePermissionResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      const rolePermissionAssignment = new RolePermissionAssignment();
      rolePermissionAssignment.permissionId = permissionId;
      rolePermissionAssignment.roleId = roleId;

      return await apiClient.assignPermissionToRole(daoId, roleId, rolePermissionAssignment);
    } catch (error) {
      console.error(`Error assigning permission ${permissionId} to role ${roleId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Remove a permission from a role in a DAO
   */
  async removePermissionFromRole(daoId: string, roleId: string, permissionId: string): Promise<RolePermissionResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      return await apiClient.removePermissionFromRole(daoId, roleId, permissionId);
    } catch (error) {
      console.error(`Error removing permission ${permissionId} from role ${roleId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Check if a user has a specific role in a DAO
   */
  async checkUserRole(daoId: string, userId: string, roleId: string): Promise<boolean> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return false;

      const response = await apiClient.checkUserRole(daoId, userId, roleId);
      return response.hasRole || false;
    } catch (error) {
      console.error(`Error checking if user ${userId} has role ${roleId} in DAO ${daoId}:`, error);
      return false;
    }
  }

  /**
   * Check if a user has a specific permission in a DAO
   */
  async checkUserPermission(daoId: string, userId: string, permissionId: string): Promise<boolean> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return false;

      const response = await apiClient.checkUserPermission(daoId, userId, permissionId);
      return response.hasPermission || false;
    } catch (error) {
      console.error(`Error checking if user ${userId} has permission ${permissionId} in DAO ${daoId}:`, error);
      return false;
    }
  }

  /**
   * Delete a role from a DAO
   */
  async deleteRole(daoId: string, roleId: string): Promise<RoleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      return await apiClient.deleteDAORole(daoId, roleId);
    } catch (error) {
      console.error(`Error deleting role ${roleId} from DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Remove a role from a user in a DAO
   */
  async removeRoleFromUser(daoId: string, userId: string, roleId: string): Promise<UserRoleResponse | null> {
    try {
      const apiClient = this.createAuthenticatedApiClient();
      if (!apiClient) return null;

      return await apiClient.removeRoleFromUser(daoId, userId, roleId);
    } catch (error) {
      console.error(`Error removing role ${roleId} from user ${userId} in DAO ${daoId}:`, error);
      return null;
    }
  }

  /**
   * Clear all caches - should be called on logout
   */
  clearCaches(): void {
    this.rolesCache.clear();
    this.permissionsCache.clear();
    this.rolePermissionsCache.clear();
    this.userRolesCache.clear();
    this.userPermissionsCache.clear();
    this.governanceModelsCache = null;
  }
}

// Create a singleton instance
export const rolePermissionService = new RolePermissionService();

// Export default for convenience
export default rolePermissionService; 