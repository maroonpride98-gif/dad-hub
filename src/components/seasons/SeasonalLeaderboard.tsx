import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getCurrentSeason, SeasonDefinition } from '../../data/seasons';
import { getLevelFromXP } from '../../types/gamification';
import { getTitleById } from '../../data/titles';

interface SeasonalEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  seasonalXp: number;
  level: number;
  levelIcon: string;
  title?: string;
  titleEmoji?: string;
  isYou?: boolean;
}

interface SeasonalLeaderboardProps {
  onClose?: () => void;
}

export const SeasonalLeaderboard: React.FC<SeasonalLeaderboardProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [season, setSeason] = useState<SeasonDefinition | null>(null);
  const [entries, setEntries] = useState<SeasonalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const currentSeason = getCurrentSeason();
    setSeason(currentSeason);

    if (currentSeason) {
      loadSeasonalLeaderboard(currentSeason);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadSeasonalLeaderboard = async (_currentSeason: SeasonDefinition) => {
    try {
      // For now, we'll use the regular XP as seasonal XP
      // In a real implementation, you'd track XP earned during the season separately
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('xp', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const leaderboardEntries: SeasonalEntry[] = [];
      let rank = 1;
      let foundUser = false;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const levelInfo = getLevelFromXP(data.xp || 0);
        const isCurrentUser = user?.uid === doc.id;
        const titleDef = data.activeTitle ? getTitleById(data.activeTitle) : null;

        if (isCurrentUser) {
          setUserRank(rank);
          foundUser = true;
        }

        leaderboardEntries.push({
          rank,
          userId: doc.id,
          name: data.name,
          avatar: data.avatar,
          seasonalXp: data.xp || 0, // Would be seasonal XP in production
          level: levelInfo.level,
          levelIcon: levelInfo.icon,
          title: titleDef?.name,
          titleEmoji: titleDef?.emoji,
          isYou: isCurrentUser,
        });
        rank++;
      });

      if (!foundUser && user?.uid) {
        setUserRank(null);
      }

      setEntries(leaderboardEntries);
    } catch (error) {
      console.error('Error loading seasonal leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!season) {
    return (
      <div
        style={{
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗓️</div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
          No Active Season
        </h3>
        <p style={{ margin: 0, color: theme.colors.text.muted }}>
          Check back soon for the next seasonal event!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          background: season.theme.gradient,
          padding: '24px',
          borderRadius: onClose ? '0' : '20px 20px 0 0',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>{season.emoji}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#fff' }}>
                {season.name}
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                Seasonal Leaderboard
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* User rank summary */}
        {userRank && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
              Your Rank
            </span>
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: 700 }}>
              #{userRank}
            </span>
          </div>
        )}
      </div>

      {/* Leaderboard Content */}
      <div style={{ padding: '0 16px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', animation: 'float 2s ease-in-out infinite' }}>
              🏆
            </div>
            <p style={{ color: theme.colors.text.muted }}>Loading leaderboard...</p>
          </div>
        ) : entries.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏁</div>
            <p style={{ color: theme.colors.text.muted }}>
              Be the first to compete this season!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Top 3 Podium */}
            {entries.length >= 3 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: '8px',
                  marginBottom: '16px',
                  padding: '16px 0',
                }}
              >
                {/* 2nd Place */}
                <PodiumEntry entry={entries[1]} place={2} season={season} theme={theme} />
                {/* 1st Place */}
                <PodiumEntry entry={entries[0]} place={1} season={season} theme={theme} />
                {/* 3rd Place */}
                <PodiumEntry entry={entries[2]} place={3} season={season} theme={theme} />
              </div>
            )}

            {/* Rest of the list */}
            {entries.slice(3).map((entry) => (
              <LeaderboardRow key={entry.userId} entry={entry} season={season} theme={theme} />
            ))}
          </div>
        )}
      </div>

      {/* Rewards Info */}
      <div
        style={{
          margin: '24px 16px',
          padding: '16px',
          background: theme.colors.background.secondary,
          borderRadius: '12px',
        }}
      >
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
          🎁 Season Rewards
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🥇</span>
            <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
              Top 1: Exclusive badge + 500 bonus XP
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🥈</span>
            <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
              Top 2-3: Exclusive badge + 250 bonus XP
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🏆</span>
            <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
              Top 10: Seasonal badge + 100 bonus XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Podium Entry Component
const PodiumEntry: React.FC<{
  entry: SeasonalEntry;
  place: 1 | 2 | 3;
  season: SeasonDefinition;
  theme: any;
}> = ({ entry, place, season, theme }) => {
  const heights = { 1: '100px', 2: '80px', 3: '60px' };
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const width = place === 1 ? '90px' : '80px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          fontSize: '28px',
          width: place === 1 ? '56px' : '48px',
          height: place === 1 ? '56px' : '48px',
          borderRadius: '50%',
          background: theme.colors.card,
          border: entry.isYou ? `3px solid ${season.theme.primaryColor}` : `2px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '8px',
        }}
      >
        {entry.avatar}
      </div>

      {/* Name */}
      <p
        style={{
          margin: '0 0 4px 0',
          fontSize: '12px',
          fontWeight: 600,
          color: entry.isYou ? season.theme.primaryColor : theme.colors.text.primary,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {entry.name}
      </p>

      {/* XP */}
      <p
        style={{
          margin: '0 0 8px 0',
          fontSize: '11px',
          color: theme.colors.text.muted,
        }}
      >
        {entry.seasonalXp.toLocaleString()} XP
      </p>

      {/* Podium */}
      <div
        style={{
          width: '100%',
          height: heights[place],
          background: season.theme.gradient,
          borderRadius: '8px 8px 0 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}
      >
        {medals[place]}
      </div>
    </div>
  );
};

// Leaderboard Row Component
const LeaderboardRow: React.FC<{
  entry: SeasonalEntry;
  season: SeasonDefinition;
  theme: any;
}> = ({ entry, season, theme }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: entry.isYou ? `${season.theme.primaryColor}15` : theme.colors.card,
        borderRadius: '12px',
        border: `1px solid ${entry.isYou ? season.theme.primaryColor + '30' : theme.colors.border}`,
      }}
    >
      {/* Rank */}
      <div
        style={{
          width: '32px',
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: 600,
          color: theme.colors.text.muted,
        }}
      >
        #{entry.rank}
      </div>

      {/* Avatar */}
      <div
        style={{
          fontSize: '24px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: theme.colors.background.secondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {entry.avatar}
      </div>

      {/* Name & Level */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: entry.isYou ? season.theme.primaryColor : theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {entry.name}
          {entry.isYou && (
            <span
              style={{
                fontSize: '10px',
                padding: '2px 6px',
                background: season.theme.primaryColor,
                color: '#fff',
                borderRadius: '4px',
              }}
            >
              You
            </span>
          )}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: theme.colors.text.muted,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {entry.levelIcon} Level {entry.level}
          {entry.title && (
            <>
              <span>•</span>
              {entry.titleEmoji} {entry.title}
            </>
          )}
        </p>
      </div>

      {/* XP */}
      <div style={{ textAlign: 'right' }}>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 700,
            color: season.theme.primaryColor,
          }}
        >
          {entry.seasonalXp.toLocaleString()}
        </p>
        <p style={{ margin: 0, fontSize: '10px', color: theme.colors.text.muted }}>
          XP
        </p>
      </div>
    </div>
  );
};

export default SeasonalLeaderboard;
