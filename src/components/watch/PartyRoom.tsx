import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { PartyChat, ChatMessage } from './PartyChat';
import { haptics } from '../../utils/haptics';

export interface WatchParty {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  contentType: 'movie' | 'sports' | 'show' | 'custom';
  contentTitle: string;
  contentUrl?: string;
  scheduledFor: Date;
  status: 'scheduled' | 'live' | 'ended';
  participants: string[];
  maxParticipants?: number;
  isPrivate: boolean;
  createdAt: Date;
}

interface PartyRoomProps {
  party: WatchParty;
  onLeave: () => void;
}

export const PartyRoom: React.FC<PartyRoomProps> = ({ party, onLeave }) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [showChat, setShowChat] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: party.hostId,
      userName: party.hostName,
      userAvatar: party.hostAvatar,
      message: `Welcome to ${party.title}! Glad you could join us! 🎉`,
      timestamp: new Date(),
    },
  ]);
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string }[]>([]);

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.name,
      userAvatar: user.avatar,
      message,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    haptics.light();
  };

  const handleSendReaction = (reaction: string) => {
    const reactionId = Date.now().toString();
    setFloatingReactions((prev) => [...prev, { id: reactionId, emoji: reaction }]);
    haptics.light();

    // Remove after animation
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2000);

    // Also add to chat
    const newMessage: ChatMessage = {
      id: reactionId,
      userId: user.uid,
      userName: user.name,
      userAvatar: user.avatar,
      message: '',
      reaction,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const getContentTypeEmoji = (type: WatchParty['contentType']) => {
    switch (type) {
      case 'movie':
        return '🎬';
      case 'sports':
        return '🏈';
      case 'show':
        return '📺';
      default:
        return '🎥';
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <button
          onClick={onLeave}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff' }}>
            {party.title}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            {getContentTypeEmoji(party.contentType)} {party.contentTitle}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '12px',
              background: party.status === 'live' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.1)',
              color: party.status === 'live' ? '#ef4444' : 'rgba(255,255,255,0.6)',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            {party.status === 'live' && (
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  animation: 'pulse 1s infinite',
                }}
              />
            )}
            {party.status === 'live' ? 'LIVE' : party.status.toUpperCase()}
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
            👥 {party.participants.length}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Video Placeholder */}
        <div
          style={{
            flex: showChat ? '0 0 40%' : '1',
            background: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>
            {getContentTypeEmoji(party.contentType)}
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
            {party.contentTitle}
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
            {party.status === 'live'
              ? 'Watching now with the group...'
              : 'Waiting for the party to start...'}
          </p>

          {/* Floating Reactions */}
          {floatingReactions.map((reaction, index) => (
            <div
              key={reaction.id}
              style={{
                position: 'absolute',
                bottom: '20%',
                left: `${30 + (index % 3) * 20}%`,
                fontSize: '40px',
                animation: 'floatUp 2s ease-out forwards',
                opacity: 0,
              }}
            >
              {reaction.emoji}
            </div>
          ))}

          {/* Simulated controls */}
          {party.status === 'live' && (
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '16px',
                padding: '12px 24px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '30px',
              }}
            >
              <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
                ⏪
              </button>
              <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
                ▶️
              </button>
              <button style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>
                ⏩
              </button>
            </div>
          )}
        </div>

        {/* Chat Toggle */}
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            position: 'absolute',
            right: '12px',
            top: showChat ? '38%' : '12px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: theme.colors.accent.primary,
            color: '#fff',
            fontSize: '18px',
            cursor: 'pointer',
            zIndex: 5,
            transition: 'top 0.3s',
          }}
        >
          💬
        </button>

        {/* Chat Panel */}
        {showChat && (
          <div
            style={{
              flex: '0 0 60%',
              borderTop: `1px solid ${theme.colors.border}`,
            }}
          >
            <PartyChat
              partyId={party.id}
              messages={messages}
              onSendMessage={handleSendMessage}
              onSendReaction={handleSendReaction}
            />
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes floatUp {
            0% {
              opacity: 1;
              transform: translateY(0);
            }
            100% {
              opacity: 0;
              transform: translateY(-200px);
            }
          }
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PartyRoom;
