import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useFriends } from '../../context/FriendsContext';
import { Card } from '../common';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export const Achievements: React.FC = () => {
  const { theme, mode } = useTheme();
  const { user, discussions, events, jokes } = useApp();
  const { friends } = useFriends();

  // Calculate stats for achievements
  const postsCount = discussions.filter(d => d.authorId === user.uid).length;
  const eventsAttended = events.filter(e => e.attendeeIds?.includes(user.uid)).length;
  const jokesShared = jokes.filter(j => j.isUserSubmitted && j.author === user.name).length;
  const friendsCount = friends.length;

  const achievements: Achievement[] = [
    {
      id: 'first_post',
      name: 'First Words',
      description: 'Create your first post',
      icon: '📝',
      unlocked: postsCount >= 1,
      progress: Math.min(postsCount, 1),
      total: 1,
    },
    {
      id: 'social_dad',
      name: 'Social Dad',
      description: 'Make 5 friends',
      icon: '🤝',
      unlocked: friendsCount >= 5,
      progress: Math.min(friendsCount, 5),
      total: 5,
    },
    {
      id: 'joke_master',
      name: 'Joke Master',
      description: 'Share 10 dad jokes',
      icon: '🎭',
      unlocked: jokesShared >= 10,
      progress: Math.min(jokesShared, 10),
      total: 10,
    },
    {
      id: 'event_goer',
      name: 'Event Enthusiast',
      description: 'Attend 3 events',
      icon: '🎉',
      unlocked: eventsAttended >= 3,
      progress: Math.min(eventsAttended, 3),
      total: 3,
    },
    {
      id: 'prolific_poster',
      name: 'Prolific Poster',
      description: 'Create 10 posts',
      icon: '✍️',
      unlocked: postsCount >= 10,
      progress: Math.min(postsCount, 10),
      total: 10,
    },
    {
      id: 'popular_dad',
      name: 'Popular Dad',
      description: 'Reach 1000 points',
      icon: '⭐',
      unlocked: user.points >= 1000,
      progress: Math.min(user.points, 1000),
      total: 1000,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>🏅 Achievements</h3>
        <span style={{ color: theme.colors.text.muted, fontSize: '14px' }}>
          {unlockedCount}/{achievements.length} unlocked
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {achievements.map((achievement) => (
          <Card
            key={achievement.id}
            style={{
              opacity: achievement.unlocked ? 1 : 0.5,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  margin: '0 auto 8px',
                  background: achievement.unlocked
                    ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.3), rgba(245, 158, 11, 0.3))'
                    : mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  filter: achievement.unlocked ? 'none' : 'grayscale(100%)',
                }}
              >
                {achievement.icon}
              </div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>
                {achievement.name}
              </h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '11px', color: theme.colors.text.muted }}>
                {achievement.description}
              </p>
              {!achievement.unlocked && achievement.progress !== undefined && (
                <div style={{ marginTop: '8px' }}>
                  <div
                    style={{
                      height: '4px',
                      background: theme.colors.border,
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${(achievement.progress / (achievement.total || 1)) * 100}%`,
                        background: theme.colors.accent.primary,
                        borderRadius: '2px',
                      }}
                    />
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '10px', color: theme.colors.text.muted }}>
                    {achievement.progress}/{achievement.total}
                  </p>
                </div>
              )}
              {achievement.unlocked && (
                <span style={{ color: theme.colors.success, fontSize: '12px', fontWeight: 600 }}>
                  ✓ Unlocked
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
