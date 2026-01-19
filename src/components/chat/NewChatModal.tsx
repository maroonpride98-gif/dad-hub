import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { useApp } from '../../context/AppContext';
import { Button, Input } from '../common';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = ['🎯', '🎮', '🏈', '🎸', '🍕', '🚗', '🔧', '🎬', '📚', '🏕️', '🎣', '🏋️'];

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode } = useTheme();
  const { friends } = useFriends();
  const { createGroupChat } = useApp();

  const [groupName, setGroupName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      setError('Please enter a group name');
      return;
    }
    if (selectedFriends.length === 0) {
      setError('Please select at least one friend');
      return;
    }

    createGroupChat({
      name: groupName.trim(),
      emoji: selectedEmoji,
      memberIds: selectedFriends,
    });

    // Reset and close
    setGroupName('');
    setSelectedEmoji('🎯');
    setSelectedFriends([]);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setGroupName('');
    setSelectedEmoji('🎯');
    setSelectedFriends([]);
    setError('');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          background: mode === 'dark' ? '#1c1917' : '#fafaf9',
          borderRadius: '20px',
          border: `1px solid ${theme.colors.border}`,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
            Create Group Chat
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.text.muted,
              padding: '4px',
            }}
          >
            x
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Group Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.text.secondary,
              }}
            >
              Group Name
            </label>
            <Input
              placeholder="Enter group name..."
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                setError('');
              }}
            />
          </div>

          {/* Emoji Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.text.secondary,
              }}
            >
              Group Icon
            </label>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{
                    width: '44px',
                    height: '44px',
                    background:
                      selectedEmoji === emoji
                        ? theme.colors.accent.gradient
                        : theme.colors.card,
                    border:
                      selectedEmoji === emoji
                        ? 'none'
                        : `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Friend Selection */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.text.secondary,
              }}
            >
              Add Friends ({selectedFriends.length} selected)
            </label>

            {friends.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '20px',
                  color: theme.colors.text.muted,
                }}
              >
                <p>No friends yet. Add friends to create a group chat.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {friends.map((friend) => {
                  const isSelected = selectedFriends.includes(friend.friendId);
                  return (
                    <button
                      key={friend.friendId}
                      onClick={() => toggleFriend(friend.friendId)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px',
                        background: isSelected
                          ? `rgba(217, 119, 6, 0.15)`
                          : theme.colors.card,
                        border: isSelected
                          ? `2px solid ${theme.colors.accent.primary}`
                          : `1px solid ${theme.colors.border}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          background: theme.colors.background.tertiary,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {friend.friendAvatar}
                      </div>
                      <span
                        style={{
                          flex: 1,
                          fontWeight: 600,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {friend.friendName}
                      </span>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          border: isSelected
                            ? 'none'
                            : `2px solid ${theme.colors.border}`,
                          background: isSelected
                            ? theme.colors.accent.gradient
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#1c1917',
                          fontWeight: 700,
                        }}
                      >
                        {isSelected && '✓'}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <p
              style={{
                color: theme.colors.error,
                fontSize: '14px',
                marginTop: '12px',
                marginBottom: 0,
              }}
            >
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: `1px solid ${theme.colors.border}`,
            display: 'flex',
            gap: '12px',
          }}
        >
          <Button variant="secondary" onClick={handleClose} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleCreate} style={{ flex: 1 }}>
            Create Group
          </Button>
        </div>
      </div>
    </>
  );
};
