import React from 'react';
import { useParams } from 'react-router-dom';
import { rolePermissionService } from '../services/RolePermissionService';
import { daosService } from '../services/DaosService';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

interface RoleItem {
  roleId: string;
  name: string;
  description: string;
}

interface PermissionItem {
  permissionId: string;
  name: string;
  description: string;
}

interface UserItem {
  userId: string;
  username: string;
  memberName?: string;
}

const Roles: React.FC = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const { userInfo } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [roles, setRoles] = React.useState<RoleItem[]>([]);
  const [permissions, setPermissions] = React.useState<PermissionItem[]>([]);
  const [users, setUsers] = React.useState<UserItem[]>([]);
  
  // Add separate loading states
  const [loading, setLoading] = React.useState(true);
  const [rolesLoading, setRolesLoading] = React.useState(false);
  const [permissionsLoading, setPermissionsLoading] = React.useState(false);
  const [usersLoading, setUsersLoading] = React.useState(false);
  
  // Add error states
  const [error, setError] = React.useState<string | null>(null);
  const [rolesError, setRolesError] = React.useState<string | null>(null);
  
  const [selectedRole, setSelectedRole] = React.useState<RoleItem | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);
  const [rolePermissions, setRolePermissions] = React.useState<PermissionItem[]>([]);
  const [userRoles, setUserRoles] = React.useState<RoleItem[]>([]);
  
  // Form states
  const [newRoleName, setNewRoleName] = React.useState('');
  const [newRoleDescription, setNewRoleDescription] = React.useState('');
  const [showRoleForm, setShowRoleForm] = React.useState(false);
  const [showAssignRoleForm, setShowAssignRoleForm] = React.useState(false);
  const [showAssignPermissionForm, setShowAssignPermissionForm] = React.useState(false);
  const [selectedPermission, setSelectedPermission] = React.useState<string>('');
  const [selectedRoleForUser, setSelectedRoleForUser] = React.useState<string>('');
  const [selectedRoleForPermission, setSelectedRoleForPermission] = React.useState<string>('');

  // Check if current user is admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!daoId || !userInfo) return;
      
      try {
        const dao = await daosService.getDaoById(daoId);
        // Check if user is the owner of the DAO or in the admins list
        const adminIdsList = dao?.admins?.map(admin => admin.userId) || [];
        setIsAdmin(
          dao?.ownerId === userInfo.userId || 
          adminIdsList.includes(userInfo.userId)
        );
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    };

    checkAdminStatus();
  }, [daoId, userInfo]);

  // Load roles data
  const fetchRoles = async () => {
    if (!daoId) return;
    
    setRolesLoading(true);
    setRolesError(null);
    
    try {
      const rolesResponse = await rolePermissionService.getDAORoles(daoId);
      if (rolesResponse && rolesResponse.roles) {
        setRoles(rolesResponse.roles);
        console.log('Loaded roles:', rolesResponse.roles);
      } else {
        setRoles([]);
        console.warn('No roles returned from API');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRolesError('Failed to load roles. Please try again.');
    } finally {
      setRolesLoading(false);
    }
  };

  // Load permissions data  
  const fetchPermissions = async () => {
    if (!daoId) return;
    
    setPermissionsLoading(true);
    
    try {
      const permissionsResponse = await rolePermissionService.getDAOPermissions(daoId);
      if (permissionsResponse && permissionsResponse.permissions) {
        setPermissions(permissionsResponse.permissions);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setPermissionsLoading(false);
    }
  };

  // Load users data
  const fetchUsers = async () => {
    if (!daoId) return;
    
    setUsersLoading(true);
    
    try {
      const members = await daosService.getDaoMembers(daoId);
      if (members) {
        setUsers(members);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  // Initial data loading
  React.useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchRoles(),
          fetchPermissions(),
          fetchUsers()
        ]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadAllData();
  }, [daoId]);

  // Handle refreshing all data
  const handleRefreshData = async () => {
    // Clear all caches to ensure we get fresh data
    rolePermissionService.clearCaches();
    
    // Fetch fresh data from API
    await Promise.all([
      fetchRoles(),
      fetchPermissions(),
      fetchUsers()
    ]);
    
    // Clear selections when data is refreshed
    if (selectedRole) {
      // Refresh role permissions if a role is selected
      fetchRolePermissions(selectedRole.roleId);
    }
    
    if (selectedUser) {
      // Refresh user roles if a user is selected
      fetchUserRoles(selectedUser.userId);
    }
  };

  // Fetch role permissions
  const fetchRolePermissions = async (roleId: string) => {
    if (!daoId) return;
    
    try {
      const permissionsResponse = await rolePermissionService.getRolePermissions(daoId, roleId);
      if (permissionsResponse && permissionsResponse.permissions) {
        setRolePermissions(permissionsResponse.permissions);
      }
    } catch (error) {
      console.error('Error fetching role permissions:', error);
    }
  };

  // Fetch user roles
  const fetchUserRoles = async (userId: string) => {
    if (!daoId) return;
    
    try {
      const userRolesResponse = await rolePermissionService.getUserRoles(daoId, userId);
      if (userRolesResponse && userRolesResponse.roles) {
        setUserRoles(userRolesResponse.roles);
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  // Fetch role permissions when a role is selected
  React.useEffect(() => {
    if (selectedRole) {
      fetchRolePermissions(selectedRole.roleId);
    } else {
      setRolePermissions([]);
    }
  }, [daoId, selectedRole]);

  // Fetch user roles when a user is selected
  React.useEffect(() => {
    if (selectedUser) {
      fetchUserRoles(selectedUser.userId);
    } else {
      setUserRoles([]);
    }
  }, [daoId, selectedUser]);

  // Handle creating a new role
  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!daoId || !newRoleName) return;
    
    try {
      const response = await rolePermissionService.createDAORole(daoId, {
        name: newRoleName,
        description: newRoleDescription || undefined
      });
      
      if (response) {
        // Clear the roles cache before fetching updated data
        rolePermissionService.clearCaches();
        
        // Refresh roles list with fresh data from server
        await fetchRoles();
        
        // Reset form
        setNewRoleName('');
        setNewRoleDescription('');
        setShowRoleForm(false);
      }
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  // Handle assigning a role to a user
  const handleAssignRoleToUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!daoId || !selectedUser || !selectedRoleForUser) return;
    
    try {
      const response = await rolePermissionService.assignRoleToUser(
        daoId,
        selectedUser.userId,
        selectedRoleForUser
      );
      
      if (response) {
        // Clear caches to ensure fresh data
        rolePermissionService.clearCaches();
        
        // Refresh user roles with fresh data
        await fetchUserRoles(selectedUser.userId);
        
        // Reset form
        setSelectedRoleForUser('');
        setShowAssignRoleForm(false);
      }
    } catch (error) {
      console.error('Error assigning role to user:', error);
    }
  };

  // Handle assigning a permission to a role
  const handleAssignPermissionToRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!daoId || !selectedRole || !selectedPermission) return;
    
    try {
      const response = await rolePermissionService.assignPermissionToRole(
        daoId,
        selectedRole.roleId,
        selectedPermission
      );
      
      if (response) {
        // Clear caches to ensure fresh data
        rolePermissionService.clearCaches();
        
        // Refresh role permissions
        await fetchRolePermissions(selectedRole.roleId);
      }
      
      // Reset form
      setSelectedPermission('');
      setShowAssignPermissionForm(false);
    } catch (error) {
      console.error('Error assigning permission to role:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300">
            You do not have permission to access the role management page. 
            Only DAO owners and admins can manage roles and permissions.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Roles and Permissions</h1>
        <button 
          onClick={handleRefreshData}
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md flex items-center"
          disabled={rolesLoading || permissionsLoading || usersLoading}
        >
          <RefreshCw size={16} className={`mr-2 ${(rolesLoading || permissionsLoading || usersLoading) ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md text-white">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Roles Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Roles</h2>
            <button 
              onClick={() => setShowRoleForm(!showRoleForm)}
              className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white rounded-md text-sm"
              disabled={rolesLoading}
            >
              {showRoleForm ? 'Cancel' : 'Add Role'}
            </button>
          </div>
          
          {rolesError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-sm text-white">
              {rolesError}
            </div>
          )}
          
          {showRoleForm && (
            <form onSubmit={handleCreateRole} className="mb-6 bg-gray-900/50 p-4 rounded-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows={3}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md"
              >
                Create Role
              </button>
            </form>
          )}
          
          <div className="overflow-y-auto max-h-96 space-y-2">
            {rolesLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : roles.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No roles available</p>
            ) : (
              roles.map((role: RoleItem) => (
                <div 
                  key={role.roleId}
                  onClick={() => setSelectedRole(role)}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedRole?.roleId === role.roleId 
                      ? 'bg-purple-800/50 border border-purple-500/50' 
                      : 'bg-gray-700/30 hover:bg-gray-700/50 border border-transparent'
                  }`}
                >
                  <h3 className="font-medium text-white">{role.name}</h3>
                  {role.description && (
                    <p className="text-sm text-gray-300 mt-1">{role.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Permissions Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {selectedRole ? `${selectedRole.name} Permissions` : 'Permissions'}
            </h2>
            {selectedRole && (
              <button 
                onClick={() => {
                  // Auto-set the selected role when opening the form
                  setSelectedRoleForPermission(selectedRole.roleId);
                  setShowAssignPermissionForm(!showAssignPermissionForm);
                }}
                className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white rounded-md text-sm"
              >
                {showAssignPermissionForm ? 'Cancel' : 'Assign Permission'}
              </button>
            )}
          </div>
          
          {showAssignPermissionForm && (
            <form onSubmit={handleAssignPermissionToRole} className="mb-6 bg-gray-900/50 p-4 rounded-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <input
                  type="text"
                  value={selectedRole?.name || ''}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Permission</label>
                <select
                  value={selectedPermission}
                  onChange={(e) => setSelectedPermission(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a permission</option>
                  {permissions.map((permission: PermissionItem) => (
                    <option key={permission.permissionId} value={permission.permissionId}>
                      {permission.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md"
              >
                Assign Permission
              </button>
            </form>
          )}
          
          <div className="overflow-y-auto max-h-96 space-y-2">
            {permissionsLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : !selectedRole ? (
              <p className="text-gray-400 text-center py-4">Select a role to view permissions</p>
            ) : rolePermissions.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No permissions assigned to this role</p>
            ) : (
              rolePermissions.map((permission: PermissionItem) => (
                <div 
                  key={permission.permissionId}
                  className="p-3 rounded-md bg-gray-700/30 border border-gray-600/30"
                >
                  <h3 className="font-medium text-white">{permission.name}</h3>
                  {permission.description && (
                    <p className="text-sm text-gray-300 mt-1">{permission.description}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Members Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow p-6 border border-gray-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              {selectedUser ? `${selectedUser.username}'s Roles` : 'Members'}
            </h2>
            {selectedUser && (
              <button 
                onClick={() => setShowAssignRoleForm(!showAssignRoleForm)}
                className="px-3 py-1 bg-purple-800 hover:bg-purple-700 text-white rounded-md text-sm"
              >
                {showAssignRoleForm ? 'Cancel' : 'Assign Role'}
              </button>
            )}
          </div>
          
          {showAssignRoleForm && (
            <form onSubmit={handleAssignRoleToUser} className="mb-6 bg-gray-900/50 p-4 rounded-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">User</label>
                <input
                  type="text"
                  value={selectedUser?.username || ''}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                <select
                  value={selectedRoleForUser}
                  onChange={(e) => setSelectedRoleForUser(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="">Select a role</option>
                  {roles.map((role: RoleItem) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-md"
              >
                Assign Role
              </button>
            </form>
          )}
          
          <div className="overflow-y-auto max-h-96">
            {usersLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : !selectedUser ? (
              <div className="space-y-2">
                {users.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No members available</p>
                ) : (
                  users.map((user: UserItem) => (
                    <div 
                      key={user.userId}
                      onClick={() => setSelectedUser(user)}
                      className="p-3 rounded-md cursor-pointer bg-gray-700/30 hover:bg-gray-700/50 border border-transparent"
                    >
                      <h3 className="font-medium text-white">{user.memberName || user.username}</h3>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
                >
                  ← Back to members
                </button>
                {userRoles.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No roles assigned</p>
                ) : (
                  <div className="space-y-2">
                    {userRoles.map((role: RoleItem) => (
                      <div 
                        key={role.roleId}
                        className="p-3 rounded-md bg-gray-700/30 border border-gray-600/30"
                      >
                        <h3 className="font-medium text-white">{role.name}</h3>
                        {role.description && (
                          <p className="text-sm text-gray-300 mt-1">{role.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles; 