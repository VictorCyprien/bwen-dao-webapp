import React, { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';
import { proposalService } from '../services/ProposalService';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import Modal from './common/Modal';
import Button from './common/Button';

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
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <div className="bg-[#151515] p-6 rounded-xl border border-gray-800">
          <div className="space-y-6">
            <div>
              <label htmlFor="proposal-title" className="block text-sm font-medium text-gray-300 mb-2">
                Title*
              </label>
              <input
                id="proposal-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Enter a clear, descriptive title"
                required
              />
            </div>

            <div>
              <label htmlFor="proposal-description" className="block text-sm font-medium text-gray-300 mb-2">
                Description*
              </label>
              <textarea
                id="proposal-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[160px]"
                placeholder="Provide detailed information about your proposal"
                required
              />
            </div>

            <div>
              <label htmlFor="proposal-end-date" className="block text-sm font-medium text-gray-300 mb-2">
                End Date*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-500" />
                </div>
                <input
                  id="proposal-end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={minDate()}
                  className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The proposal will start immediately upon creation
              </p>
            </div>
          </div>
        </div>

        {!wallet?.connected && (
          <div className="flex items-start space-x-3 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
            <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-yellow-300">
              Please connect your wallet to create a proposal
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-red-300">{error}</span>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading || !wallet?.connected}
            className="px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Proposal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProposalModal; 