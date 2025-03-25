import React, { useState, useEffect, useRef } from 'react';
import useApiAndWallet from '../hooks/useApiAndWallet';
import CreateDaoModal from './CreateDaoModal';
import { typography } from '../styles/theme';
import ApiAuthStatus from './common/ApiAuthStatus';
import { daosService } from '../services/DaosService';
import { DAO } from '../core/modules/dao-api';
import { useEffectOnce } from '../hooks/useEffectOnce';
import Button from './common/Button';
import Card from './common/Card';
import ProfileModal from './ProfileModal';
import { 
  ArrowRight, 
  Clock, 
  Heart, 
  Sparkles, 
  Users, 
  ChevronDown, 
  Zap, 
  Globe, 
  Shield,
  LayoutGrid,
  Search
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface LandingPageProps {
  onEnterDashboard: (daoId?: string) => void;
}

// Badge types
type BadgeType = 'featured' | 'active' | 'new';

// Generate badge component with appropriate color
const Badge = ({ type }: { type: BadgeType }) => {
  let bgColor = '';
  let textColor = '';
  let icon = null;
  
  switch (type) {
    case 'featured':
      bgColor = 'bg-gradient-to-r from-purple-600 to-blue-600';
      textColor = 'text-white';
      icon = <Sparkles size={14} className="mr-1" />;
      break;
    case 'active':
      bgColor = 'bg-gradient-to-r from-green-600 to-emerald-600';
      textColor = 'text-white';
      icon = <Users size={14} className="mr-1" />;
      break;
    case 'new':
      bgColor = 'bg-gradient-to-r from-orange-600 to-amber-600';
      textColor = 'text-white';
      icon = <Clock size={14} className="mr-1" />;
      break;
  }
  
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${bgColor} ${textColor} flex items-center`}>
      {icon}
      {type}
    </span>
  );
};

// Function to get badges for a DAO based on its properties
const getDAOBadges = (dao: DAO, index: number): BadgeType[] => {
  const badges: BadgeType[] = [];
  
  if (dao.isActive) {
    badges.push('active');
  }
  
  if (index < 5) {
    badges.push('featured');
  }
  
  if (dao.daoId && parseInt(dao.daoId) % 3 === 0) {
    badges.push('new');
  }
  
  return badges;
};

const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  const { apiStatus, userDisplayInfo } = useApiAndWallet();
  const [isCreateDaoModalOpen, setIsCreateDaoModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('featured');
  const [daos, setDaos] = useState<DAO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllDAOs, setShowAllDAOs] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // Check for Telegram auth parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hasTelegramAuth = 
      searchParams.has('id') && 
      searchParams.has('first_name') && 
      searchParams.has('auth_date') && 
      searchParams.has('hash');

    if (hasTelegramAuth) {
      // Simply open the profile modal
      setIsProfileModalOpen(true);
    }
  }, []);
  
  // Logo animation sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1800);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch DAOs from the API
  useEffectOnce(() => {
    const fetchDAOs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedDaos = await daosService.getAllDaos();
        setDaos(fetchedDaos);
      } catch (err) {
        console.error("Error fetching DAOs:", err);
        setError("Failed to load DAOs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDAOs();
  }, []);
  
  const handleCreateDaoSuccess = (daoId: string) => {
    setTimeout(() => {
      onEnterDashboard(daoId);
    }, 1000);
  };

  // Filter DAOs based on active filter and search query
  const filteredDaos = daos.filter(dao => {
    // First apply the filter
    let passesFilter = true;
    if (activeFilter === 'active') passesFilter = Boolean(dao.isActive);
    if (activeFilter === 'new') {
      passesFilter = Boolean(dao.daoId && parseInt(dao.daoId) % 3 === 0);
    }
    
    // Then apply the search
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      dao.name.toLowerCase().includes(searchLower) || 
      (dao.description && dao.description.toLowerCase().includes(searchLower));
    
    return passesFilter && matchesSearch;
  });
  
  // Get top 4 DAOs for featured section
  const featuredDaos = daos.slice(0, 4);
  
  const scrollToDAOs = () => {
    document.getElementById('daos-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const openCreateDaoModal = () => {
    setIsCreateDaoModalOpen(true);
  };
  
  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">
      {/* Fixed background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[80%] h-[70%] bg-purple-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-30%] left-[-10%] w-[70%] h-[80%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>
      
      {/* Main content container */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="py-6 px-8 flex justify-between items-center">
          <div className="flex items-center">
            {/* Logo removed from here */}
          </div>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={scrollToDAOs} 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Explore DAOs
            </button>
            <button 
              onClick={() => { window.scrollTo({ top: document.getElementById('features')?.offsetTop, behavior: 'smooth' }) }} 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <ApiAuthStatus 
              apiStatus={apiStatus} 
              userDisplayInfo={userDisplayInfo}
            />
          </div>
        </nav>
        
        {/* Hero section */}
        <section className="relative">
          {/* Decorative element */}
          <div className="absolute top-20 left-10 w-20 h-20 border border-purple-500/30 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 border border-blue-500/20 rounded-full"></div>
          
          <div className="container mx-auto px-8 py-12 min-h-[85vh] flex flex-col lg:flex-row items-center justify-between">
            {/* Left column: Hero Text */}
            <div className="lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
              <div className={`transition-all duration-1000 ${animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Transform <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">governance</span> into something extraordinary
                </h1>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                  Create, manage, and scale your decentralized autonomous organization with powerful tools designed for modern communities.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={openCreateDaoModal}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                  >
                    Create DAO
                  </button>
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={scrollToDAOs}
                    className="rounded-xl"
                  >
                    Explore DAOs
                  </Button>
                </div>
                
                <div className="mt-10 flex items-center">
                  <div className="flex -space-x-2 mr-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center border-2 border-[#0a0a0a] text-xs font-bold">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">Join <span className="text-white font-medium">400+</span> users building DAOs</p>
                </div>
              </div>
            </div>
            
            {/* Right column: Giant Logo Animation */}
            <div className="lg:w-1/2 flex justify-center items-center">
              <div 
                className={`transition-all duration-1500 ease-out ${animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
              >
                <div className="relative">
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 to-blue-600/30 rounded-full blur-xl animate-pulse-slow"></div>
                  
                  {/* Logo */}
                  <img 
                    src="https://i.imgur.com/OZCrF4z.png" 
                    alt="DAO Logo" 
                    className="relative z-10 w-full max-w-lg mx-auto animate-float"
                  />
                  
                  {/* Floating elements */}
                  <div className="absolute top-10 left-0 w-12 h-12 bg-purple-500/10 rounded-lg animate-float-slow"></div>
                  <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-500/10 rounded-full animate-float-delay"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <p className="text-gray-400 text-sm mb-2">Scroll to explore</p>
            <ChevronDown size={20} className="text-gray-400 animate-bounce" />
          </div>
        </section>
        
        {/* Stats Section with angled design */}
        <section className="relative py-16 bg-gradient-to-br from-[#131313] to-[#0d0d0d]">
          <div className="absolute top-0 left-0 right-0 h-12 bg-[#0a0a0a] transform -skew-y-2"></div>
          
          <div className="container mx-auto px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
                <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                  <Users size={28} className="text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">400+</h3>
                <p className="text-gray-400">Active DAO Members</p>
              </div>
              
              <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
                  <LayoutGrid size={28} className="text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">50+</h3>
                <p className="text-gray-400">DAOs Launched</p>
              </div>
              
              <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
                  <Zap size={28} className="text-green-400" />
                </div>
                <h3 className="text-3xl font-bold mb-2">200+</h3>
                <p className="text-gray-400">Successful Proposals</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured DAOs section */}
        <section id="daos-section" className="py-20 px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Explore DAOs</h2>
                <p className="text-gray-400 max-w-2xl">Discover and join decentralized autonomous organizations that align with your interests and values.</p>
              </div>
              
              <div className="mt-6 md:mt-0">
                <button
                  onClick={openCreateDaoModal}
                  className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  Create DAO
                </button>
              </div>
            </div>
            
            {/* Filter tabs */}
            <div className="mb-10 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="bg-[#151515] inline-flex p-1 rounded-lg">
                {['featured', 'active', 'new'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-6 py-2 rounded-md transition-all ${
                      activeFilter === filter 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Search DAOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#151515] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-purple-600 animate-spin mb-4"></div>
                <p className="text-gray-400">Loading DAOs...</p>
              </div>
            )}
            
            {/* Error state */}
            {error && !isLoading && (
              <Card className="mb-8 max-w-lg mx-auto">
                <div className="text-center">
                  <div className="text-red-400 mb-4">{error}</div>
                  <Button 
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Empty state */}
            {!isLoading && !error && filteredDaos.length === 0 && (
              <Card className="mb-8 max-w-lg mx-auto">
                <div className="text-center">
                  <p className="text-gray-300 mb-4">No DAOs found matching your criteria.</p>
                  <Button 
                    variant="primary"
                    onClick={() => setActiveFilter('featured')}
                  >
                    View All DAOs
                  </Button>
                </div>
              </Card>
            )}
            
            {/* DAO Grid */}
            {!isLoading && !error && filteredDaos.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(showAllDAOs ? filteredDaos : filteredDaos.slice(0, 8)).map((dao, index) => (
                    <div 
                      key={dao.daoId} 
                      className="group cursor-pointer"
                      onClick={() => onEnterDashboard(dao.daoId)}
                    >
                      <Card className="h-full transition-all hover:border-purple-500 overflow-hidden flex flex-col bg-[#151515] border-gray-800">
                        {/* Card Header */}
                        <div className="p-5 border-b border-[#222] flex items-center">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mr-4 text-white font-medium text-lg">
                            {dao.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                              {dao.name}
                            </h3>
                            <div className="flex mt-1 space-x-2">
                              {getDAOBadges(dao, index).map((badge) => (
                                <Badge key={badge} type={badge} />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Body */}
                        <div className="p-5 flex-1">
                          <p className="text-gray-300 mb-4 line-clamp-3">
                            {dao.description || "This DAO hasn't provided a description yet."}
                          </p>
                          
                          {/* Stats */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#1a1a1a] p-3 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">Members</div>
                              <div className="font-semibold">{dao.members?.length || '0'}</div>
                            </div>
                            <div className="bg-[#1a1a1a] p-3 rounded-lg">
                              <div className="text-sm text-gray-400 mb-1">Proposals</div>
                              <div className="font-semibold">0</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Card Footer */}
                        <div className="p-5 border-t border-[#222] flex justify-between items-center">
                          <span className="text-sm text-gray-400">
                            {dao.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <div className="flex items-center text-purple-500 font-medium">
                            <span className="mr-2">Enter DAO</span>
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
                
                {filteredDaos.length > 8 && (
                  <div className="flex justify-center mt-10">
                    <Button 
                      variant="outline"
                      onClick={() => setShowAllDAOs(!showAllDAOs)}
                    >
                      {showAllDAOs ? 'Show Less' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        
        {/* Features section */}
        <section id="features" className="py-24 bg-[#0f0f0f]">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Powerful Features for Modern DAOs</h2>
              <p className="text-xl text-gray-300">Everything you need to build, manage and grow your decentralized organization.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mb-6">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Member Management</h3>
                <p className="text-gray-400">
                  Seamlessly onboard, manage, and engage members. Track contributions, activity, and voting power.
                </p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center mb-6">
                  <Shield size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Governance</h3>
                <p className="text-gray-400">
                  Create proposals, vote, and execute decisions. Transparent governance with flexible voting mechanisms.
                </p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center mb-6">
                  <Heart size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Community Building</h3>
                <p className="text-gray-400">
                  Build pods, delegate tasks, and foster engagement with community-focused tools.
                </p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center mb-6">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Token Integration</h3>
                <p className="text-gray-400">
                  Seamlessly integrate with existing tokens or create your own for governance and rewards.
                </p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-600 to-amber-600 flex items-center justify-center mb-6">
                  <Globe size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Global Accessibility</h3>
                <p className="text-gray-400">
                  Connect with members worldwide with multi-language support and time-zone aware features.
                </p>
              </div>
              
              <div className="flex flex-col items-start">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                  <LayoutGrid size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Modular Design</h3>
                <p className="text-gray-400">
                  Customize your DAO with modular components that fit your community's specific needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
          <div className="container mx-auto relative z-10">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#131313] rounded-3xl p-12 border border-gray-800">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-6">Ready to launch your DAO?</h2>
                <p className="text-xl text-gray-300 mb-8">
                  Join hundreds of communities already using our platform to manage their decentralized organizations.
                </p>
                <div className="flex justify-center">
                  <Button 
                    variant="primary"
                    size="lg"
                    onClick={() => setIsCreateDaoModalOpen(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Create a DAO
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-12 px-8 bg-[#0a0a0a] border-t border-gray-800">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <img 
                  src="https://i.imgur.com/OZCrF4z.png" 
                  alt="DAO Logo" 
                  className="h-10 mr-4"
                />
                <span className="text-gray-400">© {new Date().getFullYear()} BWEN</span>
              </div>
              <div className="flex flex-wrap gap-8">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Docs</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
        
        {/* Create DAO Form Modal */}
        <CreateDaoModal
          isOpen={isCreateDaoModalOpen}
          onClose={() => setIsCreateDaoModalOpen(false)}
          onSuccess={handleCreateDaoSuccess}
        />

        {/* Profile Modal for Telegram auth */}
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
        />
      </div>
    </div>
  );
};

export default LandingPage; 