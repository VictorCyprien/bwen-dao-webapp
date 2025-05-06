import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  Layers, 
  Wallet, 
  Users, 
  Trophy, 
  MessageSquareQuote, 
  FileText,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Puzzle,
  ShieldCheck
} from 'lucide-react';
import { ui } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { DAO } from '../core/modules/dao-api';
import { daosService } from '../services/DaosService';
import { useEffectOnce } from '../hooks/useEffectOnce';
import useMediaQuery from '../hooks/useMediaQuery';
import { ModuleTypes } from '../types/modules';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection,
  setActiveSection,
  isOpen = true,
  onClose,
  onToggle,
  isMobile = false
}: SidebarProps) => {
  const { userInfo } = useAuth();
  const { daoId } = useParams<{ daoId: string }>();
  const navigate = useNavigate();
  const [dao, setDao] = React.useState<DAO | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [profileImgError, setProfileImgError] = React.useState<boolean>(false);
  const [refreshTimestamp, setRefreshTimestamp] = React.useState<number>(Date.now());
  const [retryCount, setRetryCount] = React.useState<number>(0);
  const maxRetries = 3;
  const [activeModules, setActiveModules] = React.useState<string[]>([]);
  
  // Track which sections are expanded, initialize from localStorage if available
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>(() => {
    const savedState = localStorage.getItem('sidebarExpandedSections');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved sidebar state:', e);
      }
    }
    // Default state if nothing in localStorage
    return {
      'Pods': true,
      'Proof of Love': true,
      'Docs': true
    };
  });
  
  // Toggle section expanded/collapsed state and save to localStorage
  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev: Record<string, boolean>) => {
      const newState = {
        ...prev,
        [sectionName]: !prev[sectionName]
      };
      // Save to localStorage
      localStorage.setItem('sidebarExpandedSections', JSON.stringify(newState));
      return newState;
    });
  };
  
  // Fetch active modules for the current DAO
  const fetchActiveModules = async () => {
    if (!daoId) {
      setActiveModules([]);
      return;
    }
    
    try {
      const modulesList = await daosService.getDAOModules(daoId);
      if (modulesList && modulesList.modules) {
        setActiveModules(modulesList.modules);
      } else {
        setActiveModules([]);
      }
    } catch (err) {
      console.error("Error fetching DAO modules:", err);
      setActiveModules([]);
    }
  };
  
  // Fetch the DAO data when the daoId changes
  const fetchDaoData = async () => {
    if (!daoId) {
      setDao(null);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      setProfileImgError(false); // Reset image error state when refreshing
      setRefreshTimestamp(Date.now()); // Update timestamp for cache busting
      setRetryCount(0); // Reset retry count when fetching new data
      
      // Add 1 second delay to allow server to process updates
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const daoData = await daosService.getDaoById(daoId);
      setDao(daoData);
      
      // Fetch active modules after getting DAO data
      await fetchActiveModules();
    } catch (err) {
      console.error("Error fetching DAO data:", err);
      setError("Failed to load DAO information");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Call fetchDaoData when the component mounts or daoId changes
  useEffectOnce(() => {
    fetchDaoData();
  }, [daoId]);
  
  // Listen for dao-updated events
  React.useEffect(() => {
    const handleDaoUpdated = (event: CustomEvent<{ daoId: string }>) => {
      if (event.detail.daoId === daoId) {
        fetchDaoData();
      }
    };
    
    // Add event listener
    window.addEventListener('dao-updated', handleDaoUpdated as EventListener);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('dao-updated', handleDaoUpdated as EventListener);
    };
  }, [daoId]);

  // Listen for module-updated events
  React.useEffect(() => {
    const handleModuleUpdated = () => {
      fetchActiveModules();
    };
    
    // Add event listener
    window.addEventListener('module-updated', handleModuleUpdated as EventListener);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('module-updated', handleModuleUpdated as EventListener);
    };
  }, [daoId]);

  // Handle return to landing page
  const handleReturnToLanding = () => {
    navigate('/');
  };
  
  // Handle image loading error with retries
  const handleImageError = () => {
    if (retryCount < maxRetries) {
      // Try again after a short delay (increasing with each retry)
      const delay = 1000 * (retryCount + 1); // 1s, 2s, 3s...
      
      console.log(`Image load failed, retrying in ${delay}ms (attempt ${retryCount + 1} of ${maxRetries})`);
      
      setTimeout(() => {
        setRefreshTimestamp(Date.now()); // Update timestamp to force a fresh load
        setRetryCount((prevCount: number) => prevCount + 1);
      }, delay);
    } else {
      // After all retries, set the error flag
      console.log('Image load failed after all retries, showing placeholder');
      setProfileImgError(true);
    }
  };

  // Close sidebar on mobile when clicking a navigation item
  const handleNavigationClick = (section: string) => {
    setActiveSection(section);
    if (isMobile && onClose) {
      onClose();
    }
  };

  // Check if a module is active
  const isModuleActive = (moduleName: string): boolean => {
    return activeModules.includes(moduleName);
  };

  const navItems: {
    section: string;
    items: { id: string; label: string; icon: React.ReactNode }[];
    isUncollapsable?: boolean;
    moduleRequired?: string;
  }[] = [
    {
      section: 'main',
      items: [
        { id: 'dashboard_home', label: 'Home', icon: <Home size={18} /> },
        { id: 'governance', label: 'Governance', icon: <Building2 size={18} /> },
        { id: 'treasury', label: 'Treasury', icon: <Wallet size={18} /> },
        { id: 'members', label: 'Members', icon: <Users size={18} /> },
        { id: 'roles', label: 'Roles', icon: <ShieldCheck size={18} /> },
        { id: 'modules', label: 'Modules', icon: <Puzzle size={18} /> }
      ],
      isUncollapsable: true
    },
    {
      section: 'Pods',
      items: [
        { id: 'pods', label: 'Pods', icon: <Layers size={18} /> }
      ],
      moduleRequired: ModuleTypes.PODS
    },
    {
      section: 'Proof of Love',
      items: [
        { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
        { id: 'questboard', label: 'Questboard', icon: <MessageSquareQuote size={18} /> }
      ],
      moduleRequired: ModuleTypes.PROOF_OF_LOVE
    },
    {
      section: 'Docs',
      items: [
        { id: 'manifest', label: 'Manifest', icon: <FileText size={18} /> }
      ]
    }
  ];

  // Display a loading spinner in the DAO name area
  const renderDaoName = () => {
    if (isLoading) {
      return <span className="inline-block w-6 h-6 border-2 border-surface-300 border-t-primary rounded-full animate-spin"></span>;
    }
    
    if (error) {
      return <span className="text-red-400">Error loading DAO</span>;
    }
    
    return dao?.name || 'Select a DAO';
  };

  // Common button styling for both toggle buttons
  const toggleButtonClass = "bg-[#151515] border border-surface-300 rounded-full p-1 shadow-lg transition-all hover:bg-surface-200 focus:outline-none focus:ring-2 focus:ring-primary z-50";

  // Calculate sidebar position based on isOpen and isMobile
  const sidebarClasses = `w-64 text-text flex flex-col ${ui.sidebar} font-normal ${
    isMobile ? 'fixed top-0 bottom-0 left-0 z-40 h-full transition-transform duration-300 ease-in-out transform' : ''
  } ${
    isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
  }`;

  return (
    <>
      {/* Sidebar */}
      <div className={sidebarClasses}>
        {/* Back to landing page button */}
        <div className="p-4 text-center">
          <button 
            onClick={handleReturnToLanding}
            className="flex items-center text-surface-500 hover:text-text transition-colors mx-auto"
            title="Return to landing page"
          >
            <ArrowLeft size={16} className="mr-2" />
            <span className="text-sm">Back to Homepage</span>
          </button>
        </div>
        
        {/* DAO Profile */}
        <div className="p-4 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-primary mb-2 overflow-hidden">
            {/* Logo normal - afficher le logo standard */}
            <img 
              src={!profileImgError && dao?.profilePicture 
                ? `${dao.profilePicture}` 
                : "https://i.imgur.com/PeLdfS1.png"}
              alt="DAO Logo" 
              className="w-full h-full object-cover" 
              onError={handleImageError}
              key={`profile-image-${refreshTimestamp}-${retryCount}`} // Force react to recreate the element
            />
          </div>
          <div className="text-center">
            <p className="text-sm text-text font-normal">
              {renderDaoName()}
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          {navItems.map((section) => {
            // Skip sections that require a module that isn't active
            if (section.moduleRequired && !isModuleActive(section.moduleRequired)) {
              return null;
            }
            
            return (
              <React.Fragment key={section.section}>
                {!section.isUncollapsable && (
                  <div 
                    className="px-3 py-2 text-xs text-surface-500 font-normal flex items-center justify-between cursor-pointer group"
                    onClick={() => toggleSection(section.section)}
                  >
                    <span>{section.section}</span>
                    <span className="transform transition-transform duration-200 mr-1">
                      {expandedSections[section.section] ? 
                        <ChevronDown size={14} className="text-surface-500 group-hover:text-surface-400"/> : 
                        <ChevronRight size={14} className="text-surface-500 group-hover:text-surface-400"/>
                      }
                    </span>
                  </div>
                )}
                <nav className={`transition-all duration-300 overflow-hidden ${
                  section.isUncollapsable || expandedSections[section.section] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {section.items.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => handleNavigationClick(item.id)}
                      className={`flex items-center px-5 py-3 my-1 mx-[5%] w-[90%] text-left rounded-[12px] font-normal ${activeSection === item.id ? 'bg-surface-300' : 'hover:bg-surface-200'}`}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="font-normal">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </React.Fragment>
            );
          })}
        </div>
        
        {/* DAO Logo */}
        <div className="p-4">
          <div className="w-32 mx-auto">
            <img 
              src="https://i.imgur.com/OZCrF4z.png" 
              alt="DAO Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Toggle button when sidebar is open - only shown on mobile */}
        {isMobile && isOpen && onToggle && (
          <button 
            onClick={onToggle}
            className={`absolute -right-4 top-1/2 transform -translate-y-1/2 ${toggleButtonClass}`}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Separate toggle button when sidebar is closed - only shown on mobile */}
      {isMobile && !isOpen && onToggle && (
        <button 
          onClick={onToggle}
          className={`fixed left-4 top-1/2 transform -translate-y-1/2 ${toggleButtonClass}`}
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>
      )}
    </>
  );
};

export default Sidebar;