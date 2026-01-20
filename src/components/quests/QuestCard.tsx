import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { UserQuestProgress, QUEST_CATEGORY_INFO } from '../../types/quests';
import { haptics } from '../../utils/haptics';

interface QuestCardProps {
  questProgress: UserQuestProgress;
  onClaim?: () => void;
}

export const QuestCard: React.FC<QuestCardProps> = ({ questProgress, onClaim }) => {
  const { theme } = useTheme();
  const { quest, progress, completed, claimedAt } = questProgress;
  const categoryInfo = QUEST_CATEGORY_INFO[quest.category];

  const progressPercent = Math.min((progress / quest.requirement.target) * 100, 100);
  const isClaimed = !!claimedAt;
  const canClaim = completed && !isClaimed;

  const handleClaim = () => {
    if (canClaim && onClaim) {
      haptics.success();
      onClaim();
    }
  };

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '16px',
        padding: '16px',
        marginBottom: '12px',
        border: `1px solid ${isClaimed ? theme.colors.accent.primary + '40' : theme.colors.border}`,
        opacity: isClaimed ? 0.7 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Completion glow effect */}
      {canClaim && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}10, ${theme.colors.accent.secondary}10)`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
          {/* Icon */}
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: `${categoryInfo.color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
            }}
          >
            {quest.icon}
          </div>

          {/* Title & Description */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h4
                style={{
                  margin: 0,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: theme.colors.text.primary,
                }}
              >
                {quest.title}
              </h4>
              {isClaimed && (
                <span style={{ fontSize: '14px' }}>✓</span>
              )}
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: theme.colors.text.secondary,
              }}
            >
              {quest.description}
            </p>
          </div>

          {/* XP Reward */}
          <div
            style={{
              padding: '6px 10px',
              background: `${theme.colors.accent.primary}20`,
              borderRadius: '20px',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: theme.colors.accent.primary,
              }}
            >
              +{quest.xpReward} XP
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: canClaim ? '12px' : '0' }}>
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
                fontSize: '12px',
                color: theme.colors.text.muted,
                textTransform: 'uppercase',
              }}
            >
              {categoryInfo.label}
            </span>
            <span
              style={{
                fontSize: '12px',
                color: completed ? theme.colors.accent.primary : theme.colors.text.secondary,
                fontWeight: 500,
              }}
            >
              {progress}/{quest.requirement.target}
            </span>
          </div>

          <div
            style={{
              height: '6px',
              background: theme.colors.background.secondary,
              borderRadius: '3px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: completed
                  ? `linear-gradient(90deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
                  : categoryInfo.color,
                borderRadius: '3px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Claim Button */}
        {canClaim && (
          <button
            onClick={handleClaim}
            style={{
              width: '100%',
              padding: '12px',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>🎉</span>
            <span>Claim Reward</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestCard;
