import React from 'react';
import { useParams } from 'react-router-dom';
import { daosService } from '../services/DaosService';
import { rolePermissionService } from '../services/RolePermissionService';
import { useAuth } from '../context/AuthContext';
import { DAOModulesList, DAOModule } from '../core/modules/dao-api';
import { ModuleTypes } from '../types/modules';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import { createModuleTransaction, signAndSendTransaction } from '../utils/solanaTransactions';

interface ModuleCardProps {
  name: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  name, 
  description, 
  isEnabled, 
  onToggle 
}: ModuleCardProps) => {
  return (
    <div className="bg-surface-200 rounded-xl p-6 flex flex-col h-full transition-all hover:shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-text">{name}</h3>
        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
          <input
            type="checkbox"
            id={`toggle-${name}`}
            className="opacity-0 w-0 h-0"
            checked={isEnabled}
            onChange={onToggle}
          />
          <label
            htmlFor={`toggle-${name}`}
            className={`absolute left-0 top-0 right-0 bottom-0 rounded-full cursor-pointer transition-all duration-200 ${
              isEnabled ? 'bg-primary' : 'bg-surface-300'
            }`}
          >
            <span
              className={`absolute left-1 bottom-1 bg-white w-4 h-4 rounded-full transition-all duration-200 ${
                isEnabled ? 'transform translate-x-6' : ''
              }`}
            ></span>
          </label>
        </div>
      </div>
      <p className="text-text-secondary mb-4 flex-grow">{description}</p>
      <button 
        className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
      >
        View details
      </button>
    </div>
  );
};

