import React from 'react';

interface TransactionModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  type?: 'processing' | 'success' | 'error' | 'validating';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  title = 'Processing Transaction',
  message = 'Please confirm the transaction in your wallet and wait for it to be processed.',
  type = 'processing'
}: TransactionModalProps) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      case 'validating':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'processing':
      default:
        return (
          <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-primary animate-spin mx-auto mb-4"></div>
        );
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'validating':
        return 'text-blue-400';
      case 'processing':
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full shadow-2xl border border-gray-700 mx-4">
        <div className="text-center">
          {getIcon()}
          <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
          <p className={getTextColor()}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal; 