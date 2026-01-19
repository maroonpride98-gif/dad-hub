import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { Button } from '../common';
import { NotificationItem } from './NotificationItem';

export const NotificationPanel: React.FC = () => {
  const { theme, mode } = useTheme();
  const { notifications, showPanel, setShowPanel, markAllAsRead, clearAll } = useNotifications();

  if (!showPanel) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowPanel(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 200,
        }}
      />

      {/* Panel */}
      <div
        className="notification-enter"
        style={{
          position: 'fixed',
          top: '80px',
          right: '20px',
          width: '360px',
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 160px)',
          background: mode === 'dark' ? '#292524' : '#fafaf9',
          borderRadius: '20px',
          boxShadow: theme.shadows.large,
          border: `1px solid ${theme.colors.border}`,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
            Notifications
          </h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="ghost" size="small" onClick={markAllAsRead}>
              Mark all read
            </Button>
            <button
              onClick={() => setShowPanel(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: theme.colors.text.secondary,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px',
          }}
        >
          {notifications.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme.colors.text.muted,
              }}
            >
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>
                🔔
              </span>
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div
            style={{
              padding: '12px 20px',
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <Button variant="ghost" size="small" fullWidth onClick={clearAll}>
              Clear all notifications
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
