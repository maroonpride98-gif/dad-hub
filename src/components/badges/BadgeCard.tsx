import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../../types';
import { BadgeDefinition } from '../../types/gamification';
import { RARITY_COLORS } from '../../data/badges';

interface BadgeCardProps {
  badge: Badge | BadgeDefinition;
  isUnlocked?: boolean;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isUnlocked = true,
  showDescription = true,
  size = 'medium',
  onClick,
}) => {
  const { theme } = useTheme();
  const rarity = badge.rarity || 'common';
  const rarityColors = RARITY_COLORS[rarity];

  const sizeStyles = {
    small: { icon: '28px', padding: '12px', fontSize: '11px' },
    medium: { icon: '40px', padding: '16px', fontSize: '12px' },
    large: { icon: '56px', padding: '20px', fontSize: '14px' },
  };

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: sizeStyles[size].padding,
        background: isUnlocked ? rarityColors.bg : `rgba(100, 100, 100, 0.1)`,
        border: `2px solid ${isUnlocked ? rarityColors.border : theme.colors.border}`,
        borderRadius: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        opacity: isUnlocked ? 1 : 0.5,
        filter: isUnlocked ? 'none' : 'grayscale(100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (onClick) e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        if (onClick) e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Shine effect for unlocked badges */}
      {isUnlocked && rarity !== 'common' && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
            animation: 'shimmer 3s infinite',
          }}
        />
      )}

      {/* Badge Icon */}
      <span
        style={{
          fontSize: sizeStyles[size].icon,
          filter: isUnlocked ? 'none' : 'grayscale(100%)',
        }}
      >
        {badge.icon}
      </span>

      {/* Badge Name */}
      <span
        style={{
          fontSize: sizeStyles[size].fontSize,
          fontWeight: 600,
          color: isUnlocked ? rarityColors.text : theme.colors.text.muted,
          textAlign: 'center',
        }}
      >
        {badge.name}
      </span>

      {/* Badge Description */}
      {showDescription && badge.description && (
        <span
          style={{
            fontSize: size === 'large' ? '12px' : '10px',
            color: theme.colors.text.muted,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {badge.description}
        </span>
      )}

      {/* Rarity Label */}
      <span
        style={{
          fontSize: '9px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: isUnlocked ? rarityColors.text : theme.colors.text.muted,
          padding: '2px 8px',
          background: isUnlocked ? `${rarityColors.border}22` : 'transparent',
          borderRadius: '10px',
        }}
      >
        {rarity}
      </span>

      {/* Lock Icon for locked badges */}
      {!isUnlocked && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            fontSize: '14px',
            opacity: 0.7,
          }}
        >
          🔒
        </div>
      )}
    </div>
  );
};
