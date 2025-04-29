import React from 'react';
import { daosService } from '../../../services/DaosService';
import type { StepId } from '../../BabyWenOnboarding';
import { Shield, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useWallet, type WalletContextState } from '@solana/wallet-adapter-react'; 
import { Connection } from '@solana/web3.js';

// Define the props interface with explicit typing
interface DaoPaymentPageProps {
  onComplete: (nextStep: StepId) => void;
}

/**
 * Standalone payment component for DAO creation
 * This is a full page component rather than a standard onboarding step
 */
const DaoPaymentPage: React.FC<DaoPaymentPageProps> = (props: DaoPaymentPageProps) => {
  // No access to session storage for DAO name as it hasn't been entered yet
  const [isLoading, setIsLoading] = React.useState(true);
  const [transactionStarted, setTransactionStarted] = React.useState(false);
  const [transactionComplete, setTransactionComplete] = React.useState(false);
  const [transactionError, setTransactionError] = React.useState<string | null>(null);
  const [existingPayment, setExistingPayment] = React.useState(false);
  
  // Get the wallet for transaction signing
  const wallet = useWallet();

  // Check if transaction is already stored when component mounts
  React.useEffect(() => {
    const checkTransaction = async () => {
      try {
        setIsLoading(true);
        
        // If no data in sessionStorage, call the API to check
        const isInitialized = await daosService.checkDAOInitialization();
        
        if (isInitialized) {
          console.log('DAO transaction already exists, showing payment found screen');
          // If transaction exists, show payment found screen
          setExistingPayment(true);
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTransaction();
  }, [props]);
  
  // Handle the payment process
  const handleStartTransaction = async () => {
    setTransactionStarted(true);
    setTransactionError(null);
    
    try {
      // Make sure we have a public key
      if (!wallet.publicKey) {
        setTransactionError("Wallet not connected");
        setTransactionStarted(false);
        return;
      }
      
      // Import necessary functions and create the connection
      const { createDaoTransaction, signAndSendTransaction } = await import('../../../utils/solanaTransactions');
      const { SOLANA_RPC_ENDPOINT } = await import('../../../config/solana');
      
      // Create a Solana connection
      const connection = new Connection(SOLANA_RPC_ENDPOINT, 'confirmed');
      
      // Create the transaction for DAO initialization
      // Use a placeholder name since we don't have the real name yet
      const tempDaoName = "New DAO " + Date.now().toString().slice(-6);
      
      // For the initial transaction, we only need the minimum required fields
      const { transaction, daoAccount } = await createDaoTransaction(
        connection,
        { publicKey: wallet.publicKey },
        tempDaoName,             // Temporary placeholder name
        '',                      // No description yet
        '',                      // No social links yet
        '',
        '',
        '',
        '',
        '',
        '',                      // No treasury
        '',                      // No profile picture yet
        '',                      // No token address yet
      );
      
      // Check if wallet can sign transactions
      if (wallet && wallet.signTransaction) {
        // Send the transaction
        const txSignature = await signAndSendTransaction(
          wallet,
          connection,
          transaction
        );
        
        console.log('DAO initialized on blockchain with transaction:', txSignature);
        console.log('DAO account public key:', daoAccount.publicKey.toString());
        
        // Store blockchain DAO address in session storage
        sessionStorage.setItem('blockchainDaoAddress', daoAccount.publicKey.toString());
        
        // Store transaction signature in session storage
        sessionStorage.setItem('blockchainTxSignature', txSignature);
        
        // Update state to show success
        setTransactionStarted(false);
        setTransactionComplete(true);
        
        // Initialize DAO creation after successful blockchain transaction
        try {
          // Call the initializeDAOCreation method with the pubkey and transaction
          const initResult = await daosService.initializeDAOCreation(
            daoAccount.publicKey.toString(),
            txSignature
          );
          
          if (initResult) {
            console.log('DAO initialization successful:', initResult);
            // Note: No automatic redirect - user must click button
          } else {
            console.error('DAO initialization failed');
            setTransactionError("Blockchain transaction successful, but there was an error initializing your DAO on the server.");
            setTransactionStarted(false);
          }
        } catch (initError: any) {
          console.error('Error initializing DAO on server:', initError);
          setTransactionError("Blockchain transaction successful, but there was an error initializing your DAO: " + (initError.message || "Unknown error"));
          setTransactionStarted(false);
        }
      } else {
        console.error('Wallet not available or does not support signing');
        setTransactionStarted(false);
        setTransactionError("Your wallet doesn't support transaction signing");
      }
    } catch (error: any) {
      console.error('Error creating DAO on blockchain:', error);
      setTransactionStarted(false);
      setTransactionError(error.message || 'Unknown error');
    }
  };
  
  // Show loading indicator while checking
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-indigo-300 text-lg">Checking transaction status...</p>
        </div>
      </div>
    );
  }
  
  // Show existing payment found screen
  if (existingPayment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-4">
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Payment Already Completed!</h2>
          <p className="text-blue-200 text-center mb-8">
            We've found that you've already completed the payment for your DAO.
            You can continue with your DAO creation process.
          </p>
          <button
            onClick={() => props.onComplete('dao-name')}
            className="px-8 py-3 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all shadow-lg font-medium"
          >
            Continue to DAO Creation <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }
  
  // Show transaction success screen
  if (transactionComplete) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-4">
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 size={48} className="text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
          <p className="text-emerald-200 text-center mb-8">
            Your DAO has been successfully initialized on the Solana blockchain.
            You can now begin creating your DAO.
          </p>
          <button
            onClick={() => props.onComplete('dao-name')}
            className="px-8 py-3 flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all shadow-lg font-medium"
          >
            Begin DAO Creation <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }
  
  // Show transaction error
  if (transactionError) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-4">
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
            <AlertCircle size={48} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Transaction Failed</h2>
          <p className="text-red-200 text-center mb-6">
            {transactionError}
          </p>
          <button 
            onClick={handleStartTransaction}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-lg transition-all shadow-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Show transaction in progress
  if (transactionStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-4">
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8 max-w-xl w-full flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-l-2 border-indigo-500 mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Transaction</h2>
          <p className="text-indigo-200 text-center mb-8">
            Please wait while we initialize your DAO on the blockchain. 
            This may take up to a minute to complete.
          </p>
          <div className="w-full max-w-sm bg-indigo-900/40 rounded-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-slow w-3/4"></div>
          </div>
          <p className="text-indigo-300 mt-4 text-sm">
            Please confirm the transaction in your wallet if prompted
          </p>
        </div>
      </div>
    );
  }
  
  // Main payment page
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex justify-center items-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your DAO on Solana</h1>
          <p className="text-indigo-300 max-w-2xl mx-auto">
            Before you can begin setting up your DAO, we need to create a blockchain registration for your organization.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {/* Free Plan (Disabled) */}
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6 opacity-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="block text-gray-400 text-sm font-medium mb-1">Basic</span>
                <span className="text-2xl font-bold text-gray-300">Free</span>
              </div>
              <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs">Limited</span>
            </div>
            <div className="border-t border-gray-700 my-4 pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Basic DAO features
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Community tools
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Limited voting
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✕</span> No blockchain record
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✕</span> No on-chain governance
                </li>
              </ul>
            </div>
            <button 
              disabled
              className="w-full py-2.5 bg-gray-800 text-gray-400 rounded-lg mt-4 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
          
          {/* Standard Plan (Highlighted) */}
          <div className="bg-gradient-to-b from-indigo-800/20 to-indigo-900/20 rounded-xl border border-indigo-500/40 p-6 transform scale-105 shadow-xl relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1 rounded-full text-white text-xs font-medium">
              Required
            </div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="block text-indigo-300 text-sm font-medium mb-1">Standard</span>
                <span className="text-2xl font-bold text-white">0.05 SOL</span>
              </div>
              <span className="bg-indigo-900/60 text-indigo-300 px-3 py-1 rounded-full text-xs">One-time Fee</span>
            </div>
            <div className="border-t border-indigo-500/20 my-4 pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center text-indigo-100">
                  <span className="mr-2 text-indigo-400">✓</span> Blockchain registration
                </li>
                <li className="flex items-center text-indigo-100">
                  <span className="mr-2 text-indigo-400">✓</span> Full DAO creation access
                </li>
                <li className="flex items-center text-indigo-100">
                  <span className="mr-2 text-indigo-400">✓</span> Token management
                </li>
                <li className="flex items-center text-indigo-100">
                  <span className="mr-2 text-indigo-400">✓</span> On-chain governance
                </li>
                <li className="flex items-center text-indigo-100">
                  <span className="mr-2 text-indigo-400">✓</span> Unlimited community members
                </li>
              </ul>
            </div>
            <button 
              onClick={handleStartTransaction}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg mt-4 shadow-lg shadow-indigo-500/30 font-medium transition-all"
            >
              Register DAO & Continue
            </button>
          </div>
          
          {/* Premium Plan (Disabled) */}
          <div className="bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-xl border border-gray-700 p-6 opacity-50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="block text-gray-400 text-sm font-medium mb-1">Enterprise</span>
                <span className="text-2xl font-bold text-gray-300">0.2 SOL</span>
              </div>
              <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-xs">Advanced</span>
            </div>
            <div className="border-t border-gray-700 my-4 pt-4">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Everything in Standard
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Custom token distribution
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Advanced treasury
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Premium support
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">✓</span> Custom governance rules
                </li>
              </ul>
            </div>
            <button 
              disabled
              className="w-full py-2.5 bg-gray-800 text-gray-400 rounded-lg mt-4 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="bg-gradient-to-r from-indigo-900/10 to-purple-900/10 rounded-xl border border-indigo-500/20 p-6 mb-8">
          <h3 className="text-xl font-medium text-white mb-4 flex items-center">
            <Shield className="mr-2 text-indigo-400" size={20} /> 
            Required Blockchain Registration
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-indigo-300 font-medium mb-2">Why Registration is Required</h4>
              <p className="text-indigo-100 text-sm">
                To create a true DAO on Solana, we need to deploy smart contracts that
                establish your organization's identity and governance structure on-chain.
              </p>
            </div>
            
            <div>
              <h4 className="text-indigo-300 font-medium mb-2">One-Time Payment</h4>
              <p className="text-indigo-100 text-sm">
                This is a one-time fee that covers blockchain transaction costs,
                smart contract deployment, and permanent storage of your DAO's data.
              </p>
            </div>
            
            <div>
              <h4 className="text-indigo-300 font-medium mb-2">Secure and Transparent</h4>
              <p className="text-indigo-100 text-sm">
                Your DAO will be registered on the Solana blockchain, providing
                immutable proof of your organization's existence and structure.
              </p>
            </div>
            
            <div>
              <h4 className="text-indigo-300 font-medium mb-2">Full Access to Tools</h4>
              <p className="text-indigo-100 text-sm">
                After registration, you'll unlock complete access to all DAO creation
                tools, governance features, and management capabilities.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/40 p-6">
          <h3 className="text-lg font-medium text-white mb-4">Frequently Asked Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-indigo-300 font-medium mb-1">Why do I need to pay before starting?</h4>
              <p className="text-gray-300 text-sm">
                Creating a DAO on Solana requires blockchain transactions and smart contract deployments
                that incur costs. We require payment upfront to ensure that only committed users
                begin the process, reducing spam and abandoned DAOs.
              </p>
            </div>
            
            <div>
              <h4 className="text-indigo-300 font-medium mb-1">What will I be able to do after payment?</h4>
              <p className="text-gray-300 text-sm">
                After completing this one-time payment, you'll get access to our complete DAO creation
                workflow, where you'll define your DAO's name, membership rules, governance structure,
                and token economics.
              </p>
            </div>
            
            <div>
              <h4 className="text-indigo-300 font-medium mb-1">Is there any way to try before paying?</h4>
              <p className="text-gray-300 text-sm">
                Currently, we require blockchain registration to use our DAO creation tools. We're 
                working on a free plan with limited features that doesn't require on-chain registration,
                but it's not available yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the component as the default export
export default DaoPaymentPage; 