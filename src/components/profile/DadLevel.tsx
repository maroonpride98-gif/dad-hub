import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common';

interface DadLevelProps {
  points: number;
}

const LEVELS = [
  { name: 'Rookie Dad', minPoints: 0, icon: '🍼', color: '#78716c' },
  { name: 'Diaper Pro', minPoints: 100, icon: '👶', color: '#a8a29e' },
  { name: 'Bedtime Boss', minPoints: 250, icon: '🌙', color: '#84cc16' },
  { name: 'Grill Master', minPoints: 500, icon: '🔥', color: '#22c55e' },
  { name: 'Dad Joke Legend', minPoints: 1000, icon: '😂', color: '#3b82f6' },
  { name: 'Super Dad', minPoints: 2500, icon: '🦸‍♂️', color: '#8b5cf6' },
  { name: 'Dad of the Year', minPoints: 5000, icon: '🏆', color: '#f59e0b' },
  { name: 'Legendary Father', minPoints: 10000, icon: '👑', color: '#ef4444' },
];

export const DadLevel: React.FC<DadLevelProps> = ({ points }) => {
  const { theme } = useTheme();

  // Find current level
  const currentLevelIndex = LEVELS.findIndex((_, i) => {
    const nextLevel = LEVELS[i + 1];
    return !nextLevel || points < nextLevel.minPoints;
  });

  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];

  // Calculate progress to next level
  const progressToNext = nextLevel
    ? ((points - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  const pointsToNext = nextLevel ? nextLevel.minPoints - points : 0;

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            background: `linear-gradient(135deg, ${currentLevel.color}33, ${currentLevel.color}66)`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            border: `3px solid ${currentLevel.color}`,
          }}
        >
          {currentLevel.icon}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px 0', color: theme.colors.text.muted, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Dad Level {currentLevelIndex + 1}
          </p>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: currentLevel.color }}>
            {currentLevel.name}
          </h3>
        </div>
      </div>

      {/* Progress Bar */}
      {nextLevel && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
              Progress to {nextLevel.name}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 600 }}>
              {pointsToNext} pts to go
            </span>
          </div>
          <div
            style={{
              height: '12px',
              background: theme.colors.border,
              borderRadius: '6px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(progressToNext, 100)}%`,
                background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel.color})`,
                borderRadius: '6px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      )}

      {!nextLevel && (
        <p style={{ margin: 0, color: theme.colors.accent.secondary, fontWeight: 600, textAlign: 'center' }}>
          🎉 You've reached the highest level!
        </p>
      )}
    </Card>
  );
};
