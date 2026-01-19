import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Button, Card } from '../common';
import { NewChatModal } from './NewChatModal';
import { Chat } from '../../types';

const ChatItem: React.FC<{ chat: Chat; onClick: () => void }> = ({ chat, onClick }) => {
  const { theme, mode } = useTheme();
  const isDM = chat.type === 'dm';

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
            borderRadius: isDM ? '50%' : '16px',
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
          {!isDM && (
            <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>
              {chat.members} members
            </span>
          )}
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

  const { dms, groups } = useMemo(() => {
    const dms = chats.filter((chat) => chat.type === 'dm');
    const groups = chats.filter((chat) => chat.type === 'group');
    return { dms, groups };
  }, [chats]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Messages</h2>
        <Button icon="+" size="medium" onClick={() => setShowNewChatModal(true)}>
          New Group
        </Button>
      </div>

      {/* Direct Messages Section */}
      {dms.length > 0 && (
        <div>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.muted,
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Direct Messages
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dms.map((chat) => (
              <ChatItem key={chat.id} chat={chat} onClick={() => setActiveChat(chat.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Group Chats Section */}
      <div>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: 600,
            color: theme.colors.text.muted,
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          Group Chats
        </h3>
        {groups.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '30px',
              color: theme.colors.text.muted,
            }}
          >
            <p>No group chats yet. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groups.map((chat) => (
              <ChatItem key={chat.id} chat={chat} onClick={() => setActiveChat(chat.id)} />
            ))}
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      <NewChatModal isOpen={showNewChatModal} onClose={() => setShowNewChatModal(false)} />
    </div>
  );
};
