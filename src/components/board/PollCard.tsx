import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../common';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';

export type PollCategory = 'parenting' | 'gear' | 'activities' | 'food' | 'opinions' | 'general';

export const POLL_CATEGORIES: Record<PollCategory, { label: string; emoji: string; color: string }> = {
  parenting: { label: 'Parenting', emoji: '👶', color: '#3b82f6' },
  gear: { label: 'Dad Gear', emoji: '🎒', color: '#22c55e' },
  activities: { label: 'Activities', emoji: '🏃', color: '#f59e0b' },
  food: { label: 'Food & BBQ', emoji: '🍔', color: '#ef4444' },
  opinions: { label: 'Hot Takes', emoji: '🔥', color: '#8b5cf6' },
  general: { label: 'General', emoji: '💬', color: '#6b7280' },
};

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  authorId: string;
  author: string;
  avatar: string;
  totalVotes: number;
  time: string;
  endsAt?: Date;
  category?: PollCategory;
  imageUrl?: string;
  isHot?: boolean;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voterIds: string[];
}

interface PollCardProps {
  poll: Poll;
}

export const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const { theme, mode } = useTheme();
  const { user } = useApp();
  const [isVoting, setIsVoting] = useState(false);
  const [localPoll, setLocalPoll] = useState(poll);

  const userVotedOption = localPoll.options.find(opt => opt.voterIds?.includes(user.uid));
  const hasVoted = !!userVotedOption;

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;

    setIsVoting(true);
    try {
      const pollRef = doc(db, 'polls', poll.id);

      // Find the option index
      const optionIndex = localPoll.options.findIndex(o => o.id === optionId);

      // Update locally first for instant feedback
      setLocalPoll(prev => ({
        ...prev,
        totalVotes: prev.totalVotes + 1,
        options: prev.options.map((opt, i) =>
          i === optionIndex
            ? { ...opt, votes: opt.votes + 1, voterIds: [...(opt.voterIds || []), user.uid] }
            : opt
        ),
      }));

      // Update in Firestore
      await updateDoc(pollRef, {
        totalVotes: increment(1),
        [`options.${optionIndex}.votes`]: increment(1),
        [`options.${optionIndex}.voterIds`]: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error('Error voting:', error);
      // Revert on error
      setLocalPoll(poll);
    } finally {
      setIsVoting(false);
    }
  };

  const categoryInfo = localPoll.category ? POLL_CATEGORIES[localPoll.category] : null;
  const isExpired = localPoll.endsAt && new Date(localPoll.endsAt) < new Date();
  const isHotPoll = localPoll.isHot || localPoll.totalVotes >= 10;

  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!localPoll.endsAt) return null;
    const end = new Date(localPoll.endsAt);
    const now = new Date();
    if (end < now) return 'Ended';
    const hours = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h left`;
    const days = Math.floor(hours / 24);
    return `${days}d left`;
  };

  const timeRemaining = getTimeRemaining();

  return (
    <Card hover>
      {/* Hot Poll Banner */}
      {isHotPoll && !isExpired && (
        <div
          style={{
            background: 'linear-gradient(90deg, #ef4444, #f97316)',
            padding: '6px 12px',
            marginBottom: '12px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{ fontSize: '14px' }}>🔥</span>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>Hot Poll</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginLeft: 'auto' }}>
            Trending in the community
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ fontSize: '40px' }}>{localPoll.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {categoryInfo ? (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  background: `${categoryInfo.color}20`,
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: categoryInfo.color,
                }}
              >
                {categoryInfo.emoji} {categoryInfo.label}
              </span>
            ) : (
              <Badge variant="category" category="Support">📊 Poll</Badge>
            )}
            <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>{localPoll.time}</span>
            {timeRemaining && (
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  background: isExpired ? theme.colors.background.secondary : `${theme.colors.accent.primary}20`,
                  borderRadius: '8px',
                  color: isExpired ? theme.colors.text.muted : theme.colors.accent.primary,
                }}
              >
                {timeRemaining}
              </span>
            )}
          </div>

          <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>
            {localPoll.question}
          </h4>

          {/* Poll Image */}
          {localPoll.imageUrl && (
            <div
              style={{
                width: '100%',
                height: '160px',
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '12px',
                background: theme.colors.background.secondary,
              }}
            >
              <img
                src={localPoll.imageUrl}
                alt="Poll image"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <p style={{ margin: '0 0 16px 0', color: theme.colors.text.muted, fontSize: '13px' }}>
            by {localPoll.author} • {localPoll.totalVotes} vote{localPoll.totalVotes !== 1 ? 's' : ''}
          </p>

          {/* Poll Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {localPoll.options.map((option) => {
              const percentage = localPoll.totalVotes > 0
                ? Math.round((option.votes / localPoll.totalVotes) * 100)
                : 0;
              const isSelected = option.voterIds?.includes(user.uid);

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || isVoting}
                  style={{
                    position: 'relative',
                    padding: '14px 16px',
                    background: mode === 'dark' ? 'rgba(28, 25, 23, 0.6)' : 'rgba(231, 229, 228, 0.6)',
                    border: isSelected ? `2px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    cursor: hasVoted ? 'default' : 'pointer',
                    textAlign: 'left',
                    overflow: 'hidden',
                    color: theme.colors.text.primary,
                  }}
                >
                  {/* Progress bar */}
                  {hasVoted && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        width: `${percentage}%`,
                        background: isSelected
                          ? 'rgba(217, 119, 6, 0.3)'
                          : mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                        transition: 'width 0.5s ease',
                        borderRadius: '10px',
                      }}
                    />
                  )}

                  <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: isSelected ? 700 : 500 }}>
                      {isSelected && '✓ '}{option.text}
                    </span>
                    {hasVoted && (
                      <span style={{ fontWeight: 700, color: theme.colors.accent.secondary }}>
                        {percentage}%
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
