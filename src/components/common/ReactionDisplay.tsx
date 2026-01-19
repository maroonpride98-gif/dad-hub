import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { PostReaction, DAD_REACTIONS, getReactionSummary } from '../../types/reaction';

interface ReactionDisplayProps {
  reactions: PostReaction[];
  currentUserId?: string;
  onReactionClick?: (emoji: string) => void;
  maxDisplay?: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  interactive?: boolean;
}

export const ReactionDisplay: React.FC<ReactionDisplayProps> = ({
  reactions,
  currentUserId,
  onReactionClick,
  maxDisplay = 3,
  size = 'medium',
  showCount = true,
  interactive = true,
}) => {
  const { theme } = useTheme();
  const summary = getReactionSummary(reactions, currentUserId);

  if (summary.totalCount === 0) return null;

  const sizeStyles = {
    small: { fontSize: '14px', padding: '2px 6px', gap: '2px' },
    medium: { fontSize: '16px', padding: '4px 8px', gap: '4px' },
    large: { fontSize: '20px', padding: '6px 10px', gap: '6px' },
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: sizeStyles[size].gap,
        flexWrap: 'wrap',
      }}
    >
      {summary.topReactions.slice(0, maxDisplay).map(({ emoji, count }) => {
        const isUserReaction = summary.userReaction === emoji;

        return (
          <button
            key={emoji}
            onClick={() => interactive && onReactionClick?.(emoji)}
            disabled={!interactive}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: sizeStyles[size].padding,
              background: isUserReaction
                ? `rgba(217, 119, 6, 0.2)`
                : `rgba(255, 255, 255, ${theme.mode === 'dark' ? 0.05 : 0.5})`,
              border: isUserReaction
                ? `1px solid ${theme.colors.accent.primary}`
                : `1px solid ${theme.colors.border}`,
              borderRadius: '20px',
              cursor: interactive ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              fontSize: sizeStyles[size].fontSize,
            }}
          >
            <span>{emoji}</span>
            {showCount && (
              <span
                style={{
                  fontSize: size === 'small' ? '11px' : '12px',
                  fontWeight: 600,
                  color: isUserReaction
                    ? theme.colors.accent.primary
                    : theme.colors.text.secondary,
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}

      {summary.totalCount > 0 && showCount && summary.topReactions.length === 0 && (
        <span
          style={{
            fontSize: '12px',
            color: theme.colors.text.muted,
          }}
        >
          {summary.totalCount} reactions
        </span>
      )}
    </div>
  );
};

interface ReactionBarProps {
  reactions: PostReaction[];
  currentUserId?: string;
  onReactionToggle: (emoji: string) => void;
  disabled?: boolean;
}

export const ReactionBar: React.FC<ReactionBarProps> = ({
  reactions,
  currentUserId,
  onReactionToggle,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const summary = getReactionSummary(reactions, currentUserId);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {/* Quick reaction button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          background: 'transparent',
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '20px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all 0.2s ease',
          color: theme.colors.text.secondary,
          fontSize: '14px',
        }}
      >
        <span>{summary.userReaction || '👍'}</span>
        <span>{isExpanded ? '▲' : '▼'}</span>
      </button>

      {/* Expanded reaction picker */}
      {isExpanded && (
        <div
          style={{
            display: 'flex',
            gap: '4px',
            padding: '4px 8px',
            background: theme.colors.card,
            borderRadius: '20px',
            border: `1px solid ${theme.colors.border}`,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {DAD_REACTIONS.map((reaction) => {
            const reactionData = reactions.find(r => r.emoji === reaction.emoji);
            const count = reactionData?.userIds.length || 0;
            const isActive = currentUserId && reactionData?.userIds.includes(currentUserId);

            return (
              <button
                key={reaction.emoji}
                onClick={() => {
                  onReactionToggle(reaction.emoji);
                  setIsExpanded(false);
                }}
                disabled={disabled}
                title={reaction.label}
                style={{
                  fontSize: '18px',
                  padding: '4px 8px',
                  background: isActive ? `rgba(217, 119, 6, 0.2)` : 'transparent',
                  border: isActive ? `1px solid ${theme.colors.accent.primary}` : '1px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {reaction.emoji}
                {count > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      fontSize: '10px',
                      fontWeight: 700,
                      background: theme.colors.accent.primary,
                      color: '#fff',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Display existing reactions */}
      {!isExpanded && summary.totalCount > 0 && (
        <ReactionDisplay
          reactions={reactions}
          currentUserId={currentUserId}
          onReactionClick={onReactionToggle}
          size="small"
        />
      )}
    </div>
  );
};
