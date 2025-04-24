import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Plus, X, Check, AlertCircle, ChevronRight, Search, ChevronDown, ChevronLeft, Calendar, Users } from 'lucide-react';
import PopupProposal from './PopupProposal';
import { containers, typography, ui, utils } from '../styles/theme';
import { proposalService } from '../services/ProposalService';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useSolanaTransaction } from '../hooks/useSolanaTransaction';
import { SOLANA_RPC_ENDPOINT } from '../config/solana';
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
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isPageChanging, setIsPageChanging] = useState<boolean>(false);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('Recent');
  const [filteredProposals, setFilteredProposals] = useState<ProposalDetails[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Date range filters
  const [createdSince, setCreatedSince] = useState<string>('');
  const [createdUntil, setCreatedUntil] = useState<string>('');
  
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

  useEffectOnce(() => {
    proposalService.initializeSolanaConnection(SOLANA_RPC_ENDPOINT);
  });

  useEffectOnce(() => {
    if (daoId) {
      fetchProposals().then(() => {
        setFilteredProposals(proposals);
      });
    }
  });

  useEffect(() => {
    setFilteredProposals(proposals);
  }, [proposals]);

  const checkDaoMembership = async () => {
    if (!daoId || !publicKey) return;
    
    try {
      setMembershipLoading(true);
      
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        setUserIsDaoMember(false);
        setMembershipLoading(false);
        return;
      }
      
      const members = await daosService.getDaoMembers(daoId);
      
      const isMember = members.some((member: any) => member.userId === currentUser.userId);
      
      setUserIsDaoMember(isMember);
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error checking DAO membership:', err);
      setUserIsDaoMember(false);
      setMembershipLoading(false);
    }
  };

  useEffect(() => {
    if (daoId && publicKey && connected) {
      checkDaoMembership();
    }
  }, [daoId, publicKey, connected]);

  useEffectOnce(() => {
    if (isTransactionSuccess && transactionSignature) {
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
    
    setIsLoading(true);
    try {
      const fetchedProposals = await proposalService.getAllProposals(daoId);
      
      if (!fetchedProposals || fetchedProposals.length === 0) {
        setProposals([]);
        return;
      }
      
      const transformedProposals = fetchedProposals.map(p => ({
        id: p.proposalId || '',
        name: p.name || '',
        description: p.description || '',
        status: p.isActive ? 'Active' : p.hasPassed ? 'Passed' : 'Rejected',
        creator: p.createdByUsername || 'Unknown',
        createdAt: formatDate(new Date()),
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
        quorum: 1000,
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

  useEffect(() => {
    let result = [...proposals];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(proposal => 
        proposal.name.toLowerCase().includes(query) || 
        proposal.description.toLowerCase().includes(query) ||
        proposal.creator.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(proposal => {
        switch(statusFilter) {
          case 'active':
            return proposal.status === 'Active' || proposal.status === 'active';
          case 'passed':
            return proposal.status === 'Passed' || proposal.status === 'completed' || proposal.status === 'Completed';
          case 'rejected':
            return proposal.status === 'Rejected' || proposal.status === 'rejected';
          default:
            return true;
        }
      });
    }
    
    if (createdSince || createdUntil) {
      result = result.filter(proposal => {
        const createdDate = new Date(proposal.createdAt);
        
        if (createdSince && createdUntil) {
          return createdDate >= new Date(createdSince) && createdDate <= new Date(createdUntil);
        } else if (createdSince) {
          return createdDate >= new Date(createdSince);
        } else if (createdUntil) {
          return createdDate <= new Date(createdUntil);
        }
        
        return true;
      });
    }
    
    switch (sortOrder) {
      case 'A-Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Recent':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'Oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'Most Votes':
        result.sort((a, b) => (b.votes.for + b.votes.against) - (a.votes.for + a.votes.against));
        break;
    }
    
    setFilteredProposals(result);
  }, [proposals, searchQuery, statusFilter, createdSince, createdUntil, sortOrder]);

  const getTimeAgo = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) {
      return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    } else if (diffHour > 0) {
      return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    } else if (diffMin > 0) {
      return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };
  
  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };
  
  const resetDateFilters = () => {
    setCreatedSince('');
    setCreatedUntil('');
  };
  
  const isDateFilterActive = createdSince || createdUntil;
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setIsPageChanging(true);
      
      setTimeout(() => {
        setCurrentPage(page);
        setTimeout(() => {
          setIsPageChanging(false);
        }, 50);
      }, 150);
    }
  };
  
  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
    setActiveDropdown(null);
  };
  
  const lastCreatedProposal = proposals.length > 0 
    ? [...proposals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;
  
  const mostActiveProposal = proposals.length > 0 
    ? [...proposals].sort((a, b) => (b.votes.for + b.votes.against) - (a.votes.for + a.votes.against))[0]
    : null;
    
  const totalPages = Math.ceil(filteredProposals.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredProposals.length);
  const paginatedProposals = filteredProposals.slice(startIndex, endIndex);

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
    const existingActionIndex = proposal.actions.findIndex((action: Action) => action.type === actionType);
    
    if (existingActionIndex >= 0) {
      const updatedActions = [...proposal.actions];
      updatedActions.splice(existingActionIndex, 1);
      setProposal({ ...proposal, actions: updatedActions });
    } else {
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
    const updatedActions = proposal.actions.map((action: Action) => {
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
    return proposal.actions.some((action: Action) => action.type === actionType);
  };

  const getActionByType = (actionType: string) => {
    return proposal.actions.find((action: Action) => action.type === actionType);
  };

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
      
      const minVotingPeriod = 5 * 60 * 1000;
      if (endDate.getTime() - startDate.getTime() < minVotingPeriod) {
        alert('Voting period must be at least 5 minutes long.');
        setIsSubmitting(false);
        return;
      }

      const actions = proposal.actions.map((action: Action) => {
        return {
          type: action.type,
          walletAddress: action.walletAddress,
          amount: action.tokenAmount,
          token: action.tokenSymbol
        };
      });
      
      const result = await proposalService.createProposalTransaction(
        daoId,
        '',
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
      
      const { transaction, proposalAccount } = result;
      
      if (!transaction) {
        throw new Error('Failed to create proposal transaction - transaction is null');
      }
      
      sessionStorage.setItem('currentProposalAccount', proposalAccount.publicKey.toString());
      
      const signature = await wallet.sendTransaction(transaction, connection);
      
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }
      
      await handleCreateProposalAPI(signature);
      
    } catch (error) {
      console.error('Failed to create proposal transaction:', error);
      alert(`Failed to create proposal transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsSubmitting(false);
    }
  };

  const handleCreateProposalAPI = async (signature: string) => {
    if (!daoId) return;
    
    try {
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
      
      const proposalAccountPubkey = sessionStorage.getItem('currentProposalAccount') || '';
      
      const actions = proposal.actions.map((action: Action) => {
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
      
      const newProposal = await proposalService.createProposal(daoId, {
        title: proposal.title,
        description: proposal.description,
        startDate,
        endDate,
        actions,
        transactionSignature: signature,
        proposalAccount: proposalAccountPubkey
      });

      sessionStorage.removeItem('currentProposalAccount');
      
      if (newProposal) {
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
      
      const votes = await proposalService.getProposalVotes(daoId, proposalId);;
      
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
      console.error(`Failed to fetch proposal details for ${proposalId}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      const { transaction, voteAccount } = result;

      const signature = await wallet.sendTransaction(transaction, connection);
      
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
      }
      
      await proposalService.voteOnProposal(
        daoId, 
        proposalId, 
        vote, 
        signature, 
        voteAccount.publicKey.toString()
      );
      
      fetchProposals();
    } catch (error) {
      console.error("Error voting on proposal:", error);
      alert(`Failed to vote: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoteSubmitted = async () => {
    fetchProposals();
    
    if (selectedProposal && daoId) {
      await refreshSelectedProposal(selectedProposal.id);
    }
  };

  const refreshSelectedProposal = async (proposalId: string) => {
    if (!daoId) return;
    
    try {
      const proposalDetails = await proposalService.getProposalById(daoId, proposalId);
      
      if (!proposalDetails) return;
      
      const votes = await proposalService.getProposalVotes(daoId, proposalId);
      
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
                    {proposal.actions.map((action: Action, index: number) => (
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

  return (
    <div className="p-6 h-full min-h-screen overflow-auto">
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Governance</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mr-4">
              <PieChart size={20} className="text-white" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Total Proposals</div>
              <div className="text-2xl font-bold text-white">{proposals.length}</div>
            </div>
          </div>
        </div>
            
        {lastCreatedProposal && (
          <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
                <Calendar size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400 flex items-center">
                  <span>Latest Proposal</span>
                  <span className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">{getTimeAgo(lastCreatedProposal.createdAt)}</span>
                </div>
                <div className="text-xl font-bold text-white mt-1 truncate">{lastCreatedProposal.name}</div>
              </div>
            </div>
          </div>
        )}
            
        {mostActiveProposal && (
          <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 mr-4">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-400 flex items-center">
                  <span>Most Active</span>
                  <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">{mostActiveProposal.votes.for + mostActiveProposal.votes.against} votes</span>
                </div>
                <div className="text-xl font-bold text-white mt-1 truncate">{mostActiveProposal.name}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
        {/* Filters - Centered on mobile */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {/* Sort Dropdown */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleDropdown('sort')}
              rightIcon={<ChevronDown size={16} />}
            >
              Sort: {sortOrder}
            </Button>
            
            {activeDropdown === 'sort' && (
              <div className={utils.glassmorphism + " absolute left-0 md:left-0 right-0 md:right-auto mt-2 w-48 rounded-md shadow-lg z-10"}>
                <div className="py-2">
                  {['Recent', 'Oldest', 'A-Z', 'Z-A', 'Most Votes'].map(option => (
                    <button
                      key={option}
                      className={`flex items-center w-full px-4 py-2 text-sm ${sortOrder === option ? 'text-purple-500' : 'text-gray-200'} hover:bg-[#222]/60`}
                      onClick={() => {
                        setSortOrder(option);
                        setActiveDropdown(null);
                      }}
                    >
                      {sortOrder === option && <Check size={16} className="mr-2" />}
                      <span>{option}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
              
          {/* Status Filter Dropdown */}
          <div className="relative">
            <Button 
              variant={statusFilter !== 'all' ? "primary" : "outline"} 
              size="sm" 
              onClick={() => toggleDropdown('status')}
              rightIcon={<ChevronDown size={16} />}
            >
              Status
            </Button>
                
            {activeDropdown === 'status' && (
              <div className={utils.glassmorphism + " absolute left-0 md:left-0 right-0 md:right-auto mt-2 w-48 rounded-md shadow-lg z-10"}>
                <div className="py-2">
                  {[
                    { value: 'all', label: 'All Proposals' },
                    { value: 'active', label: 'Active' },
                    { value: 'passed', label: 'Passed' },
                    { value: 'rejected', label: 'Rejected' }
                  ].map(option => (
                    <button
                      key={option.value}
                      className={`flex items-center w-full px-4 py-2 text-sm ${statusFilter === option.value ? 'text-purple-500' : 'text-gray-200'} hover:bg-[#222]/60`}
                      onClick={() => {
                        setStatusFilter(option.value);
                        setActiveDropdown(null);
                      }}
                    >
                      {statusFilter === option.value && <Check size={16} className="mr-2" />}
                      <span>{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
              
          {/* Date Filter Dropdown */}
          <div className="relative">
            <Button 
              variant={isDateFilterActive ? "primary" : "outline"} 
              size="sm" 
              onClick={() => toggleDropdown('date')}
              rightIcon={<ChevronDown size={16} />}
            >
              Date Range
            </Button>
                
            {activeDropdown === 'date' && (
              <div className={utils.glassmorphism + " absolute left-0 md:left-0 right-0 md:right-auto mt-2 w-64 rounded-md shadow-lg z-10"}>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Created After</label>
                    <input
                      type="date"
                      value={createdSince}
                      onChange={(e) => setCreatedSince(e.target.value)}
                      className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Created Before</label>
                    <input
                      type="date"
                      value={createdUntil}
                      onChange={(e) => setCreatedUntil(e.target.value)}
                      className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white text-sm"
                    />
                  </div>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetDateFilters}
                    >
                      Reset
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => setActiveDropdown(null)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
            
        {/* Search and Create Button - Centered on mobile */}
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          {/* Search Bar */}
          <div className="relative flex-1 min-w-[180px] max-w-[300px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search proposals..."
              className="pl-10 pr-3 py-2 bg-[#191919] border border-gray-800 rounded-md text-white w-full focus:outline-none focus:border-purple-600"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={16} />
            </div>
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Create Proposal Button */}
          {userIsDaoMember && (
            <Button 
              variant="primary" 
              onClick={() => setShowProposalForm(true)}
              leftIcon={<Plus size={16} />}
              className="sm:w-auto"
            >
              Create Proposal
            </Button>
          )}
        </div>
      </div>
      
      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
        <div className="w-full flex justify-center sm:justify-start items-center gap-2">
          <span className="text-gray-400 text-sm">Show</span>
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleDropdown('rows')}
              rightIcon={<ChevronDown size={16} />}
            >
              {rowsPerPage} proposals
            </Button>
                
            {activeDropdown === 'rows' && (
              <div className={utils.glassmorphism + " absolute left-0 mt-2 w-40 rounded-md shadow-lg z-10"}>
                <div className="py-2">
                  {[10, 25, 50].map(option => (
                    <button
                      key={option}
                      className={`flex items-center w-full px-4 py-2 text-sm ${rowsPerPage === option ? 'text-purple-500' : 'text-gray-200'} hover:bg-[#222]/60`}
                      onClick={() => handleRowsPerPageChange(option)}
                    >
                      {rowsPerPage === option && <Check size={16} className="mr-2" />}
                      <span>{option} proposals</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
            
        <div className="text-gray-400 text-sm text-center sm:text-right">
          Showing {startIndex + 1} to {endIndex} of {filteredProposals.length} proposals
        </div>
      </div>
      
      {/* Proposals Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <Card className="overflow-hidden mb-4" style={{ minHeight: '300px', height: `calc(100vh - 400px)` }}>
          <div className={`overflow-auto h-full custom-scrollbar transition-opacity duration-150 ${isPageChanging ? 'opacity-30' : 'opacity-100'}`}>
            <table className={ui.table.container}>
              <thead className="sticky top-0 bg-[#121212] z-10">
                <tr>
                  <th className={ui.table.header + " min-w-[250px]"}>Proposal</th>
                  <th className={ui.table.header + " min-w-[100px]"}>Status</th>
                  <th className={ui.table.header + " min-w-[150px]"}>Creator</th>
                  <th className={ui.table.header + " min-w-[150px]"}>Created</th>
                  <th className={ui.table.header + " min-w-[120px]"}>For</th>
                  <th className={ui.table.header + " min-w-[120px]"}>Against</th>
                  <th className={ui.table.header + " min-w-[150px]"}>End Time</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProposals.map((proposal: ProposalDetails) => (
                  <tr 
                    key={proposal.id} 
                    className={`${ui.table.row} cursor-pointer hover:bg-[#191919]`}
                    onClick={() => handleViewProposal(proposal.id)}
                  >
                    <td className={ui.table.cell}>
                      <div>
                        <div className="font-medium text-white">{proposal.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[300px]">{proposal.description}</div>
                      </div>
                    </td>
                    <td className={ui.table.cell}>
                      <Badge 
                        variant={
                          proposal.status === 'Active' || proposal.status === 'active' 
                            ? 'primary' 
                            : proposal.status === 'Passed' || proposal.status === 'completed' || proposal.status === 'Completed' 
                              ? 'success' 
                              : 'error'
                        }
                      >
                        {proposal.status}
                      </Badge>
                    </td>
                    <td className={ui.table.cell}>
                      <div className="text-gray-300">{proposal.creator}</div>
                    </td>
                    <td className={ui.table.cell}>
                      <div className="text-gray-300">{getTimeAgo(proposal.createdAt)}</div>
                      <div className="text-xs text-gray-400">{proposal.createdAt}</div>
                    </td>
                    <td className={ui.table.cell}>
                      <div className="text-green-400 font-medium">{proposal.votes.for}</div>
                    </td>
                    <td className={ui.table.cell}>
                      <div className="text-red-400 font-medium">{proposal.votes.against}</div>
                    </td>
                    <td className={ui.table.cell}>
                      <div className="text-gray-300">{proposal.endTime}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredProposals.length === 0 && (
              <div className="flex justify-center items-center py-10 text-gray-400">
                <p>No proposals match your search criteria</p>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Pagination controls below the content */}
      {filteredProposals.length > 0 && (
        <div className="flex justify-center items-center gap-3 my-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            leftIcon={<ChevronLeft size={14} />}
            className="px-4"
          >
            <span className="hidden sm:inline">Prev</span>
          </Button>
          
          <div className="hidden sm:flex items-center">
            {/* Show page numbers on larger screens */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer pages, show them all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If near the start, show 1-5
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If near the end, show last 5
                pageNum = totalPages - 4 + i;
              } else {
                // Show current page and 2 on each side
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-1 ${
                    pageNum === currentPage 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:bg-[#222] hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          {/* Always show current/total on mobile */}
          <div className="flex sm:hidden items-center">
            <span className="mx-2 text-gray-300 text-sm">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            rightIcon={<ChevronRight size={14} />}
            className="px-4"
          >
            <span className="hidden sm:inline">Next</span>
          </Button>
        </div>
      )}
      
      {/* Non-member notice */}
      {!userIsDaoMember && !membershipLoading && (
        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
          <div className="flex items-start">
            <AlertCircle size={20} className="text-yellow-500 mr-2 mt-0.5" />
            <div>
              <p className="text-yellow-500 font-medium">Members Only</p>
              <p className="text-sm text-gray-300 mt-1">
                Only DAO members can create proposals. Join this DAO to participate in governance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
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
      
      {/* Create Proposal Form Modal */}
      {showProposalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Create Proposal</h2>
              <button 
                onClick={() => resetForm()}
                className="text-gray-400 hover:text-white p-1 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-136px)]">
              {renderProposalForm()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Governance;