import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TypingIndicatorProps {
  userNames: string[];
  compact?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  userNames,
  compact = false,
}) => {
  const { theme } = useTheme();

  if (userNames.length === 0) return null;

  const getTypingText = (): string => {
    if (userNames.length === 1) {
      return `${userNames[0]} is typing`;
    }
    if (userNames.length === 2) {
      return `${userNames[0]} and ${userNames[1]} are typing`;
    }
    return `${userNames[0]} and ${userNames.length - 1} others are typing`;
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: compact ? '4px 0' : '8px 12px',
      }}
    >
      {/* Animated Dots */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: compact ? '5px' : '6px',
              height: compact ? '5px' : '6px',
              borderRadius: '50%',
              background: theme.colors.accent.primary,
              animation: `typing 1.4s infinite ease-in-out`,
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>

      {/* Text */}
      {!compact && (
        <span
          style={{
            fontSize: '12px',
            color: theme.colors.text.muted,
            fontStyle: 'italic',
          }}
        >
          {getTypingText()}
        </span>
      )}
    </div>
  );
};

// Bubble version for inside chat
export const TypingBubble: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '12px 16px',
        background: theme.colors.background.secondary,
        borderRadius: '16px 16px 16px 4px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: theme.colors.accent.primary,
            animation: `typing 1.4s infinite ease-in-out`,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </div>
  );
};
