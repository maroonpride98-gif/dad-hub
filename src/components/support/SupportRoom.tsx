import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { SupportTopic, SupportSession } from './LiveSupportPage';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface SupportRoomProps {
  topic: SupportTopic;
  sessions: SupportSession[];
  onBack: () => void;
  onRefresh: () => void;
}

export const SupportRoom: React.FC<SupportRoomProps> = ({
  topic,
  sessions,
  onBack,
  onRefresh,
}) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [selectedSession, setSelectedSession] = useState<SupportSession | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendResponse = async () => {
    if (!selectedSession || !responseText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      // Add response
      await addDoc(collection(db, 'supportResponses'), {
        sessionId: selectedSession.id,
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
        message: responseText.trim(),
        createdAt: serverTimestamp(),
      });

      // Update response count
      await updateDoc(doc(db, 'supportSessions', selectedSession.id), {
        responses: increment(1),
      });

      haptics.success();
      setResponseText('');
      setSelectedSession(null);
      onRefresh();
    } catch (error) {
      console.error('Error sending response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: 'none',
            background: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ←
        </button>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
            {topic.emoji} {topic.name}
          </h3>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
            {sessions.length} active request{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Topic Banner */}
      <div
        style={{
          padding: '20px',
          background: `${topic.color}15`,
          borderBottom: `1px solid ${topic.color}30`,
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.secondary, lineHeight: 1.6 }}>
          {topic.description}. Remember, we're all in this together. Be kind and supportive. 💪
        </p>
      </div>

      {/* Sessions */}
      <div style={{ padding: '16px 20px' }}>
        {sessions.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🤗</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              No active requests
            </h3>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              Be the first to ask for support in this topic!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sessions.map((session) => (
              <div
                key={session.id}
                style={{
                  background: theme.colors.card,
                  borderRadius: '16px',
                  border: `1px solid ${theme.colors.border}`,
                  overflow: 'hidden',
                }}
              >
                {/* Session Header */}
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '32px' }}>{session.userAvatar}</span>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 600,
                          fontSize: '15px',
                          color: theme.colors.text.primary,
                        }}
                      >
                        {session.userName}
                        {session.isAnonymous && (
                          <span style={{ fontSize: '12px', marginLeft: '6px', color: theme.colors.text.muted }}>
                            (anonymous)
                          </span>
                        )}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                        {formatTimeAgo(session.createdAt)}
                      </p>
                    </div>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: '15px',
                      color: theme.colors.text.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {session.message}
                  </p>
                </div>

                {/* Actions */}
                <div
                  style={{
                    padding: '12px 16px',
                    background: theme.colors.background.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
                    💬 {session.responses} response{session.responses !== 1 ? 's' : ''}
                  </span>
                  <button
                    onClick={() => setSelectedSession(session)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: 'none',
                      background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    💪 Offer Support
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {selectedSession && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px 20px 0 0',
              width: '100%',
              maxHeight: '70vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{selectedSession.userAvatar}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>
                    Responding to {selectedSession.userName}
                  </p>
                  <p
                    style={{
                      margin: '4px 0 0 0',
                      fontSize: '13px',
                      color: theme.colors.text.muted,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    "{selectedSession.message}"
                  </p>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px' }}>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Write something supportive..."
                autoFocus
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '14px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '12px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                  resize: 'vertical',
                  marginBottom: '16px',
                }}
              />

              <div
                style={{
                  padding: '12px',
                  background: `${theme.colors.accent.primary}10`,
                  borderRadius: '10px',
                  marginBottom: '16px',
                }}
              >
                <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.secondary }}>
                  💡 <strong>Tip:</strong> Share your experience, offer encouragement, or just let
                  them know they're not alone.
                </p>
              </div>

              <button
                onClick={handleSendResponse}
                disabled={!responseText.trim() || isSubmitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: !responseText.trim()
                    ? theme.colors.background.secondary
                    : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                  color: !responseText.trim() ? theme.colors.text.muted : '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: !responseText.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Sending...' : '💪 Send Support'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportRoom;
