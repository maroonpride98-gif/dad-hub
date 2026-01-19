import React, { useState } from 'react';
import { TabType } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { NavButton } from '../common';

interface NavItem {
  tab: TabType;
  icon: string;
  label: string;
  adminOnly?: boolean;
}

const mainNavItems: NavItem[] = [
  { tab: 'home', icon: '🏠', label: 'Home' },
  { tab: 'chat', icon: '💬', label: 'Chat' },
  { tab: 'board', icon: '📋', label: 'Board' },
  { tab: 'events', icon: '📅', label: 'Events' },
];

const moreMenuItems: NavItem[] = [
  { tab: 'groups', icon: '👥', label: 'Dad Groups' },
  { tab: 'wisdom', icon: '🧔', label: 'Dad Wisdom AI' },
  { tab: 'leaderboard', icon: '🏅', label: 'Leaderboard' },
  { tab: 'jokes', icon: '😂', label: 'Dad Jokes' },
  { tab: 'recipes', icon: '🍳', label: 'Recipes' },
  { tab: 'hacks', icon: '💡', label: 'Dad Hacks' },
  { tab: 'games', icon: '🎮', label: 'Mini Games' },
  { tab: 'challenges', icon: '🏆', label: 'Challenges' },
  { tab: 'profile', icon: '👤', label: 'My Profile' },
  { tab: 'admin', icon: '🛡️', label: 'Admin Panel', adminOnly: true },
];

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { theme, mode } = useTheme();
  const { user } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isMoreActive = moreMenuItems.some((item) => item.tab === activeTab);

  const visibleMoreItems = moreMenuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && user?.isAdmin)
  );

  const handleMoreItemClick = (tab: TabType) => {
    onTabChange(tab);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* More Menu */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '16px',
            background: theme.colors.card,
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            padding: '8px',
            zIndex: 101,
            minWidth: '180px',
          }}
        >
          {visibleMoreItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => handleMoreItemClick(item.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                width: '100%',
                background: activeTab === item.tab ? theme.colors.cardHover : 'transparent',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                color: activeTab === item.tab ? theme.colors.accent.primary : theme.colors.text.primary,
                fontWeight: activeTab === item.tab ? 600 : 400,
                fontSize: '15px',
                textAlign: 'left',
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}

      <nav
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: `rgba(${mode === 'dark' ? '28, 25, 23' : '250, 250, 249'}, 0.95)`,
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${theme.colors.border}`,
          padding: '12px 16px 20px',
          display: 'flex',
          justifyContent: 'space-around',
          zIndex: 100,
        }}
      >
        {mainNavItems.map((item) => (
          <NavButton
            key={item.tab}
            tab={item.tab}
            icon={item.icon}
            label={item.label}
            isActive={activeTab === item.tab}
            onClick={() => {
              onTabChange(item.tab);
              setShowMoreMenu(false);
            }}
          />
        ))}
        <NavButton
          tab="profile"
          icon="⋯"
          label="More"
          isActive={isMoreActive || showMoreMenu}
          onClick={() => setShowMoreMenu(!showMoreMenu)}
        />
      </nav>
    </>
  );
};
