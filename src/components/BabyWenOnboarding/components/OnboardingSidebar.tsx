import * as React from 'react';
import { ui } from '../../../styles/theme';
import { Home, Building2, Layers, Wallet, Users } from 'lucide-react';

interface OnboardingSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  daoName: string;
  daoLogo: string | null;
  showDaoInfo: boolean;
}

/**
 * Simplified sidebar for the onboarding experience
 */
const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  activeSection,
  setActiveSection,
  daoName,
  daoLogo,
  showDaoInfo
}: OnboardingSidebarProps) => {
  // Navigation items for the sidebar
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
    }
  ];

  return (
    <div className={`w-64 text-text flex flex-col ${ui.sidebar} font-normal relative z-10`}>
      {/* DAO Profile */}
      <div className="p-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-primary mb-2 overflow-hidden">
          {showDaoInfo && daoLogo ? (
            <img 
              src={daoLogo}
              alt="DAO Logo" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-indigo-600/30 to-purple-600/30 flex items-center justify-center">
              <Users size={40} className="text-gray-400" />
            </div>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm text-text font-normal">
            {showDaoInfo && daoName ? daoName : <span className="text-gray-500">New DAO</span>}
          </p>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {navItems.map((section) => (
          <React.Fragment key={section.section}>
            <div className="px-3 py-2 text-xs text-surface-500 font-normal">{section.section}</div>
            <nav>
              {section.items
                .filter(item => item.id === 'dashboard')
                .map((item) => (
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

export default OnboardingSidebar; 