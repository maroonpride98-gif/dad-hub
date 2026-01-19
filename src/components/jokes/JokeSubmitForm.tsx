import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../common';

interface JokeSubmitFormProps {
  onClose: () => void;
}

export const JokeSubmitForm: React.FC<JokeSubmitFormProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { addJoke, user } = useApp();
  const [joke, setJoke] = useState('');
  const [punchline, setPunchline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!joke.trim() || !punchline.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addJoke({
        joke,
        punchline,
        author: user.name,
        isUserSubmitted: true,
        likes: 0,
      });

      setJoke('');
      setPunchline('');
      onClose();
    } catch (error) {
      console.error('Failed to submit joke:', error);
      alert('Failed to submit joke. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      style={{
        width: '100%',
        maxWidth: '400px',
        border: `1px solid rgba(217, 119, 6, 0.3)`,
      }}
    >
      <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
        ✏️ Submit Your Dad Joke
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              color: theme.colors.text.secondary,
              fontWeight: 600,
            }}
          >
            The Setup
          </label>
          <Input
            placeholder="Why did the dad..."
            value={joke}
            onChange={(e) => setJoke(e.target.value)}
          />
        </div>
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '13px',
              color: theme.colors.text.secondary,
              fontWeight: 600,
            }}
          >
            The Punchline
          </label>
          <Input
            placeholder="Because..."
            value={punchline}
            onChange={(e) => setPunchline(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1 }}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
