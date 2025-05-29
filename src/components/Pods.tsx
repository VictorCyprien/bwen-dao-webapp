import React from 'react';
const { useState, useEffect } = React;
import { Plus, Users, MessageSquare, Calendar, ExternalLink, Layers, ArrowUpRight, X, Check, PlusCircle, RefreshCw, Edit, LogIn, LogOut, AlertCircle } from 'lucide-react';
import CreatePodModal from './CreatePodModal';
import UpdatePodModal from './UpdatePodModal';
import CreateProposalModal from './CreateProposalModal';
import PopupProposal from './PopupProposal';
import { useParams, Link } from 'react-router-dom';
import { podsService } from '../services/PodsService';
import { proposalService } from '../services/ProposalService';
import { POD } from '../core/modules/dao-api/models/POD';
import { DiscordMessage } from '../core/modules/dao-api/models/DiscordMessage';
import { Proposal } from '../core/modules/dao-api/models/Proposal';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useSolanaTransaction } from '../hooks/useSolanaTransaction';
import { Connection } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SOLANA_RPC_ENDPOINT } from '../config/solana';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import { signAndSendTransaction } from '../utils/solanaTransactions';
import { containers, typography, ui, utils } from '../styles/theme';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';
import { useAuth } from '../context/AuthContext';
import { useTransaction } from '../context/TransactionContext';
import { getCurrentUTC } from '../utils/dateUtils';

