import React, { useState, useRef, useEffect } from 'react';
import { 
  CircleDollarSign,
  Vote,
  Users,
  Loader,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { treasuryService } from '../services/TreasuryService';
import { daosService } from '../services/DaosService';
import { userService } from '../services/UserService';
import { Treasury, Token, User } from '../core/modules/dao-api';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  PointElement,
  LinearScale,
  CategoryScale,
  Title
} from 'chart.js';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolanaTransaction } from '../hooks/useSolanaTransaction';
import DaoUpdateModal from './DaoUpdateModal';
import { useAuth } from '../context/AuthContext';
import { proposalService } from '../services/ProposalService';
import { SOLANA_RPC_ENDPOINT } from '../config/solana';
import PopupProposal from './PopupProposal';
import TokenCard from './TokenCard';
import TreasuryAssetsCard from './TreasuryAssetsCard';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  PointElement,
  LinearScale,
  CategoryScale,
  Title
);

// Define type for the selected proposal to solve typing issues
interface SelectedProposal {
  id: string;
  title: string;
  votesFor: number;
  votesAgainst: number;
  closingDate: Date;
  fullDetails?: {
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
    actions: Array<{
      type: string;
      description: string;
      walletAddress?: string;
      amount?: string;
      token?: string;
    }>;
    quorum: number;
    minApproval: number;
    daoId: string;
  }
}

// Define type for community links
interface CommunityLinks {
  twitter: string | null;
  discordServer: string | null;
  telegram: string | null;
  instagram: string | null;
  tiktok: string | null;
  website: string | null;
}

// Define props for Dashboard component
interface DashboardProps {
  recheckMembership?: () => void;
}

