import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export const TopJokeTellers: React.FC = () => {
  const { theme } = useTheme();
  const { user, jokes } = useApp();

  // Count user-submitted jokes
  const userJokeCount = jokes.filter(j => j.isUserSubmitted && j.author === user.name).length;

  // Create leaderboard with current user
  const leaderboard = [
    { name: user.name, emoji: user.avatar, jokes: userJokeCount, isYou: true },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '400px' }}>
      <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700 }}>
        🏆 Top Joke Tellers
      </h4>
      {leaderboard.map((teller, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: teller.isYou ? 'rgba(217, 119, 6, 0.15)' : theme.colors.card,
            borderRadius: '12px',
            marginBottom: '8px',
          }}
        >
          <span style={{ fontSize: '28px' }}>{teller.emoji}</span>
          <span style={{ flex: 1, fontWeight: 600 }}>
            {teller.name} {teller.isYou && '(You)'}
          </span>
          <span style={{ color: theme.colors.accent.secondary, fontWeight: 700 }}>
            {teller.jokes} joke{teller.jokes !== 1 ? 's' : ''}
          </span>
        </div>
      ))}
      <p style={{
        margin: '12px 0 0 0',
        color: theme.colors.text.muted,
        fontSize: '13px',
        textAlign: 'center'
      }}>
        Submit jokes to climb the leaderboard!
      </p>
    </div>
  );
};
