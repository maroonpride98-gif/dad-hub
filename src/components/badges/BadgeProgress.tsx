import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { BadgeDefinition } from '../../types/gamification';
import { RARITY_COLORS } from '../../data/badges';

interface BadgeProgressProps {
  badge: BadgeDefinition;
  currentValue: number;
  showDetails?: boolean;
}

export const BadgeProgress: React.FC<BadgeProgressProps> = ({
  badge,
  currentValue,
  showDetails = true,
}) => {
  const { theme } = useTheme();
  const rarityColors = RARITY_COLORS[badge.rarity];
  const progress = Math.min((currentValue / badge.requirement.threshold) * 100, 100);
  const isComplete = currentValue >= badge.requirement.threshold;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: theme.colors.card,
        borderRadius: '12px',
        border: `1px solid ${isComplete ? rarityColors.border : theme.colors.border}`,
      }}
    >
      {/* Badge Icon */}
      <div
        style={{
          fontSize: '32px',
          opacity: isComplete ? 1 : 0.5,
          filter: isComplete ? 'none' : 'grayscale(100%)',
        }}
      >
        {badge.icon}
      </div>

      {/* Progress Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: isComplete ? rarityColors.text : theme.colors.text.primary,
            }}
          >
            {badge.name}
          </span>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              color: theme.colors.text.muted,
            }}
          >
            {currentValue}/{badge.requirement.threshold}
          </span>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            height: '6px',
            background: theme.colors.border,
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: isComplete
                ? rarityColors.border
                : theme.colors.accent.gradient,
              borderRadius: '3px',
              transition: 'width 0.3s ease',
            }}
          />
        </div>

        {/* Description */}
        {showDetails && (
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '11px',
              color: theme.colors.text.muted,
            }}
          >
            {badge.description}
          </p>
        )}
      </div>

      {/* Completion Indicator */}
      {isComplete && (
        <div
          style={{
            fontSize: '20px',
          }}
        >
          ✅
        </div>
      )}
    </div>
  );
};

interface BadgeProgressListProps {
  badges: BadgeDefinition[];
  currentValues: Record<string, number>;
  showCompleted?: boolean;
  maxItems?: number;
}

export const BadgeProgressList: React.FC<BadgeProgressListProps> = ({
  badges,
  currentValues,
  showCompleted = false,
  maxItems = 5,
}) => {
  const { theme } = useTheme();

  const sortedBadges = badges
    .map(badge => ({
      badge,
      currentValue: currentValues[badge.requirement.type] || 0,
      progress: Math.min(
        ((currentValues[badge.requirement.type] || 0) / badge.requirement.threshold) * 100,
        100
      ),
      isComplete:
        (currentValues[badge.requirement.type] || 0) >= badge.requirement.threshold,
    }))
    .filter(item => showCompleted || !item.isComplete)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, maxItems);

  if (sortedBadges.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '24px',
          color: theme.colors.text.muted,
        }}
      >
        All badges unlocked! 🎉
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {sortedBadges.map(({ badge, currentValue }) => (
        <BadgeProgress
          key={badge.id}
          badge={badge}
          currentValue={currentValue}
          showDetails={false}
        />
      ))}
    </div>
  );
};
