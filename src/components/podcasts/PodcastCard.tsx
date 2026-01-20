import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Podcast, PODCAST_CATEGORIES } from '../../data/podcasts';

interface PodcastCardProps {
  podcast: Podcast;
  onSelect: (podcast: Podcast) => void;
  variant?: 'default' | 'compact' | 'featured';
}

export const PodcastCard: React.FC<PodcastCardProps> = ({
  podcast,
  onSelect,
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const categoryInfo = PODCAST_CATEGORIES[podcast.category];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#f59e0b' }}>★</span>);
      } else if (i === fullStars && hasHalf) {
        stars.push(<span key={i} style={{ color: '#f59e0b' }}>☆</span>);
      } else {
        stars.push(<span key={i} style={{ color: theme.colors.text.muted }}>☆</span>);
      }
    }
    return stars;
  };

  const getPlatformIcon = (platform: Podcast['platform']) => {
    switch (platform) {
      case 'spotify':
        return '🟢';
      case 'apple':
        return '🍎';
      case 'youtube':
        return '🔴';
      default:
        return '🎧';
    }
  };

  if (variant === 'compact') {
    return (
      <div
        onClick={() => onSelect(podcast)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: theme.colors.card,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`,
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            width: '48px',
            height: '48px',
            borderRadius: '10px',
            background: theme.colors.background.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {podcast.coverImage}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: '14px',
              color: theme.colors.text.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {podcast.title}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
            {podcast.host}
          </p>
        </div>
        <span style={{ fontSize: '16px' }}>{getPlatformIcon(podcast.platform)}</span>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        onClick={() => onSelect(podcast)}
        style={{
          background: `linear-gradient(135deg, ${categoryInfo.color}40, ${categoryInfo.color}20)`,
          borderRadius: '20px',
          padding: '20px',
          cursor: 'pointer',
          minWidth: '280px',
          border: `1px solid ${categoryInfo.color}40`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '12px' }}>
          <div
            style={{
              fontSize: '48px',
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: theme.colors.background.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {podcast.coverImage}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  padding: '4px 8px',
                  background: categoryInfo.color,
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#fff',
                }}
              >
                ⭐ FEATURED
              </span>
            </div>
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '18px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {podcast.title}
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.secondary }}>
              {podcast.host}
            </p>
          </div>
        </div>

        <p
          style={{
            margin: '0 0 12px 0',
            fontSize: '13px',
            color: theme.colors.text.secondary,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {podcast.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '13px' }}>{renderStars(podcast.rating)}</span>
            <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
              ({podcast.ratingCount})
            </span>
          </div>
          <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
            {podcast.episodeCount} episodes
          </span>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      onClick={() => onSelect(podcast)}
      style={{
        background: theme.colors.card,
        borderRadius: '16px',
        padding: '16px',
        border: `1px solid ${theme.colors.border}`,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <div
          style={{
            fontSize: '40px',
            width: '64px',
            height: '64px',
            borderRadius: '12px',
            background: theme.colors.background.secondary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {podcast.coverImage}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h4
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {podcast.title}
            </h4>
            <span style={{ fontSize: '14px' }}>{getPlatformIcon(podcast.platform)}</span>
          </div>

          <p style={{ margin: '0 0 6px 0', fontSize: '13px', color: theme.colors.text.muted }}>
            by {podcast.host}
          </p>

          <p
            style={{
              margin: '0 0 10px 0',
              fontSize: '13px',
              color: theme.colors.text.secondary,
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {podcast.description}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                background: `${categoryInfo.color}20`,
                borderRadius: '12px',
                fontSize: '12px',
                color: categoryInfo.color,
              }}
            >
              {categoryInfo.emoji} {categoryInfo.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '12px' }}>{renderStars(podcast.rating)}</span>
              <span style={{ fontSize: '11px', color: theme.colors.text.muted }}>
                {podcast.rating}
              </span>
            </div>
            <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
              {podcast.episodeCount} eps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
