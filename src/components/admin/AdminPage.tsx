import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { AdminNav } from './AdminNav';
import { OverviewSection } from './OverviewSection';
import { AnalyticsSection } from './AnalyticsSection';
import { UsersSection } from './UsersSection';
import { ModerationSection } from './ModerationSection';

export const AdminPage: React.FC = () => {
  const { theme } = useTheme();
  const { currentView, isAdmin, fetchAnalytics, fetchUsers, fetchReports } = useAdmin();

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
      fetchUsers();
      fetchReports('pending');
    }
  }, [isAdmin, fetchAnalytics, fetchUsers, fetchReports]);

  if (!isAdmin) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: theme.colors.text.muted,
        }}
      >
        <span style={{ fontSize: '48px' }}>🚫</span>
        <h2 style={{ margin: '16px 0 8px' }}>Access Denied</h2>
        <p style={{ margin: 0 }}>You do not have permission to access this page.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'users':
        return <UsersSection />;
      case 'moderation':
        return <ModerationSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1
          style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>🛡️</span> Admin Dashboard
        </h1>
        <p style={{ margin: 0, color: theme.colors.text.muted }}>
          Manage users, content, and view platform analytics
        </p>
      </div>

      <AdminNav />
      {renderContent()}
    </div>
  );
};
