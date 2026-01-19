import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common';
import { Challenge } from '../../types';
import { ChallengeDetailModal } from './ChallengeDetailModal';

interface ChallengeCardProps {
  challenge: Challenge;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  const { theme } = useTheme();
  const [showDetail, setShowDetail] = useState(false);

  const getTypeEmoji = () => {
    switch (challenge.type) {
      case 'photo': return '📸';
      case 'activity': return '🎯';
      case 'poll': return '📊';
      case 'streak': return '🔥';
      default: return '🏆';
    }
  };

  const getStatusColor = () => {
    switch (challenge.status) {
      case 'active': return '#22c55e';
      case 'upcoming': return '#3b82f6';
      case 'completed': return '#78716c';
      default: return theme.colors.text.muted;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeRemaining = () => {
    const end = new Date(challenge.endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <>
      <Card hover onClick={() => setShowDetail(true)} style={{ cursor: 'pointer' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: `linear-gradient(135deg, ${getStatusColor()}44, ${getStatusColor()}22)`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
          }}>
            {getTypeEmoji()}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                background: `${getStatusColor()}22`,
                color: getStatusColor(),
                textTransform: 'uppercase',
              }}>
                {challenge.status}
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 700,
                background: theme.colors.accent.gradient,
                color: '#fff',
              }}>
                {challenge.points} pts
              </span>
            </div>

            <h3 style={{ margin: '8px 0 4px 0', fontSize: '17px', fontWeight: 700 }}>
              {challenge.title}
            </h3>
            <p style={{
              margin: '0 0 8px 0',
              color: theme.colors.text.muted,
              fontSize: '13px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {challenge.description}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
                {challenge.status === 'active'
                  ? getTimeRemaining()
                  : `${formatDate(challenge.startDate)} - ${formatDate(challenge.endDate)}`}
              </span>
              <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
                👥 {challenge.participantCount || 0} participants
              </span>
            </div>
          </div>
        </div>
      </Card>

      {showDetail && (
        <ChallengeDetailModal
          challenge={challenge}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};
