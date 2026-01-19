import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../common';

export const WelcomeCard: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();

  return (
    <Card variant="accent" padding="large">
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '120px',
          opacity: 0.1,
        }}
      >
        🎯
      </div>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 700 }}>
        Welcome back, {user.name.split(' ')[0]}!
      </h2>
      <p style={{ margin: 0, color: theme.colors.text.secondary, fontSize: '15px' }}>
        Dad of {user.kids} since {user.dadSince} • Rank #5 this week
      </p>
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
        {user.badges.map((badge) => (
          <Badge key={badge.id}>{badge.name}</Badge>
        ))}
      </div>
    </Card>
  );
};
