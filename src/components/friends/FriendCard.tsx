import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { Friend } from '../../types';
import { Card, Button } from '../common';

interface FriendCardProps {
  friend: Friend;
  onStartDM: (friendId: string) => void;
}

export const FriendCard: React.FC<FriendCardProps> = ({ friend, onStartDM }) => {
  const { theme, mode } = useTheme();
  const { removeFriend } = useFriends();

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
          {friend.friendAvatar}
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
            {friend.friendName}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: theme.colors.text.muted,
            }}
          >
            Dad since {friend.friendDadSince}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            variant="primary"
            size="small"
            onClick={() => onStartDM(friend.friendId)}
          >
            💬
          </Button>
          <Button
            variant="ghost"
            size="small"
            onClick={() => removeFriend(friend.id)}
          >
            ✕
          </Button>
        </div>
      </div>
    </Card>
  );
};
