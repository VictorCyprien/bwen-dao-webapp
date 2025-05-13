import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import Governance from './components/Governance';
import Pods from './components/Pods';
import Members from './components/Members';
import Treasury from './components/Treasury';
import Modules from './components/Modules';
import Roles from './components/Roles';
import UserManagement from './components/UserManagement';
import LandingPage from './components/LandingPage';
import LandingPageDev from './components/Landingpage_dev';
import BabyWenOnboarding from './components/BabyWenOnboarding';
import ChatBot from './components/ChatBot';
import Featured from './components/Featured';
import { useEffectOnce } from './hooks/useEffectOnce';
import useMediaQuery from './hooks/useMediaQuery';
import { userService } from './services/UserService';
import { daosService } from './services/DaosService';
import { useAuth } from './context/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';

// DAO Access Check Component
const DaoAccessCheck = ({ children }: { children: React.ReactNode }) => {
  const { daoId } = useParams();
  const navigate = useNavigate();
  const { userInfo, isAuthenticated } = useAuth();
  const { publicKey, connected } = useWallet();
  const [loading, setLoading] = React.useState(true);
  const [isMember, setIsMember] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [checkTimestamp, setCheckTimestamp] = React.useState(Date.now());

  // Function to force a re-check of membership
  const recheckMembership = () => {
    setCheckTimestamp(Date.now());
  };

  // Check if the user is a member of this DAO
  React.useEffect(() => {
    async function checkMembership() {
      if (!daoId) {
        setLoading(false);
        return;
      }

      if (!publicKey || !connected || !isAuthenticated) {
        setError("Please connect your wallet to access this DAO");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get current user ID
        const currentUser = await userService.getCurrentUser();
        if (!currentUser || !currentUser.userId) {
          setError("Could not verify your identity");
          setLoading(false);
          return;
        }
        
        // Get DAO members
        const members = await daosService.getDaoMembers(daoId);
        
        // Check if user is a member
        const userIsMember = members.some((member: any) => member.userId === currentUser.userId);
        
        setIsMember(userIsMember);
        setLoading(false);
      } catch (err) {
        console.error("Error checking DAO membership:", err);
        setError("Failed to verify membership");
        setLoading(false);
      }
    }

    checkMembership();
  }, [daoId, publicKey, connected, isAuthenticated, checkTimestamp]);

  const handleGoHome = () => {
    navigate('/');
  };

  // Pass the recheckMembership function to children
  const childrenWithProps = React.Children.map(children, (child: React.ReactNode) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, { 
        recheckMembership 
      });
    }
    return child;
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
        <div className="w-12 h-12 rounded-full border-t-2 border-l-2 border-indigo-600 animate-spin mb-4"></div>
        <p className="text-white text-lg">Verifying membership...</p>
      </div>
    );
  }

  if (!isMember && daoId) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 p-4">
        <div className="bg-[#1A1A1A] rounded-xl p-6 max-w-md w-full shadow-2xl border border-red-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-6">
            {error || "You're not a member of this DAO. You need to join this DAO to access its dashboard."}
          </p>
          <div className="flex justify-center">
            <button
              onClick={handleGoHome}
              className="px-6 py-2 border border-white text-white rounded-md hover:bg-white/10 transition-all"
            >
              Go back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{childrenWithProps}</>;
};

// Dashboard component that handles DAO-specific routing
const Dashboard = () => {
  const { daoId } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = React.useState('dashboard_home');
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [fadeIn, setFadeIn] = React.useState(true);
  const [currentComponent, setCurrentComponent] = React.useState<React.ReactNode>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Set default sidebar state based on screen size
  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Handle section changes
  const handleSectionChange = (section: string) => {
    // We no longer need special handling for the profile section as it's now a modal
    setActiveSection(section);
  };

  // Handle sidebar toggle - only works on mobile
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen((prev: boolean) => !prev);
    } else {
      // Always keep sidebar open on desktop
      setSidebarOpen(true);
    }
  };

  // Effect to initialize the correct component based on the active section
  React.useEffect(() => {
    setFadeIn(false); // Start fade out
    
    const timer = setTimeout(() => {
      // Update the component after fade out
      switch (activeSection) {
        case 'governance':
          setCurrentComponent(<Governance />);
          break;
        case 'pods':
          setCurrentComponent(<Pods />);
          break;
        case 'members':
          setCurrentComponent(<Members />);
          break;
        case 'user_management':
          setCurrentComponent(<UserManagement />);
          break;
        case 'treasury':
          setCurrentComponent(<Treasury />);
          break;
        case 'modules':
          setCurrentComponent(<Modules />);
          break;
        case 'roles':
          setCurrentComponent(<Roles />);
          break;
        case 'featured':
          setCurrentComponent(<Featured />);
          break;
        case 'dashboard_home':
          setCurrentComponent(<Home />);
          break;
        default:
          setCurrentComponent(null);
      }
      
      setFadeIn(true); // Start fade in
    }, 300); // Duration of fade out
    
    return () => clearTimeout(timer);
  }, [activeSection]);

  // Log the current DAO ID whenever it changes
  useEffectOnce(() => {
    console.log('Current DAO ID:', daoId);
    // Here you could fetch specific DAO data based on the ID
  }, [daoId]);

  // Handle close sidebar - only works on mobile
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* App Background with split design */}
      <div className="fixed inset-0 z-0">
        {/* Banner - 20% viewport height */}
        <div className="h-[20vh] w-full bg-[url('https://applescoop.org/image/wallpapers/mac/pink-blue-purple-abstract-gradient-08-10-2024-1728440099-hd-wallpaper.jpg')] bg-cover bg-center bg-no-repeat"></div>
        {/* Main background - dark grey for remaining 80% */}
        <div className="h-[80vh] w-full bg-background"></div>
      </div>
      
      {/* Left Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={handleSectionChange} 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden z-10 relative w-full">
        <Header 
          activeSection={activeSection} 
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          setActiveSection={handleSectionChange}
          daoId={daoId}
        />
        
        {/* Main content area */}
        <div className="flex-1 overflow-y-auto">
          <div 
            className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'} my-10`}
          >
            {currentComponent}
          </div>
        </div>
      </div>

      {/* Chatbot floating button */}
      <ChatBot />
    </div>
  );
};

// The main App component with routing
function App() {
  const navigate = useNavigate();

  // Function to handle navigation to a specific DAO
  const handleEnterDashboard = (daoId?: string) => {
    if (daoId) {
      navigate(`/daos/${daoId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Routes>
      <Route path="/landingdemo" element={<LandingPageDev />} />
      <Route path="/" element={<LandingPage onEnterDashboard={handleEnterDashboard} />} />
      <Route path="/create/babywen" element={<BabyWenOnboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/daos/:daoId" element={<DaoAccessCheck><Dashboard /></DaoAccessCheck>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Wrapper component for routing
const AppWithRouter = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

export default AppWithRouter;


