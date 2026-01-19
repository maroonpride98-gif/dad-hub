import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common';
import { DadJokeTrivia } from './DadJokeTrivia';
import { WordScramble } from './WordScramble';
import { MemoryMatch } from './MemoryMatch';

type GameType = 'trivia' | 'scramble' | 'memory' | null;

export const GamesPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeGame, setActiveGame] = useState<GameType>(null);

  const games = [
    {
      id: 'trivia' as GameType,
      name: 'Dad Joke Trivia',
      description: 'Guess the punchline to dad jokes!',
      emoji: '🎯',
      color: '#ef4444',
    },
    {
      id: 'scramble' as GameType,
      name: 'Word Scramble',
      description: 'Unscramble dad-related words',
      emoji: '🔤',
      color: '#3b82f6',
    },
    {
      id: 'memory' as GameType,
      name: 'Memory Match',
      description: 'Match the dad emoji pairs',
      emoji: '🧠',
      color: '#8b5cf6',
    },
  ];

  if (activeGame === 'trivia') {
    return <DadJokeTrivia onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'scramble') {
    return <WordScramble onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'memory') {
    return <MemoryMatch onBack={() => setActiveGame(null)} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Mini Games</h2>
        <p style={{ margin: '4px 0 0 0', color: theme.colors.text.muted, fontSize: '14px' }}>
          Take a break and earn bonus points!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {games.map((game) => (
          <Card
            key={game.id}
            hover
            onClick={() => setActiveGame(game.id)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${game.color}, ${game.color}88)`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                margin: '0 auto 16px',
              }}>
                {game.emoji}
              </div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700 }}>{game.name}</h3>
              <p style={{ margin: 0, color: theme.colors.text.muted }}>{game.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Leaderboard Preview */}
      <Card>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
          Top Players This Week
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { rank: 1, name: 'Coming Soon', score: '---', emoji: '🥇' },
            { rank: 2, name: 'Play games', score: '---', emoji: '🥈' },
            { rank: 3, name: 'to rank up!', score: '---', emoji: '🥉' },
          ].map((player) => (
            <div
              key={player.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: theme.colors.cardHover,
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '24px' }}>{player.emoji}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>{player.name}</span>
              <span style={{ color: theme.colors.accent.secondary, fontWeight: 700 }}>{player.score}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
