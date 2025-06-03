import React from 'react';
const { useState, useEffect } = React;
import { useParams } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { daosService } from '../services/DaosService';
import { rolePermissionService } from '../services/RolePermissionService';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import Card from './common/Card';
import Button from './common/Button';
import { DAO, FeaturedResponse } from '../core/modules/dao-api';
import { typography, containers, ui } from '../styles/theme';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { createFeaturedTransaction, signAndSendTransaction } from '../utils/solanaTransactions';
import { formatTimeRemainingUTC, toUTC, formatServerDateToLocal } from '../utils/dateUtils';

// Interface for the component's props
interface FeaturedProps {
  dao?: DAO | null;
  onUpdate?: () => void;
}

// Modal form state
interface ActivateFormState {
  days: number;
}

const Featured: React.FC<FeaturedProps> = ({ dao, onUpdate }: FeaturedProps) => {
  const { daoId } = useParams<{ daoId: string }>();
  const { userInfo } = useAuth();
  const { connection } = useConnection();
  const wallet = useWallet();
  const { showTransactionModal, hideTransactionModal } = useTransaction();
  
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredStatus, setFeaturedStatus] = useState<boolean>(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<ActivateFormState>({
    days: 7
  });
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [transactionPending, setTransactionPending] = useState<boolean>(false);
  
  // Check if user has access to the page (owner, admin, or has required permissions)
  useEffect(() => {
    const checkAccess = async () => {
      if (!daoId || !userInfo) {
        setPageLoading(false);
        return;
      }
      
      try {
        setPageLoading(true);
        
        // Check if we have cached access data
        const cachedAccess = rolePermissionService.getUserAccessFromCache(daoId, userInfo.userId);
        
        if (cachedAccess) {
          // Use cached data
          setHasAccess(cachedAccess.hasAccess);
          
          // Only if user has access, fetch featured status
          if (cachedAccess.hasAccess) {
            fetchFeaturedStatus();
          }
          
          setPageLoading(false);
          return;
        }
        
        // Check if user is DAO owner/admin
        const isOwnerOrAdmin = await rolePermissionService.isUserDAOAdmin(daoId, userInfo.userId);
        
        // If user is owner or admin, they have access
        if (isOwnerOrAdmin) {
          setHasAccess(true);
          
          // Fetch featured status
          fetchFeaturedStatus();
          
          // Cache the access data
          rolePermissionService.cacheUserAccess(daoId, userInfo.userId, true, true, true);
          
          setPageLoading(false);
          return;
        }
        
        // Otherwise, check if user has roles with required permissions
        const userRolesResponse = await rolePermissionService.getUserRoles(daoId, userInfo.userId);
        if (!userRolesResponse || !userRolesResponse.roles) {
          setHasAccess(false);
          
          // Cache the negative response
          rolePermissionService.cacheUserAccess(daoId, userInfo.userId, false, false, false);
          
          setPageLoading(false);
          return;
        }
        
        // For each role, check if it has the MANAGE_FEATURED permission
        let hasManageFeaturedPermission = false;
        
        for (const role of userRolesResponse.roles) {
          if (!role.roleId) continue; // Skip if roleId is undefined
          
          const rolePermissions = await rolePermissionService.getRolePermissions(daoId, role.roleId);
          
          if (rolePermissions && rolePermissions.permissions) {
            const permissionNames = rolePermissions.permissions.map(p => p.name);
            
            if (permissionNames.includes('MANAGE_FEATURED')) {
              hasManageFeaturedPermission = true;
              break;
            }
          }
        }
        
        // User has access if they have the permission
        setHasAccess(hasManageFeaturedPermission);
        
        // Cache the access data
        rolePermissionService.cacheUserAccess(daoId, userInfo.userId, hasManageFeaturedPermission, false, false);
        
        // Fetch featured status only if user has access
        if (hasManageFeaturedPermission) {
          fetchFeaturedStatus();
        }
        
      } catch (error) {
        console.error('Error checking page access:', error);
        setHasAccess(false);
      } finally {
        setPageLoading(false);
      }
    };
    
    checkAccess();
  }, [daoId, userInfo]);

  // Fetch featured status when component mounts and when daoId changes
  const fetchFeaturedStatus = async () => {
    if (!daoId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Call the API to get featured status
      const response = await daosService.getDAOFeaturedStatus(daoId);
      
      setFeaturedStatus(response?.isFeatured || false);
      
      // If featured is active, use featuredUntil from the API response
      if (response?.isFeatured && response?.featuredUntil) {
        setExpiryDate(toUTC(response.featuredUntil));
      } else {
        setExpiryDate(null);
      }
    } catch (err) {
      console.error("Error fetching featured status:", err);
      setError("Failed to load featured status. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate time remaining if featured is active using UTC
  const getTimeRemaining = (): string => {
    if (!expiryDate) return '';
    
    // Use UTC-based calculation to match server/Redis timing
    return formatTimeRemainingUTC(expiryDate);
  };
  
  // Get formatted expiry date in user's local timezone
  const getExpiryDateLocal = (): string => {
    if (!expiryDate) return '';
    
    return formatServerDateToLocal(expiryDate);
  };
  
  // Handle activating the featured service
  const handleActivateFeatured = async () => {
    if (!daoId || !wallet.publicKey) {
      setError('Wallet not connected or DAO not loaded');
      return;
    }

    try {
      setIsLoading(true);
      showTransactionModal('Activating Featured Status', 'Please confirm the transaction in your wallet to activate featured status.');

      // Create the transaction
      const { transaction, featuredAccount } = await createFeaturedTransaction(
        connection,
        { publicKey: wallet.publicKey },
        daoId,
        formState.days
      );

      // Send the transaction
      const signature = await signAndSendTransaction(
        wallet,
        connection,
        transaction
      );
      
      console.log(`Featured activation transaction sent: ${signature}`);
      
      // Show validation state while waiting for indexing
      showTransactionModal(
        'Transaction Confirmed', 
        'Featured activation successful! Waiting for blockchain indexing to complete...', 
        'validating'
      );
      
      // Wait a moment to show the validation state, then hide modal
      setTimeout(() => {
        hideTransactionModal();
      }, 2000);

      // Call the API to activate featured status
      const result = await daosService.enableDAOFeatured(daoId, {
        featured: true,
        days: formState.days,
        pubkey: featuredAccount.publicKey.toString(),
        transaction: signature
      });

      if (result) {
        setIsLoading(false);
        setFeaturedStatus(true);
        if (result.featuredUntil) {
          setExpiryDate(toUTC(result.featuredUntil));
        }
        setIsModalOpen(false);
        
        // Trigger onUpdate if provided
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (err) {
      hideTransactionModal();
      console.error('Error activating featured status:', err);
      setError(`Failed to activate featured status: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Modal for activating featured service
  const renderActivateModal = () => {
    return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 ${isModalOpen ? 'block' : 'hidden'}`}>
        <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Activate Featured Service</h2>
          <div className="mt-4 mb-6">
            <p className="text-gray-300 mb-4">
              The Featured service will make your DAO appear at the top of the landing page, increasing its visibility to all users.
            </p>
            
            <label className="block text-sm font-medium text-white mb-2">
              Duration (days)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                min="1"
                max="30"
                value={formState.days}
                onChange={(e) => setFormState({ ...formState, days: parseInt(e.target.value) || 7 })}
                className="w-full px-3 py-2 bg-[#242424] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Clock size={16} className="ml-2 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Default duration is 7 days. Maximum duration is 30 days.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 rounded-md p-3 mb-4 text-red-300 flex items-start">
              <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            {!wallet.connected ? (
              <WalletMultiButton className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md" />
            ) : (
              <Button
                onClick={handleActivateFeatured}
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Activate'}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // If page is loading, show loading indicator
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-full min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user doesn't have access, show access denied message
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full min-h-screen">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300">
            You do not have permission to access the featured service management page. 
            Only DAO owners, admins, or members with appropriate permissions can manage featured status.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 h-full min-h-screen overflow-auto">
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Featured Service</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 mr-4">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Status</div>
              <div className="text-xl font-bold text-white">
                {featuredStatus ? "Active" : "Inactive"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
              <Clock size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Time Remaining</div>
              <div className="text-xl font-bold text-white mt-1">
                {featuredStatus ? getTimeRemaining() : "Not Active"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 mr-4">
              <Info size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Visibility</div>
              <div className="text-xl font-bold text-white mt-1">
                {featuredStatus ? "Top of Landing Page" : "Standard"}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Card className="mb-8">
        <div className="flex items-center mb-4">
          <Sparkles size={20} className="mr-2 text-amber-500" />
          <h2 className={typography.h2}>Featured Status</h2>
        </div>
        
        <div className="p-4">
          {featuredStatus ? (
            // If featured is active
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-900/30 text-green-400 border border-green-700">
                    <Clock size={14} className="mr-1" />
                    Active
                  </span>
                </div>
                <h3 className="text-xl font-medium mt-3 mb-1">Your DAO is currently featured!</h3>
                <p className="text-gray-400">
                  Your DAO is being prominently displayed at the top of the landing page, increasing visibility to all users.
                </p>
                <div className="mt-4 bg-[#242424] p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-white mt-1">
                    <span className="font-medium">Expires on:</span>{' '}
                    <span className="text-amber-400">{getExpiryDateLocal()}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    You can renew the featured service once the current period expires.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // If featured is inactive
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#242424] text-gray-400 border border-gray-700">
                    <Info size={14} className="mr-1" />
                    Inactive
                  </span>
                </div>
                <h3 className="text-xl font-medium mt-3 mb-1">Featured Service</h3>
                <p className="text-gray-400">
                  Make your DAO stand out by featuring it at the top of the landing page. This increases visibility and attracts more members.
                </p>
                <div className="mt-4 bg-[#242424] p-4 rounded-lg border border-gray-700">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Sparkles size={16} className="text-amber-400 mr-2" />
                    Benefits of Featured Service
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <ArrowRight size={14} className="mt-1 mr-2 text-amber-400" />
                      Increased visibility on the landing page
                    </li>
                    <li className="flex items-start">
                      <ArrowRight size={14} className="mt-1 mr-2 text-amber-400" />
                      Higher chance of attracting new members
                    </li>
                    <li className="flex items-start">
                      <ArrowRight size={14} className="mt-1 mr-2 text-amber-400" />
                      Stand out from other DAOs
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500"
                  onClick={() => setIsModalOpen(true)}
                >
                  Activate Featured
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Modal for activating featured service */}
      {renderActivateModal()}
      
      {/* Transaction pending overlay */}
      {transactionPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
            <div className="text-center">
              <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-white mb-2">Processing Transaction</h3>
              <p className="text-gray-400">Please confirm the transaction in your wallet and wait for it to be processed.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Featured; 