import React from 'react';
import { Badge } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface BadgesGridProps {
  badges: Badge[];
}

export const BadgesGrid: React.FC<BadgesGridProps> = ({ badges }) => {
  const { theme } = useTheme();

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>🎖️ Your Badges</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {badges.map((badge) => (
          <div
            key={badge.id}
            style={{
              padding: '20px',
              background: theme.colors.card,
              borderRadius: '16px',
              textAlign: 'center',
              border: `1px solid rgba(251, 191, 36, 0.2)`,
            }}
          >
            <span style={{ fontSize: '32px' }}>{badge.icon}</span>
            <p
              style={{
                margin: '8px 0 0 0',
                fontWeight: 700,
                color: theme.colors.accent.secondary,
              }}
            >
              {badge.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
