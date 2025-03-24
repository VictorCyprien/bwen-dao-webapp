import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Plus, X, Check, AlertCircle, ChevronRight } from 'lucide-react';
import PopupProposal from './PopupProposal';
import { containers, typography, ui, utils } from '../styles/theme';
import { proposalService } from '../services/ProposalService';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useSolanaTransaction } from '../hooks/useSolanaTransaction';
import { SOLANA_RPC_ENDPOINT } from '../config/solana';
import { toast } from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';

interface Action {
  type: string;
  walletAddress?: string;
  tokenAmount?: string;
  tokenSymbol?: string;
}

interface ProposalForm {
  title: string;
  description: string;
  startTime: string;
  customStartDate: string;
  customStartTime: string;
  expirationDays: string;
  expirationHours: string;
  expirationMinutes: string;
  actions: Action[];
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
  votes: {
    for: number;
    against: number;
  };
  actions: {
    type: string;
    description: string;
    walletAddress?: string;
    amount?: string;
    token?: string;
  }[];
  quorum: number;
  minApproval: number;
  daoId: string;
}

const Governance = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalStep, setProposalStep] = useState(1);
  const [proposal, setProposal] = useState<ProposalForm>({
    title: '',
    description: '',
    startTime: 'now',
    customStartDate: '',
    customStartTime: '',
    expirationDays: '3',
    expirationHours: '0',
    expirationMinutes: '0',
    actions: []
  });
  const [selectedProposal, setSelectedProposal] = useState<ProposalDetails | null>(null);
  const [proposals, setProposals] = useState<ProposalDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIsDaoMember, setUserIsDaoMember] = useState<boolean>(false);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);
  const [showMembershipTooltip, setShowMembershipTooltip] = useState<boolean>(false);
  
  // Get Solana transaction utilities from our custom hook
  const { 
    sendTransaction, 
    isLoading: isTransactionLoading, 
    isSuccess: isTransactionSuccess,
    isError: isTransactionError,
    error: transactionError,
    signature: transactionSignature,
    publicKey,
    connected
  } = useSolanaTransaction();

  const wallet = useWallet();
  const connection = new Connection(SOLANA_RPC_ENDPOINT);

  // Initialize Solana connection once on component mount
  useEffectOnce(() => {
    // Initialize the Solana connection with our configured endpoint
    proposalService.initializeSolanaConnection(SOLANA_RPC_ENDPOINT);
  });

  // Fetch proposals when the component mounts
  useEffectOnce(() => {
    console.log("Governance component mounted with daoId:", daoId);
    if (daoId) {
      fetchProposals();
    }
  });

  // Check if the current user is a member of the DAO
  const checkDaoMembership = async () => {
    if (!daoId || !publicKey) return;
    
    try {
      setMembershipLoading(true);
      
      // Get the current user's ID
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setUserIsDaoMember(false);
        setMembershipLoading(false);
        return;
      }
      
      // Call the DAO-API SDK to check membership
      const members = await daosService.getDaoMembers(daoId);
      console.log('DAO members:', members);
      console.log('Current user ID:', currentUser.userId);
      
      // Check if the user is a member by userId
      const isMember = members.some((member: any) => member.userId === currentUser.userId);
      
      console.log('User is DAO member:', isMember);
      setUserIsDaoMember(isMember);
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error checking DAO membership:', err);
      setUserIsDaoMember(false);
      setMembershipLoading(false);
    }
  };

  // Check membership when component loads or when relevant data changes
  useEffect(() => {
    if (daoId && publicKey && connected) {
      checkDaoMembership();
    }
  }, [daoId, publicKey, connected]);

  // Watch for transaction success/error to proceed with API updates
  useEffectOnce(() => {
    if (isTransactionSuccess && transactionSignature) {
      // If we just completed a proposal creation transaction, continue with API call
      handleCreateProposalAPI(transactionSignature);
    }
    
    if (isTransactionError) {
      setIsSubmitting(false);
      alert(`Transaction failed: ${transactionError?.message || 'Unknown error'}`);
    }
  }, [isTransactionSuccess, isTransactionError, transactionSignature]);

  const fetchProposals = async () => {
    if (!daoId) {
      console.error("No daoId available, cannot fetch proposals");
      return;
    }
    
    console.log(`Fetching proposals for DAO ${daoId}`);
    setIsLoading(true);
    try {
      const fetchedProposals = await proposalService.getAllProposals(daoId);
      console.log("Fetched proposals:", fetchedProposals);
      
      if (!fetchedProposals || fetchedProposals.length === 0) {
        console.log("No proposals returned from API or empty array");
        setProposals([]);
        return;
      }
      
      // Transform API proposals to our component's format
      const transformedProposals = fetchedProposals.map(p => ({
        id: p.proposalId || '',
        name: p.name || '',
        description: p.description || '',
        status: p.isActive ? 'Active' : p.hasPassed ? 'Passed' : 'Rejected',
        creator: p.createdByUsername || 'Unknown',
        createdAt: formatDate(new Date()), // API doesn't provide created_at
        startTime: formatDate(p.startTime instanceof Date ? p.startTime : new Date(p.startTime)),
        endTime: formatDate(p.endTime instanceof Date ? p.endTime : new Date(p.endTime)),
        votes: {
          for: p.forVotesCount || 0,
          against: p.againstVotesCount || 0,
        },
        actions: Object.values(p.actions || {}).map((action: any) => ({
          type: action.type || '',
          description: action.description || '',
          walletAddress: action.wallet_address,
          amount: action.amount,
          token: action.token
        })),
        quorum: 1000, // Default values, should be retrieved from DAO settings
        minApproval: 60,
        daoId: p.daoId
      }));
      setProposals(transformedProposals);
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProposal({ ...proposal, [name]: value });
  };

  const nextStep = () => {
    setProposalStep(proposalStep + 1);
  };

  const prevStep = () => {
    setProposalStep(proposalStep - 1);
  };

  const resetForm = () => {
    setProposalStep(1);
    setShowProposalForm(false);
    setProposal({
      title: '',
      description: '',
      startTime: 'now',
      customStartDate: '',
      customStartTime: '',
      expirationDays: '3',
      expirationHours: '0',
      expirationMinutes: '0',
      actions: []
    });
  };

  const toggleAction = (actionType: string) => {
    // Find if this action type already exists in the actions array
    const existingActionIndex = proposal.actions.findIndex(action => action.type === actionType);
    
    if (existingActionIndex >= 0) {
      // If it exists, remove it
      const updatedActions = [...proposal.actions];
      updatedActions.splice(existingActionIndex, 1);
      setProposal({ ...proposal, actions: updatedActions });
    } else {
      // If it doesn't exist, add it
      const newAction: Action = {
        type: actionType,
        walletAddress: '',
        tokenAmount: '',
        tokenSymbol: 'SOL'
      };
      setProposal({ ...proposal, actions: [...proposal.actions, newAction] });
    }
  };

  const updateActionField = (actionType: string, fieldName: string, value: string) => {
    const updatedActions = proposal.actions.map(action => {
      if (action.type === actionType) {
        return { ...action, [fieldName]: value };
      }
      return action;
    });
    
    setProposal({ ...proposal, actions: updatedActions });
  };

  const calculateExpirationTime = () => {
    const days = parseInt(proposal.expirationDays) || 0;
    const hours = parseInt(proposal.expirationHours) || 0;
    const minutes = parseInt(proposal.expirationMinutes) || 0;
    
    let totalTime = '';
    if (days > 0) totalTime += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0) totalTime += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) totalTime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    
    return totalTime.trim() || 'No expiration set';
  };

  const getActionDescription = (action: Action) => {
    switch (action.type) {
      case 'authorize':
        return `Authorize wallet ${action.walletAddress} to multisig`;
      case 'remove':
        return `Remove wallet ${action.walletAddress} from multisig`;
      case 'withdraw':
        return `Withdraw ${action.tokenAmount} ${action.tokenSymbol} to ${action.walletAddress}`;
      default:
        return 'Unknown action';
    }
  };

  const isActionSelected = (actionType: string) => {
    return proposal.actions.some(action => action.type === actionType);
  };

  const getActionByType = (actionType: string) => {
    return proposal.actions.find(action => action.type === actionType);
  };

  // Step 1: Create and send the blockchain transaction
  const handleCreateProposalTransaction = async () => {
    if (!publicKey || !wallet) {
      alert('Wallet not connected.');
      return;
    }
    
    if (!daoId) {
      alert('DAO ID is missing.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(`Starting proposal creation for DAO ID: ${daoId}`);
      console.log(`Using wallet public key: ${publicKey.toString()}`);
      
      // Calculate start and end dates
      let startDate = new Date();
      if (proposal.startTime === 'custom' && proposal.customStartDate && proposal.customStartTime) {
        startDate = new Date(`${proposal.customStartDate}T${proposal.customStartTime}`);
      }
      
      // Calculate end date based on expiration time
      const days = parseInt(proposal.expirationDays) || 0;
      const hours = parseInt(proposal.expirationHours) || 0;
      const minutes = parseInt(proposal.expirationMinutes) || 0;
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
      endDate.setHours(endDate.getHours() + hours);
      endDate.setMinutes(endDate.getMinutes() + minutes);
      
      // Make sure voting period is at least 5 minutes to avoid too short periods
      const minVotingPeriod = 5 * 60 * 1000; // 5 minutes in milliseconds
      if (endDate.getTime() - startDate.getTime() < minVotingPeriod) {
        alert('Voting period must be at least 5 minutes long.');
        setIsSubmitting(false);
        return;
      }

      // Format actions for the transaction (simplified for now)
      const actions = proposal.actions.map(action => {
        return {
          type: action.type,
          walletAddress: action.walletAddress,
          amount: action.tokenAmount,
          token: action.tokenSymbol
        };
      });
      
      console.log('Creating proposal transaction with data:', {
        title: proposal.title,
        description: proposal.description,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        votingPeriod: Math.floor((endDate.getTime() - startDate.getTime()) / 1000),
        actions: actions.length ? actions : 'None'
      });
      
      // Create the transaction
      const result = await proposalService.createProposalTransaction(
        daoId,
        publicKey,
        {
          title: proposal.title,
          description: proposal.description,
          startDate,
          endDate,
          actions
        }
      );
      
      if (!result) {
        throw new Error('Failed to create proposal transaction - null result returned');
      }
      
      // Extract transaction and account from result
      const { transaction, proposalAccount } = result;
      
      if (!transaction) {
        throw new Error('Failed to create proposal transaction - transaction is null');
      }
      
      // Log the transaction details for debugging
      console.log('Transaction created successfully:', {
        numInstructions: transaction.instructions.length,
        proposalAccount: proposalAccount?.publicKey.toString(),
        feePayer: transaction.feePayer?.toString(),
      });
      
      console.log('Transaction created successfully, sending for signature...');
      
      // Send the transaction directly with wallet adapter
      const signature = await wallet.sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }
      
      console.log('Transaction signed and sent successfully! Signature:', signature);
      
      // Now call the API to update the database
      await handleCreateProposalAPI(signature);
      
    } catch (error) {
      console.error('Failed to create proposal transaction:', error);
      alert(`Failed to create proposal transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  // Step 2: After blockchain transaction is confirmed, update the API
  const handleCreateProposalAPI = async (signature: string) => {
    if (!daoId) return;
    
    try {
      // Calculate start and end dates (same as in handleCreateProposalTransaction)
      let startDate = new Date();
      if (proposal.startTime === 'custom' && proposal.customStartDate && proposal.customStartTime) {
        startDate = new Date(`${proposal.customStartDate}T${proposal.customStartTime}`);
      }
      
      const days = parseInt(proposal.expirationDays) || 0;
      const hours = parseInt(proposal.expirationHours) || 0;
      const minutes = parseInt(proposal.expirationMinutes) || 0;
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days);
      endDate.setHours(endDate.getHours() + hours);
      endDate.setMinutes(endDate.getMinutes() + minutes);
      
      // Format actions for the API
      const actions = proposal.actions.map(action => {
        let description = '';
        
        switch (action.type) {
          case 'authorize':
            description = `Authorize wallet ${action.walletAddress} to multisig`;
            break;
          case 'remove':
            description = `Remove wallet ${action.walletAddress} from multisig`;
            break;
          case 'withdraw':
            description = `Withdraw ${action.tokenAmount} ${action.tokenSymbol} to ${action.walletAddress}`;
            break;
        }
        
        return {
          type: action.type,
          description,
          walletAddress: action.walletAddress,
          amount: action.tokenAmount,
          token: action.tokenSymbol
        };
      });
      
      // Create the proposal using the service, including the transaction signature
      const newProposal = await proposalService.createProposal(daoId, {
        title: proposal.title,
        description: proposal.description,
        startDate,
        endDate,
        actions,
        transactionSignature: signature // Include the signature from the successful transaction
      });
      
      if (newProposal) {
        // Refresh the proposal list
        await fetchProposals();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to create proposal in API:', error);
      alert('Blockchain transaction succeeded, but there was an error updating the database. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewProposal = async (proposalId: string) => {
    if (!daoId) {
      console.error("Cannot view proposal: daoId is undefined");
      return;
    }
    
    setIsLoading(true);
    try {
      const proposalDetails = await proposalService.getProposalById(daoId, proposalId);
      
      if (!proposalDetails) {
        console.error("No proposal details returned from API");
        setIsLoading(false);
        return;
      }
      
      // Get proposal votes
      const votes = await proposalService.getProposalVotes(daoId, proposalId);;
      
      const transformedProposal: ProposalDetails = {
        id: proposalDetails.proposalId || '',
        name: proposalDetails.name || '',
        description: proposalDetails.description || '',
        status: proposalDetails.isActive ? 'Active' : proposalDetails.hasPassed ? 'Passed' : 'Rejected',
        creator: proposalDetails.createdByUsername || 'Unknown',
        createdAt: formatDate(new Date()), // API doesn't provide created_at
        startTime: formatDate(proposalDetails.startTime instanceof Date ? proposalDetails.startTime : new Date(proposalDetails.startTime)),
        endTime: formatDate(proposalDetails.endTime instanceof Date ? proposalDetails.endTime : new Date(proposalDetails.endTime)),
        votes: {
          for: votes?.forVotes || proposalDetails.forVotesCount || 0,
          against: votes?.againstVotes || proposalDetails.againstVotesCount || 0
        },
        actions: Object.values(proposalDetails.actions || {}).map((action: any) => ({
          type: action.type || '',
          description: action.description || '',
          walletAddress: action.wallet_address,
          amount: action.amount,
          token: action.token
        })),
        quorum: 1000, // Default value
        minApproval: 60, // Default value
        daoId: proposalDetails.daoId
      };
      
      setSelectedProposal(transformedProposal);
    } catch (error) {
      console.error(`Failed to fetch proposal details for ${proposalId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Create and send transaction for voting
  const handleVoteTransaction = async (proposalId: string, vote: 'for' | 'against') => {
    if (!publicKey || !wallet) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!daoId) {
      alert('DAO ID is missing');
      return;
    }

    try {
      setIsLoading(true);
      
      console.log(`Creating vote transaction for proposal: ${proposalId}, vote: ${vote}`);
      
      // Create the vote transaction
      const result = await proposalService.createVoteTransaction(
        daoId,
        proposalId,
        publicKey,
        vote
      );

      if (!result) {
        alert('Failed to create vote transaction');
        return;
      }
      
      // Extract transaction and vote account
      const { transaction, voteAccount } = result;
      
      console.log('Vote transaction created successfully:', {
        proposalId,
        vote,
        voteAccountPubkey: voteAccount.publicKey.toString()
      });

      // Send the transaction
      const signature = await wallet.sendTransaction(transaction, connection);
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }
      
      console.log("Vote transaction confirmed:", signature);
      await proposalService.voteOnProposal(daoId, proposalId, vote, signature);
      
      // Refresh proposals after voting
      fetchProposals();
    } catch (error) {
      console.error("Error voting on proposal:", error);
      alert(`Failed to vote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle vote submission and refresh the current proposal
  const handleVoteSubmitted = async () => {
    // First refresh all proposals in the background
    fetchProposals();
    
    // Then refresh the currently selected proposal to update its vote counts
    if (selectedProposal && daoId) {
      await refreshSelectedProposal(selectedProposal.id);
    }
  };

  // Refresh the currently selected proposal
  const refreshSelectedProposal = async (proposalId: string) => {
    if (!daoId) return;
    
    try {
      const proposalDetails = await proposalService.getProposalById(daoId, proposalId);
      
      if (!proposalDetails) return;
      
      // Get updated vote information
      const votes = await proposalService.getProposalVotes(daoId, proposalId);
      
      // Transform the proposal data using the same logic as in handleViewProposal
      const transformedProposal: ProposalDetails = {
        id: proposalDetails.proposalId || '',
        name: proposalDetails.name || '',
        description: proposalDetails.description || '',
        status: proposalDetails.isActive ? 'Active' : proposalDetails.hasPassed ? 'Passed' : 'Rejected',
        creator: proposalDetails.createdByUsername || 'Unknown',
        createdAt: formatDate(new Date()),
        startTime: formatDate(proposalDetails.startTime instanceof Date ? proposalDetails.startTime : new Date(proposalDetails.startTime)),
        endTime: formatDate(proposalDetails.endTime instanceof Date ? proposalDetails.endTime : new Date(proposalDetails.endTime)),
        votes: {
          for: votes?.forVotes || proposalDetails.forVotesCount || 0,
          against: votes?.againstVotes || proposalDetails.againstVotesCount || 0
        },
        actions: Object.values(proposalDetails.actions || {}).map((action: any) => ({
          type: action.type || '',
          description: action.description || '',
          walletAddress: action.wallet_address,
          amount: action.amount,
          token: action.token
        })),
        quorum: 1000,
        minApproval: 60,
        daoId: proposalDetails.daoId
      };
      
      setSelectedProposal(transformedProposal);
    } catch (error) {
      console.error(`Failed to refresh proposal ${proposalId} after vote:`, error);
    }
  };

  const renderProposalForm = () => {
    switch (proposalStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-text opacity-80 mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={proposal.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter proposal title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text opacity-80 mb-1">Description</label>
              <textarea
                name="description"
                value={proposal.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Describe your proposal"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={nextStep}
                className="px-4 py-2 rounded-md text-text bg-primary hover:bg-primary"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Timing</h3>
            
            <div>
              <label className="block text-sm font-medium text-text opacity-80 mb-1">Start Time</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="startNow"
                    name="startTime"
                    value="now"
                    checked={proposal.startTime === 'now'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary focus:ring-primary bg-surface-200 border-gray-600"
                  />
                  <label htmlFor="startNow" className="text-text">Start immediately</label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="startCustom"
                    name="startTime"
                    value="custom"
                    checked={proposal.startTime === 'custom'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary focus:ring-primary bg-surface-200 border-gray-600"
                  />
                  <label htmlFor="startCustom" className="text-text">Schedule for later</label>
                </div>
                
                {proposal.startTime === 'custom' && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-xs text-surface-500 mb-1">Date</label>
                      <input
                        type="date"
                        name="customStartDate"
                        value={proposal.customStartDate}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-surface-500 mb-1">Time</label>
                      <input
                        type="time"
                        name="customStartTime"
                        value={proposal.customStartTime}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text opacity-80 mb-1">Expiration Time</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-surface-500 mb-1">Days</label>
                  <input
                    type="number"
                    name="expirationDays"
                    value={proposal.expirationDays}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-surface-500 mb-1">Hours</label>
                  <input
                    type="number"
                    name="expirationHours"
                    value={proposal.expirationHours}
                    onChange={handleInputChange}
                    min="0"
                    max="23"
                    className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-surface-500 mb-1">Minutes</label>
                  <input
                    type="number"
                    name="expirationMinutes"
                    value={proposal.expirationMinutes}
                    onChange={handleInputChange}
                    min="0"
                    max="59"
                    className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <p className="text-sm text-surface-500 mt-2">
                Proposal will expire after: {calculateExpirationTime()}
              </p>
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md text-text bg-surface-300 hover:bg-[#444444]"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={proposal.startTime === 'custom' && (!proposal.customStartDate || !proposal.customStartTime)}
                className={`px-4 py-2 rounded-md text-text ${proposal.startTime === 'custom' && (!proposal.customStartDate || !proposal.customStartTime) ? 'bg-surface-300 cursor-not-allowed' : 'bg-primary hover:bg-primary'}`}
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Actions (Optional)</h3>
            <p className="text-sm text-surface-500 mb-2">Select one or more actions for this proposal</p>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                onClick={() => toggleAction('authorize')}
                className={`p-2 rounded-md text-sm ${isActionSelected('authorize') ? 'bg-primary text-text' : 'bg-surface-300 text-text hover:bg-[#444444]'}`}
              >
                Authorize Wallet
              </button>
              <button
                onClick={() => toggleAction('remove')}
                className={`p-2 rounded-md text-sm ${isActionSelected('remove') ? 'bg-primary text-text' : 'bg-surface-300 text-text hover:bg-[#444444]'}`}
              >
                Remove Wallet
              </button>
              <button
                onClick={() => toggleAction('withdraw')}
                className={`p-2 rounded-md text-sm ${isActionSelected('withdraw') ? 'bg-primary text-text' : 'bg-surface-300 text-text hover:bg-[#444444]'}`}
              >
                Withdraw Tokens
              </button>
            </div>
            
            <div className="space-y-4">
              {proposal.actions.length > 0 ? (
                <>
                  {isActionSelected('authorize') && (
                    <div className="p-4 bg-surface-200 rounded-md border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-primary">Authorize Wallet</h5>
                        <button 
                          onClick={() => toggleAction('authorize')}
                          className="text-surface-500 hover:text-gray-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text opacity-80 mb-1">Wallet Address to Authorize</label>
                        <input
                          type="text"
                          value={getActionByType('authorize')?.walletAddress || ''}
                          onChange={(e) => updateActionField('authorize', 'walletAddress', e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter wallet address"
                        />
                      </div>
                    </div>
                  )}
                  
                  {isActionSelected('remove') && (
                    <div className="p-4 bg-surface-200 rounded-md border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-primary">Remove Wallet</h5>
                        <button 
                          onClick={() => toggleAction('remove')}
                          className="text-surface-500 hover:text-gray-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text opacity-80 mb-1">Wallet Address to Remove</label>
                        <input
                          type="text"
                          value={getActionByType('remove')?.walletAddress || ''}
                          onChange={(e) => updateActionField('remove', 'walletAddress', e.target.value)}
                          className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter wallet address"
                        />
                      </div>
                    </div>
                  )}
                  
                  {isActionSelected('withdraw') && (
                    <div className="p-4 bg-surface-200 rounded-md border border-gray-600">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium text-primary">Withdraw Tokens</h5>
                        <button 
                          onClick={() => toggleAction('withdraw')}
                          className="text-surface-500 hover:text-gray-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-text opacity-80 mb-1">Recipient Wallet</label>
                          <input
                            type="text"
                            value={getActionByType('withdraw')?.walletAddress || ''}
                            onChange={(e) => updateActionField('withdraw', 'walletAddress', e.target.value)}
                            className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Enter recipient wallet address"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-sm font-medium text-text opacity-80 mb-1">Amount</label>
                            <input
                              type="number"
                              value={getActionByType('withdraw')?.tokenAmount || ''}
                              onChange={(e) => updateActionField('withdraw', 'tokenAmount', e.target.value)}
                              className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter amount"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-text opacity-80 mb-1">Token</label>
                            <select
                              value={getActionByType('withdraw')?.tokenSymbol || 'SOL'}
                              onChange={(e) => updateActionField('withdraw', 'tokenSymbol', e.target.value)}
                              className="w-full p-2 border border-gray-600 rounded-md bg-surface-200 text-text focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                              <option value="SOL">SOL</option>
                              <option value="USDC">USDC</option>
                              <option value="USDT">USDT</option>
                              <option value="BTC">BTC</option>
                              <option value="ETH">ETH</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-4 bg-surface-200 rounded-md text-center text-surface-500">
                  No actions selected. You can continue without actions or select one above.
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md text-text bg-surface-300 hover:bg-[#444444]"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                className="px-4 py-2 rounded-md text-text bg-primary hover:bg-primary"
              >
                Next
              </button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text">Review & Submit</h3>
            
            <div className={containers.card}>
              <h4 className="font-medium text-text mb-2">{proposal.title}</h4>
              <p className="text-text opacity-80 text-sm mb-4">{proposal.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Start Time:</span>
                  <span className="text-text">
                    {proposal.startTime === 'now' 
                      ? 'Immediately after creation' 
                      : `${proposal.customStartDate} at ${proposal.customStartTime}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-500">Expiration:</span>
                  <span className="text-text">{calculateExpirationTime()}</span>
                </div>
              </div>
              
              {proposal.actions.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium text-text opacity-80 mb-2">Actions:</h5>
                  <ul className="space-y-1">
                    {proposal.actions.map((action, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Check size={16} className="text-primary mr-2 mt-0.5" />
                        <span className="text-text">{getActionDescription(action)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                className="px-4 py-2 rounded-md text-text bg-surface-300 hover:bg-[#444444]"
              >
                Back
              </button>
              <button
                onClick={handleCreateProposalTransaction}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-md text-text bg-primary hover:bg-primary"
              >
                {isSubmitting ? 'Creating Proposal...' : 'Create Proposal'}
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const closeProposalDetails = () => {
    setSelectedProposal(null);
  };

  // This function renders the proposals list using our new components
  const renderProposalsList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
        </div>
      );
    }

    if (proposals.length === 0) {
      return (
        <Card className="mt-6">
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">No proposals have been created yet.</p>
            {userIsDaoMember && (
              <Button 
                variant="primary" 
                onClick={() => setShowProposalForm(true)}
                leftIcon={<Plus size={16} />}
              >
                Create New Proposal
              </Button>
            )}
          </div>
        </Card>
      );
    }

    return (
      <div className="mt-6 space-y-4">
        {proposals.map(proposal => (
          <Card 
            key={proposal.id} 
            className="hover:border-purple-800/40 cursor-pointer transition-all"
            onClick={() => handleViewProposal(proposal.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={typography.h3}>{proposal.name}</h3>
                <p className={`${typography.small} mt-1 line-clamp-2`}>
                  {proposal.description}
                </p>
              </div>
              <div>
                {proposal.status === 'active' && (
                  <Badge variant="primary">Active</Badge>
                )}
                {proposal.status === 'pending' && (
                  <Badge variant="warning">Pending</Badge>
                )}
                {proposal.status === 'completed' && (
                  <Badge variant="success">Completed</Badge>
                )}
                {proposal.status === 'rejected' && (
                  <Badge variant="error">Rejected</Badge>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800/40 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <span className={typography.small}>For</span>
                  <span className="text-green-400">{proposal.votes.for}</span>
                </div>
                <div className="flex flex-col">
                  <span className={typography.small}>Against</span>
                  <span className="text-red-400">{proposal.votes.against}</span>
                </div>
                <div className="flex flex-col">
                  <span className={typography.small}>Created</span>
                  <span className="text-gray-300">{formatDate(proposal.createdAt)}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className={containers.flexBetween}>
        <h1 className={typography.h1}>Governance</h1>
        {userIsDaoMember ? (
          <Button 
            variant="primary" 
            onClick={() => setShowProposalForm(true)}
            leftIcon={<Plus size={16} />}
          >
            Create Proposal
          </Button>
        ) : membershipLoading ? (
          <div className="animate-pulse h-10 w-32 bg-gray-700 rounded-lg"></div>
        ) : (
          <div className="relative">
            <Button 
              variant="secondary" 
              disabled={true}
              onClick={() => setShowMembershipTooltip(!showMembershipTooltip)}
              leftIcon={<AlertCircle size={16} />}
            >
              Members Only
            </Button>
            {showMembershipTooltip && (
              <div className={`${utils.glassmorphism} absolute right-0 mt-2 p-3 rounded-lg z-10 w-64`}>
                <p className={typography.small}>
                  Only DAO members can create proposals. Join this DAO to participate in governance.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Card title="DAO Governance Overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <span className={typography.label}>Total Proposals</span>
              <span className={ui.stat.value}>{proposals.length}</span>
            </div>
            <div className="flex flex-col">
              <span className={typography.label}>Active Proposals</span>
              <span className={ui.stat.value}>{proposals.filter(p => p.status === 'Active').length}</span>
            </div>
            <div className="flex flex-col">
              <span className={typography.label}>Completed Proposals</span>
              <span className={ui.stat.value}>{proposals.filter(p => p.status === 'Passed').length}</span>
            </div>
          </div>
        </Card>
      </div>

      {renderProposalsList()}

      {selectedProposal && (
        <PopupProposal 
          proposal={selectedProposal}
          onClose={closeProposalDetails}
          onVote={handleVoteTransaction}
          canVote={userIsDaoMember}
          onVoteSubmitted={handleVoteSubmitted}
          wallet={wallet}
        />
      )}
    </div>
  );
};

export default Governance;