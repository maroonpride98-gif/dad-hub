import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { Card } from '../common';
import { StatCard } from './components/StatCard';

export const AnalyticsSection: React.FC = () => {
  const { theme } = useTheme();
  const { analytics, analyticsLoading } = useAdmin();

  if (analyticsLoading || !analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <span style={{ fontSize: '32px' }}>⏳</span>
        <p style={{ color: theme.colors.text.muted }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* User Stats */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
          👥 User Statistics
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}
        >
          <StatCard
            icon="👥"
            label="Total Users"
            value={analytics.platform.totalUsers}
          />
          <StatCard
            icon="🟢"
            label="Active Today"
            value={analytics.platform.activeUsersToday}
          />
          <StatCard
            icon="📅"
            label="Active This Week"
            value={analytics.platform.activeUsersWeek}
          />
          <StatCard
            icon="📆"
            label="Active This Month"
            value={analytics.platform.activeUsersMonth}
          />
        </div>
      </div>

      {/* New Users */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
          🆕 New Registrations
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}
        >
          <StatCard
            icon="📍"
            label="Today"
            value={analytics.platform.newUsersToday}
            variant="success"
          />
          <StatCard
            icon="📅"
            label="This Week"
            value={analytics.platform.newUsersWeek}
            variant="success"
          />
          <StatCard
            icon="📆"
            label="This Month"
            value={analytics.platform.newUsersMonth}
            variant="success"
          />
        </div>
      </div>

      {/* Engagement Stats */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
          📊 Engagement Metrics
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '12px',
          }}
        >
          <StatCard
            icon="📝"
            label="Total Posts"
            value={analytics.engagement.totalPosts}
          />
          <StatCard
            icon="💬"
            label="Total Comments"
            value={analytics.engagement.totalComments}
          />
          <StatCard
            icon="📅"
            label="Total Events"
            value={analytics.engagement.totalEvents}
          />
          <StatCard
            icon="😂"
            label="Total Jokes"
            value={analytics.engagement.totalJokes}
          />
        </div>
      </div>

      {/* Growth Chart */}
      <Card>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
          📈 7-Day Growth
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {analytics.growth.map((point, index) => {
            const maxUsers = Math.max(...analytics.growth.map((p) => p.users));
            const widthPercent = (point.users / maxUsers) * 100;
            const isLatest = index === analytics.growth.length - 1;

            return (
              <div
                key={point.date}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    width: '80px',
                    fontSize: '12px',
                    color: theme.colors.text.muted,
                  }}
                >
                  {new Date(point.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: '24px',
                    background: theme.colors.background.tertiary,
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${widthPercent}%`,
                      height: '100%',
                      background: isLatest
                        ? theme.colors.accent.gradient
                        : theme.colors.accent.secondary,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
                <span
                  style={{
                    width: '50px',
                    textAlign: 'right',
                    fontWeight: isLatest ? 700 : 500,
                    fontSize: '14px',
                  }}
                >
                  {point.users}
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
