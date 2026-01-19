import React from 'react';
import { Notification } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationItemProps {
  notification: Notification;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const { theme } = useTheme();
  const { markAsRead, removeNotification } = useNotifications();

  const getTypeIcon = (): string => {
    switch (notification.type) {
      case 'message':
        return '💬';
      case 'like':
        return '❤️';
      case 'comment':
        return '💭';
      case 'event':
        return '📅';
      case 'badge':
        return '🏆';
      case 'mention':
        return '@';
      default:
        return '🔔';
    }
  };

  return (
    <div
      onClick={() => markAsRead(notification.id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '12px',
        borderRadius: '12px',
        background: notification.read ? 'transparent' : `rgba(217, 119, 6, 0.1)`,
        cursor: 'pointer',
        marginBottom: '8px',
        transition: 'background 0.2s ease',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: theme.colors.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
        }}
      >
        {notification.avatar || getTypeIcon()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p
            style={{
              margin: 0,
              fontWeight: notification.read ? 500 : 700,
              fontSize: '14px',
              color: theme.colors.text.primary,
            }}
          >
            {notification.title}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text.muted,
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '13px',
            color: theme.colors.text.secondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {notification.message}
        </p>
        <p
          style={{
            margin: '6px 0 0 0',
            fontSize: '11px',
            color: theme.colors.text.muted,
          }}
        >
          {notification.time}
        </p>
      </div>

      {!notification.read && (
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: theme.colors.accent.secondary,
            flexShrink: 0,
            marginTop: '6px',
          }}
        />
      )}
    </div>
  );
};
