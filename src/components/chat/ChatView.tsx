import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Button, Input } from '../common';
import { MessageBubble } from './MessageBubble';

export const ChatView: React.FC = () => {
  const { theme, mode } = useTheme();
  const { activeChat, setActiveChat, messages, sendMessage, reactToMessage, getChatById } = useApp();
  const [newMessage, setNewMessage] = useState('');

  const chat = activeChat ? getChatById(activeChat) : undefined;
  const chatMessages = messages[activeChat!] || [];

  const handleSend = () => {
    if (newMessage.trim() && activeChat) {
      sendMessage(activeChat, newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 220px)' }}>
      {/* Chat Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setActiveChat(null)}
          style={{
            background: theme.colors.cardHover,
            border: 'none',
            borderRadius: '10px',
            padding: '10px 14px',
            color: theme.colors.text.primary,
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          ←
        </button>
        <div
          style={{
            width: '44px',
            height: '44px',
            background: `linear-gradient(135deg, ${theme.colors.background.tertiary}, ${
              mode === 'dark' ? '#57534e' : '#d6d3d1'
            })`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          {chat?.emoji}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{chat?.name}</h3>
          <span style={{ color: theme.colors.text.muted, fontSize: '13px' }}>
            {chat?.members} members
          </span>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {chatMessages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            onReact={(messageId, emoji) => activeChat && reactToMessage(activeChat, messageId, emoji)}
          />
        ))}
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.colors.border}`,
          marginTop: '16px',
        }}
      >
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSend} size="large">
          Send
        </Button>
      </div>
    </div>
  );
};
