import { OnboardingStep } from '../../../BabyWenOnboarding';
import React, { useEffect, useState } from 'react';
import { daosService } from '../../../../services/DaosService';

// Create a custom component for the transaction step
const TransactionStatusComponent: React.FC<{
  onSelectOption: (option: string, data?: any) => void;
}> = ({ onSelectOption }) => {
  // Access session storage to display DAO name
  const daoName = sessionStorage.getItem('daoName') || 'Your DAO';
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if transaction is already stored when component mounts
  useEffect(() => {
    const checkTransaction = async () => {
      try {
        setIsLoading(true);
        
        // If no data in sessionStorage, call the API to check
        const isInitialized = await daosService.checkDAOInitialization();
        
        if (isInitialized) {
          console.log('DAO transaction already exists, skipping to next step');
          // If transaction exists, automatically proceed to next step
          onSelectOption('transaction_exists');
        }
      } catch (error) {
        console.error('Error checking transaction status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkTransaction();
  }, [onSelectOption]);
  
  // Show loading indicator while checking
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-indigo-300">Checking transaction status...</p>
        </div>
      </div>
    );
  }
  
  // We'll only show this component before the transaction begins
  // Once the transaction is started, the parent component will take over
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-medium text-white mb-3">Transaction Required</h3>
        <p className="text-indigo-200 mb-4">
          We need to create "<span className="font-bold text-white">{daoName}</span>" on the blockchain. 
          This requires a transaction from your wallet.
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
              <span className="text-indigo-300 text-xs">1</span>
            </div>
            <p className="text-indigo-200 text-sm">Create a blockchain record for your DAO</p>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
              <span className="text-indigo-300 text-xs">2</span>
            </div>
            <p className="text-indigo-200 text-sm">Register the DAO name on-chain</p>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3">
              <span className="text-indigo-300 text-xs">3</span>
            </div>
            <p className="text-indigo-200 text-sm">Reserve your DAO's unique identifier</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onSelectOption('start_transaction')}
        className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg transition-all font-medium"
      >
        Create Blockchain Transaction
      </button>
    </div>
  );
};

const DaoTransactionStep: OnboardingStep = {
  id: 'dao-transaction',
  messages: [
    {
      content: `Great! Now let's create your DAO on the blockchain. This is an important first step that needs to be completed before we can set up the rest of your DAO.`
    }
  ],
  customComponent: TransactionStatusComponent,
  onCustomComponentResponse: (option: string, data?: any) => {
    if (option === 'start_transaction') {
      return {
        responseMessage: "Processing your transaction... This might take a moment. You'll need to confirm the transaction in your wallet.",
        nextStep: 'dao-description'
      };
    }
    
    // If transaction already exists, skip to next step with appropriate message
    if (option === 'transaction_exists') {
      return {
        responseMessage: "You've already completed the blockchain transaction for this DAO. Let's continue setting up your DAO.",
        nextStep: 'dao-description'
      };
    }
    
    return {
      nextStep: 'dao-description'
    };
  },
  onResponse: (response: string) => {
    // This is a fallback, the custom component should handle the response
    return {
      nextStep: 'dao-description'
    };
  }
};

export default DaoTransactionStep; 