import React, { ReactNode } from 'react';
import { ui } from '../../styles/theme';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const baseStyle = ui.badge[variant];
  
  return (
    <span className={`inline-flex items-center ${baseStyle} ${className}`}>
      {children}
    </span>
  );
};

export default Badge; 