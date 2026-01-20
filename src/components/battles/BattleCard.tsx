import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { JokeBattle, JokeBattleParticipant } from '../../types/battle';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface BattleCardProps {
  battle: JokeBattle;
  onVote?: () => void;
}

export const BattleCard: React.FC<BattleCardProps> = ({ battle, onVote }) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [isVoting, setIsVoting] = useState(false);
  const [localBattle, setLocalBattle] = useState(battle);

  const hasVoted =
    localBattle.participant1.voterIds.includes(user.uid) ||
    localBattle.participant2.voterIds.includes(user.uid);

  const userVotedFor =
    localBattle.participant1.voterIds.includes(user.uid)
      ? 'participant1'
      : localBattle.participant2.voterIds.includes(user.uid)
      ? 'participant2'
      : null;

  const isCompleted = localBattle.status === 'completed';
  const isVotingPhase = localBattle.status === 'voting' || localBattle.status === 'active';

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(localBattle.endsAt);
    if (end < now) return 'Ended';

    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) return `${Math.floor(hours / 24)}d left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const handleVote = async (participantKey: 'participant1' | 'participant2') => {
    if (hasVoted || isVoting || !isVotingPhase) return;

    setIsVoting(true);
    haptics.light();

    try {
      const battleRef = doc(db, 'jokeBattles', battle.id);

      // Update locally first
      setLocalBattle((prev) => ({
        ...prev,
        totalVotes: prev.totalVotes + 1,
        [participantKey]: {
          ...prev[participantKey],
          votes: prev[participantKey].votes + 1,
          voterIds: [...prev[participantKey].voterIds, user.uid],
        },
      }));

      // Update in Firestore
      await updateDoc(battleRef, {
        totalVotes: increment(1),
        [`${participantKey}.votes`]: increment(1),
        [`${participantKey}.voterIds`]: arrayUnion(user.uid),
      });

      haptics.success();
      onVote?.();
    } catch (error) {
      console.error('Error voting:', error);
      setLocalBattle(battle);
    } finally {
      setIsVoting(false);
    }
  };

  const getVotePercentage = (participant: JokeBattleParticipant) => {
    if (localBattle.totalVotes === 0) return 50;
    return Math.round((participant.votes / localBattle.totalVotes) * 100);
  };

  const renderParticipant = (
    participant: JokeBattleParticipant,
    participantKey: 'participant1' | 'participant2',
    isWinner?: boolean
  ) => {
    const isUserVote = userVotedFor === participantKey;
    const percentage = getVotePercentage(participant);

    return (
      <div
        style={{
          flex: 1,
          padding: '16px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Vote progress background */}
        {(hasVoted || isCompleted) && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${percentage}%`,
              background: isUserVote
                ? 'rgba(217, 119, 6, 0.2)'
                : 'rgba(255, 255, 255, 0.05)',
              transition: 'width 0.5s ease',
            }}
          />
        )}

        <div style={{ position: 'relative' }}>
          {/* User info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '32px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: theme.colors.background.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isWinner ? '3px solid #ffd700' : 'none',
              }}
            >
              {participant.userAvatar}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: 600,
                  fontSize: '14px',
                  color: theme.colors.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {participant.userName}
                {isWinner && <span style={{ fontSize: '16px' }}>👑</span>}
              </p>
              {(hasVoted || isCompleted) && (
                <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                  {participant.votes} vote{participant.votes !== 1 ? 's' : ''} • {percentage}%
                </p>
              )}
            </div>
          </div>

          {/* Joke */}
          <div
            style={{
              padding: '14px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
              marginBottom: '12px',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: theme.colors.text.primary,
                lineHeight: 1.5,
              }}
            >
              "{participant.joke}"
            </p>
          </div>

          {/* Vote button */}
          {isVotingPhase && !hasVoted && (
            <button
              onClick={() => handleVote(participantKey)}
              disabled={isVoting}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              😂 Vote for this joke
            </button>
          )}

          {isUserVote && (
            <div
              style={{
                textAlign: 'center',
                padding: '10px',
                background: `${theme.colors.accent.primary}20`,
                borderRadius: '10px',
              }}
            >
              <span style={{ fontSize: '13px', color: theme.colors.accent.primary, fontWeight: 600 }}>
                ✓ Your vote
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const winner =
    isCompleted && localBattle.winnerId
      ? localBattle.winnerId === localBattle.participant1.userId
        ? 'participant1'
        : 'participant2'
      : null;

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          background: localBattle.isFeatured
            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
            : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>⚔️</span>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#fff', fontSize: '15px' }}>
              {localBattle.title || 'Joke Battle'}
            </p>
            {localBattle.theme && (
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                Theme: {localBattle.theme}
              </p>
            )}
          </div>
        </div>

        <div
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
            {isCompleted ? '🏆 Complete' : `⏱️ ${getTimeRemaining()}`}
          </span>
        </div>
      </div>

      {/* Battle Area */}
      <div style={{ display: 'flex' }}>
        {renderParticipant(localBattle.participant1, 'participant1', winner === 'participant1')}

        {/* VS Divider */}
        <div
          style={{
            width: '60px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.colors.background.secondary,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 800,
              fontSize: '14px',
            }}
          >
            VS
          </div>
        </div>

        {renderParticipant(localBattle.participant2, 'participant2', winner === 'participant2')}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
          {localBattle.totalVotes} total vote{localBattle.totalVotes !== 1 ? 's' : ''}
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: theme.colors.accent.primary,
          }}
        >
          🎁 +{localBattle.xpReward} XP for winner
        </span>
      </div>
    </div>
  );
};

export default BattleCard;
