import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  reaction?: string;
  timestamp: Date;
}

interface PartyChatProps {
  partyId: string;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onSendReaction: (reaction: string) => void;
}

const QUICK_REACTIONS = ['😂', '🔥', '👏', '😮', '💪', '🍿'];

export const PartyChat: React.FC<PartyChatProps> = ({
  messages,
  onSendMessage,
  onSendReaction,
}) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: theme.colors.background.primary,
      }}
    >
      {/* Quick Reactions */}
      <div
        style={{
          padding: '10px 12px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          gap: '8px',
          justifyContent: 'center',
        }}
      >
        {QUICK_REACTIONS.map((reaction) => (
          <button
            key={reaction}
            onClick={() => onSendReaction(reaction)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: theme.colors.background.secondary,
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {reaction}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: theme.colors.text.muted }}>
            <p>No messages yet. Start the chat!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.userId === user.uid;

            if (msg.reaction) {
              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: 'center',
                    fontSize: '32px',
                    animation: 'bounce 0.5s ease',
                  }}
                >
                  {msg.reaction}
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  alignSelf: isOwn ? 'flex-end' : 'flex-start',
                  flexDirection: isOwn ? 'row-reverse' : 'row',
                  maxWidth: '80%',
                }}
              >
                <span style={{ fontSize: '24px' }}>{msg.userAvatar}</span>
                <div>
                  {!isOwn && (
                    <p
                      style={{
                        margin: '0 0 2px 0',
                        fontSize: '11px',
                        color: theme.colors.text.muted,
                      }}
                    >
                      {msg.userName}
                    </p>
                  )}
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '14px',
                      background: isOwn
                        ? `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
                        : theme.colors.background.secondary,
                      color: isOwn ? '#fff' : theme.colors.text.primary,
                    }}
                  >
                    <p style={{ margin: 0, fontSize: '14px' }}>{msg.message}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px',
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Say something..."
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: '24px',
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            fontSize: '14px',
          }}
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: 'none',
            background: newMessage.trim()
              ? `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
              : theme.colors.background.secondary,
            color: newMessage.trim() ? '#fff' : theme.colors.text.muted,
            fontSize: '18px',
            cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
          }}
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default PartyChat;
