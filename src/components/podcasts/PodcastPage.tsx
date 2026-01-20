import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Podcast,
  PodcastCategory,
  CURATED_PODCASTS,
  PODCAST_CATEGORIES,
  getFeaturedPodcasts,
} from '../../data/podcasts';
import { PodcastCard } from './PodcastCard';
import { MiniPlayer } from './MiniPlayer';

export const PodcastPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<PodcastCategory | 'all'>('all');
  const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const featuredPodcasts = getFeaturedPodcasts();

  const filteredPodcasts = CURATED_PODCASTS.filter((podcast) => {
    const matchesCategory = selectedCategory === 'all' || podcast.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      podcast.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
      podcast.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleSelectPodcast = (podcast: Podcast) => {
    setSelectedPodcast(podcast);
  };

  const handleOpenExternal = () => {
    if (selectedPodcast) {
      window.open(selectedPodcast.externalUrl, '_blank');
    }
  };

  const categories: { id: PodcastCategory | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '🎧' },
    ...Object.entries(PODCAST_CATEGORIES).map(([id, info]) => ({
      id: id as PodcastCategory,
      label: info.label,
      emoji: info.emoji,
    })),
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: selectedPodcast ? '180px' : '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #059669, #10b981)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎙️ Dad Podcasts
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Curated podcasts for dads, by dads
        </p>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 16px',
            background: theme.colors.background.secondary,
            borderRadius: '12px',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <span style={{ fontSize: '16px' }}>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search podcasts..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: theme.colors.text.primary,
              fontSize: '15px',
            }}
          />
        </div>
      </div>

      {/* Featured Section */}
      {!searchQuery && selectedCategory === 'all' && featuredPodcasts.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3
            style={{
              margin: '0 0 12px 0',
              padding: '0 20px',
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            ⭐ Featured
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '0 20px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}
          >
            {featuredPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onSelect={handleSelectPodcast}
                variant="featured"
              />
            ))}
          </div>
        </div>
      )}

      {/* Category Filters */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 20px 16px',
          overflowX: 'auto',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '10px 16px',
              background:
                selectedCategory === cat.id
                  ? theme.colors.accent.primary
                  : theme.colors.background.secondary,
              border: 'none',
              borderRadius: '20px',
              color: selectedCategory === cat.id ? '#fff' : theme.colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Podcasts List */}
      <div style={{ padding: '0 20px' }}>
        {filteredPodcasts.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              No podcasts found
            </h3>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredPodcasts.map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onSelect={handleSelectPodcast}
              />
            ))}
          </div>
        )}
      </div>

      {/* Submit Podcast CTA */}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
            borderRadius: '16px',
            border: `1px dashed ${theme.colors.accent.primary}40`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📬</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
            Know a great dad podcast?
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: theme.colors.text.secondary }}>
            Submit your favorite podcast to be featured in our collection!
          </p>
          <button
            style={{
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Submit Podcast
          </button>
        </div>
      </div>

      {/* Mini Player */}
      {selectedPodcast && (
        <MiniPlayer
          podcast={selectedPodcast}
          onClose={() => setSelectedPodcast(null)}
          onOpenExternal={handleOpenExternal}
        />
      )}
    </div>
  );
};

export default PodcastPage;
