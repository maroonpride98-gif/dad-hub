import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useApp } from '../../context/AppContext';
import { useFriends } from '../../context/FriendsContext';

interface HeaderProps {
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearchClick }) => {
  const { theme, mode, toggleTheme } = useTheme();
  const { unreadCount, togglePanel } = useNotifications();
  const { user } = useApp();
  const { setShowFriendsPanel, incomingRequests } = useFriends();

  return (
    <header
      style={{
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.colors.border}`,
        background: `rgba(${mode === 'dark' ? '28, 25, 23' : '250, 250, 249'}, 0.8)`,
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img
          src="/logo.svg"
          alt="DadHub Logo"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            objectFit: 'cover',
          }}
        />
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #fafaf9, #d6d3d1)'
                : 'linear-gradient(135deg, #1c1917, #44403c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DadHub
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '11px',
              color: theme.colors.text.muted,
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Brotherhood of Fatherhood
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search Button */}
        <button
          onClick={onSearchClick}
          style={{
            width: '40px',
            height: '40px',
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
          }}
          aria-label="Search"
        >
          🔍
        </button>

        {/* Friends Button */}
        <button
          onClick={() => setShowFriendsPanel(true)}
          style={{
            width: '40px',
            height: '40px',
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label="Friends"
        >
          👥
          {incomingRequests.length > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '20px',
                height: '20px',
                background: theme.colors.error,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              {incomingRequests.length > 9 ? '9+' : incomingRequests.length}
            </span>
          )}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: '40px',
            height: '40px',
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} mode`}
        >
          {mode === 'dark' ? '☀️' : '🌙'}
        </button>

        {/* Notifications Bell */}
        <button
          onClick={togglePanel}
          style={{
            width: '40px',
            height: '40px',
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label="Notifications"
        >
          🔔
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                minWidth: '20px',
                height: '20px',
                background: theme.colors.error,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Points Display */}
        <div
          style={{
            padding: '8px 16px',
            background: `rgba(217, 119, 6, 0.15)`,
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '16px' }}>🏆</span>
          <span style={{ fontWeight: 700, color: theme.colors.accent.secondary }}>
            {user.points.toLocaleString()}
          </span>
        </div>

        {/* User Avatar */}
        <div
          style={{
            width: '44px',
            height: '44px',
            background: `linear-gradient(135deg, ${theme.colors.background.tertiary}, ${
              mode === 'dark' ? '#57534e' : '#d6d3d1'
            })`,
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            cursor: 'pointer',
            border: `2px solid rgba(217, 119, 6, 0.3)`,
          }}
        >
          {user.avatar}
        </div>
      </div>
    </header>
  );
};
