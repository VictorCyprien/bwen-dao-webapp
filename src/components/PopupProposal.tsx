import React, { useState } from 'react';
import { X, Check, AlertTriangle, ThumbsUp, ThumbsDown, Users, Calendar, Clock, Minus, Wallet, UserMinus, ArrowUpRight } from 'lucide-react';
import { proposalService } from '../services/ProposalService';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import Modal from './common/Modal';
import Button from './common/Button';

interface ProposalVotes {
  for: number;
  against: number;
}

interface ProposalActions {
  type: string;
  description: string;
  walletAddress?: string;
  amount?: string;
  token?: string;
}

interface ProposalDetails {
  id: string;
  name: string;
  description: string;
  status: string;
  creator: string;
  createdAt: string;
  startTime: string;
  endTime: string;
  votes: ProposalVotes;
  actions: ProposalActions[];
  quorum: number;
  minApproval: number;
  daoId: string;
  isPodProposal?: boolean;
  podId?: string;
}

interface PopupProposalProps {
  proposal: ProposalDetails;
  onClose: () => void;
  onVoteSubmitted?: () => void;
  onVote?: (proposalId: string, vote: 'for' | 'against') => Promise<any>;
  wallet?: WalletContextState;
  canVote?: boolean;
}

const PopupProposal: React.FC<PopupProposalProps> = ({ proposal, onClose, onVoteSubmitted, onVote, wallet, canVote = true }) => {
  const [voteOption, setVoteOption] = useState<'for' | 'against' | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localProposal, setLocalProposal] = useState<ProposalDetails>(proposal);

  const walletState = useWallet();

  // Update local state when the parent provides a new proposal
  useEffectOnce(() => {
    setLocalProposal(proposal);
  }, [proposal]);

  const handleVote = async () => {
    if (!voteOption) return;
    if (!localProposal.daoId) {
      setError('Missing DAO ID. Cannot submit vote.');
      return;
    }
    
    // Check if wallet is connected
    if (!walletState || !walletState.connected) {
      setError('Wallet not connected. Please connect your wallet to vote.');
      return;
    }
    
    setIsVoting(true);
    setError(null);
    
    try {
      if (onVote) {
        console.log('Submitting vote via blockchain transaction');
        await onVote(localProposal.id, voteOption);
        setHasVoted(true);
        
        // Call the parent's callback to refresh the proposal data
        if (onVoteSubmitted) {
          onVoteSubmitted();
        }
      } else {
        setError('Voting is not available at this time.');
      }
    } catch (err) {
      console.error('Error voting on proposal:', err);
      setError(`An error occurred while voting: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsVoting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-900/20 text-green-400 border border-green-700/30';
      case 'pending':
        return 'bg-yellow-900/20 text-yellow-400 border border-yellow-700/30';
      case 'passed':
        return 'bg-blue-900/20 text-blue-400 border border-blue-700/30';
      case 'rejected':
        return 'bg-red-900/20 text-red-400 border border-red-700/30';
      default:
        return 'bg-gray-900/20 text-gray-400 border border-gray-700/30';
    }
  };

  const calculateProgress = () => {
    const total = (localProposal.votes.for || 0) + (localProposal.votes.against || 0);
    const forPercentage = total > 0 ? (localProposal.votes.for / total) * 100 : 0;
    const againstPercentage = total > 0 ? (localProposal.votes.against / total) * 100 : 0;
    
    return {
      for: forPercentage,
      against: againstPercentage,
      quorumMet: total >= localProposal.quorum,
      approvalMet: forPercentage >= localProposal.minApproval,
      total: total
    };
  };

  const progress = calculateProgress();

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={localProposal.name}
      maxWidth="max-w-4xl"
    >
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#151515] p-4 rounded-xl border border-gray-800">
            <div className="flex items-center text-gray-400 mb-2">
              <Calendar size={16} className="mr-2" />
              <span className="text-sm font-medium">Start Date</span>
            </div>
            <p className="text-white">{localProposal.startTime}</p>
          </div>
          
          <div className="bg-[#151515] p-4 rounded-xl border border-gray-800">
            <div className="flex items-center text-gray-400 mb-2">
              <Clock size={16} className="mr-2" />
              <span className="text-sm font-medium">End Date</span>
            </div>
            <p className="text-white">{localProposal.endTime}</p>
          </div>
          
          <div className="bg-[#151515] p-4 rounded-xl border border-gray-800">
            <div className="flex items-center text-gray-400 mb-2">
              <Users size={16} className="mr-2" />
              <span className="text-sm font-medium">Created By</span>
            </div>
            <p className="text-white truncate">{localProposal.creator}</p>
          </div>
        </div>
        
        <div className="bg-[#151515] p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-4">Description</h3>
          <p className="text-gray-300 whitespace-pre-line">{localProposal.description}</p>
        </div>
        
        {localProposal.actions.length > 0 && (
          <div className="bg-[#151515] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-medium text-white mb-4">Actions</h3>
            <ul className="space-y-4">
              {localProposal.actions.map((action, index) => (
                <li key={index} className="flex items-start bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                  <Check size={18} className="text-purple-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-white">{action.description}</p>
                    {action.walletAddress && (
                      <p className="text-gray-400 text-sm font-mono mt-2">
                        {action.walletAddress}
                      </p>
                    )}
                    {action.amount && action.token && (
                      <p className="text-gray-400 text-sm mt-2">
                        Amount: {action.amount} {action.token}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="bg-[#151515] p-6 rounded-xl border border-gray-800">
          <h3 className="text-lg font-medium text-white mb-4">Current Votes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Quorum</span>
                <span className={progress.quorumMet ? "text-green-400" : "text-yellow-400"}>
                  {progress.quorumMet ? "Met" : `${progress.total}/${localProposal.quorum} needed`}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((progress.total / localProposal.quorum) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Approval</span>
                <span className={progress.approvalMet ? "text-green-400" : "text-yellow-400"}>
                  {progress.approvalMet ? "Met" : `${progress.for.toFixed(1)}%/${localProposal.minApproval}% needed`}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.for}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
            <div className="flex space-x-2 mb-2">
              <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                  style={{ width: `${progress.for}%` }}
                />
              </div>
              <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-pink-600 transition-all duration-300"
                  style={{ width: `${progress.against}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-medium text-purple-400">{localProposal.votes.for}</div>
                <div className="text-sm text-gray-400">For ({progress.for.toFixed(1)}%)</div>
              </div>
              <div>
                <div className="text-lg font-medium text-red-400">{localProposal.votes.against}</div>
                <div className="text-sm text-gray-400">Against ({progress.against.toFixed(1)}%)</div>
              </div>
            </div>
          </div>
        </div>
        
        {canVote && !hasVoted && (
          <div className="bg-[#151515] p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-medium text-white mb-4">Cast Your Vote</h3>
            
            {error && (
              <div className="flex items-start space-x-3 p-4 bg-red-900/20 border border-red-700/50 rounded-lg mb-4">
                <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-red-300">{error}</span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button
                onClick={() => canVote && setVoteOption('for')}
                disabled={isVoting}
                className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all
                  ${voteOption === 'for' 
                    ? 'bg-purple-900/20 border-2 border-purple-500' 
                    : 'bg-[#1a1a1a] border-2 border-gray-800 hover:border-purple-500/50'}
                  ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsUp size={28} className={voteOption === 'for' ? 'text-purple-400' : 'text-gray-400'} />
                <span className={`mt-2 font-medium ${voteOption === 'for' ? 'text-purple-400' : 'text-gray-400'}`}>
                  Vote For
                </span>
              </button>
              
              <button
                onClick={() => canVote && setVoteOption('against')}
                disabled={isVoting}
                className={`p-4 rounded-xl flex flex-col items-center justify-center transition-all
                  ${voteOption === 'against' 
                    ? 'bg-red-900/20 border-2 border-red-500' 
                    : 'bg-[#1a1a1a] border-2 border-gray-800 hover:border-red-500/50'}
                  ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <ThumbsDown size={28} className={voteOption === 'against' ? 'text-red-400' : 'text-gray-400'} />
                <span className={`mt-2 font-medium ${voteOption === 'against' ? 'text-red-400' : 'text-gray-400'}`}>
                  Vote Against
                </span>
              </button>
            </div>
            
            <Button
              variant="primary"
              onClick={handleVote}
              disabled={!voteOption || isVoting}
              className={`w-full p-3 ${
                voteOption === 'for' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                  : voteOption === 'against'
                    ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                    : 'bg-gray-700'
              }`}
            >
              {isVoting ? 'Submitting Vote...' : `Submit ${voteOption ? (voteOption === 'for' ? 'For' : 'Against') : ''} Vote`}
            </Button>
          </div>
        )}
        
        {hasVoted && (
          <div className="bg-[#151515] p-6 rounded-xl border border-gray-800 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/20 border-2 border-green-500 mb-4">
              <Check size={32} className="text-green-400" />
            </div>
            <h4 className="text-xl font-medium text-white mb-2">Vote Submitted Successfully!</h4>
            <p className="text-gray-400">Thank you for participating in this proposal.</p>
          </div>
        )}
        
        {!canVote && (
          <div className="bg-[#151515] p-6 rounded-xl border border-gray-800">
            <div className="flex flex-col items-center w-full">
              <p className="text-gray-400 mb-4 text-center">
                {localProposal.isPodProposal 
                  ? "You must be a member of this pod to vote on proposals."
                  : "You must be a member of this DAO to vote on proposals."
                }
              </p>
              <Button
                variant="primary"
                onClick={() => window.location.href = localProposal.isPodProposal 
                  ? `/daos/${localProposal.daoId}/pods/${localProposal.podId}`
                  : `/daos/${localProposal.daoId}`
                }
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {localProposal.isPodProposal ? "Join Pod to Participate" : "Join DAO to Participate"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PopupProposal; 