const Pods = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const { userInfo } = useAuth();
  const { showTransactionModal, hideTransactionModal } = useTransaction();
  const [selectedPod, setSelectedPod] = useState<POD | null>(null);
  const [pods, setPods] = useState<POD[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [feedMessages, setFeedMessages] = useState<DiscordMessage[]>([]);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCreateProposalModalOpen, setIsCreateProposalModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [userIsMember, setUserIsMember] = useState<boolean>(false);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);
  const [userIsDaoMember, setUserIsDaoMember] = useState<boolean>(false);
  const [daoMembershipLoading, setDaoMembershipLoading] = useState<boolean>(false);
  const [podsFilter, setPodsFilter] = useState<'my' | 'available' | 'all'>('all');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [podMembers, setPodMembers] = useState<Record<string, any[]>>({});
  const [showNonMemberMessage, setShowNonMemberMessage] = useState<boolean>(true);
  
  // Get Solana wallet and transaction utilities
  const walletState = useWallet();
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
  
  // Initialize Solana connection
  useEffectOnce(() => {
    // Initialize the Solana connection with our configured endpoint
    proposalService.initializeSolanaConnection(SOLANA_RPC_ENDPOINT);
  });

  // Consolidated membership check and data loading
  useEffectOnce(() => {
    if (!daoId) return;
    
    // Check membership if wallet is connected
    if (publicKey && connected) {
      checkDaoMembership();
    } else {
      // Reset membership status if wallet is not connected
      setUserIsDaoMember(false);
      setDaoMembershipLoading(false);
    }
    
    // This will also handle loading pods when the DAO ID changes
    fetchPods();
  }, [daoId, publicKey, connected]);

  // Check if the current user is a member of the DAO
  const checkDaoMembership = async () => {
    // First check if the wallet is connected, if not, we can't check membership
    if (!connected || !publicKey) {
      console.log("Wallet not connected, can't check DAO membership");
      setUserIsDaoMember(false);
      setDaoMembershipLoading(false);
      setLoading(false);
      return;
    }
    
    if (!daoId) {
      console.error("No DAO ID provided, can't check membership");
      setUserIsDaoMember(false);
      setDaoMembershipLoading(false);
      setLoading(false);
      return;
    }
    
    try {
      setDaoMembershipLoading(true);
      
      // Get the current user's ID
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setUserIsDaoMember(false);
        setDaoMembershipLoading(false);
        setLoading(false);
        return;
      }
      
      setCurrentUserId(currentUser.userId);
      
      // Call the DAO-API SDK to check membership
      const members = await daosService.getDaoMembers(daoId);
      console.log('DAO members:', members);
      console.log('Current user ID:', currentUser.userId);
      
      // Check if the user is a member by userId
      const isMember = members.some((member: any) => member.userId === currentUser.userId);
      
      console.log('User is DAO member:', isMember);
      setUserIsDaoMember(isMember);
      setDaoMembershipLoading(false);
      
      // Only fetch pods if the user is a DAO member
      if (isMember) {
        fetchPods();
      } else {
        // Make sure loading state is cleared if not a member
        setLoading(false);
      }
    } catch (err) {
      console.error('Error checking DAO membership:', err);
      setUserIsDaoMember(false);
      setDaoMembershipLoading(false);
      setLoading(false);
    }
  };

  // Fetch pods from the API
  const fetchPods = async () => {
    if (!daoId) {
      setError('No DAO ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const podsData = await podsService.getPods(daoId);
      setPods(podsData);
      
      // Fetch members for each pod
      const membersMap: Record<string, any[]> = {};
      for (const pod of podsData) {
        if (pod.podId) {
          try {
            const members = await podsService.getPodMembers(daoId, pod.podId);
            membersMap[pod.podId] = members;
          } catch (err) {
            console.error(`Error fetching members for pod ${pod.podId}:`, err);
            membersMap[pod.podId] = [];
          }
        }
      }
      setPodMembers(membersMap);
      
      // Set the first pod as selected if there are pods and no selection yet
      if (podsData.length > 0 && !selectedPod) {
        setSelectedPod(podsData[0]);
        
        // Check membership for the initially selected pod
        if (publicKey && podsData[0].podId) {
          checkPodMembership(podsData[0].podId);
        }
      } else if (podsData.length > 0 && selectedPod) {
        // Find the current pod in the updated list
        const updatedPod = podsData.find(pod => pod.podId === selectedPod.podId);
        if (updatedPod) {
          setSelectedPod(updatedPod);
          
          // Re-check membership with fresh data
          if (publicKey && updatedPod.podId) {
            checkPodMembership(updatedPod.podId);
          }
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching pods:', err);
      setError('Failed to load pods. Please try again.');
      setLoading(false);
    }
  };

  // Helper function to fetch proposals for a pod
  const fetchProposalsForPod = async (podId: string, podName: string) => {
    if (!daoId || !podId) return;
    
    try {
      // Get proposals for this POD from the API
      const proposals = await proposalService.getProposalsByPOD(daoId, podId);
      setFilteredProposals(proposals);
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setFilteredProposals([]);
    }
  };

  // Check if the current user is a member of the selected pod
  const checkPodMembership = async (podId: string) => {
    if (!daoId || !podId || !publicKey) return;
    
    try {
      setMembershipLoading(true);
      // Call the DAO-API SDK to check membership
      const members = await podsService.getPodMembers(daoId, podId);
      console.log('POD members:', members);
      console.log('Current user publicKey:', publicKey.toString());
      
      // Check all possible formats of the public key
      const publicKeyStr = publicKey.toString();
      const isMember = members.some((member: any) => {
        // Check if userId matches exactly
        if (member.userId === publicKeyStr) return true;
        
        // Check if userId is the user's wallet address
        if (member.walletAddress && member.walletAddress === publicKeyStr) return true;
        
        // Check if userId is base58 encoded public key
        if (member.userId && publicKeyStr.includes(member.userId)) return true;
        if (member.userId && member.userId.includes(publicKeyStr)) return true;
        
        return false;
      });
      
      console.log('User is member:', isMember);
      setUserIsMember(isMember);
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error checking pod membership:', err);
      setUserIsMember(false);
      setMembershipLoading(false);
    }
  };
  
  // Join a pod
  const handleJoinPod = async () => {
    if (!daoId || !selectedPod?.podId || !publicKey) {
      console.error("Missing required data for joining pod");
      return;
    }
    
    try {
      setMembershipLoading(true);
      // Call the DAO-API SDK to join the pod
      const result = await podsService.addMemberToPod(daoId, selectedPod.podId);
      if (result) {
        console.log('Successfully joined pod:', selectedPod.name);
        setUserIsMember(true);
        // Refresh pod data to get updated membership info
        fetchPods();
      } else {
        console.error('Failed to join pod');
        // Re-check membership to be sure
        checkPodMembership(selectedPod.podId);
      }
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error joining pod:', err);
      setMembershipLoading(false);
      // Re-check membership to be sure
      checkPodMembership(selectedPod.podId);
    }
  };
  
  // Leave a pod
  const handleLeavePod = async () => {
    if (!daoId || !selectedPod?.podId || !publicKey) {
      console.error("Missing required data for leaving pod");
      return;
    }
    
    try {
      setMembershipLoading(true);
      
      // Get the current user's ID from the members list
      const members = await podsService.getPodMembers(daoId, selectedPod.podId);
      const publicKeyStr = publicKey.toString();
      const currentMember = members.find((member: any) => {
        // Check different possible formats
        if (member.userId === publicKeyStr) return true;
        if (member.walletAddress && member.walletAddress === publicKeyStr) return true;
        if (member.userId && publicKeyStr.includes(member.userId)) return true;
        if (member.userId && member.userId.includes(publicKeyStr)) return true;
        return false;
      });
      
      if (!currentMember || !currentMember.userId) {
        console.error("Could not find current user's ID in the POD members list");
        setMembershipLoading(false);
        return;
      }
      
      console.log("Found user ID for removal:", currentMember.userId);
      
      // Call the DAO-API SDK to leave the pod with the correct user ID
      const result = await podsService.removeMemberFromPod(daoId, selectedPod.podId, currentMember.userId);
      if (result) {
        console.log('Successfully left pod:', selectedPod.name);
        setUserIsMember(false);
        // Refresh pod data to get updated membership info
        fetchPods();
      } else {
        console.error('Failed to leave pod');
        // Re-check membership to be sure
        checkPodMembership(selectedPod.podId);
      }
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error leaving pod:', err);
      setMembershipLoading(false);
      // Re-check membership to be sure
      checkPodMembership(selectedPod.podId);
    }
  };

  // Fetch feed messages when selected pod changes
  useEffectOnce(() => {
    if (selectedPod && selectedPod.podId && daoId) {
      fetchFeedMessages(daoId, selectedPod.podId);
      
      // Fetch proposals for the selected pod
      if (selectedPod.name) {
        fetchProposalsForPod(selectedPod.podId, selectedPod.name);
      } else {
        setFilteredProposals([]);
      }
      
      // Check if the user is a member of this pod
      if (publicKey) {
        checkPodMembership(selectedPod.podId);
      }
    } else {
      setFeedMessages([]);
      setFilteredProposals([]);
    }
  }, [selectedPod, daoId, publicKey]);

  // Fetch feed messages from the API
  const fetchFeedMessages = async (daoId: string, podId: string) => {
    try {
      setFeedLoading(true);
      const messages = await podsService.getPodFeed(daoId, podId);
      setFeedMessages(messages);
      setFeedLoading(false);
    } catch (err) {
      console.error('Error fetching feed messages:', err);
      setFeedMessages([]);
      setFeedLoading(false);
    }
  };

  // Format date for display using UTC
  const formatDate = (date: Date): string => {
    const now = getCurrentUTC();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    if (diffDays === 0) {
      return `Today at ${timeStr}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${timeStr}`;
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year} at ${timeStr}`;
    }
  };

  // Refresh pods data after creating or updating a pod
  const handlePodUpdated = () => {
    fetchPods();
  };

  // Handler for successful proposal creation
  const handleProposalCreated = () => {
    console.log('Proposal created successfully');
    
    // Refresh proposals list for the selected pod
    if (selectedPod && selectedPod.podId && selectedPod.name) {
      fetchProposalsForPod(selectedPod.podId, selectedPod.name);
    }
  };

  // Handler for proposal voting
  const handleProposalVoted = async () => {
    // After a successful vote, refresh the proposals list
    if (selectedPod && selectedPod.podId && selectedPod.name) {
      fetchProposalsForPod(selectedPod.podId, selectedPod.name);
      
      // Also update the selected proposal with fresh data if one is selected
      if (selectedProposal && selectedProposal.proposalId && daoId) {
        try {
          const updatedProposal = await proposalService.getPodProposalById(
            daoId, 
            selectedPod.podId, 
            selectedProposal.proposalId
          );
          if (updatedProposal) {
            setSelectedProposal(updatedProposal);
          }
        } catch (err) {
          console.error('Error refreshing proposal data after vote:', err);
        }
      }
    }
  };

  // Handler for successful proposal creation with blockchain transaction
  const handleCreateProposalWithTransaction = async (
    title: string,
    description: string,
    endDate: Date
  ) => {
    if (!walletState.publicKey) {
      alert('Wallet not connected');
      return false;
    }
    
    if (!selectedPod) {
      alert('No pod selected');
      return false;
    }

    if (!daoId) {
      alert('DAO ID is missing');
      return false;
    }

    if (!selectedPod.podId) {
      alert('Pod ID is missing');
      return false;
    }
    
    try {
      showTransactionModal('Creating POD Proposal', 'Please confirm the transaction in your wallet to create this proposal.');
      
      console.log(`Creating proposal transaction for POD: ${selectedPod.podId}`);
      
      // Create the proposal transaction using UTC dates
      const result = await proposalService.createProposalTransaction(
        daoId,
        selectedPod.podId,
        walletState.publicKey,
        {
          title,
          description,
          startDate: getCurrentUTC(),
          endDate,
          actions: []
        }
      );
      
      if (!result) {
        throw new Error('Failed to create proposal transaction');
      }
      
      // Extract transaction and proposalAccount
      const { transaction, proposalAccount } = result;
      
      // Send the transaction using Solana wallet adapter
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      const signature = await signAndSendTransaction(walletState, connection, transaction);
      
      console.log('Transaction confirmed:', signature);
      
      // Show validation state while waiting for indexing
      showTransactionModal(
        'Transaction Confirmed', 
        'POD proposal transaction successful! Waiting for blockchain indexing to complete...', 
        'validating'
      );
      
      // Wait a moment to show the validation state, then hide modal
      setTimeout(() => {
        hideTransactionModal();
      }, 2000);
      
      // Create proposal via API using UTC dates
      await proposalService.createProposalForPOD(daoId, selectedPod.podId, {
        title,
        description,
        startDate: getCurrentUTC(),
        endDate,
        actions: [],
        transactionSignature: signature,
        proposalAccount: proposalAccount.publicKey.toString()
      });
      
      return true;
    } catch (err) {
      hideTransactionModal();
      console.error('Error creating proposal:', err);
      throw err;
    }
  };

  // Handler for voting on a proposal with blockchain transaction
  const handleVoteWithTransaction = async (proposalId: string, vote: 'for' | 'against') => {
    if (!walletState.publicKey) {
      alert('Wallet not connected');
      return false;
    }
    
    if (!selectedPod) {
      alert('No pod selected');
      return false;
    }
    
    if (!daoId) {
      alert('DAO ID is missing');
      return false;
    }
    
    try {
      showTransactionModal('Processing Vote', 'Please confirm the transaction in your wallet to cast your vote.');
      
      console.log(`Creating vote transaction for proposal: ${proposalId}, vote: ${vote}`);
      
      // Create the vote transaction
      const result = await proposalService.createVoteTransaction(
        daoId,
        proposalId,
        walletState.publicKey,
        vote
      );
      
      if (!result) {
        throw new Error('Failed to create vote transaction');
      }
      
      // Extract transaction
      const { transaction, voteAccount } = result;
      
      // Send the transaction using Solana wallet adapter
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      const signature = await signAndSendTransaction(walletState, connection, transaction);
      
      console.log('Vote transaction confirmed:', signature);
      
      // Show validation state while waiting for indexing
      showTransactionModal(
        'Vote Confirmed', 
        'Vote transaction successful! Waiting for blockchain indexing to complete...', 
        'validating'
      );
      
      // Wait a moment to show the validation state, then hide modal
      setTimeout(() => {
        hideTransactionModal();
      }, 2000);
      
      // Submit vote to API
      await proposalService.voteOnPODProposal(
        daoId,
        selectedPod.podId,
        proposalId,
        vote,
        signature,
        voteAccount.publicKey.toString()
      );
      
      return true;
    } catch (err) {
      hideTransactionModal();
      console.error('Error voting on proposal:', err);
      throw err;
    }
  };

  // Filter pods based on the user's membership
  const getFilteredPods = (filterType: 'my' | 'available' | 'all') => {
    if (!userIsDaoMember || !currentUserId) return pods;
    
    switch (filterType) {
      case 'my':
        return pods.filter((pod: POD) => {
          // Check if pod has members and if current user is in them
          return pod.podId && podMembers[pod.podId]?.some((member: any) => member.userId === currentUserId);
        });
      case 'available':
        return pods.filter((pod: POD) => {
          // Find pods where the user is not a member
          return pod.podId && !podMembers[pod.podId]?.some((member: any) => member.userId === currentUserId);
        });
      case 'all':
      default:
        return pods;
    }
  };

  // Check if user is a member of a specific pod
  const isUserPodMember = (podId: string | undefined) => {
    if (!podId || !currentUserId) return false;
    return podMembers[podId]?.some((member: any) => member.userId === currentUserId) || false;
  };

  // Render a message for non-DAO members
  const renderNonMemberMessage = () => {
    // Different message if wallet is not connected
    if (!connected) {
      if (!showNonMemberMessage) return null;
      
      return (
        <div className="p-6">
          <div className="bg-surface-200 p-8 rounded-lg text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-text mb-4">Connect Your Wallet</h2>
            <p className="text-text mb-6">
              Please connect your wallet to view and interact with PODs.
            </p>
            <div className="flex justify-center space-x-4">
              <button 
                onClick={() => setShowNonMemberMessage(false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-3 rounded-md text-sm inline-flex items-center"
              >
                <X size={16} className="mr-2" /> Dismiss
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-6">
        <div className="bg-surface-200 p-8 rounded-lg text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold text-text mb-4">DAO Membership Required</h2>
          <p className="text-text mb-6">
            You must be a member of this DAO to view and create PODs. 
            PODs are specialized groups within the DAO that work on specific tasks or areas.
          </p>
          <button 
            onClick={() => {
              if (daoId) {
                window.location.href = `/daos/${daoId}`;
              }
            }}
            className="bg-primary text-text px-6 py-3 rounded-md text-sm inline-flex items-center"
          >
            Go to DAO page to join
          </button>
        </div>
      </div>
    );
  };

  // Add adapter to convert Proposal to ProposalDetails for PopupProposal
  const convertToProposalDetails = (proposal: Proposal): any => {
    return {
      id: proposal.proposalId || '',
      name: proposal.name || '',
      description: proposal.description || '',
      status: proposal.isActive ? 'Active' : (proposal.hasPassed ? 'Passed' : 'Rejected'),
      creator: proposal.createdByUsername || 'Unknown',
      createdAt: proposal.startTime?.toISOString() || new Date().toISOString(),
      startTime: proposal.startTime?.toISOString() || new Date().toISOString(),
      endTime: proposal.endTime?.toISOString() || new Date().toISOString(),
      votes: {
        for: proposal.forVotesCount || 0,
        against: proposal.againstVotesCount || 0
      },
      actions: [],
      quorum: 1, // Default quorum
      minApproval: 50, // Default approval threshold (50%)
      daoId: proposal.daoId || '',
      isPodProposal: true, // Since we're in the Pods component, all proposals here are pod proposals
      podId: proposal.podId || selectedPod?.podId || '' // Get podId from the proposal or selected pod
    };
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden p-6">
      <div className={containers.flexBetween + " mb-4 flex-shrink-0"}>
        <h1 className={typography.h1}>Pods</h1>
      </div>

      {loading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <Card className="mb-4 flex-shrink-0">
          <div className="flex items-center text-red-400">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Left sidebar - list of pods */}
          <div className="lg:col-span-1 min-h-0 flex flex-col">
            <Card 
              title="Pods" 
              rightElement={
                userIsDaoMember && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    leftIcon={<Plus size={14} />}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Create
                  </Button>
                )
              }
              className="flex flex-col h-full overflow-hidden"
            >
              <div className="flex mb-4 border-b border-gray-800 pb-2">
                <button
                  className={`mr-3 text-sm px-3 py-1 rounded-md transition-colors ${podsFilter === 'my' ? 'bg-purple-600/40 text-white' : 'hover:bg-surface-200 text-gray-400'}`}
                  onClick={() => setPodsFilter('my')}
                >
                  My Pods
                </button>
                <button
                  className={`mr-3 text-sm px-3 py-1 rounded-md transition-colors ${podsFilter === 'available' ? 'bg-purple-600/40 text-white' : 'hover:bg-surface-200 text-gray-400'}`}
                  onClick={() => setPodsFilter('available')}
                >
                  Available Pods
                </button>
                <button
                  className={`text-sm px-3 py-1 rounded-md transition-colors ${podsFilter === 'all' ? 'bg-purple-600/40 text-white' : 'hover:bg-surface-200 text-gray-400'}`}
                  onClick={() => setPodsFilter('all')}
                >
                  All
                </button>
              </div>
              
              <div className={`space-y-2 ${utils.scrollHidden} overflow-y-auto flex-1 pr-2`}>
                {pods.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Layers size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No pods have been created yet.</p>
                  </div>
                ) : (
                  <>
                    {podsFilter === 'my' && (
                      <div>
                        {getFilteredPods('my').length === 0 ? (
                          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                            <p className="text-gray-400 text-sm">You haven't joined any pods yet.</p>
                          </div>
                        ) : (
                          getFilteredPods('my').map((pod: POD) => (
                            <div 
                              key={pod.podId}
                              className={`p-3 rounded-lg cursor-pointer transition-all mb-2 ${selectedPod?.podId === pod.podId ? 'bg-[#222]/90 border border-purple-800/60' : 'border border-gray-800/20 hover:border-gray-700/40'}`}
                              onClick={() => setSelectedPod(pod)}
                            >
                              <div className={containers.flexBetween}>
                                <h3 className={typography.h4}>{pod.name}</h3>
                                <Badge variant={selectedPod?.podId === pod.podId ? "primary" : "success"} className="text-xs">
                                  {pod.podId && podMembers[pod.podId]?.length || 0} 
                                  {pod.podId && podMembers[pod.podId]?.length === 1 ? ' member' : ' members'}
                                </Badge>
                              </div>
                              <p className={`${typography.small} mt-1 line-clamp-2`}>{pod.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {podsFilter === 'available' && (
                      <div>
                        {getFilteredPods('available').length === 0 ? (
                          <div className="text-center p-4 bg-[#1a1a1a] rounded-lg">
                            <p className="text-gray-400 text-sm">No other pods available.</p>
                          </div>
                        ) : (
                          getFilteredPods('available').map((pod: POD) => (
                            <div 
                              key={pod.podId}
                              className={`p-3 rounded-lg cursor-pointer transition-all mb-2 ${selectedPod?.podId === pod.podId ? 'bg-[#222]/90 border border-purple-800/60' : 'border border-gray-800/20 hover:border-gray-700/40'}`}
                              onClick={() => setSelectedPod(pod)}
                            >
                              <div className={containers.flexBetween}>
                                <h3 className={typography.h4}>{pod.name}</h3>
                                <Badge variant={selectedPod?.podId === pod.podId ? "primary" : "neutral"} className="text-xs">
                                  {pod.podId && podMembers[pod.podId]?.length || 0}
                                  {pod.podId && podMembers[pod.podId]?.length === 1 ? ' member' : ' members'}
                                </Badge>
                              </div>
                              <p className={`${typography.small} mt-1 line-clamp-2`}>{pod.description}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {podsFilter === 'all' && pods.map((pod: POD) => (
                      <div 
                        key={pod.podId}
                        className={`p-3 rounded-lg cursor-pointer transition-all mb-2 ${selectedPod?.podId === pod.podId ? 'bg-[#222]/90 border border-purple-800/60' : 'border border-gray-800/20 hover:border-gray-700/40'}`}
                        onClick={() => setSelectedPod(pod)}
                      >
                        <div className={containers.flexBetween}>
                          <h3 className={typography.h4}>{pod.name}</h3>
                          <Badge 
                            variant={
                              selectedPod?.podId === pod.podId 
                                ? "primary" 
                                : pod.podId && isUserPodMember(pod.podId)
                                  ? "success"
                                  : "neutral"
                            } 
                            className="text-xs"
                          >
                            {pod.podId && podMembers[pod.podId]?.length || 0}
                            {pod.podId && podMembers[pod.podId]?.length === 1 ? ' member' : ' members'}
                          </Badge>
                        </div>
                        <p className={`${typography.small} mt-1 line-clamp-2`}>{pod.description}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Right content area - selected pod */}
          <div className="lg:col-span-3 min-h-0 flex flex-col">
            {selectedPod ? (
              <div className="flex flex-col h-full min-h-0">
                <Card 
                  title={
                    <div className="flex items-center">
                      <h2 className={typography.h2}>{selectedPod.name}</h2>
                      <Badge variant="primary" className="ml-3">
                        {selectedPod.podId && podMembers[selectedPod.podId]?.length || 0}
                        {selectedPod.podId && podMembers[selectedPod.podId]?.length === 1 ? ' member' : ' members'}
                      </Badge>
                    </div>
                  }
                  rightElement={
                    userIsDaoMember && (
                      <div className="flex space-x-2">
                        {userIsMember ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            leftIcon={<LogOut size={14} />}
                            onClick={handleLeavePod}
                            isLoading={membershipLoading}
                          >
                            Leave
                          </Button>
                        ) : (
                          <Button 
                            variant="primary" 
                            size="sm"
                            leftIcon={<LogIn size={14} />}
                            onClick={handleJoinPod}
                            isLoading={membershipLoading}
                          >
                            Join
                          </Button>
                        )}
                        {userIsMember && (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            leftIcon={<Edit size={14} />}
                            onClick={() => setIsUpdateModalOpen(true)}
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    )
                  }
                  className="mb-4 flex-shrink-0"
                >
                  <div className="space-y-4">
                    <p className={typography.body}>{selectedPod.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className={typography.label}>Created</span>
                        <span className="text-white">
                          {selectedPod.createdAt 
                            ? new Date(selectedPod.createdAt).toLocaleDateString()
                            : 'Unknown'
                          }
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className={typography.label}>Proposals</span>
                        <span className="text-white">{filteredProposals.length}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className={typography.label}>Status</span>
                        <Badge variant={selectedPod.isActive ? "success" : "error"} className="w-fit mt-1">
                          {selectedPod.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Discord feed and proposals in a 2-column layout */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 flex-1 min-h-0">
                  {/* Discord Feed (70% width) */}
                  <div className="md:col-span-7 min-h-0 flex flex-col">
                    <Card 
                      title="Discord Feed" 
                      rightElement={
                        <Button 
                          variant="icon" 
                          onClick={() => fetchFeedMessages(daoId || '', selectedPod.podId || '')} 
                          isLoading={feedLoading}
                        >
                          <RefreshCw size={14} />
                        </Button>
                      }
                      className="flex flex-col h-full overflow-hidden"
                    >
                      {feedLoading ? (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                        </div>
                      ) : feedMessages.length > 0 ? (
                        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                          {feedMessages.map((message: DiscordMessage) => (
                            <div key={message.messageId} className="bg-[#191919] p-3 rounded-md">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-2">
                                    {message.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-medium text-white">{message.username}</div>
                                    <div className="text-gray-400 text-xs">{formatDate(message.createdAt)}</div>
                                  </div>
                                </div>
                                <a 
                                  href={`https://discord.com/users/${message.userId}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink size={14} />
                                </a>
                              </div>
                              <div className="break-words text-sm text-gray-300">{message.text}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No Discord messages found for this pod.</p>
                            <p className="text-xs mt-2">Discord messages will appear here when synchronized.</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Proposals (30% width) */}
                  <div className="md:col-span-3 min-h-0 flex flex-col">
                    <Card 
                      title="Proposals" 
                      rightElement={
                        userIsMember && (
                          <Button 
                            variant="primary" 
                            size="sm"
                            leftIcon={<Plus size={14} />}
                            onClick={() => setIsCreateProposalModalOpen(true)}
                          >
                            Create
                          </Button>
                        )
                      }
                      className="flex flex-col h-full overflow-hidden"
                    >
                      {filteredProposals.length > 0 ? (
                        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                          {filteredProposals.map((proposal: Proposal) => (
                            <div 
                              key={proposal.proposalId} 
                              className="bg-[#191919] p-3 rounded-md hover:bg-[#222] cursor-pointer transition-colors"
                              onClick={() => setSelectedProposal(proposal)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="font-medium text-white">{proposal.name}</div>
                                <Badge 
                                  variant={proposal.isActive ? "primary" : (proposal.hasPassed ? "success" : "error")}
                                  className="text-xs"
                                >
                                  {proposal.isActive ? 'Active' : (proposal.hasPassed ? 'Passed' : 'Rejected')}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-400 mb-2">
                                Created by {proposal.createdByUsername || 'Unknown'} on {new Date(proposal.startTime).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-gray-300 line-clamp-2">{proposal.description}</p>
                              <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
                                <span>Votes: {(proposal.forVotesCount || 0) + (proposal.againstVotesCount || 0)}</span>
                                <span>Ends: {new Date(proposal.endTime).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <Calendar size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No proposals found</p>
                            {userIsMember && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="mt-4"
                                leftIcon={<Plus size={14} />}
                                onClick={() => setIsCreateProposalModalOpen(true)}
                              >
                                Create First Proposal
                              </Button>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center py-10">
                  <Layers size={48} className="mx-auto mb-4 text-gray-500" />
                  <h3 className={typography.h3 + " mb-2"}>Select a Pod</h3>
                  <p className="text-gray-400 max-w-md mx-auto">
                    Choose a pod from the sidebar to view its details, Discord feed, and proposals.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Keep existing modal components */}
      {isCreateModalOpen && (
        <CreatePodModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handlePodUpdated}
          daoId={daoId || ''}
        />
      )}

      {isUpdateModalOpen && selectedPod && (
        <UpdatePodModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onSuccess={handlePodUpdated}
          daoId={daoId || ''}
          pod={selectedPod}
        />
      )}

      {isCreateProposalModalOpen && selectedPod && (
        <CreateProposalModal
          isOpen={isCreateProposalModalOpen}
          onClose={() => setIsCreateProposalModalOpen(false)}
          onSuccess={handleProposalCreated}
          daoId={daoId || ''}
          podId={selectedPod.podId || ''}
          podName={selectedPod.name || ''}
          createWithTransaction={handleCreateProposalWithTransaction}
          wallet={walletState}
        />
      )}

      {selectedProposal && (
        <PopupProposal
          proposal={convertToProposalDetails(selectedProposal)}
          onClose={() => setSelectedProposal(null)}
          onVote={handleVoteWithTransaction}
          canVote={userIsMember}
          onVoteSubmitted={handleProposalVoted}
          wallet={walletState}
        />
      )}

      {!userIsDaoMember && !daoMembershipLoading && !loading && showNonMemberMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          {renderNonMemberMessage()}
        </div>
      )}
    </div>
  );
};

export default Pods;