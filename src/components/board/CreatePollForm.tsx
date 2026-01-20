import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../common';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { PollCategory, POLL_CATEGORIES } from './PollCard';

interface CreatePollFormProps {
  onClose: () => void;
  onCreated: () => void;
}

type ExpirationOption = '1h' | '24h' | '3d' | '7d' | 'none';

const EXPIRATION_OPTIONS: { value: ExpirationOption; label: string }[] = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '3d', label: '3 Days' },
  { value: '7d', label: '7 Days' },
  { value: 'none', label: 'No Expiration' },
];

export const CreatePollForm: React.FC<CreatePollFormProps> = ({ onClose, onCreated }) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [category, setCategory] = useState<PollCategory>('general');
  const [expiration, setExpiration] = useState<ExpirationOption>('24h');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    setOptions(options.map((opt, i) => i === index ? value : opt));
  };

  const getExpirationDate = (): Date | null => {
    const now = new Date();
    switch (expiration) {
      case '1h':
        return new Date(now.getTime() + 60 * 60 * 1000);
      case '24h':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case '3d':
        return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      case '7d':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    const validOptions = options.filter(opt => opt.trim());
    if (!question.trim() || validOptions.length < 2 || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const expirationDate = getExpirationDate();

      await addDoc(collection(db, 'polls'), {
        question: question.trim(),
        options: validOptions.map((text, i) => ({
          id: `opt_${i}`,
          text: text.trim(),
          votes: 0,
          voterIds: [],
        })),
        authorId: user.uid,
        author: user.name,
        avatar: user.avatar,
        totalVotes: 0,
        category,
        endsAt: expirationDate ? Timestamp.fromDate(expirationDate) : null,
        createdAt: serverTimestamp(),
      });

      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ border: `1px solid rgba(217, 119, 6, 0.3)` }}>
      <h4 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
        📊 Create a Poll
      </h4>

      {/* Category Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
          Category
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {(Object.entries(POLL_CATEGORIES) as [PollCategory, typeof POLL_CATEGORIES[PollCategory]][]).map(
            ([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategory(key)}
                style={{
                  padding: '8px 14px',
                  background: category === key ? `${value.color}20` : theme.colors.background.secondary,
                  border: category === key ? `2px solid ${value.color}` : `1px solid ${theme.colors.border}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: category === key ? value.color : theme.colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: category === key ? 600 : 400,
                }}
              >
                <span>{value.emoji}</span>
                <span>{value.label}</span>
              </button>
            )
          )}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
          Question
        </label>
        <Input
          placeholder="What do you want to ask?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
          Options
        </label>
        {options.map((option, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <Input
              placeholder={`Option ${i + 1}`}
              value={option}
              onChange={(e) => updateOption(i, e.target.value)}
              style={{ flex: 1 }}
            />
            {options.length > 2 && (
              <button
                onClick={() => removeOption(i)}
                style={{
                  padding: '0 12px',
                  background: 'none',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '8px',
                  color: theme.colors.error,
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {options.length < 6 && (
          <button
            onClick={addOption}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: `1px dashed ${theme.colors.border}`,
              borderRadius: '8px',
              color: theme.colors.text.muted,
              cursor: 'pointer',
              width: '100%',
              marginTop: '4px',
            }}
          >
            + Add Option
          </button>
        )}
      </div>

      {/* Expiration Selection */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
          Poll Duration
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EXPIRATION_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setExpiration(value)}
              style={{
                padding: '8px 14px',
                background: expiration === value ? `${theme.colors.accent.primary}20` : theme.colors.background.secondary,
                border: expiration === value ? `2px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                color: expiration === value ? theme.colors.accent.primary : theme.colors.text.secondary,
                fontSize: '13px',
                fontWeight: expiration === value ? 600 : 400,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1 }}>
          {isSubmitting ? 'Creating...' : 'Create Poll'}
        </Button>
      </div>
    </Card>
  );
};
