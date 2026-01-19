import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { BadgeCard } from './BadgeCard';
import { BadgeDefinition, BadgeRarity } from '../../types/gamification';
import { Card } from '../common';

type FilterType = 'all' | BadgeRarity | 'unlocked' | 'locked';

interface BadgeGridProps {
  showFilters?: boolean;
  columns?: number;
}

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  showFilters = true,
  columns = 3,
}) => {
  const { theme } = useTheme();
  const { userBadges, allBadges, hasBadge } = useGamification();
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedBadge, setSelectedBadge] = useState<BadgeDefinition | null>(null);

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unlocked', label: 'Unlocked' },
    { value: 'locked', label: 'Locked' },
    { value: 'common', label: 'Common' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Epic' },
    { value: 'legendary', label: 'Legendary' },
  ];

  const filteredBadges = allBadges.filter(badge => {
    const isUnlocked = hasBadge(badge.id);

    switch (filter) {
      case 'unlocked':
        return isUnlocked;
      case 'locked':
        return !isUnlocked;
      case 'common':
      case 'rare':
      case 'epic':
      case 'legendary':
        return badge.rarity === filter;
      default:
        return true;
    }
  });

  // Sort: unlocked first, then by rarity
  const sortedBadges = [...filteredBadges].sort((a, b) => {
    const aUnlocked = hasBadge(a.id) ? 1 : 0;
    const bUnlocked = hasBadge(b.id) ? 1 : 0;
    if (aUnlocked !== bUnlocked) return bUnlocked - aUnlocked;

    const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
    return rarityOrder[b.rarity] - rarityOrder[a.rarity];
  });

  const unlockedCount = userBadges.length;
  const totalCount = allBadges.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Badges
          </h3>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: theme.colors.text.secondary,
            }}
          >
            {unlockedCount} of {totalCount} unlocked
          </p>
        </div>

        {/* Progress Circle */}
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `conic-gradient(
              ${theme.colors.accent.primary} ${(unlockedCount / totalCount) * 360}deg,
              ${theme.colors.border} ${(unlockedCount / totalCount) * 360}deg
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: theme.colors.background.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              color: theme.colors.accent.primary,
            }}
          >
            {Math.round((unlockedCount / totalCount) * 100)}%
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          {filters.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                background: filter === f.value
                  ? theme.colors.accent.gradient
                  : theme.colors.card,
                color: filter === f.value
                  ? theme.colors.background.primary
                  : theme.colors.text.secondary,
                border: `1px solid ${filter === f.value ? 'transparent' : theme.colors.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Badge Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '12px',
        }}
      >
        {sortedBadges.map(badge => (
          <BadgeCard
            key={badge.id}
            badge={badge}
            isUnlocked={hasBadge(badge.id)}
            showDescription={false}
            size="small"
            onClick={() => setSelectedBadge(badge)}
          />
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <Card>
          <div
            style={{
              textAlign: 'center',
              padding: '24px',
              color: theme.colors.text.muted,
            }}
          >
            No badges found with this filter
          </div>
        </Card>
      )}

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 300,
            animation: 'fadeIn 0.2s ease',
          }}
          onClick={() => setSelectedBadge(null)}
        >
          <Card
            style={{
              maxWidth: '320px',
              width: '90%',
              animation: 'slideUp 0.3s ease',
            }}
            onClick={(e) => e?.stopPropagation()}
          >
            <BadgeCard
              badge={selectedBadge}
              isUnlocked={hasBadge(selectedBadge.id)}
              showDescription={true}
              size="large"
            />

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  color: theme.colors.text.muted,
                }}
              >
                Requirement: {selectedBadge.requirement.threshold}{' '}
                {selectedBadge.requirement.type}
              </p>

              <button
                onClick={() => setSelectedBadge(null)}
                style={{
                  marginTop: '16px',
                  padding: '10px 24px',
                  background: theme.colors.card,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
