import React, { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { LeaderboardTabs } from './LeaderboardTabs';
import { LeaderboardEntry } from './LeaderboardEntry';
import { TopThreePodium } from './TopThreePodium';
import { Card } from '../common';

export const LeaderboardPage: React.FC = () => {
  const { theme } = useTheme();
  const {
    leaderboardData,
    leaderboardType,
    userRank,
    isLoadingLeaderboard,
    fetchLeaderboard,
  } = useGamification();

  useEffect(() => {
    fetchLeaderboard(leaderboardType);
  }, []);

  const handleTabChange = (tab: typeof leaderboardType) => {
    fetchLeaderboard(tab);
  };

  const topThree = leaderboardData.slice(0, 3);
  const restOfLeaderboard = leaderboardData.slice(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 800,
            color: theme.colors.text.primary,
          }}
        >
          Leaderboard
        </h2>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            color: theme.colors.text.secondary,
          }}
        >
          See how you rank among fellow dads
        </p>
      </div>

      {/* Tabs */}
      <LeaderboardTabs activeTab={leaderboardType} onTabChange={handleTabChange} />

      {/* Loading State */}
      {isLoadingLeaderboard ? (
        <Card>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              gap: '16px',
            }}
          >
            <div
              style={{
                fontSize: '40px',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            >
              🏆
            </div>
            <span style={{ color: theme.colors.text.muted }}>
              Loading leaderboard...
            </span>
          </div>
        </Card>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <Card>
              <TopThreePodium entries={topThree} />
            </Card>
          )}

          {/* User Rank Card (if not in top 3) */}
          {userRank && userRank > 3 && (
            <Card
              style={{
                background: `rgba(217, 119, 6, 0.1)`,
                border: `1px solid ${theme.colors.accent.primary}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: theme.colors.text.secondary,
                    }}
                  >
                    Your Rank
                  </div>
                  <div
                    style={{
                      fontSize: '32px',
                      fontWeight: 800,
                      color: theme.colors.accent.primary,
                    }}
                  >
                    #{userRank}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: theme.colors.text.muted,
                    }}
                  >
                    Keep going! You're doing great! 💪
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Rest of Leaderboard */}
          {restOfLeaderboard.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3
                style={{
                  margin: '8px 0',
                  fontSize: '16px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                Rankings
              </h3>
              {restOfLeaderboard.map(entry => (
                <LeaderboardEntry key={entry.userId} entry={entry} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {leaderboardData.length === 0 && (
            <Card>
              <div
                style={{
                  textAlign: 'center',
                  padding: '48px',
                  color: theme.colors.text.muted,
                }}
              >
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏆</div>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    color: theme.colors.text.primary,
                  }}
                >
                  No rankings yet
                </h3>
                <p style={{ margin: 0 }}>
                  Be the first to earn XP and claim the top spot!
                </p>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
