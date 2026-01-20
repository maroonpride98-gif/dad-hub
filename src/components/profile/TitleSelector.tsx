import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useFriends } from '../../context/FriendsContext';
import { DAD_TITLES, getTitleById, getUnlockedTitles, TITLE_RARITY_COLORS, TitleDefinition } from '../../data/titles';
import { haptics } from '../../utils/haptics';

export const TitleSelector: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const { updateProfile } = useAuth();
  const { level, xp, userBadges, longestStreak, userStats } = useGamification();
  const { friends } = useFriends();
  const [isOpen, setIsOpen] = useState(false);
  const [unlockedTitles, setUnlockedTitles] = useState<TitleDefinition[]>([]);

  // Calculate unlocked titles based on user stats
  useEffect(() => {
    const stats = {
      level,
      badges: userBadges.length,
      streak: longestStreak,
      posts: userStats.postsCount,
      jokes: userStats.jokesCount,
      friends: friends.length,
      xp,
    };

    const titles = getUnlockedTitles(stats);

    // Add special titles from user's unlockedTitles array
    const specialTitles = (user.unlockedTitles || [])
      .map(id => getTitleById(id))
      .filter((t): t is TitleDefinition => t !== undefined && t.requirement.type === 'special');

    setUnlockedTitles([...titles, ...specialTitles]);
  }, [level, xp, userBadges, longestStreak, userStats, friends, user.unlockedTitles]);

  const currentTitle = getTitleById(user.activeTitle || 'rookie_dad') || DAD_TITLES[0];

  const handleSelectTitle = async (titleId: string) => {
    if (!user.uid) return;

    haptics.light();

    try {
      await updateProfile({ activeTitle: titleId });
      setIsOpen(false);
      haptics.success();
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const lockedTitles = DAD_TITLES.filter(
    t => !unlockedTitles.some(ut => ut.id === t.id)
  );

  return (
    <div>
      {/* Current Title Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          background: `${TITLE_RARITY_COLORS[currentTitle.rarity]}20`,
          border: `2px solid ${TITLE_RARITY_COLORS[currentTitle.rarity]}50`,
          borderRadius: '20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ fontSize: '18px' }}>{currentTitle.emoji}</span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: TITLE_RARITY_COLORS[currentTitle.rarity],
          }}
        >
          {currentTitle.name}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: theme.colors.text.muted,
            marginLeft: 'auto',
          }}
        >
          {isOpen ? '▲' : '▼'}
        </span>
      </div>

      {/* Title Selector Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '70vh',
              background: theme.colors.background.primary,
              borderRadius: '20px 20px 0 0',
              zIndex: 1000,
              overflow: 'hidden',
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${theme.colors.border}`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '4px',
                  background: theme.colors.border,
                  borderRadius: '2px',
                  margin: '0 auto 16px auto',
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}
              >
                Choose Your Title
              </h3>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '13px',
                  color: theme.colors.text.muted,
                }}
              >
                {unlockedTitles.length} of {DAD_TITLES.length} titles unlocked
              </p>
            </div>

            {/* Title List */}
            <div
              style={{
                maxHeight: 'calc(70vh - 100px)',
                overflowY: 'auto',
                padding: '16px',
              }}
            >
              {/* Unlocked Titles */}
              <h4
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                Available Titles
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {unlockedTitles.map((title) => (
                  <TitleCard
                    key={title.id}
                    title={title}
                    isSelected={currentTitle.id === title.id}
                    isLocked={false}
                    onClick={() => handleSelectTitle(title.id)}
                    theme={theme}
                  />
                ))}
              </div>

              {/* Locked Titles */}
              {lockedTitles.length > 0 && (
                <>
                  <h4
                    style={{
                      margin: '0 0 12px 0',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: theme.colors.text.muted,
                    }}
                  >
                    Locked Titles
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {lockedTitles.map((title) => (
                      <TitleCard
                        key={title.id}
                        title={title}
                        isSelected={false}
                        isLocked={true}
                        theme={theme}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Title Card Component
const TitleCard: React.FC<{
  title: TitleDefinition;
  isSelected: boolean;
  isLocked: boolean;
  onClick?: () => void;
  theme: any;
}> = ({ title, isSelected, isLocked, onClick, theme }) => {
  const rarityColor = TITLE_RARITY_COLORS[title.rarity];

  const getRequirementText = () => {
    const { type, threshold, specialCondition } = title.requirement;
    switch (type) {
      case 'level':
        return `Reach Level ${threshold}`;
      case 'badges':
        return `Earn ${threshold} badges`;
      case 'streak':
        return `${threshold}-day streak`;
      case 'posts':
        return `Create ${threshold} posts`;
      case 'jokes':
        return `Share ${threshold} jokes`;
      case 'friends':
        return `Make ${threshold} friends`;
      case 'xp':
        return `Earn ${threshold.toLocaleString()} XP`;
      case 'special':
        return specialCondition === 'early_adopter' ? 'Early member' : 'Special achievement';
      default:
        return 'Unknown';
    }
  };

  return (
    <div
      onClick={isLocked ? undefined : onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: isSelected
          ? `${rarityColor}20`
          : isLocked
          ? theme.colors.background.secondary
          : theme.colors.card,
        borderRadius: '12px',
        border: `2px solid ${isSelected ? rarityColor : 'transparent'}`,
        cursor: isLocked ? 'default' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        transition: 'all 0.2s ease',
      }}
    >
      {/* Emoji */}
      <div
        style={{
          fontSize: '28px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `${rarityColor}20`,
          borderRadius: '10px',
          filter: isLocked ? 'grayscale(1)' : 'none',
        }}
      >
        {isLocked ? '🔒' : title.emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: isLocked ? theme.colors.text.muted : theme.colors.text.primary,
            }}
          >
            {title.name}
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              background: `${rarityColor}30`,
              color: rarityColor,
              borderRadius: '4px',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {title.rarity}
          </span>
        </div>
        <p
          style={{
            margin: '2px 0 0 0',
            fontSize: '12px',
            color: theme.colors.text.muted,
          }}
        >
          {isLocked ? getRequirementText() : title.description}
        </p>
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: rarityColor,
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
    </div>
  );
};

export default TitleSelector;
