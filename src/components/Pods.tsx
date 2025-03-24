import { useState } from 'react';
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
import { containers, typography, ui, utils } from '../styles/theme';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';

const Pods = () => {
  const { daoId } = useParams<{ daoId: string }>();
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

  // Fetch pods when component loads or daoId changes
  useEffectOnce(() => {
    if (daoId) {
      // Check DAO membership first
      checkDaoMembership();
    }
  }, [daoId]);

  // Watch for wallet connection changes to check membership
  useEffectOnce(() => {
    if (daoId && publicKey && connected) {
      checkDaoMembership();
    }
  }, [publicKey, connected]);

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

  // Format date for display
  const formatDate = (date: Date): string => {
    const now = new Date();
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
    if (!daoId || !selectedPod?.podId || !publicKey || !walletState) {
      console.error("Missing required data for proposal creation");
      return null;
    }
    
    try {
      console.log(`Creating proposal transaction for DAO: ${daoId}, POD: ${selectedPod.podId}`);
      
      // Create the transaction
      const result = await proposalService.createProposalTransaction(
        daoId,
        publicKey,
        {
          title: title,
          description: description,
          startDate: new Date(), // Start immediately
          endDate: endDate,
          actions: []
        }
      );
      
      if (!result) {
        throw new Error('Failed to create proposal transaction');
      }
      
      // Extract transaction
      const { transaction } = result;
      
      // Send the transaction using Solana wallet adapter
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      const signature = await walletState.sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log('Transaction confirmed:', signature);
      
      // Create proposal via API
      const newProposal = await proposalService.createProposalForPOD(
        daoId,
        selectedPod.podId,
        {
          title,
          description,
          endDate
        }
      );
      
      // Refresh proposal list
      if (selectedPod && selectedPod.podId && selectedPod.name) {
        fetchProposalsForPod(selectedPod.podId, selectedPod.name);
      }
      
      return newProposal;
    } catch (err) {
      console.error('Error creating proposal transaction:', err);
      throw err;
    }
  };

  // Handler for voting on a proposal with blockchain transaction
  const handleVoteWithTransaction = async (proposalId: string, vote: 'for' | 'against') => {
    if (!daoId || !selectedPod?.podId || !publicKey || !walletState) {
      console.error("Missing required data for voting");
      return false;
    }

      // Check if wallet is connected
    if (!walletState || !walletState.connected) {
      setError('Wallet not connected. Please connect your wallet to vote.');
      return;
    }
    
    try {
      console.log(`Creating vote transaction for proposal: ${proposalId}, vote: ${vote}`);
      
      // Create the vote transaction
      const result = await proposalService.createVoteTransaction(
        daoId,
        proposalId,
        publicKey,
        vote
      );
      
      if (!result) {
        throw new Error('Failed to create vote transaction');
      }
      
      // Extract transaction
      const { transaction } = result;
      
      // Send the transaction using Solana wallet adapter
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      const signature = await walletState.sendTransaction(transaction, connection);
      
      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      
      console.log('Vote transaction confirmed:', signature);
      
      // Submit vote to API
      await proposalService.voteOnPODProposal(
        daoId,
        selectedPod.podId,
        proposalId,
        vote
      );
      
      return true;
    } catch (err) {
      console.error('Error voting on proposal:', err);
      throw err;
    }
  };

  // Render a message for non-DAO members
  const renderNonMemberMessage = () => {
    // Different message if wallet is not connected
    if (!connected) {
      return (
        <div className="p-6">
          <div className="bg-surface-200 p-8 rounded-lg text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-yellow-400" />
            <h2 className="text-2xl font-bold text-text mb-4">Connect Your Wallet</h2>
            <p className="text-text mb-6">
              Please connect your wallet to view and interact with PODs.
            </p>
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

  return (
    <div className="p-6">
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Pods</h1>
        {userIsDaoMember && (
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Pod
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <Card className="mb-6">
          <div className="flex items-center text-red-400">
            <AlertCircle size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left sidebar - list of pods */}
          <div className="lg:col-span-1">
            <Card title="Available Pods" className="mb-6">
              <div className={`space-y-2 ${utils.scrollHidden} max-h-[50vh] lg:max-h-[70vh] overflow-y-auto pr-2`}>
                {pods.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <Layers size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No pods have been created yet.</p>
                    {userIsDaoMember && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-4"
                        leftIcon={<Plus size={14} />}
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        Create First Pod
                      </Button>
                    )}
                  </div>
                ) : (
                  pods.map((pod) => (
                    <div 
                      key={pod.podId}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${selectedPod?.podId === pod.podId ? 'bg-[#222]/90 border border-purple-800/60' : 'border border-gray-800/20 hover:border-gray-700/40'}`}
                      onClick={() => setSelectedPod(pod)}
                    >
                      <div className={containers.flexBetween}>
                        <h3 className={typography.h4}>{pod.name}</h3>
                        <Badge variant={selectedPod?.podId === pod.podId ? "primary" : "neutral"} className="text-xs">
                          {pod.memberCount || 0} {pod.memberCount === 1 ? 'member' : 'members'}
                        </Badge>
                      </div>
                      <p className={`${typography.small} mt-1 line-clamp-2`}>{pod.description}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Right content area - selected pod */}
          <div className="lg:col-span-2">
            {selectedPod ? (
              <div className="space-y-6">
                <Card 
                  title={
                    <div className="flex items-center">
                      <h2 className={typography.h2}>{selectedPod.name}</h2>
                      <Badge variant="primary" className="ml-3">
                        {selectedPod.memberCount || 0} {selectedPod.memberCount === 1 ? 'member' : 'members'}
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
                  className="mb-6"
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

                {/* Keep existing sections for Discord feed and proposals, but update their Card wrappers */}
                <div className="flex flex-col space-y-6">
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
                  >
                    {feedLoading ? (
                      <div className="h-64 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                      </div>
                    ) : feedMessages.length > 0 ? (
                      <div className="space-y-4">
                        {feedMessages.map((message) => (
                          <div key={message.messageId} className="bg-surface-200 p-3 rounded-md">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-text font-bold mr-2">
                                  {message.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-text font-medium">{message.username}</div>
                                  <div className="text-surface-500 text-xs">{formatDate(message.createdAt)}</div>
                                </div>
                              </div>
                              <a 
                                href={`https://discord.com/users/${message.userId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary text-xs flex items-center"
                              >
                                Discord <ExternalLink size={12} className="ml-1" />
                              </a>
                            </div>
                            <p className="text-text text-sm">{message.text}</p>
                            {message.hasMedia && message.mediaUrls && (
                              <div className="mt-2">
                                {Array.isArray(message.mediaUrls) ? (
                                  message.mediaUrls.map((url: string, index: number) => (
                                    <a 
                                      key={index} 
                                      href={url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-primary hover:underline text-xs inline-block mr-2"
                                    >
                                      Attachment {index + 1}
                                    </a>
                                  ))
                                ) : (
                                  <a 
                                    href={message.mediaUrls} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline text-xs"
                                  >
                                    Attachment
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-[#555555]">
                        <p>No messages in this pod yet. Be the first to post!</p>
                      </div>
                    )}
                  </Card>

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
                          Create Proposal
                        </Button>
                      )
                    }
                  >
                    {filteredProposals.length > 0 ? (
                      <div className="space-y-4">
                        {filteredProposals.map((proposal) => (
                          <div 
                            key={proposal.proposalId} 
                            className="bg-surface-200 p-3 rounded-md cursor-pointer hover:bg-surface-300"
                            onClick={() => setSelectedProposal(proposal)}
                          >
                            <h3 className="text-text font-medium mb-1">{proposal.name}</h3>
                            <p className="text-text opacity-80 text-sm mb-2">{proposal.description}</p>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-surface-500">
                                By {proposal.createdByUsername || 'Unknown'} on {
                                  proposal.startTime instanceof Date 
                                  ? proposal.startTime.toLocaleString() 
                                  : new Date(proposal.startTime).toLocaleString()
                                }
                              </span>
                              <div className="flex items-center">
                                <span className="text-primary mr-1">{proposal.forVotesCount || 0}</span>
                                <span className="text-surface-500">votes</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-[#555555]">
                        <p>No proposals in this pod yet. Create one!</p>
                      </div>
                    )}
                  </Card>
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
          onPodCreated={fetchPods}
          daoId={daoId || ''}
        />
      )}

      {isUpdateModalOpen && selectedPod && (
        <UpdatePodModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          onPodUpdated={handlePodUpdated}
          daoId={daoId || ''}
          pod={selectedPod}
        />
      )}

      {isCreateProposalModalOpen && selectedPod && (
        <CreateProposalModal
          isOpen={isCreateProposalModalOpen}
          onClose={() => setIsCreateProposalModalOpen(false)}
          onProposalCreated={handleProposalCreated}
          daoId={daoId || ''}
          podId={selectedPod.podId || ''}
          podName={selectedPod.name || ''}
          onCreateWithTransaction={handleCreateProposalWithTransaction}
        />
      )}

      {selectedProposal && (
        <PopupProposal
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onVote={handleVoteWithTransaction}
          canVote={userIsMember}
          onVoteSubmitted={handleProposalVoted}
          wallet={walletState}
        />
      )}

      {!userIsDaoMember && !daoMembershipLoading && !loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          {renderNonMemberMessage()}
        </div>
      )}
    </div>
  );
};

export default Pods;