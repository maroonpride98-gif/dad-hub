import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { haptics } from '../../utils/haptics';

interface BannerOption {
  id: string;
  name: string;
  gradient: string;
  emoji?: string;
  unlockRequirement?: string;
  isLocked?: boolean;
}

const BANNER_OPTIONS: BannerOption[] = [
  { id: 'default', name: 'Classic Dad', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
  { id: 'ocean', name: 'Ocean Breeze', gradient: 'linear-gradient(135deg, #0ea5e9, #38bdf8)' },
  { id: 'forest', name: 'Forest Green', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)' },
  { id: 'sunset', name: 'Sunset Glow', gradient: 'linear-gradient(135deg, #f43f5e, #fb7185)' },
  { id: 'galaxy', name: 'Galaxy', gradient: 'linear-gradient(135deg, #8b5cf6, #a855f7)', emoji: '✨' },
  { id: 'midnight', name: 'Midnight', gradient: 'linear-gradient(135deg, #1e293b, #334155)' },
  { id: 'fire', name: 'Fire Dad', gradient: 'linear-gradient(135deg, #ea580c, #f97316)', emoji: '🔥', unlockRequirement: '7-day streak', isLocked: false },
  { id: 'gold', name: 'Golden Dad', gradient: 'linear-gradient(135deg, #ca8a04, #eab308)', emoji: '👑', unlockRequirement: 'Level 10', isLocked: false },
  { id: 'rainbow', name: 'Rainbow', gradient: 'linear-gradient(90deg, #ef4444, #f59e0b, #22c55e, #3b82f6, #8b5cf6)', emoji: '🌈', unlockRequirement: 'All badges', isLocked: true },
  { id: 'champion', name: 'Champion', gradient: 'linear-gradient(135deg, #fbbf24, #d97706)', emoji: '🏆', unlockRequirement: '#1 Leaderboard', isLocked: true },
];

interface ProfileBannerProps {
  selectedBannerId: string;
  onBannerChange: (bannerId: string) => void;
  isEditing?: boolean;
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  selectedBannerId,
  onBannerChange,
  isEditing = false,
}) => {
  const { theme } = useTheme();
  const [showPicker, setShowPicker] = useState(false);

  const selectedBanner = BANNER_OPTIONS.find(b => b.id === selectedBannerId) || BANNER_OPTIONS[0];

  const handleSelect = (banner: BannerOption) => {
    if (banner.isLocked) {
      haptics.error();
      return;
    }
    onBannerChange(banner.id);
    setShowPicker(false);
    haptics.success();
  };

  return (
    <>
      {/* Banner Display */}
      <div
        style={{
          height: '120px',
          background: selectedBanner.gradient,
          borderRadius: '20px 20px 0 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Edit button */}
        {isEditing && (
          <button
            onClick={() => setShowPicker(true)}
            style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(8px)',
            }}
          >
            🎨 Change Banner
          </button>
        )}

        {/* Banner name badge */}
        {selectedBanner.emoji && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              padding: '6px 12px',
              borderRadius: '16px',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(8px)',
            }}
          >
            {selectedBanner.emoji} {selectedBanner.name}
          </div>
        )}
      </div>

      {/* Banner Picker Modal */}
      {showPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={() => setShowPicker(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '70vh',
              background: theme.colors.background.primary,
              borderRadius: '24px 24px 0 0',
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: `1px solid ${theme.colors.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
                  Choose Banner
                </h3>
                <button
                  onClick={() => setShowPicker(false)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: theme.colors.background.secondary,
                    color: theme.colors.text.muted,
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Banner Grid */}
            <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(70vh - 80px)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {BANNER_OPTIONS.map(banner => (
                  <button
                    key={banner.id}
                    onClick={() => handleSelect(banner)}
                    style={{
                      position: 'relative',
                      height: '80px',
                      borderRadius: '12px',
                      border: selectedBannerId === banner.id
                        ? `3px solid ${theme.colors.accent.primary}`
                        : `2px solid ${theme.colors.border}`,
                      background: banner.gradient,
                      cursor: banner.isLocked ? 'not-allowed' : 'pointer',
                      overflow: 'hidden',
                      opacity: banner.isLocked ? 0.5 : 1,
                    }}
                  >
                    {/* Pattern overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20.5V18H18v2.5h-2.5v2H18V25h2v-2.5h2.5v-2H20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Banner name */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        right: '8px',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 600,
                        textAlign: 'center',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {banner.emoji && `${banner.emoji} `}{banner.name}
                    </div>

                    {/* Lock overlay */}
                    {banner.isLocked && (
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.5)',
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>🔒</span>
                        <span style={{ fontSize: '10px', color: '#fff', marginTop: '4px' }}>
                          {banner.unlockRequirement}
                        </span>
                      </div>
                    )}

                    {/* Selected checkmark */}
                    {selectedBannerId === banner.id && !banner.isLocked && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: theme.colors.accent.primary,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontSize: '14px',
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default ProfileBanner;
