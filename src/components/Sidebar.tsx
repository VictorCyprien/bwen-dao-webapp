import React, { useState } from 'react';
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
  ArrowLeft
} from 'lucide-react';
import { ui } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { DAO } from '../core/modules/dao-api';
import { daosService } from '../services/DaosService';
import { useEffectOnce } from '../hooks/useEffectOnce';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const { userInfo } = useAuth();
  const { daoId } = useParams<{ daoId: string }>();
  const navigate = useNavigate();
  const [dao, setDao] = useState<DAO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the DAO data when the daoId changes
  useEffectOnce(() => {
    const fetchDaoData = async () => {
      if (!daoId) {
        setDao(null);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        const daoData = await daosService.getDaoById(daoId);
        setDao(daoData);
      } catch (err) {
        console.error("Error fetching DAO data:", err);
        setError("Failed to load DAO information");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDaoData();
  }, [daoId]);

  // Handle return to landing page
  const handleReturnToLanding = () => {
    navigate('/');
  };
  
  const navItems = [
    {
      section: 'DAO',
      items: [
        { id: 'dashboard', label: 'Home', icon: <Home size={18} /> },
        { id: 'governance', label: 'Governance', icon: <Building2 size={18} /> },
        { id: 'pods', label: 'Pods', icon: <Layers size={18} /> },
        { id: 'treasury', label: 'Treasury', icon: <Wallet size={18} /> },
        { id: 'members', label: 'Members', icon: <Users size={18} /> }
      ]
    },
    {
      section: 'Proof of Love',
      items: [
        { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
        { id: 'questboard', label: 'Questboard', icon: <MessageSquareQuote size={18} /> }
      ]
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

  return (
    <div className={`w-64 text-text flex flex-col ${ui.sidebar} font-normal relative z-10`}>
      {/* Back to landing page button */}
      <div className="p-4 text-center">
        <button 
          onClick={handleReturnToLanding}
          className="flex items-center text-surface-500 hover:text-text transition-colors mx-auto"
          title="Return to landing page"
        >
          <ArrowLeft size={16} className="mr-2" />
          <span className="text-sm">Back to DAOs</span>
        </button>
      </div>
      
      {/* DAO Profile */}
      <div className="p-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary mb-2 overflow-hidden">
          <img src="https://i.imgur.com/PeLdfS1.png" alt="DAO Logo" className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <p className="text-sm text-text font-normal">
            {renderDaoName()}
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {navItems.map((section) => (
          <React.Fragment key={section.section}>
            <div className="px-3 py-2 text-xs text-surface-500 font-normal">{section.section}</div>
            <nav>
              {section.items.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center px-5 py-3 my-1 mx-[5%] w-[90%] text-left rounded-[12px] font-normal ${activeSection === item.id ? 'bg-surface-300' : 'hover:bg-surface-200'}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="font-normal">{item.label}</span>
                </button>
              ))}
            </nav>
          </React.Fragment>
        ))}
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
    </div>
  );
};

export default Sidebar;