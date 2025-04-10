import * as React from 'react';

export interface ButtonActionProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Button component that can trigger an action
 */
const ButtonAction: React.FC<ButtonActionProps> = ({ 
  label, 
  onClick, 
  variant = 'primary' 
}: ButtonActionProps) => {
  const variantClasses = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90',
    secondary: 'bg-[#333] hover:bg-[#444] border border-gray-700',
    danger: 'bg-gradient-to-r from-red-600 to-pink-600 hover:opacity-90'
  };

  return (
    <div className="px-4 py-4 bg-[#151515] border border-gray-700 rounded-xl mx-4 mb-4 flex justify-center shadow-lg">
      <button
        onClick={onClick}
        className={`${variantClasses[variant]} px-6 py-3 text-white rounded-lg transition-all text-base font-medium`}
      >
        {label}
      </button>
    </div>
  );
};

export default ButtonAction; 