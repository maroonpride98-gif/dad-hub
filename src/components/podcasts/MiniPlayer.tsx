import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Podcast, PodcastEpisode, formatDuration } from '../../data/podcasts';

interface MiniPlayerProps {
  podcast: Podcast;
  episode?: PodcastEpisode;
  onClose: () => void;
  onOpenExternal: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  podcast,
  episode,
  onClose,
  onOpenExternal,
}) => {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        left: 0,
        right: 0,
        background: theme.colors.card,
        borderTop: `1px solid ${theme.colors.border}`,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        zIndex: 900,
        transition: 'transform 0.3s ease',
      }}
    >
      {/* Mini View */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
        }}
      >
        {/* Cover */}
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
            flexShrink: 0,
          }}
        >
          {podcast.coverImage}
        </div>

        {/* Info */}
        <div
          style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
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
            {episode?.title || podcast.title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: theme.colors.text.muted,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {podcast.host}
            {episode && ` • ${formatDuration(episode.duration)}`}
          </p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenExternal}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              color: '#fff',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ▶️
          </button>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: 'none',
              background: theme.colors.background.secondary,
              color: theme.colors.text.secondary,
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div
          style={{
            padding: '0 16px 16px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <p
            style={{
              margin: '12px 0',
              fontSize: '13px',
              color: theme.colors.text.secondary,
              lineHeight: 1.5,
            }}
          >
            {episode?.description || podcast.description}
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={onOpenExternal}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
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
              🎧 Listen on {podcast.platform.charAt(0).toUpperCase() + podcast.platform.slice(1)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniPlayer;
