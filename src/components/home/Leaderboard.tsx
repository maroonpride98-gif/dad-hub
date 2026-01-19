import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../common';

export const Leaderboard: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();

  // Show the current user's standing as a placeholder until we have more users
  const leaderboardData = [
    { rank: 1, name: user.name, points: user.points, badge: '🥇', isYou: true },
  ];

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
        🏆 Top Dads This Week
      </h3>
      <Card padding="medium">
        {leaderboardData.map((entry, i) => (
          <div
            key={entry.rank}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px',
              background: entry.isYou ? 'rgba(217, 119, 6, 0.15)' : 'transparent',
              borderRadius: '12px',
              marginBottom: i < leaderboardData.length - 1 ? '8px' : 0,
            }}
          >
            <span
              style={{
                width: '30px',
                fontWeight: 800,
                color: i < 3 ? theme.colors.accent.secondary : theme.colors.text.muted,
                fontSize: '16px',
              }}
            >
              {entry.badge || `#${entry.rank}`}
            </span>
            <span style={{ flex: 1, fontWeight: entry.isYou ? 700 : 500 }}>{entry.name}</span>
            <span style={{ fontWeight: 700, color: theme.colors.accent.secondary }}>
              {entry.points.toLocaleString()}
            </span>
          </div>
        ))}
        <p style={{
          margin: '16px 0 0 0',
          color: theme.colors.text.muted,
          fontSize: '13px',
          textAlign: 'center'
        }}>
          Leaderboard updates as more dads join!
        </p>
      </Card>
    </div>
  );
};
