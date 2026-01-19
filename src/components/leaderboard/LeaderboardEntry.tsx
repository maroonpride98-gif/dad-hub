import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LeaderboardEntryFull } from '../../types/gamification';

interface LeaderboardEntryProps {
  entry: LeaderboardEntryFull;
  onClick?: () => void;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  entry,
  onClick,
}) => {
  const { theme } = useTheme();

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return { emoji: '🥇', color: '#ffd700' };
      case 2:
        return { emoji: '🥈', color: '#c0c0c0' };
      case 3:
        return { emoji: '🥉', color: '#cd7f32' };
      default:
        return { emoji: null, color: theme.colors.text.muted };
    }
  };

  const rankDisplay = getRankDisplay(entry.rank);

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: entry.isYou
          ? `rgba(217, 119, 6, 0.15)`
          : theme.colors.card,
        borderRadius: '12px',
        border: `1px solid ${
          entry.isYou ? theme.colors.accent.primary : theme.colors.border
        }`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'translateX(4px)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = 'translateX(0)';
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: '40px',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: rankDisplay.emoji ? '24px' : '16px',
          color: rankDisplay.color,
        }}
      >
        {rankDisplay.emoji || `#${entry.rank}`}
      </div>

      {/* Avatar */}
      <div
        style={{
          fontSize: '32px',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background.secondary,
          borderRadius: '50%',
        }}
      >
        {entry.avatar}
      </div>

      {/* Name & Level */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: entry.isYou
                ? theme.colors.accent.primary
                : theme.colors.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {entry.name}
            {entry.isYou && (
              <span
                style={{
                  marginLeft: '6px',
                  fontSize: '11px',
                  padding: '2px 6px',
                  background: theme.colors.accent.primary,
                  color: '#fff',
                  borderRadius: '8px',
                }}
              >
                You
              </span>
            )}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '2px',
          }}
        >
          <span style={{ fontSize: '14px' }}>{entry.levelIcon}</span>
          <span
            style={{
              fontSize: '12px',
              color: theme.colors.text.muted,
            }}
          >
            Level {entry.level}
          </span>
        </div>
      </div>

      {/* XP */}
      <div style={{ textAlign: 'right' }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: theme.colors.accent.primary,
          }}
        >
          {entry.xp.toLocaleString()}
        </div>
        <div
          style={{
            fontSize: '11px',
            color: theme.colors.text.muted,
          }}
        >
          XP
        </div>
      </div>
    </div>
  );
};
