import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../common';
import { ChallengeType } from '../../types';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface CreateChallengeModalProps {
  onClose: () => void;
}

export const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ChallengeType>('photo');
  const [points, setPoints] = useState('50');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challengeTypes: { type: ChallengeType; label: string; emoji: string; desc: string }[] = [
    { type: 'photo', label: 'Photo Challenge', emoji: '📸', desc: 'Submit a photo' },
    { type: 'activity', label: 'Activity', emoji: '🎯', desc: 'Complete an activity' },
    { type: 'poll', label: 'Poll', emoji: '📊', desc: 'Vote-based challenge' },
    { type: 'streak', label: 'Streak', emoji: '🔥', desc: 'Daily streak challenge' },
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !startDate || !endDate || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'challenges'), {
        title: title.trim(),
        description: description.trim(),
        type,
        points: parseInt(points) || 50,
        startDate: Timestamp.fromDate(new Date(startDate)),
        endDate: Timestamp.fromDate(new Date(endDate)),
        participantCount: 0,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (error) {
      console.error('Error creating challenge:', error);
      alert('Failed to create challenge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default dates (next 7 days)
  React.useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(nextWeek.toISOString().split('T')[0]);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '20px',
    }}>
      <Card style={{
        maxWidth: '500px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.colors.text.muted,
          }}
        >
          ×
        </button>

        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px' }}>Create Weekly Challenge</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Challenge Type */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Challenge Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {challengeTypes.map((ct) => (
                <button
                  key={ct.type}
                  onClick={() => setType(ct.type)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    border: type === ct.type ? `2px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border}`,
                    background: type === ct.type ? `${theme.colors.accent.primary}22` : 'transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{ct.emoji}</span>
                  <p style={{ margin: '8px 0 4px 0', fontWeight: 600, color: theme.colors.text.primary }}>{ct.label}</p>
                  <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>{ct.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title</label>
            <Input
              placeholder="E.g., Best BBQ Photo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
            <textarea
              placeholder="Describe the challenge rules..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.card,
                color: theme.colors.text.primary,
                fontSize: '15px',
                resize: 'vertical',
                minHeight: '100px',
              }}
            />
          </div>

          {/* Points */}
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Points Reward</label>
            <select
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.card,
                color: theme.colors.text.primary,
                fontSize: '15px',
              }}
            >
              <option value="25">25 points</option>
              <option value="50">50 points</option>
              <option value="100">100 points</option>
              <option value="150">150 points</option>
              <option value="200">200 points</option>
            </select>
          </div>

          {/* Dates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.card,
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.card,
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? 'Creating...' : 'Create Challenge'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
