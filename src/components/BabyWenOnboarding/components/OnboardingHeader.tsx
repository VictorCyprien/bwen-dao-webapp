import * as React from 'react';
import { ui } from '../../../styles/theme';

interface OnboardingHeaderProps {
  activeSection: string;
}

/**
 * Simplified header for the onboarding experience
 */
const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({ 
  activeSection 
}: OnboardingHeaderProps) => {
  // Map section IDs to display names
  const getSectionDisplayName = () => {
    switch (activeSection) {
      case 'governance':
        return 'Governance';
      case 'pods':
        return 'Pods';
      case 'members':
        return 'Members';
      case 'profile':
        return 'My Profile';
      default:
        return 'Home';
    }
  };

  return (
    <header className={ui.header}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-surface-500 select-none ml-2">DAO</span>
          <span className="mx-2 text-surface-500">/</span>
          <span className="text-text select-none min-w-[100px]">{getSectionDisplayName()}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Placeholder for authenticated status */}
          <div className="text-sm text-gray-400 px-3 py-1 rounded-full border border-gray-800 bg-[#151515]">
            Demo Mode
          </div>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader; 