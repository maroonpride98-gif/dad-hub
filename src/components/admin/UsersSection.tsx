import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAdmin } from '../../context/AdminContext';
import { Card, Button, Input } from '../common';
import { AdminUser } from '../../types';

export const UsersSection: React.FC = () => {
  const { theme } = useTheme();
  const { users, usersLoading, setModeratorStatus, banUser, unbanUser } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'banned'>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'banned' && user.isBanned) ||
      (filterStatus === 'active' && !user.isBanned);
    return matchesSearch && matchesFilter;
  });

  if (usersLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <span style={{ fontSize: '32px' }}>⏳</span>
        <p style={{ color: theme.colors.text.muted }}>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Card>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="🔍"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'banned')}
            style={{
              padding: '10px 16px',
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.input,
              color: theme.colors.text.primary,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </Card>

      <p style={{ color: theme.colors.text.muted, margin: 0 }}>
        Showing {filteredUsers.length} of {users.length} users
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredUsers.map((user) => (
          <UserRow
            key={user.id}
            user={user}
            onSetModerator={setModeratorStatus}
            onBan={banUser}
            onUnban={unbanUser}
          />
        ))}
      </div>
    </div>
  );
};

interface UserRowProps {
  user: AdminUser;
  onSetModerator: (userId: string, isModerator: boolean) => Promise<void>;
  onBan: (userId: string, reason: string) => Promise<void>;
  onUnban: (userId: string) => Promise<void>;
}

const UserRow: React.FC<UserRowProps> = ({ user, onSetModerator, onBan, onUnban }) => {
  const { theme } = useTheme();
  const [showActions, setShowActions] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBan = async () => {
    if (banReason.trim()) {
      setIsLoading(true);
      try {
        await onBan(user.id, banReason);
        setBanReason('');
        setShowActions(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleModeratorToggle = async () => {
    setIsLoading(true);
    try {
      await onSetModerator(user.id, !user.isModerator);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    setIsLoading(true);
    try {
      await onUnban(user.id);
      setShowActions(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: theme.colors.background.tertiary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          {user.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700 }}>{user.name}</span>
            {user.isAdmin && <span title="Admin">👑</span>}
            {user.isModerator && <span title="Moderator">🛡️</span>}
            {user.isBanned && <span title="Banned">🚫</span>}
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
            {user.email}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
            Joined: {user.createdAt.toLocaleDateString()} | Last:{' '}
            {user.lastLogin.toLocaleDateString()}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontWeight: 700, color: theme.colors.accent.secondary }}>
            {user.points.toLocaleString()}
          </span>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
            points
          </p>
        </div>

        {!user.isAdmin && (
          <Button variant="ghost" size="small" onClick={() => setShowActions(!showActions)}>
            ⚙️
          </Button>
        )}
      </div>

      {showActions && !user.isAdmin && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: `1px solid ${theme.colors.border}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <Button
              variant={user.isModerator ? 'danger' : 'success'}
              size="small"
              onClick={handleModeratorToggle}
              disabled={isLoading}
            >
              {user.isModerator ? '🚫 Remove Mod' : '🛡️ Make Mod'}
            </Button>

            {user.isBanned ? (
              <Button variant="success" size="small" onClick={handleUnban} disabled={isLoading}>
                ✅ Unban User
              </Button>
            ) : (
              <>
                <Input
                  placeholder="Ban reason..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  style={{ flex: 1, minWidth: '150px' }}
                />
                <Button
                  variant="danger"
                  size="small"
                  onClick={handleBan}
                  disabled={!banReason.trim() || isLoading}
                >
                  🚫 Ban
                </Button>
              </>
            )}
          </div>
          {user.isBanned && user.banReason && (
            <p style={{ margin: 0, fontSize: '13px', color: theme.colors.error }}>
              Ban reason: {user.banReason}
            </p>
          )}
        </div>
      )}
    </Card>
  );
};
