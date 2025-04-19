import React from 'react';
import { ButtonVariant } from '../../BabyWenOnboarding';

interface ButtonActionProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

/**
 * Button component that can trigger an action
 */
const ButtonAction: React.FC<ButtonActionProps> = ({ 
  label, 
  onClick, 
  variant = 'primary',
  disabled = false 
}: ButtonActionProps) => {
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
      disabled={disabled}
      className={`px-4 py-2 ${getButtonStyle()} text-white text-sm rounded-md transition-colors ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
      }`}
    >
      {label}
    </button>
  );
};

export default ButtonAction; 