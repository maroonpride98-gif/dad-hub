import React from 'react';
import { DadJoke } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common';

interface JokeCardProps {
  joke: DadJoke;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke }) => {
  const { theme } = useTheme();

  return (
    <Card
      variant="accent"
      padding="large"
      style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-30px',
          left: '-30px',
          fontSize: '100px',
          opacity: 0.1,
        }}
      >
        😄
      </div>
      <p
        style={{
          fontSize: '22px',
          fontWeight: 600,
          margin: '0 0 24px 0',
          lineHeight: 1.4,
          position: 'relative',
        }}
      >
        {joke.joke}
      </p>
      <p
        style={{
          fontSize: '24px',
          fontWeight: 800,
          margin: 0,
          color: theme.colors.accent.secondary,
          fontStyle: 'italic',
        }}
      >
        {joke.punchline}
      </p>
      {joke.isUserSubmitted && (
        <p
          style={{
            fontSize: '12px',
            color: theme.colors.text.muted,
            marginTop: '16px',
          }}
        >
          Submitted by {joke.author || 'a fellow dad'}
        </p>
      )}
    </Card>
  );
};
