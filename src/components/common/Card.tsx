import React, { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'accent' | 'success';
  hover?: boolean;
  padding?: 'small' | 'medium' | 'large';
  onClick?: (e?: React.MouseEvent) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hover = false,
  padding = 'medium',
  onClick,
  style,
  className = '',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'accent':
        return {
          background: `linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(245, 158, 11, 0.1))`,
          border: `1px solid rgba(217, 119, 6, 0.2)`,
        };
      case 'success':
        return {
          background: `linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(22, 163, 74, 0.1))`,
          border: `1px solid rgba(34, 197, 94, 0.2)`,
        };
      default:
        return {
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
        };
    }
  };

  const getPaddingStyles = (): React.CSSProperties => {
    switch (padding) {
      case 'small':
        return { padding: '12px' };
      case 'medium':
        return { padding: '20px' };
      case 'large':
        return { padding: '28px' };
    }
  };

  return (
    <div
      className={`${hover ? 'card-hover' : ''} ${className}`}
      onClick={onClick}
      style={{
        borderRadius: '20px',
        transition: 'all 0.3s ease',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        ...getVariantStyles(),
        ...getPaddingStyles(),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
