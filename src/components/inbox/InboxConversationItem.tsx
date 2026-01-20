import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common';
import { Chat } from '../../types';

interface InboxConversationItemProps {
  chat: Chat;
  unreadCount: number;
  onClick: () => void;
}

export const InboxConversationItem: React.FC<InboxConversationItemProps> = ({
  chat,
  unreadCount,
  onClick,
}) => {
  const { theme, mode } = useTheme();
  const hasUnread = unreadCount > 0;

  return (
    <Card hover onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            background: `linear-gradient(135deg, ${theme.colors.background.tertiary}, ${
              mode === 'dark' ? '#57534e' : '#d6d3d1'
            })`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}
        >
          {chat.emoji || chat.dmPartnerAvatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: hasUnread ? 800 : 700,
                color: hasUnread ? theme.colors.text.primary : theme.colors.text.primary,
              }}
            >
              {chat.dmPartnerName || chat.name}
            </h4>
            <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>
              {chat.time}
            </span>
          </div>
          <p
            style={{
              margin: '4px 0 0 0',
              color: hasUnread ? theme.colors.text.primary : theme.colors.text.secondary,
              fontSize: '14px',
              fontWeight: hasUnread ? 600 : 400,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {chat.lastMessage}
          </p>
        </div>
        {hasUnread && (
          <div
            style={{
              minWidth: '24px',
              height: '24px',
              padding: '0 8px',
              background: theme.colors.accent.gradient,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 800,
              color: theme.colors.background.primary,
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
      </div>
    </Card>
  );
};
