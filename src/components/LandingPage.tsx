import React from 'react';
const { useState, useEffect, useRef } = React;
import useApiAndWallet from '../hooks/useApiAndWallet';
import CreateDaoModal from './CreateDaoModal';
import CreateMethodModal from './CreateMethodModal';
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
  Zap, 
  Globe, 
  Shield,
  LayoutGrid,
  Search,
  ArrowUpRight,
  Star,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/aurora.css';

// Add keyframes for logo scrolling
const logoScrollKeyframes = `
@keyframes logoScroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
`;

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
      bgColor = 'bg-gradient-to-r from-indigo-600 to-purple-600';
      textColor = 'text-white';
      icon = <Sparkles size={14} className="mr-1" />;
      break;
    case 'active':
      bgColor = 'bg-gradient-to-r from-teal-600 to-emerald-600';
      textColor = 'text-white';
      icon = <Users size={14} className="mr-1" />;
      break;
    case 'new':
      bgColor = 'bg-gradient-to-r from-amber-600 to-orange-600';
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

const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }: LandingPageProps) => {
  const { apiStatus, userDisplayInfo } = useApiAndWallet();
  const [isCreateDaoModalOpen, setIsCreateDaoModalOpen] = useState(false);
  const [isMethodSelectionOpen, setIsMethodSelectionOpen] = useState(false);
  const [isBabyWenOnboardingOpen, setIsBabyWenOnboardingOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'form' | 'babywen' | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('featured');
  const [daos, setDaos] = useState<DAO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllDAOs, setShowAllDAOs] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const navigate = useNavigate();
  
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
    }, 800);
    
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
  const filteredDaos = daos.filter((dao: DAO) => {
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
    setIsMethodSelectionOpen(true);
  };
  
  const handleMethodSelect = (method: 'form' | 'babywen') => {
    setSelectedMethod(method);
    setIsMethodSelectionOpen(false);
    
    if (method === 'form') {
      // Open traditional form
      setIsCreateDaoModalOpen(true);
    } else {
      // Navigate to BabyWen route instead of opening modal
      navigate('/create/babywen');
    }
  };



  // Add a ref for the 3D effect
  const logoRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse movement for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      
      const { clientX, clientY } = e;
      const { left, top, width, height } = logoRef.current.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      const rotateX = (y - 0.5) * 20;
      const rotateY = (x - 0.5) * 20;
      
      logoRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">
      {/* Aurora background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary aurora */}
        <div className="absolute top-[-20%] right-[-10%] w-[90%] h-[80%] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-30%] left-[-20%] w-[80%] h-[70%] bg-gradient-to-tr from-teal-600/20 via-cyan-600/15 to-blue-600/10 rounded-full blur-[120px] animate-pulse-slow-delayed"></div>
        
        {/* Secondary aurora effects */}
        <div className="absolute top-[30%] left-[10%] w-[40%] h-[30%] bg-gradient-to-r from-amber-600/10 to-orange-600/5 rounded-full blur-[80px] animate-float"></div>
        <div className="absolute bottom-[20%] right-[15%] w-[35%] h-[25%] bg-gradient-to-l from-emerald-600/10 to-green-600/5 rounded-full blur-[80px] animate-float-delayed"></div>
        
        {/* Aurora particles */}
        <div className="absolute inset-0 opacity-30">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `twinkle ${3 + Math.random() * 5}s infinite ${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>
      
      {/* Main content container */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="py-6 px-8 flex justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            {/* Logo removed from here */}
          </div>
          
          <div className="flex items-center">
              <ApiAuthStatus 
                apiStatus={apiStatus} 
                userDisplayInfo={userDisplayInfo}
              />
          </div>
        </nav>
        
        {/* Hero section - Centered Logo Focus */}
        <section className="relative h-[90vh] sm:h-[95vh] flex flex-col items-center justify-center px-4 mt-[50px]">
          {/* Main Logo Container with Animation */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              animationComplete ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="relative">
              {/* Logo with 3D effect */}
              <div className="relative z-10 w-[95vw] sm:w-[550px] md:w-[650px] mx-auto overflow-hidden">
                <img 
                  src="https://i.imgur.com/OZCrF4z.png" 
                  alt="DAO Logo" 
                  className="w-full h-auto object-contain object-top drop-shadow-2xl max-h-[200px] sm:max-h-[300px] md:max-h-[350px]"
                />
              </div>
            </div>
          </div>
          
          {/* Tagline below logo */}
          <div 
            className={`mt-4 sm:mt-6 md:mt-10 text-center transition-all duration-700 delay-300 ${
              animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2 leading-tight px-4">
              Transform <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">governance</span> <br className="hidden sm:block" />
              into something extraordinary
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto px-4">
              Create, manage, and scale your decentralized autonomous organization with powerful tools designed for modern communities.
            </p>
            <div className="flex flex-wrap gap-3 justify-center px-4">
              <button
                onClick={openCreateDaoModal}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors shadow-lg shadow-indigo-500/20 group text-xs sm:text-sm"
              >
                <span className="flex items-center">
                  Create DAO
                  <Rocket className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <Button 
                variant="outline"
                size="lg"
                onClick={scrollToDAOs}
                className="rounded-xl border-indigo-500/30 hover:border-indigo-500/50 group text-xs sm:text-sm py-2 px-3 sm:py-2.5 sm:px-4"
              >
                <span className="flex items-center">
                  Explore DAOs
                  <ArrowUpRight className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Button>
            </div>
            
            {/* Stats section integrated after the buttons */}
            <div className={`mt-8 sm:mt-10 max-w-4xl mx-auto transition-all duration-700 delay-500 ${
              animationComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {/* Stats cards */}
              <div className="relative backdrop-blur-sm rounded-2xl overflow-hidden">
                {/* Mobile layout (triangular) / Desktop layout (3 in a row) */}
                <div className="sm:hidden flex flex-col gap-6 relative z-10">
                  {/* First row - two cards side by side */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Active DAO Members */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                        <Users size={24} className="text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">400+</h3>
                        <p className="text-xs text-gray-400 mt-1">Active DAO Members</p>
                      </div>
                    </div>
                    
                    {/* DAOs Launched */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                        <LayoutGrid size={24} className="text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">50+</h3>
                        <p className="text-xs text-gray-400 mt-1">DAOs Launched</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second row - single centered card */}
                  <div className="mx-auto">
                    {/* Successful Proposals */}
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                        <Zap size={24} className="text-pink-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">200+</h3>
                        <p className="text-xs text-gray-400 mt-1">Successful Proposals</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Desktop layout - all 3 in a row */}
                <div className="hidden sm:grid sm:grid-cols-3 gap-8 md:gap-12 relative z-10">
                  {/* Active DAO Members */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                      <Users size={24} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">400+</h3>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Active DAO Members</p>
                    </div>
                  </div>
                  
                  {/* DAOs Launched */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                      <LayoutGrid size={24} className="text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">50+</h3>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">DAOs Launched</p>
                    </div>
                  </div>
                  
                  {/* Successful Proposals */}
                  <div className="flex flex-col items-center text-center group">
                    <div className="w-14 h-14 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:scale-110 transition-transform mb-3">
                      <Zap size={24} className="text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-rose-400">200+</h3>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Successful Proposals</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured DAOs section */}
        <section id="daos-section" className="py-16 sm:py-20 px-4 sm:px-8">
          <div className="container mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Explore DAOs</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">Discover and join decentralized autonomous organizations that align with your interests and values.</p>
            </div>
            
            {/* Filter tabs - centered */}
            <div className="mb-10 flex flex-col items-center gap-4">
              <div className="bg-[#151515] inline-flex p-1 rounded-lg">
                {['featured', 'active', 'new'].map((filter) => (
                  <button
                    key={filter}
                    className={`px-6 py-2 rounded-md transition-all ${
                      activeFilter === filter 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    onClick={() => setActiveFilter(filter)}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
              
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search DAOs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#151515] border border-indigo-700/30 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              </div>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-indigo-600 animate-spin mb-4"></div>
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
                  {(showAllDAOs ? filteredDaos : filteredDaos.slice(0, 8)).map((dao: DAO, index: number) => (
                    <div 
                      key={dao.daoId} 
                      className="group cursor-pointer"
                      onClick={() => onEnterDashboard(dao.daoId)}
                    >
                      <Card className="h-full transition-all hover:border-indigo-500 overflow-hidden flex flex-col bg-[#151515] border-indigo-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/10">
                        {/* Card Header */}
                        <div className="p-5 border-b border-[#222] flex items-center">
                          <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-4 text-white font-medium text-lg">
                            {dao.profilePicture ? (
                              <img 
                                src={dao.profilePicture} 
                                alt={`${dao.name} logo`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Fallback to first letter if image fails to load
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
                          <div>
                            <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
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
                          <div className="flex items-center text-indigo-500 font-medium">
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
        
        {/* How It Works Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#0d0d0d]">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">How It Works</h2>
              <p className="text-base sm:text-xl text-gray-300">Simple steps to create and manage your DAO with powerful tools.</p>
            </div>
            
            <div className="relative max-w-5xl mx-auto">
              {/* Connection line */}
              <div className="absolute left-1/2 top-12 bottom-12 w-1 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 hidden md:block"></div>
              
              {/* Timeline items */}
              <div className="space-y-16 md:space-y-24 relative">
                {/* Step 1 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-indigo-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-indigo-500/10 transition-all md:mr-8 mb-8 md:mb-0">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3">1</span>
                      Create Your DAO
                    </h3>
                    <p className="text-gray-300">Setup your organization with our intuitive tools. Define your governance model, membership, and voting parameters.</p>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <Rocket size={48} className="text-indigo-400" />
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="hidden md:flex justify-center md:order-1">
                    <div className="w-32 h-32 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Users size={48} className="text-purple-400" />
                    </div>
                  </div>
                  <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-purple-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all md:ml-8 md:order-2">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm mr-3">2</span>
                      Invite Members
                    </h3>
                    <p className="text-gray-300">Grow your community by inviting members. Assign roles, permissions, and voting rights to build your DAO ecosystem.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="md:grid md:grid-cols-2 md:gap-8 items-center">
                  <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-pink-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-pink-500/10 transition-all md:mr-8">
                    <h3 className="text-xl font-bold mb-4 flex items-center">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold text-sm mr-3">3</span>
                      Launch Proposals
                    </h3>
                    <p className="text-gray-300">Start governing with transparent proposals and voting. Execute decisions and track progress all in one place.</p>
                  </div>
                  <div className="hidden md:flex justify-center">
                    <div className="w-32 h-32 rounded-full bg-pink-500/10 flex items-center justify-center">
                      <Sparkles size={48} className="text-pink-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Partners Section with Scrolling Banner */}
        <section className="py-16 sm:py-20 bg-transparent">
          <div className="container mx-auto px-0 sm:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Our Partners</h2>
              <p className="text-gray-400 max-w-2xl mx-auto px-4 text-sm sm:text-base">Working with leading protocols and organizations in the web3 ecosystem.</p>
            </div>
          </div>
            
          {/* Full-width Scrolling Logo Banner */}
          <div className="relative overflow-hidden py-10 w-full">
            <style dangerouslySetInnerHTML={{ __html: logoScrollKeyframes }} />
            <div className="flex whitespace-nowrap" style={{ animation: 'logoScroll 40s linear infinite' }}>
              {/* First set of logos - added more logos for better infinite scroll effect */}
              {[
                { name: "Ethereum", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png" },
                { name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
                { name: "Polygon", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
                { name: "Arweave", logo: "https://cryptologos.cc/logos/arweave-ar-logo.png" },
                { name: "IPFS", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png" },
                { name: "Binance", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
                { name: "Avalanche", logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
                { name: "Chainlink", logo: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
                { name: "Arbitrum", logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
                { name: "Optimism", logo: "https://cryptologos.cc/logos/optimism-op-logo.png" },
                { name: "Cardano", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
                { name: "Polkadot", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
              ].map((partner, index) => (
                <div key={`set1-${index}`} className="flex flex-col items-center mx-6 md:mx-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center p-4 sm:p-5">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`} 
                      className="max-w-full max-h-full object-contain filter brightness-125" 
                    />
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm mt-2">{partner.name}</span>
                </div>
              ))}
              
              {/* Duplicated set for infinite scroll effect */}
              {[
                { name: "Ethereum", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Ethereum_logo_2014.svg/1257px-Ethereum_logo_2014.svg.png" },
                { name: "Solana", logo: "https://cryptologos.cc/logos/solana-sol-logo.png" },
                { name: "Polygon", logo: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
                { name: "Arweave", logo: "https://cryptologos.cc/logos/arweave-ar-logo.png" },
                { name: "IPFS", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Ipfs-logo-1024-ice-text.png" },
                { name: "Binance", logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
                { name: "Avalanche", logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png" },
                { name: "Chainlink", logo: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
                { name: "Arbitrum", logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png" },
                { name: "Optimism", logo: "https://cryptologos.cc/logos/optimism-op-logo.png" },
                { name: "Cardano", logo: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
                { name: "Polkadot", logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png" },
              ].map((partner, index) => (
                <div key={`set2-${index}`} className="flex flex-col items-center mx-6 md:mx-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center p-4 sm:p-5">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} logo`} 
                      className="max-w-full max-h-full object-contain filter brightness-125" 
                    />
                  </div>
                  <span className="text-gray-300 text-xs sm:text-sm mt-2">{partner.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 sm:py-24 px-4 sm:px-8 bg-transparent">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">What Our Users Say</h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">Join hundreds of satisfied communities already managing their DAOs on our platform.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
              <div className="p-6 sm:p-8 rounded-2xl border border-indigo-800/30 bg-transparent backdrop-blur-sm hover:border-indigo-500/50 transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    JD
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">John Dao</h4>
                    <p className="text-gray-400 text-sm">DeFi Protocol Founder</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "Our governance process was complex and fragmented before. This platform streamlined everything and increased member participation by 70%."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              
              <div className="p-6 sm:p-8 rounded-2xl border border-purple-800/30 bg-transparent backdrop-blur-sm hover:border-purple-500/50 transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                    SG
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Sarah Governance</h4>
                    <p className="text-gray-400 text-sm">Community Lead</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "The proposal and voting features are incredibly intuitive. We've been able to make decisions faster while keeping everyone engaged."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
              
              <div className="p-6 sm:p-8 rounded-2xl border border-pink-800/30 bg-transparent backdrop-blur-sm hover:border-pink-500/50 transition-all">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-pink-600 to-rose-600 flex items-center justify-center text-white font-bold">
                    MT
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Michael Token</h4>
                    <p className="text-gray-400 text-sm">NFT Collective Organizer</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  "Setting up our DAO took minutes instead of weeks. The platform's flexibility allowed us to create a governance model that perfectly fits our needs."
                </p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < 4 ? "text-amber-400 fill-amber-400" : "text-amber-400"} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features section */}
        <section id="features" className="py-16 sm:py-24 bg-[#0f0f0f]">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">Powerful Features for Modern DAOs</h2>
              <p className="text-base sm:text-xl text-gray-300">Everything you need to build, manage and grow your decentralized organization.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mb-6">
                  <Users size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Member Management</h3>
                <p className="text-gray-400">
                  Seamlessly onboard, manage, and engage members. Track contributions, activity, and voting power.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mb-6">
                  <Shield size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Governance</h3>
                <p className="text-gray-400">
                  Create proposals, vote, and execute decisions. Transparent governance with flexible voting mechanisms.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center mb-6">
                  <Heart size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Community Building</h3>
                <p className="text-gray-400">
                  Build pods, delegate tasks, and foster engagement with community-focused tools.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center mb-6">
                  <Zap size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Token Integration</h3>
                <p className="text-gray-400">
                  Seamlessly integrate with existing tokens or create your own for governance and rewards.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center mb-6">
                  <Globe size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">Global Accessibility</h3>
                <p className="text-gray-400">
                  Connect with members worldwide with multi-language support and time-zone aware features.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center mb-6">
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
        
        {/* CTA Section - Restyled to match the first button style */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to launch your DAO?</h2>
              <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8">
                Join hundreds of communities already using our platform to manage their decentralized organizations.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={openCreateDaoModal}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-colors shadow-lg shadow-indigo-500/20 group"
                >
                  <span className="flex items-center">
                    Create DAO
                    <Rocket className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 sm:py-12 px-4 sm:px-8 bg-[#0a0a0a] border-t border-indigo-800/20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <img 
                  src="https://i.imgur.com/OZCrF4z.png" 
                  alt="DAO Logo" 
                  className="h-8 sm:h-10 mr-3 sm:mr-4"
                />
                <span className="text-gray-400 text-sm">© {new Date().getFullYear()} BWEN</span>
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-8 justify-center">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Docs</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Help</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a>
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
        
        {/* Method Selection Modal */}
        <CreateMethodModal
          isOpen={isMethodSelectionOpen}
          onClose={() => setIsMethodSelectionOpen(false)}
          onSelectMethod={handleMethodSelect}
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