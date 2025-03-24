import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { ui } from '../../styles/theme';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'icon' | 'menu' | 'action' | 'vote';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className = '',
  isLoading = false,
  disabled,
  ...props
}) => {
  // Size modifiers
  const sizeClasses = {
    sm: 'text-xs py-1 px-3',
    md: '',  // Default size in the theme
    lg: 'text-base py-2.5 px-5',
  };
  
  // Base button style from theme
  const baseStyle = ui.button[variant];
  
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        ${baseStyle} 
        ${sizeClasses[size]} 
        ${(disabled || isLoading) ? 'opacity-60 cursor-not-allowed' : ''} 
        ${className}
        flex items-center justify-center
      `}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 