import React, { useState, useEffect } from 'react';
import { ChevronDown, ExternalLink, Check, Calendar, Users, Search, X, Filter } from 'lucide-react';
import type { User } from '../core/modules/dao-api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import { useParams } from 'react-router-dom';
import { daosService } from '../services/DaosService';
import { containers, typography, ui, utils } from '../styles/theme';
import Card from './common/Card';
import Button from './common/Button';
import Badge from './common/Badge';

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
  
  // Date range filters
  const [activitySince, setActivitySince] = useState<string>('');
  const [activityUntil, setActivityUntil] = useState<string>('');
  const [loginSince, setLoginSince] = useState<string>('');
  const [loginUntil, setLoginUntil] = useState<string>('');
  
  // Fetch DAO members using the DaosService
  useEffectOnce(() => {
    const fetchDaoMembers = async () => {
      try {
        setLoading(true);
        
        // Use the daosService to fetch the DAO by ID
        const daoData = await daosService.getDaoById(daoId || '');
        
        if (daoData && daoData.members) {
          // Transform the basic user data into the format expected by the component
          const membersData = await Promise.all(daoData.members.map(async (member: User) => {
            // You might need to fetch additional user details if needed
            return {
              id: member.userId,
              name: member.username || 'Unknown',
              username: member.username || 'Unknown',
              wallet: member.walletAddress || '0x0000000000000000000000000000000000000000',
              avatar: `https://avatars.dicebear.com/api/identicon/${member.userId}.svg`,
              pods: [], // This would need to be populated from another API call if needed
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
      case 'Recent':
        result.sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
        break;
      case 'Oldest':
        result.sort((a, b) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
        break;
    }
    
    setFilteredMembers(result);
  }, [daoMembers, sortOrder, podFilter, activitySince, activityUntil, loginSince, loginUntil]);

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

  return (
    <div className="p-6">
      <div className={containers.flexBetween + " mb-6"}>
        <h1 className={typography.h1}>Members</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            leftIcon={<Search size={16} />}
            onClick={() => {}}
          >
            Search
          </Button>
          <Button
            variant={isActivityFilterActive ? "primary" : "outline"}
            leftIcon={<Filter size={16} />}
            onClick={() => toggleDropdown('activity')}
          >
            Filter
          </Button>
        </div>
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
          <div className={containers.grid + " mb-6"}>
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
          </div>
          
          {/* Filter dropdown */}
          {activeDropdown === 'activity' && (
            <Card className="mb-6">
              <div className="space-y-4">
                <div className={containers.flexBetween}>
                  <h3 className={typography.h3}>Activity Filters</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetActivityFilters}
                    leftIcon={<X size={14} />}
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={typography.label + " block mb-1"}>Last Activity Since</label>
                    <input
                      type="date"
                      value={activitySince}
                      onChange={(e) => setActivitySince(e.target.value)}
                      className={ui.input + " w-full"}
                    />
                  </div>
                  <div>
                    <label className={typography.label + " block mb-1"}>Last Activity Until</label>
                    <input
                      type="date"
                      value={activityUntil}
                      onChange={(e) => setActivityUntil(e.target.value)}
                      className={ui.input + " w-full"}
                    />
                  </div>
                  <div>
                    <label className={typography.label + " block mb-1"}>Last Login Since</label>
                    <input
                      type="date"
                      value={loginSince}
                      onChange={(e) => setLoginSince(e.target.value)}
                      className={ui.input + " w-full"}
                    />
                  </div>
                  <div>
                    <label className={typography.label + " block mb-1"}>Last Login Until</label>
                    <input
                      type="date"
                      value={loginUntil}
                      onChange={(e) => setLoginUntil(e.target.value)}
                      className={ui.input + " w-full"}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
          
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
                  <div className={utils.glassmorphism + " absolute left-0 mt-2 w-40 rounded-md shadow-lg z-10"}>
                    <div className="py-2">
                      {['A-Z', 'Z-A', 'Recent', 'Oldest'].map(option => (
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
              
              {/* Pods Filter Dropdown */}
              {uniquePods.length > 0 && (
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
                        {uniquePods.map(pod => (
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
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className={typography.small}>
              {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} found
            </div>
          </div>
          
          {/* Members list */}
          <Card>
            <div className="overflow-x-auto">
              <table className={ui.table.container}>
                <thead>
                  <tr>
                    <th className={ui.table.header}>Member</th>
                    <th className={ui.table.header}>Wallet</th>
                    <th className={ui.table.header}>Social</th>
                    <th className={ui.table.header}>Last Activity</th>
                    <th className={ui.table.header}>Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id?.toString()} className={ui.table.row}>
                      <td className={ui.table.cell}>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-3 text-white font-medium">
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
                        <div className="flex gap-2">
                          {member.discordId && (
                            <Badge variant="primary" className="text-xs">Discord</Badge>
                          )}
                          {member.twitter && (
                            <Badge variant="primary" className="text-xs">Twitter</Badge>
                          )}
                          {member.telegram && (
                            <Badge variant="primary" className="text-xs">Telegram</Badge>
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
    </div>
  );
};

export default Members;