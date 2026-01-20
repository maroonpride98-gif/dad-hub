import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useFriends } from '../../context/FriendsContext';
import { Card, Button } from '../common';
import { BadgesGrid } from './BadgesGrid';
import { StatsCard } from './StatsCard';
import { DadLevel } from './DadLevel';
import { ActivityFeed } from './ActivityFeed';
import { Achievements } from './Achievements';
import { EditProfileModal } from './EditProfileModal';
import { TitleSelector } from './TitleSelector';
import { AchievementShowcase } from './AchievementShowcase';

export const ProfilePage: React.FC = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const { user, discussions, events, jokes } = useApp();
  const { logout } = useAuth();
  const { friends } = useFriends();
  const [showEditModal, setShowEditModal] = useState(false);

  // Compute stats from real data
  const userStats = {
    postsCreated: discussions.filter(d => d.authorId === user.uid).length,
    commentsMade: 0,
    eventsAttended: events.filter(e => e.attendeeIds?.includes(user.uid)).length,
    jokesShared: jokes.filter(j => j.isUserSubmitted && j.author === user.name).length,
  };

  // Calculate member since
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Profile Header Card */}
      <Card variant="accent" padding="large" style={{ textAlign: 'center', position: 'relative' }}>
        {/* Edit Button */}
        <button
          onClick={() => setShowEditModal(true)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: '14px',
            color: theme.colors.text.primary,
          }}
        >
          ✏️ Edit
        </button>

        <div
          style={{
            width: '100px',
            height: '100px',
            background: `linear-gradient(135deg, ${theme.colors.background.tertiary}, ${
              mode === 'dark' ? '#57534e' : '#d6d3d1'
            })`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            margin: '0 auto 16px',
            border: '4px solid rgba(217, 119, 6, 0.5)',
          }}
        >
          {user.avatar}
        </div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '26px', fontWeight: 800 }}>{user.name}</h2>

        {/* Title Selector */}
        <div style={{ marginBottom: '8px' }}>
          <TitleSelector />
        </div>

        <p style={{ margin: '0 0 4px 0', color: theme.colors.text.muted, fontSize: '13px' }}>
          {user.email}
        </p>
        <p style={{ margin: '0 0 8px 0', color: theme.colors.text.secondary }}>
          Dad of {user.kids} since {user.dadSince}
        </p>

        {/* Quick Stats Row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{friends.length}</p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Friends</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{userStats.postsCreated}</p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Posts</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>{userStats.jokesShared}</p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Jokes</p>
          </div>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: `rgba(${mode === 'dark' ? '28, 25, 23' : '0, 0, 0'}, 0.6)`,
            borderRadius: '20px',
          }}
        >
          <span style={{ fontSize: '20px' }}>🏆</span>
          <span style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.accent.secondary }}>
            {user.points.toLocaleString()}
          </span>
          <span style={{ color: theme.colors.text.muted }}>points</span>
        </div>

        <p style={{ margin: '12px 0 0 0', fontSize: '12px', color: theme.colors.text.muted }}>
          Member since {memberSince}
        </p>
      </Card>

      {/* Dad Level */}
      <DadLevel points={user.points} />

      {/* Achievement Showcase */}
      <AchievementShowcase />

      {/* Achievements */}
      <Achievements />

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Badges */}
      {user.badges.length > 0 && <BadgesGrid badges={user.badges} />}

      {/* Stats */}
      <StatsCard stats={userStats} />

      {/* Settings Section */}
      <div>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>⚙️ Settings</h3>

        {/* Theme Toggle */}
        <Card style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
                {mode === 'dark' ? '🌙' : '☀️'} Appearance
              </h4>
              <p style={{ margin: 0, color: theme.colors.text.muted, fontSize: '14px' }}>
                Currently using {mode} mode
              </p>
            </div>
            <Button variant="secondary" onClick={toggleTheme}>
              {mode === 'dark' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </Card>

        {/* Notifications Setting */}
        <Card style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
                🔔 Notifications
              </h4>
              <p style={{ margin: 0, color: theme.colors.text.muted, fontSize: '14px' }}>
                Push notifications enabled
              </p>
            </div>
            <span style={{ color: theme.colors.success, fontWeight: 600 }}>On</span>
          </div>
        </Card>

        {/* Privacy Setting */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700 }}>
                🔒 Profile Visibility
              </h4>
              <p style={{ margin: 0, color: theme.colors.text.muted, fontSize: '14px' }}>
                Visible to all members
              </p>
            </div>
            <span style={{ color: theme.colors.text.muted, fontWeight: 600 }}>Public</span>
          </div>
        </Card>
      </div>

      {/* Logout Button */}
      <Button variant="danger" fullWidth onClick={handleLogout}>
        Sign Out
      </Button>

      {/* Edit Profile Modal */}
      <EditProfileModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} />
    </div>
  );
};
