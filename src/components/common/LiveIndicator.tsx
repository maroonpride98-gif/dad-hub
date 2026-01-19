import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LiveIndicatorProps {
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: React.CSSProperties;
}

export const LiveIndicator: React.FC<LiveIndicatorProps> = ({
  showText = true,
  size = 'medium',
  style,
}) => {
  const { theme } = useTheme();

  const sizes = {
    small: { dot: 6, text: 10, gap: 4 },
    medium: { dot: 8, text: 12, gap: 6 },
    large: { dot: 10, text: 14, gap: 8 },
  };

  const s = sizes[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: s.gap,
        ...style,
      }}
    >
      <div
        style={{
          width: s.dot,
          height: s.dot,
          borderRadius: '50%',
          background: theme.colors.error,
          boxShadow: `0 0 8px ${theme.colors.error}`,
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      {showText && (
        <span
          style={{
            fontSize: s.text,
            fontWeight: 600,
            color: theme.colors.error,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Live
        </span>
      )}
    </div>
  );
};
