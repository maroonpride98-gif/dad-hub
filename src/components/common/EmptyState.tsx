import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from './Button';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'compact';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji,
  title,
  description,
  action,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const isCompact = variant === 'compact';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isCompact ? '24px 16px' : '48px 24px',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        style={{
          fontSize: isCompact ? '48px' : '64px',
          marginBottom: isCompact ? '12px' : '20px',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        {emoji}
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: isCompact ? '16px' : '20px',
          fontWeight: 700,
          color: theme.colors.text.primary,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: `${isCompact ? '8px' : '12px'} 0 0 0`,
          fontSize: isCompact ? '13px' : '14px',
          color: theme.colors.text.secondary,
          maxWidth: '280px',
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {action && (
        <Button
          onClick={action.onClick}
          style={{ marginTop: isCompact ? '16px' : '24px' }}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};
