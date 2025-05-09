import React from 'react';
import { useParams } from 'react-router-dom';
import { rolePermissionService } from '../services/RolePermissionService';
import { daosService } from '../services/DaosService';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, X, Trash2, Shield, UserCheck, Plus, AlertCircle, Users, Settings } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { typography, containers, ui } from '../styles/theme';

// Toast notification component
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 flex items-center space-x-2 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      {type === 'success' ? 
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg> : 
        <AlertCircle size={18} />
      }
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={18} />
      </button>
    </div>
  );
};

// Confirmation dialog component
const ConfirmDialog = ({ 
  title, 
  message, 
  isOpen, 
  onConfirm, 
  onCancel, 
  isLoading 
}: { 
  title: string; 
  message: string; 
  isOpen: boolean; 
  onConfirm: () => void; 
  onCancel: () => void; 
  isLoading: boolean 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 max-w-md w-full">
        <h3 className="text-lg font-medium text-white mb-4">{title}</h3>
        <p className="text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md flex items-center"
            disabled={isLoading}
          >
            {isLoading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

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
  profilePicture?: string;
  walletAddress?: string;
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

  // Add state for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isLoading: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isLoading: false
  });
  
  // Add state for toast notifications
  const [toast, setToast] = React.useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Track which section is currently being viewed
  const [activeSection, setActiveSection] = React.useState<'roles' | 'permissions' | 'users'>('roles');

  // Check if current user is admin
  React.useEffect(() => {
    const checkAdminStatus = async () => {
      if (!daoId || !userInfo) return;
      
      try {
        setLoading(true);
        
        // Use the new service-level caching method instead of localStorage
        const isUserAdmin = await rolePermissionService.isUserDAOAdmin(daoId, userInfo.userId);
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setLoading(false);
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

  // Initial data loading - only if user is admin
  React.useEffect(() => {
    const loadAllData = async () => {
      if (!daoId || !isAdmin) return; // Skip if not admin
      
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
  }, [daoId, isAdmin]);

  // Handle refreshing all data
  const handleRefreshData = async () => {
    if (!isAdmin) return; // Skip if not admin
    
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
        
        // Show success message
        setToast({
          message: `Role "${newRoleName}" created successfully`,
          type: 'success'
        });
        
        // Reset form
        setNewRoleName('');
        setNewRoleDescription('');
        setShowRoleForm(false);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      setToast({
        message: `Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
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
        
        // Show success toast
        setToast({
          message: `Role assigned to ${selectedUser.username} successfully`,
          type: 'success'
        });
        
        // Reset form
        setSelectedRoleForUser('');
        setShowAssignRoleForm(false);
      }
    } catch (error) {
      console.error('Error assigning role to user:', error);
      setToast({
        message: `Failed to assign role: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
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
        
        // Show success toast
        setToast({
          message: "Permission assigned successfully",
          type: 'success'
        });
      }
      
      // Reset form
      setSelectedPermission('');
      setShowAssignPermissionForm(false);
    } catch (error) {
      console.error('Error assigning permission to role:', error);
      setToast({
        message: `Failed to assign permission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    }
  };

  // Handle removing a permission from a role
  const handleRemovePermissionFromRole = async (permissionId: string) => {
    if (!daoId || !selectedRole) return;
    
    setConfirmDialog({
      ...confirmDialog,
      isLoading: true
    });
    
    try {
      const response = await rolePermissionService.removePermissionFromRole(
        daoId,
        selectedRole.roleId,
        permissionId
      );
      
      if (response) {
        // Clear caches to ensure fresh data
        rolePermissionService.clearCaches();
        
        // Refresh role permissions
        await fetchRolePermissions(selectedRole.roleId);
        
        // Show success toast
        setToast({
          message: "Permission removed successfully",
          type: 'success'
        });
      }
    } catch (error) {
      console.error('Error removing permission from role:', error);
      setToast({
        message: `Failed to remove permission: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    } finally {
      setConfirmDialog({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
        isLoading: false
      });
    }
  };

  // Handle confirmation dialog for permission removal
  const handleRemovePermissionClick = (permissionId: string, permissionName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Permission',
      message: `Are you sure you want to remove the "${permissionName}" permission from the "${selectedRole?.name}" role? This action cannot be undone.`,
      onConfirm: () => handleRemovePermissionFromRole(permissionId),
      isLoading: false
    });
  };

  // Handle removing a role from a user
  const handleRemoveRoleFromUser = async (roleId: string, roleName: string) => {
    if (!daoId || !selectedUser) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Role',
      message: `Are you sure you want to remove the "${roleName}" role from ${selectedUser.username}? This may affect their permissions.`,
      onConfirm: async () => {
        setConfirmDialog({
          ...confirmDialog,
          isLoading: true
        });
        
        try {
          const response = await rolePermissionService.removeRoleFromUser(
            daoId,
            selectedUser.userId,
            roleId
          );
          
          if (response) {
            // Clear caches to ensure fresh data
            rolePermissionService.clearCaches();
            
            // Refresh user roles
            await fetchUserRoles(selectedUser.userId);
            
            // Show success toast
            setToast({
              message: `Role removed from ${selectedUser.username} successfully`,
              type: 'success'
            });
          }
        } catch (error) {
          console.error('Error removing role from user:', error);
          setToast({
            message: `Failed to remove role: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'error'
          });
        } finally {
          setConfirmDialog({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: () => {},
            isLoading: false
          });
        }
      },
      isLoading: false
    });
  };

  // Handle removing a role
  const handleRemoveRole = async (roleId: string, roleName: string) => {
    if (!daoId) return;
    
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Role',
      message: `Are you sure you want to delete the "${roleName}" role? This will remove the role from all users who have it.`,
      onConfirm: async () => {
        setConfirmDialog({
          ...confirmDialog,
          isLoading: true
        });
        
        try {
          const response = await rolePermissionService.deleteRole(daoId, roleId);
          
          if (response) {
            // Clear caches to ensure fresh data
            rolePermissionService.clearCaches();
            
            // Refresh roles
            await fetchRoles();
            
            // Clear selected role if it was deleted
            if (selectedRole?.roleId === roleId) {
              setSelectedRole(null);
            }
            
            // Show success toast
            setToast({
              message: `Role "${roleName}" deleted successfully`,
              type: 'success'
            });
          }
        } catch (error) {
          console.error('Error deleting role:', error);
          setToast({
            message: `Failed to delete role: ${error instanceof Error ? error.message : 'Unknown error'}`,
            type: 'error'
          });
        } finally {
          setConfirmDialog({
            isOpen: false,
            title: '',
            message: '',
            onConfirm: () => {},
            isLoading: false
          });
        }
      },
      isLoading: false
    });
  };

  // Close toast notification
  const closeToast = () => {
    setToast(null);
  };

  // Display wallet address in shortened form
  const displayWalletAddress = (address?: string) => {
    if (!address) return 'No wallet address';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full min-h-screen">
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
      <div className="flex justify-center items-center p-8 h-full min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full min-h-screen overflow-auto">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      
      {/* Confirmation dialog */}
      <ConfirmDialog 
        title={confirmDialog.title}
        message={confirmDialog.message}
        isOpen={confirmDialog.isOpen}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({...confirmDialog, isOpen: false})}
        isLoading={confirmDialog.isLoading}
      />
      
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Roles and Permissions</h1>
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
      
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div 
          className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60 cursor-pointer transition hover:bg-gray-800/50 ${activeSection === 'roles' ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setActiveSection('roles')}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mr-4">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Roles</div>
              <div className="text-2xl font-bold text-white">{roles.length}</div>
            </div>
          </div>
        </div>
        
        <div 
          className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60 cursor-pointer transition hover:bg-gray-800/50 ${activeSection === 'permissions' ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => {
            setActiveSection('permissions');
            // If no role is selected, select the first one
            if (!selectedRole && roles.length > 0) {
              setSelectedRole(roles[0]);
            }
          }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
              <Settings size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Role Permissions</div>
              <div className="text-xl font-bold text-white mt-1">
                {selectedRole ? (
                  <span>{rolePermissions.length} Permission{rolePermissions.length !== 1 ? 's' : ''}</span>
                ) : (
                  <span>Select a role</span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div 
          className={`bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60 cursor-pointer transition hover:bg-gray-800/50 ${activeSection === 'users' ? 'ring-2 ring-indigo-500' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 mr-4">
              <UserCheck size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">User Roles</div>
              <div className="text-xl font-bold text-white mt-1">
                {selectedUser ? (
                  <span>{userRoles.length} Role{userRoles.length !== 1 ? 's' : ''}</span>
                ) : (
                  <span>Select a user</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Role Management Section */}
      {activeSection === 'roles' && (
        <Card>
          <div className="flex items-center mb-4">
            <Shield size={20} className="mr-2 text-indigo-500" />
            <h2 className={typography.h2}>Role Management</h2>
          </div>
          
          <p className={typography.body + " mb-4"}>
            Create, edit, and delete roles for your DAO.
          </p>
          
          <div className="mb-4">
            <Button 
              onClick={() => setShowRoleForm(!showRoleForm)}
              className="flex items-center"
            >
              <Plus size={16} className="mr-2" />
              {showRoleForm ? 'Cancel' : 'Create New Role'}
            </Button>
          </div>
          
          {showRoleForm && (
            <form onSubmit={handleCreateRole} className="mb-6 bg-gray-900/50 p-4 rounded-md">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Role Name</label>
                <input
                  type="text"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className={ui.input}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  className={ui.input}
                  rows={3}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
              >
                Create Role
              </Button>
            </form>
          )}
          
          {rolesError && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-sm text-white">
              {rolesError}
            </div>
          )}
          
          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2 bg-[#1A1A1A] border-b border-gray-700 grid grid-cols-12">
              <div className="col-span-4 font-medium">Role Name</div>
              <div className="col-span-6 font-medium">Description</div>
              <div className="col-span-2"></div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {rolesLoading ? (
                <div className="flex justify-center py-6">
                  <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No roles available. Create your first role!
                </div>
              ) : (
                roles.map((role: RoleItem) => (
                  <div 
                    key={role.roleId} 
                    className="border-b border-gray-700 last:border-0 grid grid-cols-12 items-center hover:bg-gray-800/30"
                  >
                    <div className="col-span-4 p-4 font-medium">{role.name}</div>
                    <div className="col-span-6 p-4 text-gray-300">
                      {role.description || <span className="text-gray-500 italic">No description</span>}
                    </div>
                    <div className="col-span-2 p-4 flex justify-end">
                      <Button 
                        variant="danger" 
                        size="small"
                        onClick={() => handleRemoveRole(role.roleId, role.name)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Card>
      )}
      
      {/* Permissions Management Section */}
      {activeSection === 'permissions' && (
        <Card>
          <div className="flex items-center mb-4">
            <Settings size={20} className="mr-2 text-blue-500" />
            <h2 className={typography.h2}>Permissions Management</h2>
          </div>
          
          <p className={typography.body + " mb-4"}>
            Manage permissions for roles to control what actions users can perform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role selection sidebar */}
            <div className="bg-[#111]/50 rounded-lg p-4 border border-gray-800/40">
              <h3 className={typography.h3 + " mb-3"}>Select Role</h3>
              
              {rolesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : roles.length === 0 ? (
                <p className="text-gray-400">No roles available</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {roles.map((role: RoleItem) => (
                    <div 
                      key={role.roleId}
                      onClick={() => setSelectedRole(role)}
                      className={`p-3 rounded-md cursor-pointer transition ${
                        selectedRole?.roleId === role.roleId 
                          ? 'bg-indigo-900/50 border border-indigo-500/50' 
                          : 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent'
                      }`}
                    >
                      <h4 className="font-medium">{role.name}</h4>
                      {role.description && (
                        <p className="text-sm text-gray-400 mt-1 truncate">{role.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Permissions list and management */}
            <div className="md:col-span-2 bg-[#111]/50 rounded-lg p-4 border border-gray-800/40">
              {!selectedRole ? (
                <div className="text-center py-10 text-gray-400">
                  <Settings size={40} className="mx-auto mb-4 opacity-40" />
                  <p>Select a role to view and manage its permissions</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={typography.h3}>
                      <span className="text-indigo-400">{selectedRole.name}</span> Permissions
                    </h3>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setShowAssignPermissionForm(!showAssignPermissionForm)}
                      disabled={permissions.length === 0}
                    >
                      <Plus size={16} className="mr-1" />
                      {showAssignPermissionForm ? 'Cancel' : 'Add Permission'}
                    </Button>
                  </div>
                  
                  {showAssignPermissionForm && (
                    <form onSubmit={handleAssignPermissionToRole} className="mb-6 bg-gray-900/50 p-4 rounded-md">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Permission</label>
                        <select
                          value={selectedPermission}
                          onChange={(e) => setSelectedPermission(e.target.value)}
                          className={ui.input}
                          required
                        >
                          <option value="">Select a permission</option>
                          {permissions
                            .filter(p => !rolePermissions.some(rp => rp.permissionId === p.permissionId))
                            .map((permission: PermissionItem) => (
                              <option key={permission.permissionId} value={permission.permissionId}>
                                {permission.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                      <Button
                        type="submit"
                        disabled={!selectedPermission}
                      >
                        Assign Permission
                      </Button>
                    </form>
                  )}
                  
                  {permissionsLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                    </div>
                  ) : rolePermissions.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                      No permissions assigned to this role
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {rolePermissions.map((permission: PermissionItem) => (
                        <div 
                          key={permission.permissionId}
                          className="p-3 rounded-md bg-gray-800/50 border border-gray-700/50 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{permission.name}</h4>
                            {permission.description && (
                              <p className="text-sm text-gray-400 mt-1">{permission.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemovePermissionClick(permission.permissionId, permission.name)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                            title="Remove permission"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      )}
      
      {/* User Roles Management Section */}
      {activeSection === 'users' && (
        <Card>
          <div className="flex items-center mb-4">
            <UserCheck size={20} className="mr-2 text-purple-500" />
            <h2 className={typography.h2}>User Role Management</h2>
          </div>
          
          <p className={typography.body + " mb-4"}>
            Assign roles to users to grant them specific permissions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* User selection sidebar */}
            <div className="bg-[#111]/50 rounded-lg p-4 border border-gray-800/40">
              <h3 className={typography.h3 + " mb-3"}>Select User</h3>
              
              {usersLoading ? (
                <div className="flex justify-center py-4">
                  <div className="w-6 h-6 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-400">No users available</p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {users.map((user: UserItem) => (
                    <div 
                      key={user.userId}
                      onClick={() => setSelectedUser(user)}
                      className={`p-3 rounded-md cursor-pointer transition ${
                        selectedUser?.userId === user.userId 
                          ? 'bg-purple-900/50 border border-purple-500/50' 
                          : 'bg-gray-800/30 hover:bg-gray-700/50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        <img 
                          src={user.profilePicture || `https://avatars.dicebear.com/api/identicon/${user.userId}.svg`} 
                          alt={user.username} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <div>
                          <h4 className="font-medium">{user.memberName || user.username}</h4>
                          {user.walletAddress && (
                            <p className="text-xs text-gray-400 mt-0.5">{displayWalletAddress(user.walletAddress)}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* User roles list and management */}
            <div className="md:col-span-2 bg-[#111]/50 rounded-lg p-4 border border-gray-800/40">
              {!selectedUser ? (
                <div className="text-center py-10 text-gray-400">
                  <Users size={40} className="mx-auto mb-4 opacity-40" />
                  <p>Select a user to view and manage their roles</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={typography.h3}>
                      <span className="text-purple-400">{selectedUser.username}</span>'s Roles
                    </h3>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => setShowAssignRoleForm(!showAssignRoleForm)}
                      disabled={roles.length === 0}
                    >
                      <Plus size={16} className="mr-1" />
                      {showAssignRoleForm ? 'Cancel' : 'Assign Role'}
                    </Button>
                  </div>
                  
                  {showAssignRoleForm && (
                    <form onSubmit={handleAssignRoleToUser} className="mb-6 bg-gray-900/50 p-4 rounded-md">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                        <select
                          value={selectedRoleForUser}
                          onChange={(e) => setSelectedRoleForUser(e.target.value)}
                          className={ui.input}
                          required
                        >
                          <option value="">Select a role</option>
                          {roles
                            .filter(r => !userRoles.some(ur => ur.roleId === r.roleId))
                            .map((role: RoleItem) => (
                              <option key={role.roleId} value={role.roleId}>
                                {role.name}
                              </option>
                            ))
                          }
                        </select>
                      </div>
                      <Button
                        type="submit"
                        disabled={!selectedRoleForUser}
                      >
                        Assign Role
                      </Button>
                    </form>
                  )}
                  
                  {usersLoading ? (
                    <div className="flex justify-center py-6">
                      <div className="w-8 h-8 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
                    </div>
                  ) : userRoles.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 border border-dashed border-gray-700 rounded-lg">
                      No roles assigned to this user
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                      {userRoles.map((role: RoleItem) => (
                        <div 
                          key={role.roleId}
                          className="p-3 rounded-md bg-gray-800/50 border border-gray-700/50 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{role.name}</h4>
                            {role.description && (
                              <p className="text-sm text-gray-400 mt-1">{role.description}</p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveRoleFromUser(role.roleId, role.name)}
                            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-md transition-colors"
                            title="Remove role"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Roles; 