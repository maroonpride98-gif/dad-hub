import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Mentor, EXPERTISE_INFO, MentorExpertise } from '../../types/mentorship';

interface MentorCardProps {
  mentor: Mentor;
  onRequestMentorship: (mentor: Mentor) => void;
  isRequesting?: boolean;
}

export const MentorCard: React.FC<MentorCardProps> = ({
  mentor,
  onRequestMentorship,
  isRequesting = false,
}) => {
  const { theme } = useTheme();

  const spotsLeft = mentor.maxMentees - mentor.matchedMentees.length;
  const isFull = spotsLeft <= 0;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#f59e0b' }}>★</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i} style={{ color: '#f59e0b' }}>☆</span>);
      } else {
        stars.push(<span key={i} style={{ color: theme.colors.text.muted }}>☆</span>);
      }
    }
    return stars;
  };

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '16px',
        padding: '20px',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
        <div
          style={{
            fontSize: '48px',
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: theme.colors.background.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {mentor.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
              {mentor.name}
            </h3>
            {mentor.isAvailable && !isFull && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#22c55e',
                }}
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div style={{ fontSize: '14px' }}>{renderStars(mentor.rating)}</div>
            <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
              ({mentor.reviewCount} review{mentor.reviewCount !== 1 ? 's' : ''})
            </span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: theme.colors.text.secondary }}>
            <span>👶 {mentor.kidsCount} kid{mentor.kidsCount !== 1 ? 's' : ''}</span>
            <span>📅 {mentor.yearsAsDad} year{mentor.yearsAsDad !== 1 ? 's' : ''} as dad</span>
          </div>
        </div>
      </div>

      {/* Bio */}
      {mentor.bio && (
        <p
          style={{
            margin: '0 0 16px 0',
            fontSize: '14px',
            color: theme.colors.text.secondary,
            lineHeight: 1.5,
          }}
        >
          {mentor.bio}
        </p>
      )}

      {/* Expertise Tags */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 600, color: theme.colors.text.muted }}>
          EXPERTISE
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {mentor.expertise.map((exp) => {
            const info = EXPERTISE_INFO[exp as MentorExpertise];
            return (
              <span
                key={exp}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  background: `${theme.colors.accent.primary}15`,
                  borderRadius: '20px',
                  fontSize: '13px',
                  color: theme.colors.accent.primary,
                }}
              >
                {info?.emoji} {info?.label || exp}
              </span>
            );
          })}
        </div>
      </div>

      {/* Availability & Action */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <div>
          {isFull ? (
            <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
              Currently at capacity
            </span>
          ) : (
            <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
              {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} available
            </span>
          )}
        </div>

        <button
          onClick={() => onRequestMentorship(mentor)}
          disabled={!mentor.isAvailable || isFull || isRequesting}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            border: 'none',
            background:
              !mentor.isAvailable || isFull
                ? theme.colors.background.secondary
                : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
            color: !mentor.isAvailable || isFull ? theme.colors.text.muted : '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: !mentor.isAvailable || isFull ? 'not-allowed' : 'pointer',
          }}
        >
          {isRequesting ? 'Requesting...' : 'Request Mentorship'}
        </button>
      </div>
    </div>
  );
};

export default MentorCard;
