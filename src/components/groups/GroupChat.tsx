import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { haptics } from '../../utils/haptics';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  reactions?: { emoji: string; count: number }[];
}

interface GroupChatProps {
  groupId: string;
  groupName: string;
}


export const GroupChat: React.FC<GroupChatProps> = ({ groupId, groupName: _groupName }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  void _groupName;

  // Load messages from Firebase
  useEffect(() => {
    const messagesRef = collection(db, 'groups', groupId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
      })) as ChatMessage[];

      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [groupId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user?.uid) return;

    try {
      const messagesRef = collection(db, 'groups', groupId, 'messages');
      await addDoc(messagesRef, {
        userId: user.uid,
        userName: user.name || 'Anonymous',
        userAvatar: user.avatar || '👤',
        content: newMessage.trim(),
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
      haptics.light();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const reactions = msg.reactions || [];
        const existing = reactions.find(r => r.emoji === emoji);
        if (existing) {
          existing.count++;
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...msg, reactions };
      }
      return msg;
    }));
    haptics.light();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '500px',
        background: theme.colors.card,
        borderRadius: '16px',
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Chat Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>💬</span>
          <span style={{ fontWeight: 600, color: theme.colors.text.primary }}>Group Chat</span>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '10px',
            background: '#22c55e20',
            color: '#22c55e',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {messages.length} messages
        </span>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <span style={{ fontSize: '40px' }}>💬</span>
            <p style={{ color: theme.colors.text.muted, margin: '12px 0 0 0' }}>
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : messages.map((message, index) => {
          const isOwn = message.userId === (user?.uid || 'current-user');
          const showAvatar = index === 0 || messages[index - 1].userId !== message.userId;

          return (
            <div
              key={message.id}
              style={{
                display: 'flex',
                flexDirection: isOwn ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: '10px',
              }}
            >
              {/* Avatar */}
              {showAvatar && !isOwn && (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: theme.colors.background.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  {message.userAvatar}
                </div>
              )}
              {!showAvatar && !isOwn && <div style={{ width: '36px' }} />}

              {/* Message Bubble */}
              <div style={{ maxWidth: '70%' }}>
                {showAvatar && !isOwn && (
                  <p
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    {message.userName}
                  </p>
                )}
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: isOwn ? theme.colors.accent.primary : theme.colors.background.secondary,
                    color: isOwn ? '#fff' : theme.colors.text.primary,
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.4 }}>{message.content}</p>
                </div>

                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {message.reactions.map((reaction, i) => (
                      <button
                        key={i}
                        onClick={() => handleReact(message.id, reaction.emoji)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          border: `1px solid ${theme.colors.border}`,
                          background: theme.colors.background.secondary,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        <span>{reaction.emoji}</span>
                        <span style={{ color: theme.colors.text.muted }}>{reaction.count}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleReact(message.id, '👍')}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        border: `1px solid ${theme.colors.border}`,
                        background: 'transparent',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: theme.colors.text.muted,
                      }}
                    >
                      +
                    </button>
                  </div>
                )}

                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '10px',
                    color: theme.colors.text.muted,
                    textAlign: isOwn ? 'right' : 'left',
                  }}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>


      {/* Typing Indicator */}
      {isTyping && (
        <div style={{ padding: '0 16px 8px', fontSize: '12px', color: theme.colors.text.muted }}>
          Someone is typing...
        </div>
      )}

      {/* Input */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          gap: '10px',
        }}
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '20px',
            border: `1px solid ${theme.colors.border}`,
            background: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: newMessage.trim() ? theme.colors.accent.primary : theme.colors.border,
            color: '#fff',
            fontSize: '18px',
            cursor: newMessage.trim() ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
