import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../../types';
import { RARITY_COLORS } from '../../data/badges';
import { Card, Button } from '../common';

interface BadgeUnlockModalProps {
  badge: Badge;
  onClose: () => void;
}

export const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({
  badge,
  onClose,
}) => {
  const { theme } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const rarity = badge.rarity || 'common';
  const rarityColors = RARITY_COLORS[rarity];

  useEffect(() => {
    // Delay content appearance for animation
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 400,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      {/* Celebration particles */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-20px',
              width: '10px',
              height: '10px',
              background: [
                theme.colors.accent.primary,
                theme.colors.accent.secondary,
                rarityColors.border,
                '#fff',
              ][i % 4],
              borderRadius: '50%',
              animation: `confetti ${2 + Math.random() * 2}s ease-out forwards`,
              animationDelay: `${Math.random() * 0.5}s`,
            }}
          />
        ))}
      </div>

      <Card
        style={{
          maxWidth: '360px',
          width: '90%',
          textAlign: 'center',
          padding: '32px 24px',
          transform: showContent ? 'scale(1)' : 'scale(0.8)',
          opacity: showContent ? 1 : 0,
          transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e?.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            fontSize: '14px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: theme.colors.accent.primary,
            marginBottom: '16px',
          }}
        >
          Badge Unlocked!
        </div>

        {/* Badge Icon with glow */}
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
            marginBottom: '16px',
          }}
        >
          {/* Glow effect */}
          <div
            style={{
              position: 'absolute',
              inset: '-20px',
              background: `radial-gradient(circle, ${rarityColors.border}40 0%, transparent 70%)`,
              borderRadius: '50%',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />

          {/* Badge */}
          <div
            style={{
              fontSize: '80px',
              lineHeight: 1,
              position: 'relative',
              animation: 'bounce 0.6s ease',
            }}
          >
            {badge.icon}
          </div>
        </div>

        {/* Badge Name */}
        <h2
          style={{
            margin: '0 0 8px 0',
            fontSize: '24px',
            fontWeight: 700,
            color: rarityColors.text,
          }}
        >
          {badge.name}
        </h2>

        {/* Rarity */}
        <div
          style={{
            display: 'inline-block',
            padding: '4px 16px',
            background: rarityColors.bg,
            border: `1px solid ${rarityColors.border}`,
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: rarityColors.text,
            marginBottom: '16px',
          }}
        >
          {rarity}
        </div>

        {/* Description */}
        {badge.description && (
          <p
            style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: theme.colors.text.secondary,
              lineHeight: 1.5,
            }}
          >
            {badge.description}
          </p>
        )}

        {/* XP Reward */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            background: `rgba(217, 119, 6, 0.1)`,
            borderRadius: '12px',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '20px' }}>⭐</span>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.accent.primary,
            }}
          >
            +50 XP
          </span>
        </div>

        {/* Close Button */}
        <Button onClick={onClose} fullWidth>
          Awesome!
        </Button>
      </Card>

      <style>
        {`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};
