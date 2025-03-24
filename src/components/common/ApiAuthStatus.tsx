import React, { useState, useRef, useEffect } from 'react';
import { Wifi, WifiOff, Loader2, PenLine, AlertCircle, UserCircle, ChevronDown } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { UserDisplayInfo } from '../../hooks/useApiAndWallet';
import { useNavigate } from 'react-router-dom';
import { ui } from '../../styles/theme';

interface ApiAuthStatusProps {
  apiStatus: 'online' | 'offline' | 'checking';
  userDisplayInfo: UserDisplayInfo;
}

const ApiAuthStatus: React.FC<ApiAuthStatusProps> = ({
  apiStatus, 
  userDisplayInfo,
}) => {
  const { 
    isAuthenticated, 
    isLoading, 
    challengeMessage, 
    authError,
    displayUsername,
  } = userDisplayInfo;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle navigation to profile page
  const handleProfileClick = () => {
    navigate('/profile');
    setMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // If no user is authenticated, show the wallet connect button directly
  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        {/* API Status Indicator - simplified when logged out */}
        <div className={ui.button.menu}>
          {apiStatus === 'checking' ? (
            <span className="flex items-center text-xs text-yellow-300">
              <div className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
              API
            </span>
          ) : apiStatus === 'online' ? (
            <span className="flex items-center text-xs text-green-300">
              <Wifi size={14} className="mr-2" />
              Online
            </span>
          ) : (
            <span className="flex items-center text-xs text-red-300">
              <WifiOff size={14} className="mr-2" />
              Offline
            </span>
          )}
        </div>
        
        {/* Wallet Connect Button */}
        <WalletMultiButton className="wallet-adapter-button-custom" />
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Collapsed menu button */}
      <button 
        className={ui.button.menu}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <UserCircle size={18} className="text-purple-400" />
        <span className="text-sm">Logged as <span className="font-bold">{displayUsername}</span></span>
        <ChevronDown size={16} className={`transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#111]/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-800/60 py-2 z-50">
          {/* User profile section */}
          <button 
            onClick={handleProfileClick}
            className="w-full flex items-center justify-between gap-2 px-4 py-2.5 hover:bg-[#222]/60 transition-colors"
          >
            <div className="flex items-center gap-2">
              <UserCircle size={20} className="text-purple-400" />
              <span className="text-white">My Profile</span>
            </div>
            {isLoading && !challengeMessage && (
              <span className={ui.badge.warning}>
                <Loader2 size={12} className="animate-spin mr-1" />
                Auth...
              </span>
            )}
            {challengeMessage && (
              <span className={ui.badge.primary}>
                <PenLine size={12} className="mr-1" />
                Sign
              </span>
            )}
            {authError && (
              <span className={ui.badge.error}>
                <AlertCircle size={12} className="mr-1" />
                Error
              </span>
            )}
          </button>

          {/* API Status section */}
          <div className="px-4 py-2.5 border-t border-gray-800/60">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">API Status</span>
              {apiStatus === 'checking' ? (
                <span className="flex items-center text-xs text-yellow-300">
                  <div className="animate-pulse h-2 w-2 rounded-full bg-yellow-400 mr-2"></div>
                  Checking...
                </span>
              ) : apiStatus === 'online' ? (
                <span className="flex items-center text-xs text-green-300">
                  <Wifi size={14} className="mr-2" />
                  Online
                </span>
              ) : (
                <span className="flex items-center text-xs text-red-300">
                  <WifiOff size={14} className="mr-2" />
                  Offline
                </span>
              )}
            </div>
          </div>

          {/* Wallet section */}
          <div className="px-4 py-2.5 border-t border-gray-800/60">
            <div className="wallet-adapter-dropdown-list-item">
              <WalletMultiButton className="wallet-adapter-button-custom w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiAuthStatus; 