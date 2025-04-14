import * as React from 'react';
import { ButtonVariant } from '../../BabyWenOnboarding';

interface ButtonActionProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
}

/**
 * Button component that can trigger an action
 */
const ButtonAction: React.FC<ButtonActionProps> = ({ label, onClick, variant = 'primary' }) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-purple-600 to-blue-600';
      case 'secondary':
        return 'bg-[#222] hover:bg-[#333]';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-red-700';
      default:
        return 'bg-gradient-to-r from-purple-600 to-blue-600';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 ${getButtonStyle()} text-white text-sm rounded-md transition-colors`}
    >
      {label}
    </button>
  );
};

export default ButtonAction; 