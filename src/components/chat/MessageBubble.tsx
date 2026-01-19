import React, { useState } from 'react';
import { Message } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

interface MessageBubbleProps {
  message: Message;
  onReact?: (messageId: string, emoji: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onReact }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(message.id, emoji);
    }
    setShowReactions(false);
  };

  const getTotalReactions = () => {
    if (!message.reactions) return [];
    return message.reactions.filter(r => r.userIds.length > 0);
  };

  const hasUserReacted = (emoji: string) => {
    if (!message.reactions || !user) return false;
    const reaction = message.reactions.find(r => r.emoji === emoji);
    return reaction?.userIds.includes(user.uid) || false;
  };

  return (
    <div
      className="message-bubble"
      style={{
        display: 'flex',
        justifyContent: message.isMe ? 'flex-end' : 'flex-start',
        position: 'relative',
      }}
      onMouseEnter={() => setShowReactions(true)}
      onMouseLeave={() => setShowReactions(false)}
    >
      <div style={{ position: 'relative' }}>
        <div
          style={{
            maxWidth: '300px',
            padding: '14px 18px',
            background: message.isMe
              ? theme.colors.accent.gradient
              : theme.colors.cardHover,
            borderRadius: message.isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
            color: message.isMe ? theme.colors.background.primary : theme.colors.text.primary,
          }}
        >
          {!message.isMe && (
            <p
              style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                fontWeight: 700,
                color: theme.colors.accent.secondary,
              }}
            >
              {message.sender}
            </p>
          )}
          <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.4 }}>{message.text}</p>
          <p
            style={{
              margin: '6px 0 0 0',
              fontSize: '11px',
              opacity: 0.7,
              textAlign: 'right',
            }}
          >
            {message.time}
          </p>
        </div>

        {/* Reactions Display */}
        {getTotalReactions().length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '4px',
              marginTop: '4px',
              justifyContent: message.isMe ? 'flex-end' : 'flex-start',
            }}
          >
            {getTotalReactions().map((reaction) => (
              <button
                key={reaction.emoji}
                onClick={() => handleReaction(reaction.emoji)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  background: hasUserReacted(reaction.emoji)
                    ? 'rgba(217, 119, 6, 0.2)'
                    : theme.colors.cardHover,
                  border: hasUserReacted(reaction.emoji)
                    ? `1px solid ${theme.colors.accent.primary}`
                    : `1px solid ${theme.colors.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                <span>{reaction.emoji}</span>
                <span style={{ fontSize: '11px', color: theme.colors.text.muted }}>
                  {reaction.userIds.length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Reaction Picker */}
        {showReactions && onReact && (
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              [message.isMe ? 'right' : 'left']: 0,
              marginBottom: '8px',
              padding: '8px',
              background: theme.colors.card,
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              gap: '4px',
              zIndex: 10,
            }}
          >
            {REACTION_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                style={{
                  width: '36px',
                  height: '36px',
                  background: hasUserReacted(emoji)
                    ? 'rgba(217, 119, 6, 0.2)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s, background 0.15s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.2)';
                  e.currentTarget.style.background = theme.colors.cardHover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = hasUserReacted(emoji)
                    ? 'rgba(217, 119, 6, 0.2)'
                    : 'transparent';
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
