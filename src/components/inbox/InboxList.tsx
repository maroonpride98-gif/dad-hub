import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common';
import { InboxConversationItem } from './InboxConversationItem';
import { NewDMModal } from './NewDMModal';

export const InboxList: React.FC = () => {
  const { theme } = useTheme();
  const { chats, setActiveChat } = useApp();
  const { user } = useAuth();
  const [showNewDMModal, setShowNewDMModal] = useState(false);

  const dmChats = useMemo(() => {
    return chats
      .filter((chat) => chat.type === 'dm')
      .sort((a, b) => {
        const timeA = a.lastMessageAt || a.time || '';
        const timeB = b.lastMessageAt || b.time || '';
        return timeB.localeCompare(timeA);
      });
  }, [chats]);

  const getUnreadCount = (chatId: string) => {
    const chat = chats.find((c) => c.id === chatId);
    return chat?.unreadCounts?.[user?.uid || ''] || 0;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Inbox</h2>
        <Button icon="+" size="medium" onClick={() => setShowNewDMModal(true)}>
          New Message
        </Button>
      </div>

      {/* Conversations List */}
      {dmChats.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: theme.colors.text.muted,
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
          <p style={{ margin: 0, fontSize: '16px' }}>No messages yet</p>
          <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
            Start a conversation with a friend!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dmChats.map((chat) => (
            <InboxConversationItem
              key={chat.id}
              chat={chat}
              unreadCount={getUnreadCount(chat.id)}
              onClick={() => setActiveChat(chat.id)}
            />
          ))}
        </div>
      )}

      {/* New DM Modal */}
      <NewDMModal isOpen={showNewDMModal} onClose={() => setShowNewDMModal(false)} />
    </div>
  );
};
