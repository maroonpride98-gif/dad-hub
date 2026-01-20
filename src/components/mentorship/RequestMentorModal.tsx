import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Mentor, MentorExpertise, EXPERTISE_INFO } from '../../types/mentorship';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface RequestMentorModalProps {
  mentor: Mentor;
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestMentorModal: React.FC<RequestMentorModalProps> = ({
  mentor,
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [message, setMessage] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<MentorExpertise[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleExpertise = (exp: MentorExpertise) => {
    setSelectedExpertise((prev) =>
      prev.includes(exp) ? prev.filter((e) => e !== exp) : [...prev, exp]
    );
  };

  const handleSubmit = async () => {
    if (!message.trim() || selectedExpertise.length === 0 || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      await addDoc(collection(db, 'mentorshipRequests'), {
        menteeId: user.uid,
        menteeName: user.name,
        menteeAvatar: user.avatar,
        mentorId: mentor.userId,
        message: message.trim(),
        expertiseNeeded: selectedExpertise,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      haptics.success();
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting mentorship request:', error);
      alert('Failed to submit request. Please try again.');
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
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: 'none',
              background: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>Request Mentorship</h3>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Mentor Preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                fontSize: '40px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: theme.colors.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mentor.avatar}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>
                {mentor.name}
              </p>
              <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
                {mentor.yearsAsDad} years as a dad • {mentor.kidsCount} kid{mentor.kidsCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Expertise Selection */}
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
              What areas do you need help with? *
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {mentor.expertise.map((exp) => {
                const info = EXPERTISE_INFO[exp];
                const isSelected = selectedExpertise.includes(exp);
                return (
                  <button
                    key={exp}
                    type="button"
                    onClick={() => toggleExpertise(exp)}
                    style={{
                      padding: '8px 14px',
                      background: isSelected ? `${theme.colors.accent.primary}20` : theme.colors.background.secondary,
                      border: isSelected
                        ? `2px solid ${theme.colors.accent.primary}`
                        : `1px solid ${theme.colors.border}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: isSelected ? theme.colors.accent.primary : theme.colors.text.secondary,
                      fontSize: '13px',
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  >
                    <span>{info.emoji}</span>
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
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
              Introduce yourself *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the mentor a bit about yourself and why you'd like their guidance..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '14px',
                background: theme.colors.background.secondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '12px',
                color: theme.colors.text.primary,
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: theme.colors.text.muted }}>
              {message.length}/500 characters
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
              💡 <strong>Tips:</strong> Share your situation, what challenges you're facing, and what you hope to learn. Mentors appreciate genuine requests!
            </p>
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
              disabled={!message.trim() || selectedExpertise.length === 0 || isSubmitting}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background:
                  !message.trim() || selectedExpertise.length === 0
                    ? theme.colors.background.secondary
                    : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color:
                  !message.trim() || selectedExpertise.length === 0
                    ? theme.colors.text.muted
                    : '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor:
                  !message.trim() || selectedExpertise.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMentorModal;
