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

interface MenuCategory {
  label: string;
  items: NavItem[];
}

const mainNavItems: NavItem[] = [
  { tab: 'home', icon: '🏠', label: 'Home' },
  { tab: 'chat', icon: '💬', label: 'Chat' },
  { tab: 'board', icon: '📋', label: 'Board' },
  { tab: 'events', icon: '📅', label: 'Events' },
];

const menuCategories: MenuCategory[] = [
  {
    label: 'Social',
    items: [
      { tab: 'groups', icon: '👥', label: 'Dad Groups' },
      { tab: 'mentorship', icon: '🤝', label: 'Mentorship' },
      { tab: 'support', icon: '💪', label: 'Dad Support' },
      { tab: 'watch', icon: '🎬', label: 'Watch Parties' },
    ],
  },
  {
    label: 'Activities',
    items: [
      { tab: 'quests', icon: '⚔️', label: 'Daily Quests' },
      { tab: 'challenges', icon: '🏆', label: 'Challenges' },
      { tab: 'battles', icon: '⚡', label: 'Joke Battles' },
      { tab: 'leaderboard', icon: '🏅', label: 'Leaderboard' },
    ],
  },
  {
    label: 'Entertainment',
    items: [
      { tab: 'jokes', icon: '😂', label: 'Dad Jokes' },
      { tab: 'memes', icon: '🖼️', label: 'Meme Generator' },
      { tab: 'podcasts', icon: '🎙️', label: 'Podcasts' },
      { tab: 'movies', icon: '🍿', label: 'Movie Night' },
      { tab: 'games', icon: '🎮', label: 'Mini Games' },
    ],
  },
  {
    label: 'Resources',
    items: [
      { tab: 'wisdom', icon: '🧔', label: 'Dad Wisdom AI' },
      { tab: 'calendar', icon: '📆', label: 'Dad Calendar' },
      { tab: 'gallery', icon: '📸', label: 'Photo Gallery' },
      { tab: 'goals', icon: '🎯', label: 'Goal Tracker' },
      { tab: 'stats', icon: '📊', label: 'My Stats' },
      { tab: 'recipes', icon: '🍳', label: 'Recipes' },
      { tab: 'hacks', icon: '💡', label: 'Dad Hacks' },
      { tab: 'tools', icon: '🔧', label: 'Dad Tools' },
    ],
  },
  {
    label: 'Account',
    items: [
      { tab: 'profile', icon: '👤', label: 'My Profile' },
      { tab: 'settings', icon: '⚙️', label: 'Settings' },
      { tab: 'admin', icon: '🛡️', label: 'Admin Panel', adminOnly: true },
    ],
  },
];

// Flatten for checking active state
const allMoreItems = menuCategories.flatMap((cat) => cat.items);

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { theme, mode } = useTheme();
  const { user } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const isMoreActive = allMoreItems.some((item) => item.tab === activeTab);

  const handleMoreItemClick = (tab: TabType) => {
    onTabChange(tab);
    setShowMoreMenu(false);
  };

  const visibleMoreItems = allMoreItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && user?.isAdmin)
  );

  return (
    <>
      {/* More Menu Overlay */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99,
          }}
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* More Menu Panel */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '16px',
            width: '220px',
            maxHeight: 'calc(100vh - 140px)',
            background: mode === 'dark' ? '#1a1a1a' : '#2d2d2d',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 101,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Scrollable List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '8px',
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
                  padding: '12px 14px',
                  width: '100%',
                  background: activeTab === item.tab
                    ? 'rgba(217, 119, 6, 0.2)'
                    : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: activeTab === item.tab
                    ? '#f59e0b'
                    : '#ffffff',
                  fontWeight: activeTab === item.tab ? 600 : 400,
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== item.tab) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.tab) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
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
