import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { UserSearchResult as UserSearchResultType } from '../../types';
import { Card, Button } from '../common';

interface UserSearchResultProps {
  user: UserSearchResultType;
}

export const UserSearchResult: React.FC<UserSearchResultProps> = ({ user }) => {
  const { theme, mode } = useTheme();
  const { sendFriendRequest } = useFriends();

  const getActionButton = () => {
    if (user.isFriend) {
      return (
        <span
          style={{
            color: theme.colors.success,
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          ✓ Friends
        </span>
      );
    }

    if (user.hasPendingRequest) {
      return (
        <span
          style={{
            color: theme.colors.text.muted,
            fontSize: '13px',
          }}
        >
          {user.requestDirection === 'sent' ? 'Request Sent' : 'Requested You'}
        </span>
      );
    }

    return (
      <Button
        variant="primary"
        size="small"
        onClick={() => sendFriendRequest(user.uid, user.name, user.avatar)}
      >
        + Add
      </Button>
    );
  };

  return (
    <Card hover>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '44px',
            height: '44px',
            background: `linear-gradient(135deg, ${theme.colors.background.tertiary}, ${
              mode === 'dark' ? '#57534e' : '#d6d3d1'
            })`,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
          }}
        >
          {user.avatar}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
            {user.name}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: theme.colors.text.muted,
            }}
          >
            Dad since {user.dadSince}
          </p>
        </div>

        {getActionButton()}
      </div>
    </Card>
  );
};
