import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { Card } from '../common';

interface StreakDisplayProps {
  compact?: boolean;
  showFreeze?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  compact = false,
  showFreeze = true,
}) => {
  const { theme } = useTheme();
  const { currentStreak, longestStreak, streakFreezes, totalActiveDays } = useGamification();

  // Get streak emoji based on length
  const getStreakEmoji = (streak: number): string => {
    if (streak >= 100) return '💎';
    if (streak >= 60) return '🏅';
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '💪';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '🌱';
    return '✨';
  };

  // Get streak message
  const getStreakMessage = (streak: number): string => {
    if (streak >= 100) return 'Legendary dedication!';
    if (streak >= 60) return 'Champion status!';
    if (streak >= 30) return "You're on fire!";
    if (streak >= 14) return 'Two weeks strong!';
    if (streak >= 7) return 'Week warrior!';
    if (streak >= 3) return 'Building momentum!';
    if (streak >= 1) return 'Keep it going!';
    return 'Start your streak today!';
  };

  if (compact) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: `rgba(217, 119, 6, ${currentStreak > 0 ? 0.15 : 0.05})`,
          borderRadius: '20px',
          border: `1px solid ${currentStreak > 0 ? theme.colors.accent.primary : theme.colors.border}`,
        }}
      >
        <span style={{ fontSize: '20px' }}>{getStreakEmoji(currentStreak)}</span>
        <span
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: currentStreak > 0
              ? theme.colors.accent.primary
              : theme.colors.text.muted,
          }}
        >
          {currentStreak}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: theme.colors.text.muted,
          }}
        >
          day streak
        </span>
      </div>
    );
  }

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Main Streak Display */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {/* Streak Icon */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `rgba(217, 119, 6, 0.15)`,
              border: `3px solid ${theme.colors.accent.primary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            {getStreakEmoji(currentStreak)}
          </div>

          {/* Streak Info */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: theme.colors.accent.primary,
                lineHeight: 1,
              }}
            >
              {currentStreak}
            </div>
            <div
              style={{
                fontSize: '14px',
                color: theme.colors.text.secondary,
                marginTop: '2px',
              }}
            >
              Day Streak
            </div>
            <div
              style={{
                fontSize: '12px',
                color: theme.colors.text.muted,
                marginTop: '4px',
              }}
            >
              {getStreakMessage(currentStreak)}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: showFreeze ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {/* Longest Streak */}
          <div
            style={{
              textAlign: 'center',
              padding: '12px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.accent.secondary,
              }}
            >
              {longestStreak}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: theme.colors.text.muted,
                marginTop: '2px',
              }}
            >
              Longest Streak
            </div>
          </div>

          {/* Total Days */}
          <div
            style={{
              textAlign: 'center',
              padding: '12px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.success,
              }}
            >
              {totalActiveDays}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: theme.colors.text.muted,
                marginTop: '2px',
              }}
            >
              Total Days
            </div>
          </div>

          {/* Streak Freezes */}
          {showFreeze && (
            <div
              style={{
                textAlign: 'center',
                padding: '12px',
                background: theme.colors.background.secondary,
                borderRadius: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#60a5fa',
                }}
              >
                ❄️ {streakFreezes}
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: theme.colors.text.muted,
                  marginTop: '2px',
                }}
              >
                Freezes Left
              </div>
            </div>
          )}
        </div>

        {/* Streak Bonus Info */}
        <div
          style={{
            padding: '12px',
            background: `rgba(217, 119, 6, 0.1)`,
            borderRadius: '12px',
            border: `1px solid rgba(217, 119, 6, 0.3)`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⭐</span>
              <span
                style={{
                  fontSize: '13px',
                  color: theme.colors.text.secondary,
                }}
              >
                Daily streak bonus
              </span>
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 700,
                color: theme.colors.accent.primary,
              }}
            >
              +{Math.min(currentStreak, 10) * 5} XP
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