const Dashboard = ({ recheckMembership }: DashboardProps = {}) => {
  const { daoId } = useParams<{ daoId: string }>();
  const [treasury, setTreasury] = useState<Treasury | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [members] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [proposalsLoading, setProposalsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [userIsDaoMember, setUserIsDaoMember] = useState<boolean>(false);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);
  const [isDaoUpdateModalOpen, setIsDaoUpdateModalOpen] = useState<boolean>(false);
  const [hasUpdatePermission, setHasUpdatePermission] = useState<boolean>(false);
  const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
  const [tokenAddress, setTokenAddress] = useState<string>("7pmuGLLYdJ2mc7chZwEJAaxuWALAYqaVqbUwzzyHcA7D");
  const [daoProfile, setDaoProfile] = useState<{
    name: string | null;
    description: string | null;
    profilePicture: string | null;
  }>({
    name: null,
    description: null,
    profilePicture: null
  });
  const [communityLinks, setCommunityLinks] = useState<CommunityLinks>({
    twitter: null,
    discordServer: null,
    telegram: null,
    instagram: null,
    tiktok: null,
    website: null
  });
  const [currentProposalPage, setCurrentProposalPage] = useState<number>(1);
  const proposalsPerPage = 10;
  
  const { publicKey, connected } = useWallet();
  const { sendTransaction } = useSolanaTransaction();
  const { userInfo } = useAuth();
  const [showLeaveConfirmation, setShowLeaveConfirmation] = useState<boolean>(false);

  // Function to fetch treasury data
  const fetchTreasuryData = async (showRefreshIndicator = true) => {
    if (!daoId) {
      setError('No DAO ID provided');
      setLoading(false);
      return;
    }

    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const treasuryData = await treasuryService.getTreasury(daoId || '');
      setTreasury(treasuryData);
      
      const tokensData = await treasuryService.getTokens(daoId || '');
      setTokens(tokensData);
      
      setLastUpdated(new Date());
      setRefreshing(false);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching treasury data:', err);
      setError('Failed to load treasury data. Please try again.');
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Function to fetch proposals data
  const fetchProposalsData = async () => {
    if (!daoId) return;
    
    try {
      setProposalsLoading(true);
      
      const proposalsData = await proposalService.getAllProposals(daoId);
      
      const formattedProposals = proposalsData
        .filter(p => p.isActive)
        .map(p => ({
          id: p.proposalId || '',
          title: p.name || '',
          votesFor: p.forVotesCount || 0,
          votesAgainst: p.againstVotesCount || 0,
          closingDate: p.endTime ? new Date(p.endTime) : new Date()
        }));
      
      const sortedProposals = formattedProposals.sort((a, b) => a.closingDate.getTime() - b.closingDate.getTime());
      setProposals(sortedProposals);
      setProposalsLoading(false);
    } catch (err) {
      console.error('Error fetching proposals data:', err);
      setProposalsLoading(false);
    }
  };


  // Check if the current user is a member of the DAO
  const checkDaoMembership = async () => {
    if (!daoId || !publicKey) return;
    
    try {
      setMembershipLoading(true);
      
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setUserIsDaoMember(false);
        setMembershipLoading(false);
        return;
      }
      
      const members = await daosService.getDaoMembers(daoId);
      console.log('DAO members:', members);
      console.log('Current user ID:', currentUser.userId);
      
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

  // Join a DAO
  const handleJoinDao = async () => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for joining DAO");
      return;
    }
    
    try {
      setMembershipLoading(true);
      
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setMembershipLoading(false);
        return;
      }
      
      console.log("Found user ID for adding to DAO:", currentUser.userId);
      
      const result = await daosService.addMemberToDao(daoId, currentUser.userId);
      if (result) {
        console.log('Successfully joined DAO');
        setUserIsDaoMember(true);
        fetchTokenAddress();
      } else {
        console.error('Failed to join DAO');
        checkDaoMembership();
      }
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error joining DAO:', err);
      setMembershipLoading(false);
      checkDaoMembership();
    }
  };
  
  // Leave a DAO
  const handleLeaveDao = async () => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for leaving DAO");
      return;
    }
    
    try {
      setMembershipLoading(true);
      
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setMembershipLoading(false);
        return;
      }
      
      console.log("Found user ID for removal:", currentUser.userId);
      
      const result = await daosService.removeMemberFromDao(daoId, currentUser.userId);
      if (result) {
        console.log('Successfully left DAO');
        setUserIsDaoMember(false);
        
        // Redirect to landing page
        window.location.href = '/';
      } else {
        console.error('Failed to leave DAO');
        checkDaoMembership();
      }
      setMembershipLoading(false);
    } catch (err) {
      console.error('Error leaving DAO:', err);
      setMembershipLoading(false);
      checkDaoMembership();
    }
  };

  // Handle the confirmation to leave DAO
  const handleLeaveConfirm = () => {
    handleLeaveDao();
    setShowLeaveConfirmation(false);
  };

  // Check membership when component loads or when relevant data changes
  useEffectOnce(() => {
    if (!daoId) return;
    
    if (publicKey && connected) {
      checkDaoMembership();
    }
    
    if (userInfo?.userId) {
      checkUpdatePermission();
    }
    
  }, [daoId, publicKey, connected, userInfo?.userId]);

  // Fetch the token address for the current DAO
  const fetchTokenAddress = async () => {
    if (!daoId) return;
    
    try {
      const tokenAddr = await daosService.getDaoTokenAddress(daoId);
      
      if (tokenAddr) {
        setTokenAddress(tokenAddr);
        console.log('DAO token address loaded:', tokenAddr);
      } else {
        console.log('No token address found for this DAO, using default value');
      }
    } catch (err) {
      console.error('Error fetching DAO token address:', err);
    }
  };

  // Set up initial data load
  useEffectOnce(() => {
    if (!daoId) return;
    
    const loadData = async () => {
      await fetchTreasuryData();
      await fetchProposalsData();
      await fetchCommunityLinks();
      await fetchTokenAddress();
    };
    
    loadData();
    
    timerRef.current = setInterval(() => {
      fetchTreasuryData(false);
    }, 60000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [daoId]);

  // Initialize Solana connection once on component mount
  useEffectOnce(() => {
    proposalService.initializeSolanaConnection(SOLANA_RPC_ENDPOINT);
  });

  // Format currency value
  const formatCurrency = (value: any): string => {
    if (value === null || value === undefined) return '$0';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(Number(value));
  };

  // Format date for proposals
  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return `< 1h`;
    }
  };

  // Add a function to check if the current user is the owner or an admin of the DAO
  const checkUpdatePermission = async () => {
    if (!daoId || !userInfo?.userId) {
      setHasUpdatePermission(false);
      return;
    }
    
    try {
      const daoInfo = await daosService.getDaoById(daoId);
      
      if (!daoInfo) {
        setHasUpdatePermission(false);
        return;
      }
      
      if (daoInfo.ownerId === userInfo.userId) {
        setHasUpdatePermission(true);
        return;
      }
      
      const isAdmin = daoInfo.admins?.some(admin => admin.userId === userInfo.userId);
      setHasUpdatePermission(Boolean(isAdmin));
      
    } catch (err) {
      console.error('Error checking update permission:', err);
      setHasUpdatePermission(false);
    }
  };

  // Handle vote on proposal
  const handleVoteOnProposal = async (proposalId: string, vote: 'for' | 'against') => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for voting");
      return;
    }
    
    try {
      const result = await proposalService.createVoteTransaction(
        daoId,
        proposalId,
        publicKey,
        vote
      );
      
      if (!result) {
        console.error("Failed to create vote transaction");
        return null;
      }
      
      const { transaction, voteAccount } = result;

      const signature = await sendTransaction(transaction);
      
      if (!signature) {
        console.error("Failed to sign and send transaction");
        return null;
      }

      await proposalService.voteOnProposal(daoId, proposalId, vote, signature, voteAccount.publicKey.toString());
      
      await fetchProposalsData();
      return signature;
    } catch (err) {
      console.error("Error voting on proposal:", err);
      return null;
    }
  };

  // Close proposal popup
  const handleCloseProposal = () => {
    setSelectedProposal(null);
  };

  // Load full proposal details when selected
  const loadFullProposalDetails = async (proposalId: string) => {
    if (!daoId || !proposalId) return;
    
    try {
      const proposalDetails = await proposalService.getProposalById(daoId, proposalId);
      if (proposalDetails) {
        setSelectedProposal((prevProposal: SelectedProposal | null) => {
          if (!prevProposal) return null;
          
          return {
            ...prevProposal,
            fullDetails: {
              id: proposalDetails.proposalId || prevProposal.id,
              name: proposalDetails.name || prevProposal.title,
              description: proposalDetails.description || "No description available",
              status: proposalDetails.isActive ? "Active" : proposalDetails.hasPassed ? "Passed" : "Rejected",
              creator: proposalDetails.createdByUsername || "Unknown",
              startTime: proposalDetails.startTime ? new Date(proposalDetails.startTime).toLocaleDateString() : "Unknown",
              endTime: proposalDetails.endTime ? new Date(proposalDetails.endTime).toLocaleDateString() : "Unknown",
              votes: {
                for: proposalDetails.forVotesCount || prevProposal.votesFor || 0,
                against: proposalDetails.againstVotesCount || prevProposal.votesAgainst || 0
              },
              actions: proposalDetails.actions ? Object.values(proposalDetails.actions).map((action: any) => ({
                type: action.type || "",
                description: action.description || "",
                walletAddress: action.wallet_address,
                amount: action.amount,
                token: action.token
              })) : [],
              quorum: 100,
              minApproval: 51,
              daoId: daoId
            }
          };
        });
      }
    } catch (err) {
      console.error("Error loading full proposal details:", err);
    }
  };

  // Fetch community links
  const fetchCommunityLinks = async () => {
    if (!daoId) return;
    
    try {
      const daoInfo = await daosService.getDaoById(daoId);
      
      if (daoInfo) {
        const socialLinks = {
          twitter: daoInfo.twitter || null,
          discordServer: daoInfo.discordServer || null,
          telegram: daoInfo.telegram || null,
          instagram: daoInfo.instagram || null,
          tiktok: daoInfo.tiktok || null,
          website: daoInfo.website || null
        };
        
        setDaoProfile({
          name: daoInfo.name || null,
          description: daoInfo.description || null,
          profilePicture: daoInfo.profilePicture || null
        });
        
        if (daoInfo.tokenAddress) {
          setTokenAddress(daoInfo.tokenAddress);
        }
        
        console.log('Social links retrieved from API:', socialLinks);
        setCommunityLinks(socialLinks);
      } else {
        console.log('No DAO information found');
        setCommunityLinks({
          twitter: null,
          discordServer: null,
          telegram: null,
          instagram: null,
          tiktok: null,
          website: null
        });
      }
    } catch (err) {
      console.error('Error fetching community links:', err);
      setCommunityLinks({
        twitter: null,
        discordServer: null,
        telegram: null,
        instagram: null,
        tiktok: null,
        website: null
      });
    }
  };

  // Fetch community links when component loads or when relevant data changes
  useEffectOnce(() => {
    if (!daoId) return;
    
    fetchCommunityLinks();
  }, [daoId]);

  // Check if community links exist
  const hasCommunityLinks = (): boolean => {
    return Object.values(communityLinks).some(link => link !== null);
  };

  // Function to paginate proposals
  const paginatedProposals = () => {
    const startIndex = (currentProposalPage - 1) * proposalsPerPage;
    const endIndex = startIndex + proposalsPerPage;
    return proposals.slice(startIndex, endIndex);
  };

  // Function to handle page changes
  const handlePreviousPage = () => {
    if (currentProposalPage > 1) {
      setCurrentProposalPage((prev: number) => prev - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(proposals.length / proposalsPerPage);
    if (currentProposalPage < totalPages) {
      setCurrentProposalPage((prev: number) => prev + 1);
    }
  };

  // Reset to first page when proposals change
  useEffect(() => {
    setCurrentProposalPage(1);
  }, [proposals.length]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Home</h1>
        <div className="flex gap-3">
          {connected && userIsDaoMember && (
            <button 
              onClick={() => setShowLeaveConfirmation(true)}
              disabled={membershipLoading}
              className="group relative flex items-center justify-center h-11 w-11 rounded-lg bg-[#1A1A1A]/80 backdrop-blur-sm hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/50 transition-all duration-200"
              title="Leave DAO"
            >
              {membershipLoading ? (
                <Loader size={22} className="animate-spin text-red-500/70" />              ) : (
                <LogOut size={22} className="text-red-500/70 group-hover:text-red-500 transition-colors" />
              )}
            </button>
          )}
          {hasUpdatePermission && (
            <button 
              onClick={() => setIsDaoUpdateModalOpen(true)}
              className="group relative flex items-center justify-center h-11 w-11 rounded-lg bg-[#1A1A1A]/80 backdrop-blur-sm hover:bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-200"
              title="Update DAO"
            >
              <Settings size={22} className="text-purple-500/70 group-hover:text-purple-500 transition-colors" />
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-6">
        {/* Left Column: DAO Portfolio + News + Proposals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 space-y-4">
            {/* Overall DAO Stats - now fully responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mr-4">
                    <CircleDollarSign size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">DAO Balance</div>
                    <div className="text-2xl font-bold text-white mt-1">{formatCurrency(treasury?.totalValue)}</div>
                    {treasury?.dailyChangePercentage && (
                      <div className={`text-xs ${Number(treasury.dailyChangePercentage) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(treasury.dailyChangePercentage) >= 0 ? '↑' : '↓'} 
                        {Math.abs(Number(treasury.dailyChangePercentage)).toFixed(2)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
                    <Users size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">DAO Members</div>
                    <div className="text-2xl font-bold text-white mt-1">{members.length || 0}</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800/60">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 mr-4">
                    <Vote size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Active Proposals</div>
                    <div className="text-2xl font-bold text-white mt-1">{proposals.length}</div>
                  </div>
                </div>
              </div>
            </div>
            
           
            {/* Proposals Activity */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-white">Active Proposals</h3>
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">{proposals.length} Active</span>
              </div>
              
              {proposalsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader className="animate-spin text-primary" size={30} />
                </div>
              ) : proposals.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {paginatedProposals().map((proposal, index) => (
                      <div 
                        key={proposal.id} 
                        className="p-3 bg-[#1A1A1A]/70 rounded-lg hover:bg-[#222]/90 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedProposal(proposal);
                          loadFullProposalDetails(proposal.id);
                        }}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-white">{proposal.title}</span>
                          <span className="text-xs text-gray-400">Closes in {formatDate(proposal.closingDate)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex space-x-4">
                            <span className="text-green-400 text-sm">For: {proposal.votesFor}</span>
                            <span className="text-red-400 text-sm">Against: {proposal.votesAgainst}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {proposals.length > proposalsPerPage && (
                    <div className="flex justify-center items-center mt-4 pt-3 border-t border-gray-800">
                      <button 
                        className={`p-1 rounded-full ${currentProposalPage === 1 ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                        onClick={handlePreviousPage}
                        disabled={currentProposalPage === 1}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="mx-2 text-xs text-gray-400">
                        {currentProposalPage} of {Math.ceil(proposals.length / proposalsPerPage)}
                      </span>
                      <button 
                        className={`p-1 rounded-full ${currentProposalPage >= Math.ceil(proposals.length / proposalsPerPage) ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                        onClick={handleNextPage}
                        disabled={currentProposalPage >= Math.ceil(proposals.length / proposalsPerPage)}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-400">
                  <p>No active proposals at the moment</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column: Share Holders + Token Distribution */}
          <div className="col-span-1 space-y-4">
            {/* DAO Profile and Community Links - Moved up */}
            <div className="bg-[#111]/80 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-gray-800/60">
              {/* DAO Profile Section */}
              {daoProfile.name || daoProfile.description || daoProfile.profilePicture ? (
                <div className="flex flex-col md:flex-row items-center mb-5 border-b border-gray-800 pb-5">
                  {/* Profile picture container - Made consistently circular with responsive sizing */}
                  <div className="w-full md:w-[30%] flex justify-center items-center mb-4 md:mb-0 md:pr-3">
                    {daoProfile.profilePicture ? (
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-gray-700/50 flex-shrink-0">
                        <img 
                          src={daoProfile.profilePicture} 
                          alt={`${daoProfile.name || 'DAO'} profile`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=DAO';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-gray-700/50 flex-shrink-0">
                        <Users size={40} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Right column - Name and description (adjusted for better mobile view) */}
                  <div className="w-full md:w-[70%] md:pl-2 flex flex-col justify-center text-center md:text-left">
                    {daoProfile.name ? (
                      <h4 className="text-lg font-medium text-white mb-1 break-words overflow-wrap-anywhere">{daoProfile.name}</h4>
                    ) : (
                      <h4 className="text-lg font-medium text-white mb-1">Unnamed DAO</h4>
                    )}
                    
                    {daoProfile.description ? (
                      <p className="text-sm text-gray-400 break-words overflow-wrap-anywhere">
                        {daoProfile.description.length > 300 
                          ? `${daoProfile.description.substring(0, 300)}...` 
                          : daoProfile.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">
                        No description available
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center mb-5 border-b border-gray-800 pb-5">
                  {/* Left column - Profile picture (made consistently circular) */}
                  <div className="w-full md:w-[30%] flex justify-center items-center mb-4 md:mb-0 md:pr-3">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center border border-gray-700/50 flex-shrink-0">
                      <Users size={40} className="text-gray-400" />
                    </div>
                  </div>
                  
                  {/* Right column - Name and description (adjusted for mobile) */}
                  <div className="w-full md:w-[70%] md:pl-2 flex flex-col justify-center text-center md:text-left">
                    <h4 className="text-lg font-medium text-white mb-1 break-words overflow-wrap-anywhere">Loading DAO...</h4>
                    <p className="text-sm text-gray-400 break-words overflow-wrap-anywhere">
                      Fetching DAO information...
                    </p>
                  </div>
                </div>
              )}
              
              {hasCommunityLinks() ? (
                <div className="flex flex-wrap justify-center items-center gap-6 py-2">
                  {communityLinks.twitter && (
                    <a href={communityLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">X</span>
                    </a>
                  )}
                  
                  {communityLinks.discordServer && (
                    <a href={communityLinks.discordServer} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 127.14 96.36" fill="#fff">
                          <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Discord</span>
                    </a>
                  )}
                  
                  {communityLinks.telegram && (
                    <a href={communityLinks.telegram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Telegram</span>
                    </a>
                  )}
                  
                  {communityLinks.instagram && (
                    <a href={communityLinks.instagram} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.072-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Instagram</span>
                    </a>
                  )}
                  
                  {communityLinks.tiktok && (
                    <a href={communityLinks.tiktok} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">TikTok</span>
                    </a>
                  )}
                  
                  {communityLinks.website && (
                    <a href={communityLinks.website} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-[#1A1A1A] rounded-full flex items-center justify-center hover:bg-[#1A1A1A]/80 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="2" y1="12" x2="22" y2="12"></line>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                        </svg>
                      </div>
                      <span className="text-xs text-gray-400">Website</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="py-1 text-center">
                  <p className="text-xs text-gray-500 mt-2">This DAO has no community links</p>
                </div>
              )}
            </div>
            
            {/* Replace the DAO Token card with our TokenCard component */}
            <TokenCard tokenAddress={tokenAddress} />
            
            {/* Replace the existing Treasury Assets section with the new component */}
            <TreasuryAssetsCard 
              tokens={tokens}
              refreshing={refreshing}
            />
            
          </div>
        </div>
      </div>

      {/* DAO Update Modal */}
      <DaoUpdateModal 
        isOpen={isDaoUpdateModalOpen} 
        onClose={() => setIsDaoUpdateModalOpen(false)} 
      />
      
      {/* Proposal Modal */}
      {selectedProposal && (
        <PopupProposal
          proposal={selectedProposal.fullDetails || {
            id: selectedProposal.id,
            name: selectedProposal.title,
            description: "Loading proposal details...",
            status: "Active",
            creator: "Loading...",
            createdAt: "Loading...",
            startTime: "Loading...",
            endTime: formatDate(selectedProposal.closingDate),
            votes: {
              for: selectedProposal.votesFor,
              against: selectedProposal.votesAgainst
            },
            actions: [],
            quorum: 100,
            minApproval: 51,
            daoId: daoId || ""
          }}
          onClose={handleCloseProposal}
          onVote={handleVoteOnProposal}
          onVoteSubmitted={fetchProposalsData}
        />
      )}

      {/* Leave Confirmation Modal */}
      {showLeaveConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-red-500/20 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-500" />
              <h3 className="text-xl font-semibold text-white">Leave DAO</h3>
            </div>
            <p className="text-gray-400 mb-6">
              Are you sure you want to leave this DAO? You will lose access to all DAO features and will need to rejoin to regain access.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLeaveConfirmation(false)}
                className="px-4 py-2 rounded-lg bg-[#111] hover:bg-[#222] border border-gray-800 text-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveConfirm}
                className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-500 transition-colors"
              >
                Leave DAO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;