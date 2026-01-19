import React from 'react';
import { UserStats } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common';

interface StatsCardProps {
  stats: UserStats;
}

interface StatItem {
  label: string;
  value: number;
  icon: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
  const { theme } = useTheme();

  const statItems: StatItem[] = [
    { label: 'Posts Created', value: stats.postsCreated, icon: '📝' },
    { label: 'Comments Made', value: stats.commentsMade, icon: '💬' },
    { label: 'Events Attended', value: stats.eventsAttended, icon: '📅' },
    { label: 'Jokes Shared', value: stats.jokesShared, icon: '😂' },
  ];

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>📊 Your Stats</h3>
      <Card>
        {statItems.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: i < statItems.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
            }}
          >
            <span style={{ fontSize: '24px', marginRight: '12px' }}>{stat.icon}</span>
            <span style={{ flex: 1, color: theme.colors.text.secondary }}>{stat.label}</span>
            <span style={{ fontWeight: 800, fontSize: '18px' }}>{stat.value}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
