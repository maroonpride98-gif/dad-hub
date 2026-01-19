import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { FriendRequest } from '../../types';
import { Card, Button } from '../common';

interface FriendRequestCardProps {
  request: FriendRequest;
  type: 'incoming' | 'outgoing';
}

export const FriendRequestCard: React.FC<FriendRequestCardProps> = ({
  request,
  type,
}) => {
  const { theme, mode } = useTheme();
  const { acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } =
    useFriends();

  const displayName =
    type === 'incoming' ? request.fromUserName : request.toUserName;
  const displayAvatar =
    type === 'incoming' ? request.fromUserAvatar : request.toUserAvatar;

  const timeAgo = getTimeAgo(request.createdAt);

  return (
    <Card hover>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            background: `linear-gradient(135deg, ${theme.colors.background.tertiary}, ${
              mode === 'dark' ? '#57534e' : '#d6d3d1'
            })`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
          }}
        >
          {displayAvatar}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
            {displayName}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: theme.colors.text.muted,
            }}
          >
            {type === 'incoming' ? 'Wants to be friends' : 'Request pending'} •{' '}
            {timeAgo}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {type === 'incoming' ? (
            <>
              <Button
                variant="success"
                size="small"
                onClick={() => acceptFriendRequest(request.id)}
              >
                ✓
              </Button>
              <Button
                variant="danger"
                size="small"
                onClick={() => rejectFriendRequest(request.id)}
              >
                ✕
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              size="small"
              onClick={() => cancelFriendRequest(request.id)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
