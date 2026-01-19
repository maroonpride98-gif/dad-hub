import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { FriendsList } from './FriendsList';
import { FriendRequestsList } from './FriendRequestsList';
import { UserSearch } from './UserSearch';

interface FriendsPanelProps {
  onStartDM: (friendId: string) => void;
}

export const FriendsPanel: React.FC<FriendsPanelProps> = ({ onStartDM }) => {
  const { theme, mode } = useTheme();
  const {
    showFriendsPanel,
    setShowFriendsPanel,
    friendsPanelTab,
    setFriendsPanelTab,
    incomingRequests,
  } = useFriends();

  if (!showFriendsPanel) return null;

  const tabs = [
    { id: 'friends' as const, label: 'Friends', icon: '👥' },
    {
      id: 'requests' as const,
      label: 'Requests',
      icon: '📬',
      badge: incomingRequests.length,
    },
    { id: 'search' as const, label: 'Find', icon: '🔍' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setShowFriendsPanel(false)}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 150,
        }}
      />

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          maxWidth: '100vw',
          background: mode === 'dark' ? '#1c1917' : '#fafaf9',
          borderLeft: `1px solid ${theme.colors.border}`,
          zIndex: 151,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
              👨‍👧‍👦 Dad Friends
            </h2>
            <button
              onClick={() => setShowFriendsPanel(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: theme.colors.text.muted,
                padding: '4px',
              }}
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              marginTop: '16px',
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFriendsPanelTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background:
                    friendsPanelTab === tab.id
                      ? theme.colors.accent.gradient
                      : theme.colors.card,
                  border:
                    friendsPanelTab === tab.id
                      ? 'none'
                      : `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color:
                    friendsPanelTab === tab.id
                      ? '#1c1917'
                      : theme.colors.text.primary,
                  fontWeight: 600,
                  fontSize: '13px',
                  position: 'relative',
                }}
              >
                {tab.icon} {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: theme.colors.error,
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {friendsPanelTab === 'friends' && <FriendsList onStartDM={onStartDM} />}
          {friendsPanelTab === 'requests' && <FriendRequestsList />}
          {friendsPanelTab === 'search' && <UserSearch />}
        </div>
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  );
};
