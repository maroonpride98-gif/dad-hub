import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../common';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';

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

  return (
    <Card hover>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{ fontSize: '40px' }}>{localPoll.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Badge variant="category" category="Support">📊 Poll</Badge>
            <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>{localPoll.time}</span>
          </div>

          <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>
            {localPoll.question}
          </h4>
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
