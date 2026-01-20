import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { SupportRoom } from './SupportRoom';
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

export interface SupportTopic {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  activeUsers: number;
}

export interface SupportSession {
  id: string;
  topicId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  isAnonymous: boolean;
  message: string;
  createdAt: Date;
  responses: number;
  isResolved: boolean;
}

const SUPPORT_TOPICS: SupportTopic[] = [
  {
    id: 'new_dad',
    name: 'New Dad Support',
    emoji: '👶',
    description: 'Support for new and expecting fathers',
    color: '#3b82f6',
    activeUsers: 0,
  },
  {
    id: 'teen_parent',
    name: 'Teen Parenting',
    emoji: '🎮',
    description: 'Navigating the teenage years',
    color: '#8b5cf6',
    activeUsers: 0,
  },
  {
    id: 'work_life',
    name: 'Work-Life Balance',
    emoji: '⚖️',
    description: 'Balancing career and family',
    color: '#f59e0b',
    activeUsers: 0,
  },
  {
    id: 'relationship',
    name: 'Relationships',
    emoji: '💕',
    description: 'Marriage, co-parenting, and family',
    color: '#ec4899',
    activeUsers: 0,
  },
  {
    id: 'mental_health',
    name: 'Mental Health',
    emoji: '🧠',
    description: 'Managing stress and emotions',
    color: '#22c55e',
    activeUsers: 0,
  },
  {
    id: 'general',
    name: 'General Support',
    emoji: '💬',
    description: 'Any topic, all dads welcome',
    color: '#6b7280',
    activeUsers: 0,
  },
];

export const LiveSupportPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [topics, setTopics] = useState<SupportTopic[]>(SUPPORT_TOPICS);
  const [selectedTopic, setSelectedTopic] = useState<SupportTopic | null>(null);
  const [recentSessions, setRecentSessions] = useState<SupportSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadRecentSessions();
  }, []);

  const loadRecentSessions = async () => {
    try {
      const sessionsRef = collection(db, 'supportSessions');
      const q = query(
        sessionsRef,
        where('isResolved', '==', false),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      const snapshot = await getDocs(q);

      const sessions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as SupportSession[];

      setRecentSessions(sessions);

      // Update topic active counts
      const topicCounts = sessions.reduce((acc, s) => {
        acc[s.topicId] = (acc[s.topicId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      setTopics((prev) =>
        prev.map((t) => ({ ...t, activeUsers: topicCounts[t.id] || 0 }))
      );
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskForSupport = async () => {
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      await addDoc(collection(db, 'supportSessions'), {
        topicId: selectedTopicId,
        userId: user.uid,
        userName: isAnonymous ? 'Anonymous Dad' : user.name,
        userAvatar: isAnonymous ? '🎭' : user.avatar,
        isAnonymous,
        message: message.trim(),
        createdAt: serverTimestamp(),
        responses: 0,
        isResolved: false,
      });

      haptics.success();
      setShowAskForm(false);
      setMessage('');
      setIsAnonymous(false);
      loadRecentSessions();
    } catch (error) {
      console.error('Error creating session:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selectedTopic) {
    return (
      <SupportRoom
        topic={selectedTopic}
        sessions={recentSessions.filter((s) => s.topicId === selectedTopic.id)}
        onBack={() => setSelectedTopic(null)}
        onRefresh={loadRecentSessions}
      />
    );
  }

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
          padding: '20px',
          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🤝 Live Dad Support
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Connect with other dads for real-time support
        </p>
      </div>

      {/* Ask for Support Button */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={() => setShowAskForm(true)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          💬 Ask for Support
        </button>
      </div>

      {/* Topics */}
      <div style={{ padding: '0 20px 20px' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 700,
            color: theme.colors.text.primary,
          }}
        >
          Support Topics
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
          }}
        >
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic)}
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.card,
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px' }}>{topic.emoji}</span>
                {topic.activeUsers > 0 && (
                  <span
                    style={{
                      padding: '2px 8px',
                      background: `${topic.color}20`,
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: topic.color,
                    }}
                  >
                    {topic.activeUsers} active
                  </span>
                )}
              </div>
              <p
                style={{
                  margin: '0 0 4px 0',
                  fontWeight: 600,
                  fontSize: '14px',
                  color: theme.colors.text.primary,
                }}
              >
                {topic.name}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                {topic.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={{ padding: '0 20px' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 700,
            color: theme.colors.text.primary,
          }}
        >
          Recent Support Requests
        </h3>

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: theme.colors.text.muted }}>Loading...</p>
          </div>
        ) : recentSessions.length === 0 ? (
          <div
            style={{
              padding: '40px',
              textAlign: 'center',
              background: theme.colors.background.secondary,
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💬</div>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              No active support sessions. Be the first to ask!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recentSessions.slice(0, 10).map((session) => {
              const topic = topics.find((t) => t.id === session.topicId);
              return (
                <div
                  key={session.id}
                  style={{
                    padding: '14px',
                    background: theme.colors.card,
                    borderRadius: '14px',
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '24px' }}>{session.userAvatar}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: theme.colors.text.primary }}>
                        {session.userName}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>
                        {formatTimeAgo(session.createdAt)}
                      </p>
                    </div>
                    {topic && (
                      <span
                        style={{
                          padding: '4px 8px',
                          background: `${topic.color}20`,
                          borderRadius: '8px',
                          fontSize: '11px',
                          color: topic.color,
                        }}
                      >
                        {topic.emoji} {topic.name}
                      </span>
                    )}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: theme.colors.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    {session.message}
                  </p>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
                      💬 {session.responses} response{session.responses !== 1 ? 's' : ''}
                    </span>
                    <button
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: theme.colors.accent.primary,
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Offer Support
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ask Form Modal */}
      {showAskForm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAskForm(false)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              maxHeight: '90vh',
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
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>💬 Ask for Support</h3>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Topic Selection */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                  Topic
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {topics.map((topic) => (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => setSelectedTopicId(topic.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '16px',
                        border:
                          selectedTopicId === topic.id
                            ? `2px solid ${topic.color}`
                            : `1px solid ${theme.colors.border}`,
                        background: selectedTopicId === topic.id ? `${topic.color}20` : 'transparent',
                        color: selectedTopicId === topic.id ? topic.color : theme.colors.text.secondary,
                        fontSize: '13px',
                        fontWeight: selectedTopicId === topic.id ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{topic.emoji}</span>
                      <span>{topic.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                  What's on your mind?
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share what you're going through..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '14px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Anonymous Toggle */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  background: theme.colors.background.secondary,
                  borderRadius: '12px',
                  marginBottom: '20px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                  style={{
                    width: '48px',
                    height: '28px',
                    borderRadius: '14px',
                    border: 'none',
                    background: isAnonymous ? theme.colors.accent.primary : theme.colors.border,
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute',
                      top: '2px',
                      left: isAnonymous ? '22px' : '2px',
                      transition: 'left 0.2s',
                    }}
                  />
                </button>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: theme.colors.text.primary }}>
                    🎭 Post Anonymously
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                    Your name won't be shown to others
                  </p>
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleAskForSupport}
                disabled={!message.trim() || isSubmitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: !message.trim()
                    ? theme.colors.background.secondary
                    : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                  color: !message.trim() ? theme.colors.text.muted : '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: !message.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Posting...' : 'Post Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSupportPage;
