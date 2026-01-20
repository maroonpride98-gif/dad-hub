import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../common';
import { NewChatModal } from './NewChatModal';
import { Chat } from '../../types';

const ChatItem: React.FC<{ chat: Chat; onClick: () => void }> = ({ chat, onClick }) => {
  const { theme, mode } = useTheme();

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
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
          }}
        >
          {chat.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>{chat.name}</h4>
            <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>
              {chat.time}
            </span>
          </div>
          <p
            style={{
              margin: '4px 0',
              color: theme.colors.text.secondary,
              fontSize: '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {chat.lastMessage}
          </p>
          <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>
            {chat.members} members
          </span>
        </div>
        {chat.unread > 0 && (
          <div
            style={{
              minWidth: '24px',
              height: '24px',
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
            {chat.unread}
          </div>
        )}
      </div>
    </Card>
  );
};

export const ChatList: React.FC = () => {
  const { theme } = useTheme();
  const { chats, setActiveChat } = useApp();
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  const groups = useMemo(() => {
    return chats.filter((chat) => chat.type === 'group');
  }, [chats]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Group Chats</h2>
        <Button icon="+" size="medium" onClick={() => setShowNewChatModal(true)}>
          New Group
        </Button>
      </div>

      {/* Group Chats */}
      {groups.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: theme.colors.text.muted,
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
          <p style={{ margin: 0, fontSize: '16px' }}>No group chats yet</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Create a group to chat with multiple dads!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groups.map((chat) => (
            <ChatItem key={chat.id} chat={chat} onClick={() => setActiveChat(chat.id)} />
          ))}
        </div>
      )}

      {/* New Chat Modal */}
      <NewChatModal isOpen={showNewChatModal} onClose={() => setShowNewChatModal(false)} />
    </div>
  );
};
