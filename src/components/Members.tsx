import React, { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, Check, Calendar, Users, Search, X, Filter, Clock } from 'lucide-react';
import type { User, UserBasic, UserBasic1 } from '../core/modules/dao-api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useParams } from 'react-router-dom';
import { daosService } from '../services/DaosService';
import { containers, typography, ui, utils } from '../styles/theme';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';
import UserProfileModal, { UserProfileData } from './UserProfileModal';

interface MemberData {
  id: string | number | undefined;
  name: string;
  username: string;
  wallet: string;
  avatar: string;
  pods: string[];
  discordId: string;
  twitter: string;
  telegram: string;
  lastLogin: string | Date;
  lastInteraction: string | Date;
}

const Members = () => {
  const { daoId } = useParams<{ daoId: string }>();
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [podFilter, setPodFilter] = useState<string[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberData[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [daoMembers, setDaoMembers] = useState<MemberData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Date range filters
  const [activitySince, setActivitySince] = useState<string>('');
  const [activityUntil, setActivityUntil] = useState<string>('');
  const [loginSince, setLoginSince] = useState<string>('');
  const [loginUntil, setLoginUntil] = useState<string>('');
  
  // Selected member for profile modal
  const [selectedMember, setSelectedMember] = useState<UserProfileData | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  
  // Fetch DAO members using the DaosService
  useEffectOnce(() => {
    const fetchDaoMembers = async () => {
      try {
        setLoading(true);
        
        // Use the daosService to fetch the DAO by ID
        const daoData = await daosService.getDaoById(daoId || '');
        
        if (daoData && daoData.members) {
          // Transform the basic user data into the format expected by the component
          const membersData = await Promise.all(daoData.members.map(async (member: UserBasic) => {
            // You might need to fetch additional user details if needed
            return {
              id: member.userId,
              name: member.username || 'Unknown',
              username: member.username || 'Unknown',
              wallet: member.walletAddress || '0x0000000000000000000000000000000000000000',
              avatar: member.profilePicture || `https://avatars.dicebear.com/api/identicon/${member.userId}.svg`,
              pods: member.pods?.map(pod => pod.name || pod.toString()) || [], // Extract the pod names
              discordId: member.discordUsername || '',
              twitter: member.twitterUsername || '',
              telegram: member.telegramUsername || '',
              lastLogin: member.lastLogin || new Date().toISOString(), // Default to current date
              lastInteraction: member.lastInteraction || new Date().toISOString() // Default to current date
            };
          }));
          
          setDaoMembers(membersData);
        } else {
          setDaoMembers([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching DAO members:', err);
        setError('Failed to fetch DAO members. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchDaoMembers();
  }, [daoId]);

  // Get unique pod values for filter
  const uniquePods = [...new Set(daoMembers.flatMap(member => member.pods))].sort();

  // Toggle dropdown visibility
  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...daoMembers];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(member => 
        member.name.toLowerCase().includes(query) || 
        member.username.toLowerCase().includes(query) ||
        member.wallet.toLowerCase().includes(query)
      );
    }
    
    // Apply pod filter
    if (podFilter.length > 0) {
      result = result.filter(member => 
        member.pods.some(pod => podFilter.includes(pod))
      );
    }
    
    // Apply activity date range filters
    if (activitySince || activityUntil) {
      result = result.filter(member => {
        const activityDate = new Date(member.lastInteraction);
        
        if (activitySince && activityUntil) {
          return activityDate >= new Date(activitySince) && activityDate <= new Date(activityUntil);
        } else if (activitySince) {
          return activityDate >= new Date(activitySince);
        } else if (activityUntil) {
          return activityDate <= new Date(activityUntil);
        }
        
        return true;
      });
    }
    
    // Apply login date range filters
    if (loginSince || loginUntil) {
      result = result.filter(member => {
        const loginDate = new Date(member.lastLogin);
        
        if (loginSince && loginUntil) {
          return loginDate >= new Date(loginSince) && loginDate <= new Date(loginUntil);
        } else if (loginSince) {
          return loginDate >= new Date(loginSince);
        } else if (loginUntil) {
          return loginDate <= new Date(loginUntil);
        }
        
        return true;
      });
    }
    
    // Apply sorting
    switch (sortOrder) {
      case 'A-Z':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'Z-A':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'Recent Activity':
        result.sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime());
        break;
      case 'Recent Login':
        result.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
        break;
      case 'Oldest Login':
        result.sort((a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
        break;
    }
    
    setFilteredMembers(result);
  }, [daoMembers, sortOrder, podFilter, activitySince, activityUntil, loginSince, loginUntil, searchQuery]);

  // Reset all activity filters
  const resetActivityFilters = () => {
    setActivitySince('');
    setActivityUntil('');
    setLoginSince('');
    setLoginUntil('');
  };

  // Toggle pod in filter
  const togglePodFilter = (pod: string) => {
    setPodFilter(podFilter.includes(pod) 
      ? podFilter.filter(p => p !== pod) 
      : [...podFilter, pod]
    );
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format time ago for display
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

  // Truncate wallet address for display
  const truncateWallet = (wallet: string) => {
    return wallet.substring(0, 6) + '...' + wallet.substring(wallet.length - 4);
  };

  // Check if any activity filter is active
  const isActivityFilterActive = activitySince || activityUntil || loginSince || loginUntil;

  // Get the most recently joined member
  const lastJoinedMember = daoMembers.length > 0 
    ? [...daoMembers].sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())[0]
    : null;

  // Get the most recently active member
  const lastActiveMember = daoMembers.length > 0 
    ? [...daoMembers].sort((a, b) => new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime())[0]
    : null;

  // Handle member click to show profile
  const handleMemberClick = (member: MemberData) => {
    // Transform MemberData to UserProfileData
    const profileData: UserProfileData = {
      id: member.id?.toString() || '',
      username: member.username,
      name: member.name,
      walletAddress: member.wallet,
      socials: [
        ...(member.discordId ? [{ platform: 'discord', username: member.discordId }] : []),
        ...(member.twitter ? [{ platform: 'twitter', username: member.twitter }] : []),
        ...(member.telegram ? [{ platform: 'telegram', username: member.telegram }] : [])
      ],
      pods: member.pods.map(podName => ({ id: podName, name: podName })),
      daos: [{ id: daoId || '', name: 'Current DAO', joinedAt: new Date() }],
      lastActivity: member.lastInteraction,
      lastLogin: member.lastLogin,
      joinedAt: member.lastLogin, // Using last login as a fallback for join date
    };
    
    setSelectedMember(profileData);
    setIsProfileModalOpen(true);
  };

  return (
    <div className="p-6 h-screen overflow-hidden flex flex-col">
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Members</h1>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : error ? (
        <Card className="mb-6">
          <div className="flex items-center text-red-400">
            <X size={20} className="mr-2" />
            <p>{error}</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 mr-4">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <div className={ui.stat.label}>Total Members</div>
                <div className={ui.stat.value}>{daoMembers.length}</div>
              </div>
            </Card>
            
            {lastJoinedMember && (
              <Card className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 mr-4">
                  <Calendar size={24} className="text-white" />
                </div>
                <div>
                  <div className={ui.stat.label}>Last Joined</div>
                  <div className={ui.stat.value}>{lastJoinedMember.name}</div>
                  <div className={typography.small}>{getTimeAgo(lastJoinedMember.lastLogin)}</div>
                </div>
              </Card>
            )}
            
            {lastActiveMember && (
              <Card className="flex items-center">
                <div className="flex-shrink-0 p-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 mr-4">
                  <Clock size={24} className="text-white" />
                </div>
                <div>
                  <div className={ui.stat.label}>Last Active</div>
                  <div className={ui.stat.value}>{lastActiveMember.name}</div>
                  <div className={typography.small}>{getTimeAgo(lastActiveMember.lastInteraction)}</div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Sort and filter toolbar */}
          <div className={containers.flexBetween + " mb-4"}>
            <div className="flex space-x-2">
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
                  <div className={utils.glassmorphism + " absolute left-0 mt-2 w-48 rounded-md shadow-lg z-10"}>
                    <div className="py-2">
                      {['A-Z', 'Z-A', 'Recent Activity', 'Recent Login', 'Oldest Login'].map(option => (
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
              
              {/* Activity Date Filter Dropdown */}
              <div className="relative">
                <Button 
                  variant={isActivityFilterActive ? "primary" : "outline"} 
                  size="sm" 
                  onClick={() => toggleDropdown('activity')}
                  rightIcon={<ChevronDown size={16} />}
                >
                  Activity Date
                </Button>
                
                {activeDropdown === 'activity' && (
                  <div className={utils.glassmorphism + " absolute left-0 mt-2 w-64 rounded-md shadow-lg z-10"}>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Last Activity Since</label>
                        <input
                          type="date"
                          value={activitySince}
                          onChange={(e) => setActivitySince(e.target.value)}
                          className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-1">Last Login Since</label>
                        <input
                          type="date"
                          value={loginSince}
                          onChange={(e) => setLoginSince(e.target.value)}
                          className="w-full bg-[#191919] border border-gray-800 rounded-md p-2 text-white text-sm"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetActivityFilters}
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
              
              {/* Pods Filter Dropdown */}
              <div className="relative">
                <Button 
                  variant={podFilter.length > 0 ? "primary" : "outline"} 
                  size="sm" 
                  onClick={() => toggleDropdown('pods')}
                  rightIcon={<ChevronDown size={16} />}
                >
                  Pods {podFilter.length > 0 ? `(${podFilter.length})` : ''}
                </Button>
                
                {activeDropdown === 'pods' && (
                  <div className={utils.glassmorphism + " absolute left-0 mt-2 w-48 rounded-md shadow-lg z-10"}>
                    <div className="py-2">
                      {uniquePods.length > 0 ? (
                        uniquePods.map(pod => (
                          <button
                            key={pod}
                            className={`flex items-center w-full px-4 py-2 text-sm ${podFilter.includes(pod) ? 'text-purple-500' : 'text-gray-200'} hover:bg-[#222]/60`}
                            onClick={() => togglePodFilter(pod)}
                          >
                            <div className="flex-shrink-0 w-4 h-4 border rounded-sm mr-2 flex items-center justify-center border-gray-500">
                              {podFilter.includes(pod) && <Check size={12} className="text-purple-500" />}
                            </div>
                            <span>{pod}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-400">No pods available</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Search Bar - now aligned with the dropdowns */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members..."
                className="pl-10 pr-3 py-2 bg-[#191919] border border-gray-800 rounded-md text-white w-64 focus:outline-none focus:border-purple-600"
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
          </div>
          
          {/* Members list */}
          <Card className="overflow-hidden flex-1">
            <div className="overflow-auto h-full custom-scrollbar">
              <table className={ui.table.container}>
                <thead>
                  <tr>
                    <th className={ui.table.header}>Member</th>
                    <th className={ui.table.header}>Wallet</th>
                    <th className={ui.table.header}>Pods</th>
                    <th className={ui.table.header}>Social</th>
                    <th className={ui.table.header}>Last Activity</th>
                    <th className={ui.table.header}>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr 
                      key={member.id?.toString()} 
                      className={`${ui.table.row} cursor-pointer hover:bg-[#191919]`}
                      onClick={() => handleMemberClick(member)}
                    >
                      <td className={ui.table.cell}>
                        <div className="flex items-center">
                          {member.avatar ? (
                            <img 
                              src={member.avatar} 
                              alt={`${member.name}'s avatar`}
                              className="h-10 w-10 rounded-full mr-3 object-cover"
                              onError={(e) => {
                                // Fallback to first letter avatar if image fails to load
                                const imgElement = e.currentTarget;
                                imgElement.style.display = 'none';
                                const parentDiv = imgElement.parentElement;
                                if (parentDiv) {
                                  const letterAvatar = parentDiv.querySelector('div.rounded-full');
                                  if (letterAvatar && letterAvatar instanceof HTMLElement) {
                                    letterAvatar.style.display = 'flex';
                                  }
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3 text-white font-medium"
                            style={{display: member.avatar ? 'none' : 'flex'}}
                          >
                            {member.name.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-medium text-white">{member.name}</div>
                            <div className="text-xs text-gray-400">@{member.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className={ui.table.cell}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-300">{truncateWallet(member.wallet)}</span>
                          <a href={`https://explorer.solana.com/address/${member.wallet}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </td>
                      <td className={ui.table.cell}>
                        <div className="flex flex-wrap gap-1">
                          {member.pods.length > 0 ? (
                            member.pods.map((pod, index) => (
                              <Badge key={index} variant="primary" className="text-xs whitespace-nowrap">
                                {pod}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 text-xs">No pods</span>
                          )}
                        </div>
                      </td>
                      <td className={ui.table.cell}>
                        <div className="flex gap-2">
                          {member.discordId && (
                            <a 
                              href={`https://discord.com/users/${member.discordId}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex"
                            >
                              <Badge variant="primary" className="text-xs flex items-center gap-1">
                                Discord <ExternalLink size={12} />
                              </Badge>
                            </a>
                          )}
                          {member.twitter && (
                            <a 
                              href={`https://twitter.com/${member.twitter}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex"
                            >
                              <Badge variant="primary" className="text-xs flex items-center gap-1">
                                Twitter <ExternalLink size={12} />
                              </Badge>
                            </a>
                          )}
                          {member.telegram && (
                            <a 
                              href={`https://t.me/${member.telegram}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex"
                            >
                              <Badge variant="primary" className="text-xs flex items-center gap-1">
                                Telegram <ExternalLink size={12} />
                              </Badge>
                            </a>
                          )}
                        </div>
                      </td>
                      <td className={ui.table.cell}>
                        <div>
                          <div className="text-gray-300">{getTimeAgo(member.lastInteraction)}</div>
                          <div className="text-xs text-gray-400">{formatDate(member.lastInteraction)}</div>
                        </div>
                      </td>
                      <td className={ui.table.cell}>
                        <div>
                          <div className="text-gray-300">{getTimeAgo(member.lastLogin)}</div>
                          <div className="text-xs text-gray-400">{formatDate(member.lastLogin)}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
      
      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={selectedMember}
      />
    </div>
  );
};

export default Members;