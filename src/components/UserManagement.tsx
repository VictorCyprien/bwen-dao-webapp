import React from 'react';
import { Search, X, Check, AlertCircle, Clock, UserPlus, UserMinus, ChevronDown, Users, Calendar } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Card from './common/Card';
import Button from './common/Button';
import { typography, containers, ui, utils } from '../styles/theme';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import type { User, DAOInvitationResponse } from '../core/modules/dao-api';

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
      {type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={18} />
      </button>
    </div>
  );
};

// Modal component for invitation
const InvitationModal = ({
  user,
  isOpen,
  onClose,
  onInvite,
  error
}: {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (expiresInDays?: number) => void;
  error?: string | null;
}) => {
  const [expirationDays, setExpirationDays] = React.useState<string>('');

  if (!isOpen || !user) return null;

  const handleInviteClick = () => {
    // If the field is empty, pass undefined to make it optional
    const days = expirationDays.trim() === '' ? undefined : parseInt(expirationDays);
    onInvite(days);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
        <h2 className={typography.h3}>Invite User</h2>
        <div className="mt-4 mb-6">
          <div className="flex items-center mb-4">
            <img 
              src={user.profilePicture || `https://avatars.dicebear.com/api/identicon/${user.userId}.svg`} 
              alt={user.username} 
              className="w-12 h-12 rounded-full mr-3"
            />
            <div>
              <p className={typography.body + " font-bold"}>{user.username}</p>
              <p className={typography.small + " text-gray-400"}>
                {user.walletAddress?.substring(0, 6)}...{user.walletAddress?.substring(user.walletAddress.length - 4)}
              </p>
            </div>
          </div>
          
          <div className="mb-4">
            <label className={typography.body + " block mb-2"}>
              Invitation expires in (days) <span className="text-gray-400 text-sm">(Optional)</span>
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                max="30"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                className={ui.input}
              />
              <Clock size={16} className="ml-2 text-gray-400" />
            </div>
            <p className={typography.small + " text-gray-400 mt-1"}>
              Leave empty if you don't want the invitation to expire
            </p>
          </div>

          {/* Error message display */}
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-md p-3 mb-4 text-red-300 flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleInviteClick}>
            Send Invitation
          </Button>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [searchResults, setSearchResults] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [daoMembers, setDaoMembers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchLoading, setSearchLoading] = React.useState<boolean>(false);
  const [toast, setToast] = React.useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [permissions, setPermissions] = React.useState<{
    canInvite: boolean;
    canRemove: boolean;
  }>({ canInvite: false, canRemove: false });

  // Check user permissions
  React.useEffect(() => {
    const checkPermissions = async () => {
      if (!daoId) return;
      
      try {
        // Here you would check if the user has the INVITE_MEMBERS and REMOVE_MEMBERS permissions
        // This is placeholder logic - replace with actual permission checking
        const currentUser = await userService.getCurrentUser();
        if (!currentUser || !currentUser.userId) return;
        
        // For now, we'll assume all authenticated users have both permissions
        // In a real implementation, you would check against actual permissions
        setPermissions({
          canInvite: true,
          canRemove: true
        });
      } catch (error) {
        console.error('Error checking permissions:', error);
      }
    };
    
    checkPermissions();
  }, [daoId]);

  // Fetch DAO members
  React.useEffect(() => {
    const fetchDaoMembers = async () => {
      if (!daoId) return;
      
      try {
        setLoading(true);
        const daoData = await daosService.getDaoById(daoId);
        if (daoData && daoData.members) {
          setDaoMembers(daoData.members);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching DAO members:', error);
        setLoading(false);
      }
    };
    
    fetchDaoMembers();
  }, [daoId]);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim() || !permissions.canInvite) return;
    
    try {
      setSearchLoading(true);
      setHasSearched(true);
      const results = await userService.searchUsersByUsername(searchQuery);
      if (results && results.users) {
        // Filter out users who are already members
        const membersWalletAddresses = daoMembers.map((member: User) => member.walletAddress);
        const filteredResults = results.users.filter(
          user => !membersWalletAddresses.includes(user.walletAddress)
        );
        setSearchResults(filteredResults);
      } else {
        setSearchResults([]);
      }
      setSearchLoading(false);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchLoading(false);
      setHasSearched(true);
      setToast({
        message: 'Error searching for users',
        type: 'error'
      });
    }
  };

  // Handle user selection for invitation
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setModalError(null); // Clear any previous errors
    setIsModalOpen(true);
  };

  // Handle invitation
  const handleInvite = async (expiresInDays?: number) => {
    if (!selectedUser || !daoId) return;
    
    try {
      setLoading(true);
      setModalError(null); // Clear any previous errors
      
      const response = await daosService.inviteUserToDAO(
        daoId,
        selectedUser.userId,
        expiresInDays
      );
      
      if (response) {
        setToast({
          message: `Invitation sent to ${selectedUser.username}`,
          type: 'success'
        });
        setIsModalOpen(false);
        setSelectedUser(null);
        setSearchResults([]);
        setSearchQuery('');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      setLoading(false);
      
      // Set error message for the modal
      let errorMessage = 'Error sending invitation';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Try to extract API error message if available
        const anyError = error as any;
        if (anyError.body?.message) {
          errorMessage = anyError.body.message;
        } else if (anyError.message) {
          errorMessage = anyError.message;
        }
      }
      
      setModalError(errorMessage);
    }
  };

  // Handle member removal
  const handleRemoveMember = async (memberId: string) => {
    if (!daoId || !permissions.canRemove) return;
    
    try {
      setLoading(true);
      if (daoId) {
        const response = await daosService.removeMemberFromDao(daoId, memberId);
        
        if (response) {
          // Update the members list with proper typing
          setDaoMembers((prevMembers: User[]) => prevMembers.filter((member: User) => member.userId !== memberId));
          setToast({
            message: 'Member removed successfully',
            type: 'success'
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error removing member:', error);
      setLoading(false);
      setToast({
        message: 'Error removing member',
        type: 'error'
      });
    }
  };

  // Close toast
  const closeToast = () => {
    setToast(null);
  };

  // When search query changes, reset hasSearched if it's cleared
  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

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
      
      {/* Invitation modal */}
      <InvitationModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
        error={modalError}
      />
      
      
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>User Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mr-4">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Members</div>
              <div className="text-2xl font-bold text-white">{daoMembers.length}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
              <UserPlus size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Invite Members</div>
              <div className="text-xl font-bold text-white mt-1">
                {permissions.canInvite ? "Enabled" : "Disabled"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 mr-4">
              <Calendar size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Member Management</div>
              <div className="text-xl font-bold text-white mt-1">
                {permissions.canRemove ? "Full Access" : "Limited Access"}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invitation section */}
      <Card className="mb-8">
        <div className="flex items-center mb-4">
          <UserPlus size={20} className="mr-2 text-indigo-500" />
          <h2 className={typography.h2}>Invite Members</h2>
        </div>
        
        {permissions.canInvite ? (
          <>
            <p className={typography.body + " mb-4"}>
              Search for users by username and invite them to join this DAO.
            </p>
            
            <div className="flex mb-6">
              <div className="relative flex-1 mr-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by username"
                  className={ui.input + " pl-10 w-full"}
                  disabled={searchLoading}
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={!searchQuery.trim() || searchLoading}
                isLoading={searchLoading}
              >
                Search
              </Button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="border border-gray-700 rounded-lg overflow-hidden mb-4">
                <div className="px-4 py-2 bg-[#1A1A1A] border-b border-gray-700 flex">
                  <div className="flex-1 font-medium">Username</div>
                  <div className="flex-1 font-medium">Wallet Address</div>
                  <div className="w-20"></div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {searchResults.map((user: User) => (
                    <div 
                      key={user.userId} 
                      className="px-4 py-3 border-b border-gray-700 last:border-0 flex items-center hover:bg-gray-800"
                    >
                      <div className="flex-1 flex items-center">
                        <img 
                          src={user.profilePicture || `https://avatars.dicebear.com/api/identicon/${user.userId}.svg`} 
                          alt={user.username} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{user.username}</span>
                      </div>
                      <div className="flex-1 text-gray-400">
                        {user.walletAddress?.substring(0, 6)}...{user.walletAddress?.substring(user.walletAddress.length - 4)}
                      </div>
                      <div className="w-20 text-right">
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={() => handleUserSelect(user)}
                        >
                          Invite
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {hasSearched && searchQuery.trim() && searchResults.length === 0 && !searchLoading && (
              <div className="text-center py-8 text-gray-400">
                No users found matching '{searchQuery}'
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-yellow-500 flex items-center justify-center">
            <AlertCircle size={20} className="mr-2" />
            <span>You don't have permission to invite members to this DAO</span>
          </div>
        )}
      </Card>
      
      {/* Remove members section */}
      <Card>
        <div className="flex items-center mb-4">
          <UserMinus size={20} className="mr-2 text-red-500" />
          <h2 className={typography.h2}>Remove Members</h2>
        </div>
        
        {permissions.canRemove ? (
          <>
            <p className={typography.body + " mb-4"}>
              Manage current DAO members or remove them from the DAO.
            </p>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
                <span className="text-gray-400">Loading members...</span>
              </div>
            ) : daoMembers.length > 0 ? (
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-4 py-2 bg-[#1A1A1A] border-b border-gray-700 flex">
                  <div className="flex-1 font-medium">Username</div>
                  <div className="flex-1 font-medium">Wallet Address</div>
                  <div className="w-24"></div>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {daoMembers.map((member: User) => (
                    <div 
                      key={member.userId} 
                      className="px-4 py-3 border-b border-gray-700 last:border-0 flex items-center"
                    >
                      <div className="flex-1 flex items-center">
                        <img 
                          src={member.profilePicture || `https://avatars.dicebear.com/api/identicon/${member.userId}.svg`} 
                          alt={member.username} 
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <span>{member.username}</span>
                      </div>
                      <div className="flex-1 text-gray-400">
                        {member.walletAddress?.substring(0, 6)}...{member.walletAddress?.substring(member.walletAddress.length - 4)}
                      </div>
                      <div className="w-24 text-right">
                        <Button 
                          variant="danger" 
                          size="small"
                          onClick={() => member.userId && handleRemoveMember(member.userId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No members found in this DAO
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-yellow-500 flex items-center justify-center">
            <AlertCircle size={20} className="mr-2" />
            <span>You don't have permission to remove members from this DAO</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserManagement; 