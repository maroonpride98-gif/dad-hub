import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useFriends } from '../../context/FriendsContext';
import { Button, Input, Card } from '../common';

interface NewDMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDMModal: React.FC<NewDMModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode } = useTheme();
  const { createOrGetDM, setActiveChat } = useApp();
  const { friends } = useFriends();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredFriends = useMemo(() => {
    if (!searchQuery.trim()) return friends;
    const query = searchQuery.toLowerCase();
    return friends.filter((friend) => friend.friendName.toLowerCase().includes(query));
  }, [friends, searchQuery]);

  const handleSelectFriend = async (friendId: string, friendName: string, friendAvatar: string) => {
    setIsLoading(true);
    try {
      const dm = await createOrGetDM(friendId, friendName, friendAvatar);
      setActiveChat(dm.id);
      onClose();
      setSearchQuery('');
    } catch (error) {
      console.error('Error creating DM:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.colors.background.secondary,
          borderRadius: '20px',
          padding: '24px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>New Message</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text.muted,
              fontSize: '24px',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            ×
          </button>
        </div>

        {/* Search */}
        <Input
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '16px' }}
        />

        {/* Friends List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {friends.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme.colors.text.muted,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
              <p style={{ margin: 0, fontSize: '14px' }}>
                No friends yet. Add some friends to start messaging!
              </p>
            </div>
          ) : filteredFriends.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme.colors.text.muted,
              }}
            >
              <p style={{ margin: 0, fontSize: '14px' }}>No friends match your search</p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <Card
                key={friend.id}
                hover
                padding="small"
                onClick={() =>
                  !isLoading &&
                  handleSelectFriend(friend.friendId, friend.friendName, friend.friendAvatar)
                }
              >
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
                    {friend.friendAvatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
                      {friend.friendName}
                    </h4>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Cancel Button */}
        <Button variant="secondary" onClick={onClose} style={{ marginTop: '16px' }} fullWidth>
          Cancel
        </Button>
      </div>
    </div>
  );
};
