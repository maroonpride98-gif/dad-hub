import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentSeason, getUpcomingSeason, getSeasonProgress, SeasonDefinition } from '../../data/seasons';
import { haptics } from '../../utils/haptics';

interface SeasonBannerProps {
  onViewLeaderboard?: () => void;
  compact?: boolean;
}

export const SeasonBanner: React.FC<SeasonBannerProps> = ({
  onViewLeaderboard,
  compact = false,
}) => {
  const { theme } = useTheme();
  const [currentSeason, setCurrentSeason] = useState<SeasonDefinition | null>(null);
  const [upcomingSeason, setUpcomingSeason] = useState<SeasonDefinition | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const season = getCurrentSeason();
    setCurrentSeason(season);

    if (season) {
      setProgress(getSeasonProgress(season));
    } else {
      setUpcomingSeason(getUpcomingSeason());
    }
  }, []);

  if (!currentSeason && !upcomingSeason) {
    return null;
  }

  const activeSeason = currentSeason || upcomingSeason!;
  const isActive = !!currentSeason;

  if (compact) {
    return (
      <div
        onClick={() => {
          haptics.light();
          setShowDetails(true);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          background: activeSeason.theme.gradient,
          borderRadius: '12px',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '20px' }}>{activeSeason.emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
            {isActive ? 'Active Season' : 'Coming Soon'}
          </p>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff' }}>
            {activeSeason.name}
          </p>
        </div>
        {isActive && (
          <div
            style={{
              padding: '4px 10px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#fff',
            }}
          >
            {activeSeason.bonusXpMultiplier}x XP
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: activeSeason.theme.gradient,
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            right: '-20px',
            fontSize: '120px',
            opacity: 0.1,
          }}
        >
          {activeSeason.emoji}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginRight: '16px',
              }}
            >
              {activeSeason.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: '0 0 4px 0',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.8)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                {isActive ? 'Current Season' : 'Coming Soon'}
              </p>
              <h3
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {activeSeason.name}
              </h3>
            </div>
            {isActive && (
              <div
                style={{
                  padding: '6px 14px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {activeSeason.bonusXpMultiplier}x XP
              </div>
            )}
          </div>

          {/* Description */}
          <p
            style={{
              margin: '0 0 16px 0',
              fontSize: '14px',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.5,
            }}
          >
            {activeSeason.description}
          </p>

          {/* Progress Bar (if active) */}
          {isActive && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                  Season Progress
                </span>
                <span style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>
                  {progress}%
                </span>
              </div>
              <div
                style={{
                  height: '8px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${progress}%`,
                    background: '#fff',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          )}

          {/* Badges Preview */}
          <div style={{ marginBottom: '16px' }}>
            <p
              style={{
                margin: '0 0 8px 0',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.8)',
                textTransform: 'uppercase',
              }}
            >
              Exclusive Badges
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {activeSeason.exclusiveBadges.map((badge) => (
                <div
                  key={badge.id}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{badge.emoji}</span>
                  <span style={{ fontSize: '12px', color: '#fff', fontWeight: 500 }}>
                    {badge.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          {isActive && onViewLeaderboard && (
            <button
              onClick={() => {
                haptics.light();
                onViewLeaderboard();
              }}
              style={{
                width: '100%',
                padding: '14px',
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '12px',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>🏆</span>
              <span>View Seasonal Leaderboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <SeasonDetailsModal
          season={activeSeason}
          isActive={isActive}
          onClose={() => setShowDetails(false)}
          theme={theme}
        />
      )}
    </>
  );
};

// Season Details Modal
const SeasonDetailsModal: React.FC<{
  season: SeasonDefinition;
  isActive: boolean;
  onClose: () => void;
  theme: any;
}> = ({ season, isActive, onClose, theme }) => {
  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '80vh',
          background: theme.colors.background.primary,
          borderRadius: '20px 20px 0 0',
          zIndex: 1000,
          overflow: 'auto',
        }}
      >
        {/* Header with gradient */}
        <div
          style={{
            background: season.theme.gradient,
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>{season.emoji}</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: 700, color: '#fff' }}>
            {season.name}
          </h3>
          {isActive && (
            <div
              style={{
                display: 'inline-block',
                padding: '6px 14px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#fff',
              }}
            >
              {season.bonusXpMultiplier}x XP Bonus Active
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{ margin: '0 0 24px 0', color: theme.colors.text.secondary }}>
            {season.description}
          </p>

          {/* Exclusive Badges */}
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: theme.colors.text.primary }}>
            Exclusive Badges
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            {season.exclusiveBadges.map((badge) => (
              <div
                key={badge.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  background: theme.colors.card,
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
                    background: `${season.theme.primaryColor}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  {badge.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                    {badge.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                    {badge.requirement}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Special Quests */}
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: theme.colors.text.primary }}>
            Special Quests
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {season.specialQuests.map((quest) => (
              <div
                key={quest.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  borderRadius: '12px',
                }}
              >
                <div>
                  <p style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                    {quest.title}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                    {quest.description}
                  </p>
                </div>
                <div
                  style={{
                    padding: '6px 12px',
                    background: `${season.theme.primaryColor}20`,
                    borderRadius: '8px',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: season.theme.primaryColor }}>
                    +{quest.xpReward} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <div style={{ padding: '0 24px 24px 24px' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              background: theme.colors.background.secondary,
              border: 'none',
              borderRadius: '12px',
              color: theme.colors.text.secondary,
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default SeasonBanner;
