import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { proposalService } from '../services/ProposalService';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import Modal from './common/Modal';

interface CreateProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  daoId?: string;
  podId?: string;
  podName?: string;
  createWithTransaction?: (title: string, description: string, endDate: Date) => Promise<any>;
  wallet?: WalletContextState;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  daoId, 
  podId, 
  podName,
  createWithTransaction,
  wallet
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when the modal is opened or closed
  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      resetForm();
    }
  }, [isOpen]);

  // Helper function to reset form fields
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEndDate('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!daoId) {
      setError('No DAO ID provided. Please select a DAO first.');
      return;
    }

    if (!podId) {
      setError('No POD ID provided. Please select a POD first.');
      return;
    }

    if (!title.trim()) {
      setError('Proposal title is required');
      return;
    }

    if (!description.trim()) {
      setError('Proposal description is required');
      return;
    }

    if (!endDate) {
      setError('End date is required');
      return;
    }

    // Check if wallet is connected
    if (!wallet || !wallet.connected) {
      setError('Wallet not connected. Please connect your wallet to create a proposal.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (createWithTransaction) {
        // Create proposal using blockchain transaction
        console.log('Creating proposal with blockchain transaction');
        const result = await createWithTransaction(
          title.trim(),
          description.trim(),
          new Date(endDate)
        );
        
        if (result) {
          console.log('Proposal created successfully:', result);
          resetForm();
          onSuccess();
          onClose();
        } else {
          setError('Failed to create proposal. Please try again.');
        }
      } else {
        // Fallback if blockchain transaction isn't available
        setError('Proposal creation is not available at this time.');
      }
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error creating proposal:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate minimum date for the end date picker (tomorrow)
  const minDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create a Proposal for ${podName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="mb-4">
          <label htmlFor="proposal-title" className="block text-gray-300 mb-1">
            Title*
          </label>
          <input
            id="proposal-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white focus:outline-none focus:border-purple-600"
            placeholder="Enter proposal title"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="proposal-description" className="block text-gray-300 mb-1">
            Description*
          </label>
          <textarea
            id="proposal-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white focus:outline-none focus:border-purple-600 h-32"
            placeholder="Enter proposal description"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="proposal-end-date" className="block text-gray-300 mb-1">
            End Date*
          </label>
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-500" />
              </div>
              <input
                id="proposal-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={minDate()}
                className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 pl-8 text-white focus:outline-none focus:border-purple-600"
                required
              />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-1">
            The proposal will start immediately upon creation and end on this date.
          </p>
        </div>

        {!wallet?.connected && (
          <div className="p-3 bg-yellow-900/30 border border-yellow-800 text-yellow-300 rounded-md mb-4 text-sm flex items-start">
            <AlertTriangle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>Please connect your wallet to create a proposal.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 text-red-400 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !wallet?.connected}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:opacity-90 disabled:opacity-70 transition-all"
          >
            {loading ? 'Creating...' : 'Create Proposal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProposalModal; 