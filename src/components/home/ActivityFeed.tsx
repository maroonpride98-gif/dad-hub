import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: 'post' | 'comment' | 'like' | 'achievement' | 'streak' | 'level_up' | 'joined_group';
  target?: string;
  timestamp: Date;
  emoji: string;
}

const ACTIVITY_TEMPLATES = {
  post: 'shared a new post',
  comment: 'commented on a discussion',
  like: 'liked a post',
  achievement: 'earned a new badge',
  streak: 'hit a new streak milestone',
  level_up: 'leveled up',
  joined_group: 'joined a group',
};

const SAMPLE_ACTIVITIES: ActivityItem[] = [
  { id: '1', userId: 'u1', userName: 'Dave Wilson', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dave', action: 'achievement', target: 'Grill Master badge', timestamp: new Date(Date.now() - 300000), emoji: '🏆' },
  { id: '2', userId: 'u2', userName: 'Mark Stevens', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mark', action: 'post', target: 'Best camping spots for families', timestamp: new Date(Date.now() - 1200000), emoji: '📝' },
  { id: '3', userId: 'u3', userName: 'Tom Chen', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom', action: 'streak', target: '30 days', timestamp: new Date(Date.now() - 3600000), emoji: '🔥' },
  { id: '4', userId: 'u4', userName: 'James Brown', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james', action: 'level_up', target: 'Level 15', timestamp: new Date(Date.now() - 7200000), emoji: '⬆️' },
  { id: '5', userId: 'u5', userName: 'Chris Miller', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris', action: 'joined_group', target: 'Tech Dads', timestamp: new Date(Date.now() - 14400000), emoji: '👥' },
];

const formatTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const ActivityFeed: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '20px',
        padding: '20px',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>📢</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
            Friend Activity
          </h3>
        </div>
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '12px',
            background: theme.colors.accent.primary + '20',
            color: theme.colors.accent.primary,
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Live
        </span>
      </div>

      {/* Activity List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {SAMPLE_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
            }}
          >
            {/* Avatar with emoji indicator */}
            <div style={{ position: 'relative' }}>
              <img
                src={activity.userAvatar}
                alt={activity.userName}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  fontSize: '14px',
                  background: theme.colors.card,
                  borderRadius: '50%',
                  padding: '2px',
                }}
              >
                {activity.emoji}
              </span>
            </div>

            {/* Activity content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: theme.colors.text.primary }}>
                <span style={{ fontWeight: 600 }}>{activity.userName}</span>
                {' '}
                <span style={{ color: theme.colors.text.secondary }}>
                  {ACTIVITY_TEMPLATES[activity.action]}
                </span>
                {activity.target && (
                  <>
                    {' '}
                    <span style={{ fontWeight: 500, color: theme.colors.accent.primary }}>
                      {activity.target}
                    </span>
                  </>
                )}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                {formatTime(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <button
        style={{
          width: '100%',
          marginTop: '12px',
          padding: '10px',
          borderRadius: '10px',
          border: `1px solid ${theme.colors.border}`,
          background: 'transparent',
          color: theme.colors.text.secondary,
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        See all activity
      </button>
    </div>
  );
};

export default ActivityFeed;
