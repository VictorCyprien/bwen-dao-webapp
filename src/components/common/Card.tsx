import React, { ReactNode } from 'react';
import { containers } from '../../styles/theme';

interface CardProps {
  children: ReactNode;
  title?: string | ReactNode;
  footer?: ReactNode;
  highlight?: boolean;
  className?: string;
  rightElement?: ReactNode;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  highlight = false,
  className = '',
  rightElement,
  onClick,
}) => {
  return (
    <div 
      className={`${highlight ? containers.cardHighlight : containers.card} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {(title || rightElement) && (
        <div className={containers.cardHeader}>
          {typeof title === 'string' ? (
            <h3 className={containers.cardTitle}>{title}</h3>
          ) : (
            title
          )}
          {rightElement && <div>{rightElement}</div>}
        </div>
      )}
      
      <div className="text-sm text-gray-300">
        {children}
      </div>
      
      {footer && (
        <div className={containers.cardFooter}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 