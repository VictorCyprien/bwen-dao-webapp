import React from 'react';
const { useState, useEffect } = React;
import Modal from './common/Modal';
import { DAO } from '../core/modules/dao-api';
import { daosService } from '../services/DaosService';
import { ProposalService } from '../services/ProposalService';
import { Users, FileText, Globe, Sparkles, ArrowUpRight, Rocket, Check, UserPlus } from 'lucide-react';
import Button from './common/Button';
import { useNavigate } from 'react-router-dom';
import useApiAndWallet from '../hooks/useApiAndWallet';
import { UserService } from '../services/UserService';

interface DAOPublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  daoId: string | undefined;
  onEnterDashboard: (daoId?: string) => void;
}

interface AdminUser {
  userId: string;
  username?: string;
  profilePicture?: string;
}

const proposalService = new ProposalService();
const userService = new UserService();

const DAOPublicProfileModal: React.FC<DAOPublicProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  daoId,
  onEnterDashboard
}: {
  isOpen: boolean;
  onClose: () => void;
  daoId: string | undefined;
  onEnterDashboard: (daoId?: string) => void;
}) => {
  const [dao, setDao] = useState<DAO | null>(null);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userIsDaoMember, setUserIsDaoMember] = useState<boolean>(false);
  const [membershipLoading, setMembershipLoading] = useState<boolean>(false);
  const [showJoinAnimation, setShowJoinAnimation] = useState<boolean>(false);
  const [memberCount, setMemberCount] = useState<number>(0);
  const navigate = useNavigate();
  const { publicKey, connected } = useApiAndWallet();
  
  useEffect(() => {
    const fetchDAOData = async () => {
      if (!daoId || !isOpen) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch DAO details
        const daoData = await daosService.getDaoById(daoId);
        if (daoData) {
          setDao(daoData);
          setMemberCount(daoData.members?.length || 0);
          
          // Fetch proposal count
          const proposals = await proposalService.getAllProposals(daoId);
          setProposalCount(proposals.length);
        } else {
          setError("Couldn't load DAO information");
        }
      } catch (err) {
        console.error("Error fetching DAO data:", err);
        setError("An error occurred while loading DAO data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDAOData();
  }, [daoId, isOpen]);
  
  // Check if user is a member of the DAO
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

  // Join the DAO
  const handleJoinDao = async () => {
    if (!daoId || !publicKey) {
      console.error("Missing required data for joining DAO");
      return;
    }
    
    try {
      setMembershipLoading(true);
      
      // Get the user ID from the user service
      const currentUser = await userService.getCurrentUser();
      
      if (!currentUser || !currentUser.userId) {
        console.error("Could not find current user's ID");
        setMembershipLoading(false);
        return;
      }
      
      console.log("Found user ID for adding to DAO:", currentUser.userId);
      
      // Call the DAO-API SDK to join the DAO with the user ID
      const result = await daosService.addMemberToDao(daoId, currentUser.userId);
      if (result) {
        console.log('Successfully joined DAO');
        setMembershipLoading(false);
        
        // Show animation first, then set userIsDaoMember
        setShowJoinAnimation(true);
        // Smoothly update the member count
        setMemberCount((prev: number) => prev + 1);
        
        setTimeout(() => {
          setShowJoinAnimation(false);
          setUserIsDaoMember(true);
        }, 1500); // Shortened animation duration from 2500ms to 1500ms
      } else {
        console.error('Failed to join DAO');
        // Re-check membership to be sure
        checkDaoMembership();
        setMembershipLoading(false);
      }
    } catch (err) {
      console.error('Error joining DAO:', err);
      setMembershipLoading(false);
      // Re-check membership to be sure
      checkDaoMembership();
    }
  };
  
  // Check membership when component loads or when relevant data changes
  useEffect(() => {
    // Only run checks if we have a daoId and auth context
    if (!daoId || !isOpen) return;
    
    // Check membership if wallet is connected
    if (publicKey && connected) {
      checkDaoMembership();
    }
  }, [daoId, publicKey, connected, isOpen]);
  
  const handleAction = () => {
    if (userIsDaoMember) {
      // If user is a member, enter the dashboard
      onClose();
      onEnterDashboard(daoId);
    } else {
      // If user is not a member, join the DAO
      handleJoinDao();
    }
  };
  
  const renderSocialLinks = () => {
    if (!dao) return null;
    
    const socialLinks = [];
    
    if (dao.website) {
      socialLinks.push(
        <a 
          key="website" 
          href={dao.website.startsWith('http') ? dao.website : `https://${dao.website}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 mr-4"
        >
          <Globe size={14} />
          <span>Website</span>
        </a>
      );
    }
    
    if (dao.twitter) {
      socialLinks.push(
        <a 
          key="twitter" 
          href={`https://twitter.com/${dao.twitter}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
          </svg>
          <span>Twitter</span>
        </a>
      );
    }
    
    if (dao.discordServer) {
      socialLinks.push(
        <a 
          key="discord" 
          href={dao.discordServer} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6h6m-6 12h6m-6-6h6"></path>
            <path d="M5.5 16.5a4.5 4.5 0 0 1-1.8-8.7A5.5 5.5 0 1 1 12 4a6.5 6.5 0 1 1-2.5 12.3" stroke="none"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span>Discord</span>
        </a>
      );
    }
    
    return socialLinks.length > 0 ? (
      <div className="flex flex-wrap mt-4">
        {socialLinks}
      </div>
    ) : null;
  };
  
  if (!isOpen) return null;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      maxWidth="max-w-3xl"
    >
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-indigo-600 animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-400 mb-4">{error}</div>
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      ) : dao ? (
        <div className="space-y-6">
          {/* Header with profile info */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* DAO Logo */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium text-4xl">
              {dao.profilePicture ? (
                <img 
                  src={dao.profilePicture} 
                  alt={`${dao.name} logo`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.textContent = dao.name.charAt(0);
                    }
                  }}
                />
              ) : (
                dao.name.charAt(0)
              )}
            </div>
            
            {/* DAO Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{dao.name}</h1>
              <p className="text-gray-300 mb-4 max-w-xl">
                {dao.description || "This DAO hasn't provided a description yet."}
              </p>
              
              {/* Social links */}
              {renderSocialLinks()}
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Members */}
            <div className={`p-4 rounded-xl bg-[#1a1a1a] border border-indigo-800/30 backdrop-blur-sm transition-all duration-500 ${showJoinAnimation ? 'border-indigo-500/70 shadow-lg shadow-indigo-500/20' : 'hover:border-indigo-500/50'}`}>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-500 ${showJoinAnimation ? 'bg-indigo-500/30' : 'bg-indigo-500/10'}`}>
                  <Users size={20} className={`transition-all duration-500 ${showJoinAnimation ? 'text-indigo-300' : 'text-indigo-400'}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold flex items-center">
                    <span className={`transition-all duration-300 ${showJoinAnimation ? 'scale-110' : ''}`}>
                      {memberCount}
                    </span>
                    {showJoinAnimation && (
                      <span className="ml-1 text-green-400 text-sm inline-flex items-center opacity-0 animate-fadeIn">
                        <span className="animate-slideInFromBottom">+1</span>
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">Members</div>
                </div>
              </div>
            </div>
            
            {/* Proposals */}
            <div className="p-4 rounded-xl bg-[#1a1a1a] border border-purple-800/30 backdrop-blur-sm hover:border-purple-500/50 transition-all">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                  <FileText size={20} className="text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{proposalCount}</div>
                  <div className="text-sm text-gray-400">Proposals</div>
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div className="p-4 rounded-xl bg-[#1a1a1a] border border-pink-800/30 backdrop-blur-sm hover:border-pink-500/50 transition-all">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center mr-3">
                  <Sparkles size={20} className="text-pink-400" />
                </div>
                <div>
                  <div className="text-sm font-medium px-2 py-1 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white inline-flex items-center">
                    {dao.isActive ? 'Active' : 'Inactive'}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">Status</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button - Centered and changed based on membership */}
          <div className="flex justify-center mt-8">
            <style>{`
              @keyframes gradientShift {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              @keyframes slideInFromBottom {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              .animate-gradientShift {
                background-size: 200% 200%;
                animation: gradientShift 1.5s ease infinite;
              }
              
              .animate-fadeIn {
                animation: fadeIn 0.3s ease-out forwards;
              }
              
              .animate-slideInFromBottom {
                animation: slideInFromBottom 0.3s ease-out forwards;
              }
            `}</style>
            <Button 
              variant="primary"
              className={`px-6 py-3 text-base transition-all duration-300 ${
                showJoinAnimation ? 
                'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 animate-gradientShift scale-105 shadow-lg shadow-green-500/30' : 
                ''
              }`}
              onClick={handleAction}
              disabled={membershipLoading}
            >
              <span className="flex items-center">
                {membershipLoading ? (
                  <>
                    <span className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {userIsDaoMember ? 'Loading...' : 'Joining...'}
                  </>
                ) : showJoinAnimation ? (
                  <div className="flex items-center overflow-hidden">
                    <div className="flex items-center opacity-0 animate-fadeIn" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                      <Check className="mr-2 h-4 w-4" />
                    </div>
                    <div className="flex items-center">
                      <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>Joined&nbsp;</span>
                      <span className="opacity-0 animate-fadeIn" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>DAO!</span>
                      <span className="ml-1 opacity-0 animate-fadeIn" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                        <UserPlus size={14} className="text-green-300" />
                      </span>
                    </div>
                  </div>
                ) : userIsDaoMember ? (
                  <>
                    Enter Dashboard
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Join DAO
                    <Rocket className="ml-2 h-4 w-4" />
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-300 mb-4">No DAO information available.</p>
          <Button variant="primary" onClick={onClose}>Close</Button>
        </div>
      )}
    </Modal>
  );
};

export default DAOPublicProfileModal; 