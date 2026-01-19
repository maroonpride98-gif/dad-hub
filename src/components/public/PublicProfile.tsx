import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ShareButton } from '../common/ShareButton';
import { getLevelFromXP } from '../../types/gamification';

interface PublicUser {
  uid: string;
  name: string;
  avatar: string;
  bio?: string;
  dadType?: string;
  kids?: string;
  xp: number;
  levelNumber: number;
  levelTitle: string;
  joinedAt: Date;
  stats: {
    posts: number;
    jokes: number;
    friends: number;
    badges: number;
    streak: number;
  };
  badges: Array<{
    id: string;
    name: string;
    emoji: string;
  }>;
}

interface PublicProfileProps {
  userId: string;
  onJoinClick?: () => void;
}

const SITE_URL = 'https://dad-hub-ab086.web.app';

export const PublicProfile: React.FC<PublicProfileProps> = ({
  userId,
  onJoinClick,
}) => {
  const { theme } = useTheme();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          setError('Profile not found');
          setIsLoading(false);
          return;
        }

        const data = userDoc.data();

        // Only show public info
        const levelDef = getLevelFromXP(data.xp || 0);
        setUser({
          uid: userId,
          name: data.name || 'Dad',
          avatar: data.avatar || '👨',
          bio: data.bio,
          dadType: data.dadType,
          kids: data.kids,
          xp: data.xp || 0,
          levelNumber: levelDef.level,
          levelTitle: levelDef.name,
          joinedAt: data.createdAt?.toDate() || new Date(),
          stats: {
            posts: data.postsCount || 0,
            jokes: data.jokesCount || 0,
            friends: data.friendsCount || 0,
            badges: data.badgesCount || 0,
            streak: data.currentStreak || 0,
          },
          badges: data.unlockedBadges?.slice(0, 6) || [],
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background.gradient,
        }}
      >
        <div style={{ fontSize: '48px', animation: 'float 2s ease-in-out infinite' }}>
          👨‍👧‍👦
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background.gradient,
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
        <h1 style={{ margin: '0 0 8px 0', color: theme.colors.text.primary }}>
          Profile Not Found
        </h1>
        <p style={{ margin: '0 0 24px 0', color: theme.colors.text.secondary }}>
          This dad might be taking a break.
        </p>
        <button
          onClick={onJoinClick || (() => window.location.href = '/')}
          style={{
            padding: '14px 28px',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Join Dad Hub
        </button>
      </div>
    );
  }

  const shareData = {
    title: `${user.name} on Dad Hub`,
    text: `Check out ${user.name}'s profile on Dad Hub - The Brotherhood of Fatherhood!`,
    url: `${SITE_URL}/dad/${userId}`,
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.gradient,
        fontFamily: "'Outfit', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '24px' }}>👨‍👧‍👦</span>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            DadHub
          </span>
        </div>

        <ShareButton data={shareData} variant="compact" />
      </header>

      {/* Profile Content */}
      <main style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Profile Card */}
        <div
          style={{
            background: theme.colors.card,
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '24px',
            boxShadow: theme.shadows.medium,
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}30, ${theme.colors.accent.secondary}30)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              margin: '0 auto 16px auto',
              border: `3px solid ${theme.colors.accent.primary}`,
            }}
          >
            {user.avatar}
          </div>

          {/* Name & Level */}
          <h1
            style={{
              margin: '0 0 4px 0',
              fontSize: '24px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            {user.name}
          </h1>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: `${theme.colors.accent.primary}20`,
              borderRadius: '20px',
              marginBottom: '12px',
            }}
          >
            <span style={{ fontSize: '14px' }}>⭐</span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.accent.primary,
              }}
            >
              Level {user.levelNumber} • {user.levelTitle}
            </span>
          </div>

          {/* Dad Type */}
          {user.dadType && (
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '14px',
                color: theme.colors.text.secondary,
              }}
            >
              {user.dadType} {user.kids && `• ${user.kids} kid${user.kids !== '1' ? 's' : ''}`}
            </p>
          )}

          {/* Bio */}
          {user.bio && (
            <p
              style={{
                margin: '0',
                fontSize: '14px',
                color: theme.colors.text.secondary,
                fontStyle: 'italic',
              }}
            >
              "{user.bio}"
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <StatCard emoji="🔥" value={user.stats.streak} label="Day Streak" theme={theme} />
          <StatCard emoji="📝" value={user.stats.posts} label="Posts" theme={theme} />
          <StatCard emoji="😂" value={user.stats.jokes} label="Jokes" theme={theme} />
          <StatCard emoji="👥" value={user.stats.friends} label="Friends" theme={theme} />
          <StatCard emoji="🏆" value={user.stats.badges} label="Badges" theme={theme} />
          <StatCard emoji="⭐" value={user.xp.toLocaleString()} label="Total XP" theme={theme} />
        </div>

        {/* Badges Preview */}
        {user.badges.length > 0 && (
          <div
            style={{
              background: theme.colors.card,
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px',
            }}
          >
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              🏅 Recent Badges
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    background: theme.colors.background.secondary,
                    borderRadius: '20px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{badge.emoji}</span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div
          style={{
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
            borderRadius: '16px',
            padding: '24px',
            textAlign: 'center',
            border: `1px solid ${theme.colors.accent.primary}30`,
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>👨‍👧‍👦</div>
          <h3
            style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Join the Brotherhood
          </h3>
          <p
            style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: theme.colors.text.secondary,
            }}
          >
            Connect with dads, share experiences, and level up your dad game!
          </p>
          <button
            onClick={onJoinClick || (() => window.location.href = '/')}
            style={{
              padding: '14px 32px',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Join Dad Hub - It's Free!
          </button>
        </div>

        {/* Footer */}
        <footer
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: theme.colors.text.muted,
            }}
          >
            Member since {user.joinedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </footer>
      </main>
    </div>
  );
};

const StatCard: React.FC<{
  emoji: string;
  value: string | number;
  label: string;
  theme: any;
}> = ({ emoji, value, label, theme }) => (
  <div
    style={{
      background: theme.colors.card,
      borderRadius: '12px',
      padding: '16px 12px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{emoji}</div>
    <div
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: theme.colors.text.primary,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: '11px',
        color: theme.colors.text.muted,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
);

export default PublicProfile;
