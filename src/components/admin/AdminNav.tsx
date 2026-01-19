import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { AdminView } from '../../types';

interface NavItem {
  view: AdminView;
  icon: string;
  label: string;
}

const navItems: NavItem[] = [
  { view: 'overview', icon: '📊', label: 'Overview' },
  { view: 'analytics', icon: '📈', label: 'Analytics' },
  { view: 'users', icon: '👥', label: 'Users' },
  { view: 'moderation', icon: '🛡️', label: 'Moderation' },
];

export const AdminNav: React.FC = () => {
  const { theme } = useTheme();
  const { currentView, setCurrentView, reports } = useAdmin();

  const pendingReports = reports.filter((r) => r.status === 'pending').length;

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '4px 0',
      }}
    >
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => setCurrentView(item.view)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background:
              currentView === item.view
                ? theme.colors.accent.gradient
                : theme.colors.card,
            border: `1px solid ${
              currentView === item.view ? 'transparent' : theme.colors.border
            }`,
            borderRadius: '12px',
            color:
              currentView === item.view
                ? '#1c1917'
                : theme.colors.text.primary,
            cursor: 'pointer',
            fontWeight: currentView === item.view ? 700 : 500,
            fontSize: '14px',
            transition: 'all 0.3s ease',
            position: 'relative',
            whiteSpace: 'nowrap',
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
          {item.view === 'moderation' && pendingReports > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: theme.colors.error,
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center',
              }}
            >
              {pendingReports}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};
