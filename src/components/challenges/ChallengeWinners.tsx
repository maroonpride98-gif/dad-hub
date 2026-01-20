import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ShareButton } from '../common/ShareButton';

interface Winner {
  rank: number;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  votes: number;
  xpAwarded: number;
}

interface ChallengeWinnersProps {
  challengeId: string;
  challengeTitle: string;
  winners: Winner[];
  onClose: () => void;
}

export const ChallengeWinners: React.FC<ChallengeWinnersProps> = ({
  challengeTitle,
  winners,
  onClose,
}) => {
  const { theme } = useTheme();

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getBackgroundGradient = (rank: number) => {
    switch (rank) {
      case 1: return 'linear-gradient(135deg, #ffd700, #ffb800)';
      case 2: return 'linear-gradient(135deg, #c0c0c0, #a0a0a0)';
      case 3: return 'linear-gradient(135deg, #cd7f32, #b5651d)';
      default: return `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.background.primary,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
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
          ←
        </button>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Challenge Winners</h3>
          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
            {challengeTitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Trophy Banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}20, ${theme.colors.accent.secondary}20)`,
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🏆</div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 700, color: theme.colors.text.primary }}>
            Congratulations!
          </h2>
          <p style={{ margin: 0, color: theme.colors.text.secondary }}>
            The community has voted. Here are the winners!
          </p>
        </div>

        {/* Winners List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {winners.map((winner) => (
            <div
              key={winner.userId}
              style={{
                background: theme.colors.card,
                borderRadius: '16px',
                overflow: 'hidden',
                border: winner.rank <= 3 ? '2px solid transparent' : `1px solid ${theme.colors.border}`,
                borderImage: winner.rank <= 3 ? getBackgroundGradient(winner.rank) + ' 1' : 'none',
              }}
            >
              {/* Rank Header */}
              <div
                style={{
                  background: getBackgroundGradient(winner.rank),
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{getMedalEmoji(winner.rank)}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#fff' }}>
                    {winner.rank === 1 ? '1st Place' : winner.rank === 2 ? '2nd Place' : winner.rank === 3 ? '3rd Place' : `${winner.rank}th Place`}
                  </span>
                </div>
                <div
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    +{winner.xpAwarded} XP
                  </span>
                </div>
              </div>

              {/* Winner Info */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '36px',
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {winner.userAvatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
                      {winner.userName}
                    </p>
                    <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.muted }}>
                      {winner.votes} vote{winner.votes !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Winning Entry */}
                <div
                  style={{
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    borderRadius: '12px',
                    marginBottom: '12px',
                  }}
                >
                  <p style={{ margin: 0, color: theme.colors.text.secondary, fontStyle: 'italic' }}>
                    "{winner.content}"
                  </p>
                </div>

                {/* Share Button */}
                <ShareButton
                  data={{
                    title: `${winner.userName} won ${winner.rank === 1 ? '1st' : winner.rank === 2 ? '2nd' : '3rd'} place!`,
                    text: `${winner.userName} won ${winner.rank === 1 ? '1st' : winner.rank === 2 ? '2nd' : '3rd'} place in the "${challengeTitle}" challenge on Dad Hub!\n\n"${winner.content}"`,
                    hashtags: ['DadHub', 'ChallengeWinner', 'DadLife'],
                  }}
                  variant="compact"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Participation Stats */}
        <div
          style={{
            marginTop: '24px',
            padding: '16px',
            background: theme.colors.background.secondary,
            borderRadius: '12px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
            Thanks to everyone who participated! Stay tuned for the next challenge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChallengeWinners;
