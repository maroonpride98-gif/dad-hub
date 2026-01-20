import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { BATTLE_THEMES, BATTLE_XP_REWARDS } from '../../types/battle';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface CreateBattleModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export const CreateBattleModal: React.FC<CreateBattleModalProps> = ({ onClose, onCreated }) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [joke, setJoke] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<string>('random');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!joke.trim() || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      // Create a pending battle (waiting for opponent)
      const now = new Date();
      const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

      await addDoc(collection(db, 'jokeBattles'), {
        title: 'Open Challenge',
        theme: BATTLE_THEMES.find((t) => t.id === selectedTheme)?.label || 'Anything Goes',
        participant1: {
          userId: user.uid,
          userName: user.name,
          userAvatar: user.avatar,
          joke: joke.trim(),
          votes: 0,
          voterIds: [],
          submittedAt: serverTimestamp(),
        },
        participant2: null, // Waiting for opponent
        status: 'pending',
        totalVotes: 0,
        startsAt: serverTimestamp(),
        endsAt: Timestamp.fromDate(endsAt),
        createdAt: serverTimestamp(),
        xpReward: BATTLE_XP_REWARDS.win,
        isFeatured: false,
      });

      haptics.success();
      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating battle:', error);
      alert('Failed to create battle. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.background.primary,
          borderRadius: '20px',
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            borderRadius: '20px 20px 0 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                ⚔️ Start a Battle
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
                Challenge the community with your best joke!
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Theme Selection */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Choose a Theme
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {BATTLE_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTheme(t.id)}
                  style={{
                    padding: '8px 14px',
                    background:
                      selectedTheme === t.id
                        ? `${theme.colors.accent.primary}20`
                        : theme.colors.background.secondary,
                    border:
                      selectedTheme === t.id
                        ? `2px solid ${theme.colors.accent.primary}`
                        : `1px solid ${theme.colors.border}`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color:
                      selectedTheme === t.id
                        ? theme.colors.accent.primary
                        : theme.colors.text.secondary,
                    fontSize: '13px',
                    fontWeight: selectedTheme === t.id ? 600 : 400,
                  }}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Joke Input */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Your Joke *
            </label>
            <textarea
              value={joke}
              onChange={(e) => setJoke(e.target.value)}
              placeholder="What's your best dad joke? Make it count!"
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '14px',
                background: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '12px',
                color: theme.colors.text.primary,
                fontSize: '15px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: theme.colors.text.muted }}>
              {joke.length}/500 characters
            </p>
          </div>

          {/* Tips */}
          <div
            style={{
              padding: '14px',
              background: `${theme.colors.accent.primary}10`,
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '13px',
                color: theme.colors.text.secondary,
                lineHeight: 1.6,
              }}
            >
              💡 <strong>Pro tip:</strong> The best dad jokes have a setup and a groan-worthy
              punchline. Keep it family-friendly and remember - the worse the pun, the better!
            </p>
          </div>

          {/* Rewards Info */}
          <div
            style={{
              padding: '14px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
              🎁 Battle Rewards
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '13px' }}>
              <span style={{ color: theme.colors.text.secondary }}>
                🏆 Win: <strong style={{ color: '#22c55e' }}>+{BATTLE_XP_REWARDS.win} XP</strong>
              </span>
              <span style={{ color: theme.colors.text.secondary }}>
                🎯 Participate: <strong style={{ color: theme.colors.accent.primary }}>+{BATTLE_XP_REWARDS.participation} XP</strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: 'transparent',
                color: theme.colors.text.primary,
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!joke.trim() || isSubmitting}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: !joke.trim()
                  ? theme.colors.background.secondary
                  : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                color: !joke.trim() ? theme.colors.text.muted : '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: !joke.trim() ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Creating...' : '⚔️ Start Battle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBattleModal;
