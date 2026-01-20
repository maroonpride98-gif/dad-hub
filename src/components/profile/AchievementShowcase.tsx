import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useGamification } from '../../context/GamificationContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../../types';
import { ShareAchievementCard } from '../common/ShareButton';
import { haptics } from '../../utils/haptics';

interface ShowcaseSlot {
  type: 'badge' | 'title' | 'stat' | 'empty';
  id?: string;
  value?: string | number;
  label?: string;
}

const MAX_SHOWCASE_SLOTS = 6;

export const AchievementShowcase: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const { userBadges, level, xp, currentStreak, longestStreak } = useGamification();
  const { updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showcaseSlots, setShowcaseSlots] = useState<ShowcaseSlot[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Load showcase from user data or initialize with defaults
  useEffect(() => {
    if (user.showcaseSlots) {
      setShowcaseSlots(user.showcaseSlots);
    } else {
      // Default showcase: top 3 badges + level + streak
      const defaultSlots: ShowcaseSlot[] = [
        ...userBadges.slice(0, 3).map(b => ({ type: 'badge' as const, id: b.id })),
        { type: 'stat' as const, id: 'level', value: level, label: 'Level' },
        { type: 'stat' as const, id: 'streak', value: longestStreak, label: 'Best Streak' },
        { type: 'stat' as const, id: 'xp', value: xp, label: 'Total XP' },
      ].slice(0, MAX_SHOWCASE_SLOTS);

      // Fill remaining slots with empty
      while (defaultSlots.length < MAX_SHOWCASE_SLOTS) {
        defaultSlots.push({ type: 'empty' });
      }

      setShowcaseSlots(defaultSlots);
    }
  }, [user.showcaseSlots, userBadges, level, longestStreak, xp]);

  const getBadgeById = (id: string): Badge | undefined => {
    return userBadges.find(b => b.id === id);
  };

  const handleSaveShowcase = async () => {
    try {
      await updateProfile({ showcaseSlots });
      setIsEditing(false);
      haptics.success();
    } catch (error) {
      console.error('Error saving showcase:', error);
    }
  };

  const handleSlotClick = (slot: ShowcaseSlot) => {
    if (!isEditing) {
      if (slot.type === 'badge') {
        const badge = getBadgeById(slot.id || '');
        if (badge) {
          setSelectedBadge(badge);
        }
      }
      return;
    }

    // In edit mode, show slot editor
    haptics.light();
  };

  const handleRemoveSlot = (index: number) => {
    const newSlots = [...showcaseSlots];
    newSlots[index] = { type: 'empty' };
    setShowcaseSlots(newSlots);
  };

  const handleAddBadge = (badge: Badge, index: number) => {
    const newSlots = [...showcaseSlots];
    newSlots[index] = { type: 'badge', id: badge.id };
    setShowcaseSlots(newSlots);
  };

  const handleAddStat = (statId: string, value: number | string, label: string, index: number) => {
    const newSlots = [...showcaseSlots];
    newSlots[index] = { type: 'stat', id: statId, value, label };
    setShowcaseSlots(newSlots);
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return '#ffd700';
      case 'epic': return '#8b5cf6';
      case 'rare': return '#3b82f6';
      default: return theme.colors.accent.primary;
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
          🏆 Trophy Room
        </h3>
        <button
          onClick={() => isEditing ? handleSaveShowcase() : setIsEditing(true)}
          style={{
            padding: '8px 16px',
            background: isEditing
              ? `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
              : theme.colors.background.secondary,
            border: isEditing ? 'none' : `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            color: isEditing ? '#fff' : theme.colors.text.secondary,
            fontSize: '13px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {isEditing ? '✓ Save' : '✏️ Edit'}
        </button>
      </div>

      {/* Showcase Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
        }}
      >
        {showcaseSlots.map((slot, index) => (
          <ShowcaseSlotCard
            key={index}
            slot={slot}
            badge={slot.type === 'badge' ? getBadgeById(slot.id || '') : undefined}
            isEditing={isEditing}
            onClick={() => handleSlotClick(slot)}
            onRemove={() => handleRemoveSlot(index)}
            theme={theme}
            getRarityColor={getRarityColor}
          />
        ))}
      </div>

      {/* Edit Panel */}
      {isEditing && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: theme.colors.text.secondary }}>
            Available Items
          </h4>

          {/* Available Badges */}
          <div style={{ marginBottom: '16px' }}>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: theme.colors.text.muted }}>
              Badges ({userBadges.length})
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {userBadges.map(badge => {
                const isUsed = showcaseSlots.some(s => s.type === 'badge' && s.id === badge.id);
                return (
                  <button
                    key={badge.id}
                    onClick={() => {
                      const emptyIndex = showcaseSlots.findIndex(s => s.type === 'empty');
                      if (emptyIndex >= 0 && !isUsed) {
                        handleAddBadge(badge, emptyIndex);
                      }
                    }}
                    disabled={isUsed}
                    style={{
                      padding: '8px 12px',
                      background: isUsed ? theme.colors.background.secondary : theme.colors.card,
                      border: `1px solid ${isUsed ? 'transparent' : theme.colors.border}`,
                      borderRadius: '8px',
                      opacity: isUsed ? 0.5 : 1,
                      cursor: isUsed ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{badge.icon}</span>
                    <span style={{ fontSize: '12px', color: theme.colors.text.primary }}>{badge.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Available Stats */}
          <div>
            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: theme.colors.text.muted }}>
              Stats
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { id: 'level', value: level, label: 'Level', icon: '⭐' },
                { id: 'xp', value: xp.toLocaleString(), label: 'Total XP', icon: '✨' },
                { id: 'streak', value: currentStreak, label: 'Current Streak', icon: '🔥' },
                { id: 'best_streak', value: longestStreak, label: 'Best Streak', icon: '💪' },
              ].map(stat => {
                const isUsed = showcaseSlots.some(s => s.type === 'stat' && s.id === stat.id);
                return (
                  <button
                    key={stat.id}
                    onClick={() => {
                      const emptyIndex = showcaseSlots.findIndex(s => s.type === 'empty');
                      if (emptyIndex >= 0 && !isUsed) {
                        handleAddStat(stat.id, stat.value, stat.label, emptyIndex);
                      }
                    }}
                    disabled={isUsed}
                    style={{
                      padding: '8px 12px',
                      background: isUsed ? theme.colors.background.secondary : theme.colors.card,
                      border: `1px solid ${isUsed ? 'transparent' : theme.colors.border}`,
                      borderRadius: '8px',
                      opacity: isUsed ? 0.5 : 1,
                      cursor: isUsed ? 'default' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{stat.icon}</span>
                    <span style={{ fontSize: '12px', color: theme.colors.text.primary }}>{stat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <>
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
            onClick={() => setSelectedBadge(null)}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: theme.colors.background.primary,
              borderRadius: '20px 20px 0 0',
              padding: '24px',
              zIndex: 1000,
              maxHeight: '80vh',
              overflow: 'auto',
            }}
          >
            <ShareAchievementCard
              title={selectedBadge.name}
              description={selectedBadge.description || 'A special badge earned on Dad Hub'}
              emoji={selectedBadge.icon}
              userName={user.name}
              stat={selectedBadge.rarity ? `${selectedBadge.rarity.charAt(0).toUpperCase() + selectedBadge.rarity.slice(1)} Badge` : undefined}
            />
            <button
              onClick={() => setSelectedBadge(null)}
              style={{
                width: '100%',
                marginTop: '16px',
                padding: '14px',
                background: theme.colors.background.secondary,
                border: 'none',
                borderRadius: '12px',
                color: theme.colors.text.secondary,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Individual showcase slot card
const ShowcaseSlotCard: React.FC<{
  slot: ShowcaseSlot;
  badge?: Badge;
  isEditing: boolean;
  onClick: () => void;
  onRemove: () => void;
  theme: any;
  getRarityColor: (rarity?: string) => string;
}> = ({ slot, badge, isEditing, onClick, onRemove, theme, getRarityColor }) => {
  if (slot.type === 'empty') {
    return (
      <div
        style={{
          aspectRatio: '1',
          borderRadius: '16px',
          border: `2px dashed ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.colors.background.secondary,
        }}
      >
        {isEditing ? (
          <span style={{ fontSize: '24px', color: theme.colors.text.muted }}>+</span>
        ) : (
          <span style={{ fontSize: '16px', color: theme.colors.text.muted }}>Empty</span>
        )}
      </div>
    );
  }

  if (slot.type === 'badge' && badge) {
    return (
      <div
        onClick={onClick}
        style={{
          aspectRatio: '1',
          borderRadius: '16px',
          background: `linear-gradient(135deg, ${getRarityColor(badge.rarity)}20, ${getRarityColor(badge.rarity)}10)`,
          border: `2px solid ${getRarityColor(badge.rarity)}40`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          cursor: 'pointer',
          position: 'relative',
          transition: 'transform 0.2s ease',
        }}
      >
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: theme.colors.error,
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        )}
        <span style={{ fontSize: '32px', marginBottom: '8px' }}>{badge.icon}</span>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: theme.colors.text.primary,
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {badge.name}
        </span>
        {badge.rarity && (
          <span
            style={{
              marginTop: '4px',
              fontSize: '9px',
              padding: '2px 6px',
              background: `${getRarityColor(badge.rarity)}30`,
              color: getRarityColor(badge.rarity),
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {badge.rarity}
          </span>
        )}
      </div>
    );
  }

  if (slot.type === 'stat') {
    return (
      <div
        style={{
          aspectRatio: '1',
          borderRadius: '16px',
          background: theme.colors.card,
          border: `1px solid ${theme.colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          position: 'relative',
        }}
      >
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: theme.colors.error,
              border: 'none',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        )}
        <span
          style={{
            fontSize: '28px',
            fontWeight: 800,
            color: theme.colors.accent.primary,
          }}
        >
          {slot.value}
        </span>
        <span
          style={{
            fontSize: '11px',
            color: theme.colors.text.muted,
            textTransform: 'uppercase',
            marginTop: '4px',
          }}
        >
          {slot.label}
        </span>
      </div>
    );
  }

  return null;
};

export default AchievementShowcase;
