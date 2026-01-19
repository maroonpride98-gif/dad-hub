import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useReferral } from '../../context/ReferralContext';
import { useAuth } from '../../context/AuthContext';

interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar: string;
  count: number;
}

export const ReferralLeaderboard: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getReferralLeaderboard, stats } = useReferral();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      const data = await getReferralLeaderboard();
      setLeaderboard(data);
      setIsLoading(false);
    };
    loadLeaderboard();
  }, [getReferralLeaderboard]);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }}>
          ⏳
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '16px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
          color: '#fff',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
          🏆 Top Recruiters
        </h3>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
          Dads who brought the most dads to the brotherhood
        </p>
      </div>

      {/* Leaderboard List */}
      <div>
        {leaderboard.length === 0 ? (
          <div
            style={{
              padding: '32px 20px',
              textAlign: 'center',
              color: theme.colors.text.muted,
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Be the first to invite a dad!
            </p>
          </div>
        ) : (
          leaderboard.map((entry, index) => {
            const isCurrentUser = entry.userId === user?.uid;
            const medals = ['🥇', '🥈', '🥉'];
            const medal = medals[index] || `#${index + 1}`;

            return (
              <div
                key={entry.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 20px',
                  background: isCurrentUser
                    ? `${theme.colors.accent.primary}10`
                    : 'transparent',
                  borderBottom: `1px solid ${theme.colors.border}`,
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    width: '32px',
                    textAlign: 'center',
                    fontSize: index < 3 ? '20px' : '14px',
                    fontWeight: 700,
                    color: index < 3 ? 'inherit' : theme.colors.text.muted,
                  }}
                >
                  {medal}
                </div>

                {/* Avatar */}
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: theme.colors.background.secondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    border: isCurrentUser
                      ? `2px solid ${theme.colors.accent.primary}`
                      : 'none',
                  }}
                >
                  {entry.userAvatar}
                </div>

                {/* Name */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {entry.userName}
                    {isCurrentUser && (
                      <span
                        style={{
                          marginLeft: '8px',
                          fontSize: '11px',
                          color: theme.colors.accent.primary,
                        }}
                      >
                        (You)
                      </span>
                    )}
                  </div>
                </div>

                {/* Count */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    background: theme.colors.background.secondary,
                    borderRadius: '20px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>👨‍👧‍👦</span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {entry.count}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Current User Status (if not in top 10) */}
      {stats.successfulReferrals > 0 &&
        !leaderboard.some((e) => e.userId === user?.uid) && (
          <div
            style={{
              padding: '12px 20px',
              background: `${theme.colors.accent.primary}10`,
              borderTop: `2px dashed ${theme.colors.border}`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ fontSize: '14px', color: theme.colors.text.muted }}>
              Your rank:
            </div>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: theme.colors.background.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              {user?.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontWeight: 600, color: theme.colors.text.primary }}>
                {user?.name}
              </span>
            </div>
            <div
              style={{
                padding: '6px 12px',
                background: theme.colors.background.secondary,
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {stats.successfulReferrals} invited
            </div>
          </div>
        )}
    </div>
  );
};
