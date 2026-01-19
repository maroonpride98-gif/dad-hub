import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Button, Input } from '../common';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_OPTIONS = ['👨', '👨‍🦰', '👨‍🦱', '👨‍🦲', '👨‍🦳', '🧔', '🧔‍♂️', '👴', '🤵', '👷', '👨‍🍳', '👨‍🔧', '👨‍💻', '👨‍🏫', '🦸‍♂️', '🧙‍♂️'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode } = useTheme();
  const { updateProfile } = useAuth();
  const { user } = useApp();

  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [dadSince, setDadSince] = useState(user.dadSince);
  const [kids, setKids] = useState(user.kids.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: name.trim(),
        avatar,
        dadSince,
        kids: parseInt(kids) || 1,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '450px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: mode === 'dark' ? '#292524' : '#fafaf9',
          borderRadius: '20px',
          boxShadow: theme.shadows.large,
          border: `1px solid ${theme.colors.border}`,
          zIndex: 201,
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>Edit Profile</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.text.muted,
            }}
          >
            ×
          </button>
        </div>

        {/* Avatar Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
            Choose Your Avatar
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => setAvatar(emoji)}
                style={{
                  width: '48px',
                  height: '48px',
                  fontSize: '28px',
                  background: avatar === emoji ? 'rgba(217, 119, 6, 0.3)' : theme.colors.card,
                  border: avatar === emoji ? '2px solid #d97706' : `1px solid ${theme.colors.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
            Display Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        {/* Dad Since */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
            Dad Since (Year)
          </label>
          <Input
            value={dadSince}
            onChange={(e) => setDadSince(e.target.value)}
            placeholder="e.g., 2020"
          />
        </div>

        {/* Number of Kids */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px' }}>
            Number of Kids
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setKids(num.toString())}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  background: kids === num.toString() ? 'rgba(217, 119, 6, 0.3)' : theme.colors.card,
                  border: kids === num.toString() ? '2px solid #d97706' : `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: theme.colors.text.primary,
                }}
              >
                {num}{num === 5 ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="secondary" onClick={onClose} style={{ flex: 1 }} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} style={{ flex: 1 }} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </>
  );
};
