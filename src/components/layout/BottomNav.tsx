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
      { tab: 'recipes', icon: '🍳', label: 'Recipes' },
      { tab: 'hacks', icon: '💡', label: 'Dad Hacks' },
      { tab: 'tools', icon: '🔧', label: 'Dad Tools' },
    ],
  },
  {
    label: 'Account',
    items: [
      { tab: 'profile', icon: '👤', label: 'My Profile' },
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

  const filterItems = (items: NavItem[]) =>
    items.filter((item) => !item.adminOnly || (item.adminOnly && user?.isAdmin));

  return (
    <>
      {/* Full Screen App Launcher Menu */}
      {showMoreMenu && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: mode === 'dark'
              ? 'rgba(10, 10, 10, 0.98)'
              : 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${theme.colors.border}`,
            }}
          >
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.text.primary }}>
              Dad Hub
            </h2>
            <button
              onClick={() => setShowMoreMenu(false)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: 'none',
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '20px',
            }}
          >
            {menuCategories.map((category) => {
              const visibleItems = filterItems(category.items);
              if (visibleItems.length === 0) return null;

              return (
                <div key={category.label} style={{ marginBottom: '28px' }}>
                  {/* Category Label */}
                  <h3
                    style={{
                      margin: '0 0 14px 4px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: theme.colors.accent.primary,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    {category.label}
                  </h3>

                  {/* Items Grid - 4 columns */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '8px',
                    }}
                  >
                    {visibleItems.map((item) => {
                      const isActive = activeTab === item.tab;
                      return (
                        <button
                          key={item.tab}
                          onClick={() => handleMoreItemClick(item.tab)}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '16px 8px',
                            background: isActive
                              ? `linear-gradient(135deg, ${theme.colors.accent.primary}25, ${theme.colors.accent.secondary}25)`
                              : 'transparent',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'transform 0.15s, background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            if (!isActive) {
                              e.currentTarget.style.background = theme.colors.background.secondary;
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            if (!isActive) {
                              e.currentTarget.style.background = 'transparent';
                            }
                          }}
                        >
                          <div
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '16px',
                              background: isActive
                                ? `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
                                : theme.colors.background.secondary,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '26px',
                              boxShadow: isActive
                                ? `0 4px 12px ${theme.colors.accent.primary}40`
                                : 'none',
                            }}
                          >
                            {item.icon}
                          </div>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: isActive ? 700 : 500,
                              color: isActive
                                ? theme.colors.accent.primary
                                : theme.colors.text.secondary,
                              textAlign: 'center',
                              lineHeight: 1.2,
                              maxWidth: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {item.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions Footer */}
          <div
            style={{
              padding: '16px 20px 24px',
              borderTop: `1px solid ${theme.colors.border}`,
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            {mainNavItems.map((item) => (
              <button
                key={item.tab}
                onClick={() => handleMoreItemClick(item.tab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  background: activeTab === item.tab
                    ? theme.colors.accent.primary
                    : theme.colors.background.secondary,
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: activeTab === item.tab ? '#fff' : theme.colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

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
