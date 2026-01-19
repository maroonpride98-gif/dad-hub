import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../common';
import { DadHackCategory } from '../../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const CATEGORIES: DadHackCategory[] = ['Parenting', 'Home', 'Car', 'Tech', 'Money', 'Health', 'Travel', 'Life'];

interface AddHackModalProps {
  onClose: () => void;
}

export const AddHackModal: React.FC<AddHackModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<DadHackCategory>('Life');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'dadHacks'), {
        title: title.trim(),
        description: description.trim(),
        category,
        authorId: user.uid,
        author: user.name,
        avatar: user.avatar,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (error) {
      console.error('Error adding hack:', error);
      alert('Failed to share hack. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryEmoji = (cat: DadHackCategory): string => {
    const emojis: Record<DadHackCategory, string> = {
      'Parenting': '👶',
      'Home': '🏠',
      'Car': '🚗',
      'Tech': '💻',
      'Money': '💰',
      'Health': '💪',
      'Travel': '✈️',
      'Life': '🌟',
    };
    return emojis[cat];
  };

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

        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>Share a Dad Hack</h2>
        <p style={{ margin: '0 0 24px 0', color: theme.colors.text.muted }}>
          What life hack have you discovered that other dads need to know?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: category === cat ? `2px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border}`,
                    background: category === cat ? `${theme.colors.accent.primary}22` : 'transparent',
                    color: theme.colors.text.primary,
                    cursor: 'pointer',
                    fontWeight: category === cat ? 600 : 400,
                  }}
                >
                  {getCategoryEmoji(cat)} {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title</label>
            <Input
              placeholder="E.g., The 5-minute bedtime trick that always works"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
            <textarea
              placeholder="Share the details of your hack. Be specific so other dads can try it!"
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
                minHeight: '120px',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? 'Sharing...' : 'Share Hack'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
