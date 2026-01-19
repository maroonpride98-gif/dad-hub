import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { LeaderboardType } from '../../types/gamification';

interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
}

const TABS: { value: LeaderboardType; label: string; icon: string }[] = [
  { value: 'weekly', label: 'This Week', icon: '📅' },
  { value: 'monthly', label: 'This Month', icon: '📆' },
  { value: 'allTime', label: 'All Time', icon: '🏆' },
];

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        padding: '4px',
        background: theme.colors.background.secondary,
        borderRadius: '16px',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.value;

        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px 16px',
              background: isActive
                ? theme.colors.accent.gradient
                : 'transparent',
              color: isActive
                ? theme.colors.background.primary
                : theme.colors.text.secondary,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
