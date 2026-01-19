import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { FriendCard } from './FriendCard';

interface FriendsListProps {
  onStartDM: (friendId: string) => void;
}

export const FriendsList: React.FC<FriendsListProps> = ({ onStartDM }) => {
  const { theme } = useTheme();
  const { friends } = useFriends();

  if (friends.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <span style={{ fontSize: '48px' }}>👥</span>
        <h3 style={{ margin: '16px 0 8px', fontWeight: 600 }}>No Friends Yet</h3>
        <p style={{ color: theme.colors.text.muted, margin: 0 }}>
          Search for other dads to connect with!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <p style={{ margin: 0, color: theme.colors.text.muted, fontSize: '13px' }}>
        {friends.length} friend{friends.length !== 1 ? 's' : ''}
      </p>
      {friends.map((friend) => (
        <FriendCard key={friend.id} friend={friend} onStartDM={onStartDM} />
      ))}
    </div>
  );
};
