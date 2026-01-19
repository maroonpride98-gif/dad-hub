import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { Card } from '../common';
import { StatCard } from './components/StatCard';

export const OverviewSection: React.FC = () => {
  const { theme } = useTheme();
  const { analytics, analyticsLoading, users, reports } = useAdmin();

  const pendingReports = reports.filter((r) => r.status === 'pending').length;
  const moderatorCount = users.filter((u) => u.isModerator).length;

  if (analyticsLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <span style={{ fontSize: '32px' }}>⏳</span>
        <p style={{ color: theme.colors.text.muted }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}
      >
        <StatCard
          icon="👥"
          label="Total Users"
          value={analytics?.platform.totalUsers || users.length}
          trend={
            analytics?.platform.newUsersWeek
              ? `+${analytics.platform.newUsersWeek} this week`
              : undefined
          }
        />
        <StatCard
          icon="📝"
          label="Total Posts"
          value={analytics?.engagement.totalPosts || 0}
          trend={
            analytics?.engagement.postsToday
              ? `+${analytics.engagement.postsToday} today`
              : undefined
          }
        />
        <StatCard
          icon="🛡️"
          label="Pending Reports"
          value={pendingReports}
          variant={pendingReports > 0 ? 'warning' : 'default'}
        />
        <StatCard icon="👮" label="Moderators" value={moderatorCount} />
      </div>

      <Card>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
          📊 Today's Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <ActivityRow
            label="Active Users"
            value={analytics?.platform.activeUsersToday || 0}
            icon="🟢"
          />
          <ActivityRow
            label="New Registrations"
            value={analytics?.platform.newUsersToday || 0}
            icon="🆕"
          />
          <ActivityRow
            label="Posts Created"
            value={analytics?.engagement.postsToday || 0}
            icon="📝"
          />
          <ActivityRow
            label="Comments Made"
            value={analytics?.engagement.commentsToday || 0}
            icon="💬"
          />
          <ActivityRow
            label="Events Created"
            value={analytics?.engagement.eventsCreatedToday || 0}
            icon="📅"
          />
          <ActivityRow
            label="Jokes Shared"
            value={analytics?.engagement.jokesSharedToday || 0}
            icon="😂"
          />
        </div>
      </Card>
    </div>
  );
};

const ActivityRow: React.FC<{ label: string; value: number; icon: string }> = ({
  label,
  value,
  icon,
}) => {
  const { theme } = useTheme();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <span style={{ marginRight: '12px', fontSize: '18px' }}>{icon}</span>
      <span style={{ flex: 1, color: theme.colors.text.secondary }}>{label}</span>
      <span style={{ fontWeight: 700, fontSize: '18px' }}>{value}</span>
    </div>
  );
};
