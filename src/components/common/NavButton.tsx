import React from 'react';
import { TabType } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface NavButtonProps {
  tab: TabType;
  icon: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const NavButton: React.FC<NavButtonProps> = ({
  icon,
  label,
  isActive,
  onClick,
}) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '12px 16px',
        background: isActive ? theme.colors.accent.gradient : 'transparent',
        border: 'none',
        borderRadius: '16px',
        color: isActive ? theme.colors.background.primary : theme.colors.text.secondary,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: isActive ? 700 : 500,
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: '24px' }}>{icon}</span>
      <span style={{ fontSize: '11px', letterSpacing: '0.5px' }}>{label}</span>
    </button>
  );
};