const Modules: React.FC = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const { userInfo } = useAuth();
  const { connection } = useConnection();
  const wallet = useWallet();
  const [modules, setModules] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [hasAccess, setHasAccess] = React.useState<boolean>(false);
  const [pageLoading, setPageLoading] = React.useState<boolean>(true);
  const [transactionPending, setTransactionPending] = React.useState<boolean>(false);

  // Define available modules with descriptions - only keeping PODS and PROOF_OF_LOVE
  const moduleDetails: Record<string, { name: string; description: string }> = {
    [ModuleTypes.PODS]: {
      name: 'Pods',
      description: 'Organize sub-teams or working groups within your DAO.'
    },
    [ModuleTypes.PROOF_OF_LOVE]: {
      name: 'Proof of Love',
      description: 'Track contributions and rewards for DAO participants.'
    }
  };

  // Check if user has access to the page (owner, admin, or has required permissions)
  React.useEffect(() => {
    const checkAccess = async () => {
      if (!daoId || !userInfo) {
        setPageLoading(false);
        return;
      }
      
      try {
        setPageLoading(true);
        
        // Check if we have cached access data
        const cachedAccess = rolePermissionService.getModuleAccessFromCache(daoId, userInfo.userId);
        
        if (cachedAccess) {
          // Use cached data
          setHasAccess(cachedAccess.hasAccess);
          
          // Only if user has access, fetch DAO modules
          if (cachedAccess.hasAccess) {
            try {
              setLoading(true);
              setError(null);
              
              // Use the actual module fetching API
              const modulesList = await daosService.getDAOModules(daoId);
              if (modulesList) {
                setModules(modulesList.modules);
              } else {
                // Fallback to empty array if no modules returned
                setModules([]);
              }
            } catch (err) {
              console.error('Error fetching DAO modules:', err);
              setError('Failed to load modules');
            } finally {
              setLoading(false);
            }
          }
          
          setPageLoading(false);
          return;
        }
        
        // Check if user is DAO owner/admin
        const isOwnerOrAdmin = await rolePermissionService.isUserDAOAdmin(daoId, userInfo.userId);
        
        // If user is owner or admin, they have access
        if (isOwnerOrAdmin) {
          setHasAccess(true);
          
          // Cache access data
          rolePermissionService.cacheModuleAccess(daoId, userInfo.userId, true);
          
          // Fetch modules only if user has access
          try {
            setLoading(true);
            setError(null);
            
            // Use the actual module fetching API
            const modulesList = await daosService.getDAOModules(daoId);
            if (modulesList) {
              setModules(modulesList.modules);
            } else {
              // Fallback to empty array if no modules returned
              setModules([]);
            }
          } catch (err) {
            console.error('Error fetching DAO modules:', err);
            setError('Failed to load modules');
          } finally {
            setLoading(false);
          }
          
          setPageLoading(false);
          return;
        }
        
        // Otherwise, check if user has any roles (simplified permission check)
        const userRolesResponse = await rolePermissionService.getUserRoles(daoId, userInfo.userId);
        if (!userRolesResponse || !userRolesResponse.roles || userRolesResponse.roles.length === 0) {
          setHasAccess(false);
          
          // Cache the negative response
          rolePermissionService.cacheModuleAccess(daoId, userInfo.userId, false);
          
          setPageLoading(false);
          return;
        }
        
        // If user has any roles, grant access
        setHasAccess(true);
        
        // Cache access data
        rolePermissionService.cacheModuleAccess(daoId, userInfo.userId, true);
        
        // Fetch modules only if user has access
        try {
          setLoading(true);
          setError(null);
          
          // Use the actual module fetching API
          const modulesList = await daosService.getDAOModules(daoId);
          if (modulesList) {
            setModules(modulesList.modules);
          } else {
            // Fallback to empty array if no modules returned
            setModules([]);
          }
        } catch (err) {
          console.error('Error fetching DAO modules:', err);
          setError('Failed to load modules');
        } finally {
          setLoading(false);
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

  const toggleModule = async (moduleName: string) => {
    if (!daoId || !hasAccess || !wallet || !connection || transactionPending) return;
    
    // Check if wallet is connected
    if (!wallet.publicKey) {
      setError("Wallet not connected. Please connect your wallet first.");
      return;
    }

    try {
      const isCurrentlyEnabled = modules.includes(moduleName);
      
      if (!isCurrentlyEnabled) {
        // Only create transaction when adding a module (not removing)
        setTransactionPending(true);
        
        try {
          // Create the Solana transaction
          const { transaction } = await createModuleTransaction(
            connection,
            { publicKey: wallet.publicKey },
            daoId, // Pass daoId directly, the transaction function will handle getting the pubkey
            moduleName
          );
          
          // Send the transaction
          const signature = await signAndSendTransaction(
            wallet,
            connection,
            transaction
          );
          console.log(`Module activation transaction sent: ${signature}`);
          
          // After successful transaction, call the API with the daoId (not public key)
          const moduleData: DAOModule = {
            module: moduleName
          };
          
          const result = await daosService.addDAOModule(daoId, moduleData);
          if (result) {
            setModules([...modules, moduleName]);
            
            // Dispatch module-updated event
            const event = new CustomEvent('module-updated', { 
              detail: { 
                daoId,
                module: moduleName,
                action: 'added'
              } 
            });
            window.dispatchEvent(event);
          }
        } catch (txError) {
          console.error(`Transaction error for module ${moduleName}:`, txError);
          setError(`Transaction failed: ${txError instanceof Error ? txError.message : 'Unknown error'}`);
          return; // Don't proceed with the API call if transaction failed
        } finally {
          setTransactionPending(false);
        }
      } else {
        // For removing a module, just call the API directly (no transaction needed)
        const moduleData: DAOModule = {
          module: moduleName
        };
        
        const result = await daosService.removeDAOModule(daoId, moduleData);
        if (result) {
          setModules(modules.filter((m: string) => m !== moduleName));
          
          // Dispatch module-updated event
          const event = new CustomEvent('module-updated', { 
            detail: { 
              daoId,
              module: moduleName,
              action: 'removed'
            } 
          });
          window.dispatchEvent(event);
        }
      }
    } catch (err) {
      console.error(`Error toggling module ${moduleName}:`, err);
      setError(`Failed to toggle module: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Get all available modules
  const allModules = Object.keys(moduleDetails);

  // Add a function to check if wallet is connected before showing toggle UI
  const handleToggleClick = (moduleName: string) => {
    if (!wallet.connected) {
      setError("Please connect your wallet to activate modules");
    } else {
      toggleModule(moduleName);
    }
  };

  // If page is loading, show loading indicator
  if (pageLoading) {
    return (
      <div className="flex justify-center items-center p-8 h-full min-h-screen">
        <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-primary animate-spin"></div>
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
            You do not have permission to access the modules management page. 
            Only DAO owners, admins, or members with appropriate permissions can manage modules.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-primary animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          <p>{error}</p>
        </div>
        <button 
          className="text-primary hover:text-primary-light transition-colors"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text">DAO Modules</h1>
        <div className="flex items-center gap-4">
          <p className="text-text-secondary">
            {modules.length} of {allModules.length} modules enabled
          </p>
          {!wallet.connected && (
            <WalletMultiButton className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md" />
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-4">
          <p>{error}</p>
          <button 
            className="text-primary hover:text-primary-light transition-colors mt-2"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allModules.map(moduleKey => (
          <ModuleCard 
            key={moduleKey}
            name={moduleDetails[moduleKey].name}
            description={moduleDetails[moduleKey].description}
            isEnabled={modules.includes(moduleKey)}
            onToggle={() => handleToggleClick(moduleKey)}
          />
        ))}
      </div>
      
      {transactionPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-primary animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-medium text-white mb-2">Processing Transaction</h3>
              <p className="text-gray-400">Please confirm the transaction in your wallet and wait for it to be processed.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules; 