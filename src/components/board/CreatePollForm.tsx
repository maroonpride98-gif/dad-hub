import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../common';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface CreatePollFormProps {
  onClose: () => void;
  onCreated: () => void;
}

export const CreatePollForm: React.FC<CreatePollFormProps> = ({ onClose, onCreated }) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
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

  const handleSubmit = async () => {
    const validOptions = options.filter(opt => opt.trim());
    if (!question.trim() || validOptions.length < 2 || isSubmitting) return;

    setIsSubmitting(true);
    try {
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
