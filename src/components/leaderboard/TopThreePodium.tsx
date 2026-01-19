import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LeaderboardEntryFull } from '../../types/gamification';

interface TopThreePodiumProps {
  entries: LeaderboardEntryFull[];
}

export const TopThreePodium: React.FC<TopThreePodiumProps> = ({ entries }) => {
  const { theme } = useTheme();

  const podiumConfig = [
    { position: 2, height: '80px', medal: '🥈', color: '#c0c0c0' },
    { position: 1, height: '100px', medal: '🥇', color: '#ffd700' },
    { position: 3, height: '60px', medal: '🥉', color: '#cd7f32' },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '8px',
        padding: '20px 0',
      }}
    >
      {podiumConfig.map(({ position, height, medal, color }) => {
        const entry = entries.find(e => e.rank === position);
        if (!entry) return null;

        return (
          <div
            key={position}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: position === 1 ? '120px' : '100px',
            }}
          >
            {/* Medal */}
            <div
              style={{
                fontSize: position === 1 ? '40px' : '32px',
                marginBottom: '8px',
                animation: position === 1 ? 'bounce 1s ease infinite' : 'none',
              }}
            >
              {medal}
            </div>

            {/* Avatar */}
            <div
              style={{
                fontSize: position === 1 ? '48px' : '40px',
                width: position === 1 ? '72px' : '60px',
                height: position === 1 ? '72px' : '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.colors.card,
                borderRadius: '50%',
                border: `3px solid ${color}`,
                boxShadow: `0 0 20px ${color}40`,
                marginBottom: '-16px',
                zIndex: 1,
              }}
            >
              {entry.avatar}
            </div>

            {/* Podium */}
            <div
              style={{
                width: '100%',
                height,
                background: `linear-gradient(180deg, ${color}40 0%, ${color}20 100%)`,
                borderRadius: '12px 12px 0 0',
                border: `2px solid ${color}60`,
                borderBottom: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '20px',
              }}
            >
              {/* Name */}
              <div
                style={{
                  fontSize: position === 1 ? '14px' : '12px',
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '90%',
                }}
              >
                {entry.name}
                {entry.isYou && (
                  <span
                    style={{
                      display: 'block',
                      fontSize: '10px',
                      color: theme.colors.accent.primary,
                    }}
                  >
                    (You)
                  </span>
                )}
              </div>

              {/* XP */}
              <div
                style={{
                  fontSize: position === 1 ? '16px' : '14px',
                  fontWeight: 700,
                  color,
                  marginTop: '4px',
                }}
              >
                {entry.xp.toLocaleString()}
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: theme.colors.text.muted,
                }}
              >
                XP
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
