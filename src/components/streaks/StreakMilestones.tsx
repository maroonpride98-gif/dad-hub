import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { Card } from '../common';

interface Milestone {
  days: number;
  icon: string;
  name: string;
  xpBonus: number;
}

const MILESTONES: Milestone[] = [
  { days: 3, icon: '🌱', name: 'Getting Started', xpBonus: 25 },
  { days: 7, icon: '⚡', name: 'Week Warrior', xpBonus: 50 },
  { days: 14, icon: '💪', name: 'Two Week Titan', xpBonus: 100 },
  { days: 30, icon: '🔥', name: 'Monthly Master', xpBonus: 200 },
  { days: 60, icon: '🏅', name: 'Streak Champion', xpBonus: 400 },
  { days: 100, icon: '💎', name: 'Streak Legend', xpBonus: 750 },
  { days: 365, icon: '👑', name: 'Year of Dedication', xpBonus: 2000 },
];

interface StreakMilestonesProps {
  showAll?: boolean;
}

export const StreakMilestones: React.FC<StreakMilestonesProps> = ({
  showAll = false,
}) => {
  const { theme } = useTheme();
  const { currentStreak, longestStreak } = useGamification();

  // Find next milestone
  const nextMilestone = MILESTONES.find(m => m.days > currentStreak);
  const achievedMilestones = MILESTONES.filter(m => m.days <= longestStreak);
  const upcomingMilestones = MILESTONES.filter(m => m.days > currentStreak);

  const milestonesToShow = showAll
    ? MILESTONES
    : upcomingMilestones.slice(0, 3);

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header */}
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Streak Milestones
          </h3>
          {nextMilestone && (
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: theme.colors.text.secondary,
              }}
            >
              {nextMilestone.days - currentStreak} days until {nextMilestone.name}
            </p>
          )}
        </div>

        {/* Milestones List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {milestonesToShow.map(milestone => {
            const isAchieved = longestStreak >= milestone.days;
            const progress = Math.min((currentStreak / milestone.days) * 100, 100);

            return (
              <div
                key={milestone.days}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: isAchieved
                    ? `rgba(217, 119, 6, 0.1)`
                    : theme.colors.background.secondary,
                  borderRadius: '12px',
                  border: `1px solid ${
                    isAchieved ? theme.colors.accent.primary : theme.colors.border
                  }`,
                  opacity: isAchieved ? 1 : 0.8,
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    fontSize: '28px',
                    filter: isAchieved ? 'none' : 'grayscale(100%)',
                    opacity: isAchieved ? 1 : 0.5,
                  }}
                >
                  {milestone.icon}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 600,
                        color: isAchieved
                          ? theme.colors.accent.primary
                          : theme.colors.text.primary,
                      }}
                    >
                      {milestone.name}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: theme.colors.text.muted,
                      }}
                    >
                      {milestone.days} days
                    </span>
                  </div>

                  {/* Progress bar (only for unachieved) */}
                  {!isAchieved && (
                    <div
                      style={{
                        height: '4px',
                        background: theme.colors.border,
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: theme.colors.accent.gradient,
                          borderRadius: '2px',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  )}

                  {/* XP Bonus */}
                  <div
                    style={{
                      marginTop: '4px',
                      fontSize: '11px',
                      color: isAchieved
                        ? theme.colors.success
                        : theme.colors.text.muted,
                    }}
                  >
                    {isAchieved ? '✅ Completed' : `+${milestone.xpBonus} XP`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Achieved Count */}
        {!showAll && achievedMilestones.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              fontSize: '13px',
              color: theme.colors.text.muted,
            }}
          >
            {achievedMilestones.length} of {MILESTONES.length} milestones achieved
          </div>
        )}
      </div>
    </Card>
  );
};
