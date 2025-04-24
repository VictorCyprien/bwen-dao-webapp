import React from 'react';
const { useState, useEffect } = React;
import Modal from './common/Modal';
import { DAO } from '../core/modules/dao-api';
import { daosService } from '../services/DaosService';
import { ProposalService } from '../services/ProposalService';
import { Users, FileText, Globe, Sparkles, ArrowUpRight, Rocket, Check, UserPlus, Twitter, Instagram, MessageCircle } from 'lucide-react';
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
          href={dao.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Website"
        >
          <Globe size={18} />
        </a>
      );
    }
    
    if (dao.twitter) {
      socialLinks.push(
        <a 
          key="twitter" 
          href={dao.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="X (Twitter)"
        >
          <Twitter size={18} />
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
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Discord"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.977-.608 1.414a15.932 15.932 0 0 0-4.746 0 9.698 9.698 0 0 0-.616-1.414.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055c1.998 1.483 3.948 2.388 5.851 2.98a.075.075 0 0 0 .082-.026c.446-.61.847-1.254 1.194-1.932a.075.075 0 0 0-.041-.104 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.127c.126-.095.252-.193.372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.099.246.198.373.292a.077.077 0 0 1-.006.127c-.598.35-1.22.645-1.873.892a.075.075 0 0 0-.041.105c.348.678.747 1.323 1.194 1.932a.076.076 0 0 0 .082.026c1.904-.592 3.854-1.497 5.852-2.98a.077.077 0 0 0 .032-.055c.505-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
          </svg>
        </a>
      );
    }
    
    if (dao.telegram) {
      socialLinks.push(
        <a 
          key="telegram" 
          href={dao.telegram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Telegram"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.064-1.225-.346-1.9-.685-1.056-.53-1.65-.856-2.676-1.362-1.186-.586-.417-1.033.26-1.632.177-.159 3.247-2.974 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
        </a>
      );
    }

    if (dao.instagram) {
      socialLinks.push(
        <a 
          key="instagram" 
          href={dao.instagram} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="Instagram"
        >
          <Instagram size={18} />
        </a>
      );
    }

    if (dao.tiktok) {
      socialLinks.push(
        <a 
          key="tiktok" 
          href={dao.tiktok} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white transition-colors p-2"
          title="TikTok"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        </a>
      );
    }
    
    return socialLinks.length > 0 ? (
      <div className="flex flex-wrap mt-1 mb-3 justify-center sm:justify-start gap-1">
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
      title={null}
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
        <div className="relative">
          {/* Close button in top right corner - Removed since it's now in Modal component */}
          
          <div className="space-y-6">
            {/* DAO Info - restructured for better responsiveness */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* DAO Logo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium text-4xl shrink-0">
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
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 break-words overflow-wrap-anywhere">{dao.name}</h1>
                
                {/* Social links moved here, right below the name */}
                {renderSocialLinks()}
                
                <p className="text-sm md:text-base text-gray-300 mb-4 max-w-xl break-words overflow-wrap-anywhere">
                  {dao.description || "This DAO hasn't provided a description yet."}
                </p>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {/* Members */}
              <div className={`p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-indigo-800/30 backdrop-blur-sm transition-all duration-500 ${showJoinAnimation ? 'border-indigo-500/70 shadow-lg shadow-indigo-500/20' : 'hover:border-indigo-500/50'}`}>
                <div className="flex items-center">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-500 ${showJoinAnimation ? 'bg-indigo-500/30' : 'bg-indigo-500/10'}`}>
                    <Users size={18} className={`transition-all duration-500 ${showJoinAnimation ? 'text-indigo-300' : 'text-indigo-400'}`} />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold flex items-center">
                      <span className={`transition-all duration-300 ${showJoinAnimation ? 'scale-110' : ''}`}>
                        {memberCount}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-400">Members</div>
                  </div>
                </div>
              </div>
              
              {/* Proposals */}
              <div className="p-3 sm:p-4 rounded-xl bg-[#1a1a1a] border border-purple-800/30 backdrop-blur-sm hover:border-purple-500/50 transition-all">
                <div className="flex items-center">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500/10 flex items-center justify-center mr-3">
                    <FileText size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{proposalCount}</div>
                    <div className="text-xs sm:text-sm text-gray-400">Proposals</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA Button - Centered and changed based on membership */}
            <div className="flex justify-center mt-6 sm:mt-8">
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
                
                .overflow-wrap-anywhere {
                  overflow-wrap: anywhere;
                  word-break: break-word;
                  hyphens: auto;
                }
              `}</style>
              <Button 
                variant="primary"
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base transition-all duration-300 ${
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