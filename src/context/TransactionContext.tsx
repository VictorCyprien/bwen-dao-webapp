import React from 'react';
const { createContext, useContext, useState } = React;
import TransactionModal from '../components/common/TransactionModal';

interface TransactionContextType {
  showTransactionModal: (title?: string, message?: string, type?: 'processing' | 'success' | 'error' | 'validating') => void;
  hideTransactionModal: () => void;
  isTransactionModalOpen: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

interface TransactionProviderProps {
  children: React.ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({ children }: TransactionProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('Processing Transaction');
  const [message, setMessage] = useState<string>('Please confirm the transaction in your wallet and wait for it to be processed.');
  const [type, setType] = useState<'processing' | 'success' | 'error' | 'validating'>('processing');

  const showTransactionModal = (
    modalTitle?: string,
    modalMessage?: string,
    modalType: 'processing' | 'success' | 'error' | 'validating' = 'processing'
  ) => {
    setTitle(modalTitle || 'Processing Transaction');
    setMessage(modalMessage || 'Please confirm the transaction in your wallet and wait for it to be processed.');
    setType(modalType);
    setIsOpen(true);
  };

  const hideTransactionModal = () => {
    setIsOpen(false);
  };

  const value: TransactionContextType = {
    showTransactionModal,
    hideTransactionModal,
    isTransactionModalOpen: isOpen,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
      <TransactionModal
        isOpen={isOpen}
        title={title}
        message={message}
        type={type}
      />
    </TransactionContext.Provider>
  );
};

export const useTransaction = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}; 