export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  coverImage: string;
  category: PodcastCategory;
  episodeCount: number;
  rating: number;
  ratingCount: number;
  externalUrl: string;
  platform: 'spotify' | 'apple' | 'youtube' | 'other';
  isFeatured?: boolean;
  tags: string[];
}

export interface PodcastEpisode {
  id: string;
  podcastId: string;
  title: string;
  description: string;
  duration: number; // in seconds
  publishedAt: Date;
  audioUrl?: string;
  externalUrl: string;
  isNew?: boolean;
}

export type PodcastCategory = 'parenting' | 'humor' | 'advice' | 'stories' | 'health' | 'lifestyle';

export const PODCAST_CATEGORIES: Record<PodcastCategory, { label: string; emoji: string; color: string }> = {
  parenting: { label: 'Parenting', emoji: '👶', color: '#3b82f6' },
  humor: { label: 'Dad Humor', emoji: '😂', color: '#f59e0b' },
  advice: { label: 'Advice', emoji: '💡', color: '#22c55e' },
  stories: { label: 'Stories', emoji: '📖', color: '#8b5cf6' },
  health: { label: 'Health', emoji: '💪', color: '#ef4444' },
  lifestyle: { label: 'Lifestyle', emoji: '🏠', color: '#06b6d4' },
};

// Curated dad podcast list (mock data - in production these would be from an API)
export const CURATED_PODCASTS: Podcast[] = [
  {
    id: 'dad-tired',
    title: 'Dad Tired',
    host: 'Jerrad Lopes',
    description: 'Helping dads be the spiritual leaders of their family. Real talk about faith, family, and being a dad.',
    coverImage: '🎙️',
    category: 'advice',
    episodeCount: 250,
    rating: 4.8,
    ratingCount: 1250,
    externalUrl: 'https://dadtired.com/podcast',
    platform: 'spotify',
    isFeatured: true,
    tags: ['faith', 'leadership', 'family'],
  },
  {
    id: 'dad-jokes-podcast',
    title: 'The Dad Jokes Podcast',
    host: 'Various Dads',
    description: 'Weekly dose of the best (worst?) dad jokes. Groan-worthy puns and one-liners guaranteed.',
    coverImage: '🃏',
    category: 'humor',
    episodeCount: 180,
    rating: 4.5,
    ratingCount: 890,
    externalUrl: 'https://example.com/dadjokes',
    platform: 'apple',
    tags: ['jokes', 'comedy', 'puns'],
  },
  {
    id: 'first-time-dads',
    title: 'First Time Dads',
    host: 'New Dad Collective',
    description: 'Everything you need to know about being a first-time dad. From pregnancy to toddlerhood.',
    coverImage: '👨‍🍼',
    category: 'parenting',
    episodeCount: 120,
    rating: 4.7,
    ratingCount: 650,
    externalUrl: 'https://example.com/firsttimedads',
    platform: 'spotify',
    isFeatured: true,
    tags: ['newborn', 'first-time', 'tips'],
  },
  {
    id: 'dad-bod-fitness',
    title: 'Dad Bod Revolution',
    host: 'Coach Mike',
    description: 'Quick workouts and health tips for busy dads. Get fit without sacrificing family time.',
    coverImage: '🏋️',
    category: 'health',
    episodeCount: 95,
    rating: 4.6,
    ratingCount: 420,
    externalUrl: 'https://example.com/dadbod',
    platform: 'youtube',
    tags: ['fitness', 'health', 'quick workouts'],
  },
  {
    id: 'grill-talk',
    title: 'Grill Talk',
    host: 'BBQ Bros',
    description: 'Master the art of grilling while we discuss dad life. Recipes, tips, and conversations.',
    coverImage: '🍖',
    category: 'lifestyle',
    episodeCount: 75,
    rating: 4.4,
    ratingCount: 380,
    externalUrl: 'https://example.com/grilltalk',
    platform: 'spotify',
    tags: ['grilling', 'bbq', 'cooking'],
  },
  {
    id: 'bedtime-stories-dads',
    title: 'Bedtime Stories for Dads',
    host: 'Story Dads',
    description: 'Calming stories and discussions to help dads wind down. Plus stories to read to your kids.',
    coverImage: '🌙',
    category: 'stories',
    episodeCount: 200,
    rating: 4.9,
    ratingCount: 1100,
    externalUrl: 'https://example.com/bedtimestories',
    platform: 'apple',
    isFeatured: true,
    tags: ['bedtime', 'stories', 'relaxation'],
  },
  {
    id: 'teen-dad-talks',
    title: 'Surviving the Teen Years',
    host: 'Dr. Mark Thompson',
    description: 'Expert advice on navigating the teenage years. Communication, boundaries, and staying connected.',
    coverImage: '🎮',
    category: 'parenting',
    episodeCount: 85,
    rating: 4.7,
    ratingCount: 520,
    externalUrl: 'https://example.com/teendad',
    platform: 'spotify',
    tags: ['teenagers', 'communication', 'advice'],
  },
  {
    id: 'dad-hacks',
    title: 'Dad Hacks Weekly',
    host: 'Hack Dad',
    description: 'Life hacks, productivity tips, and clever solutions for everyday dad challenges.',
    coverImage: '🛠️',
    category: 'advice',
    episodeCount: 150,
    rating: 4.3,
    ratingCount: 680,
    externalUrl: 'https://example.com/dadhacks',
    platform: 'youtube',
    tags: ['hacks', 'productivity', 'tips'],
  },
];

export const getFeaturedPodcasts = (): Podcast[] => {
  return CURATED_PODCASTS.filter((p) => p.isFeatured);
};

export const getPodcastsByCategory = (category: PodcastCategory): Podcast[] => {
  return CURATED_PODCASTS.filter((p) => p.category === category);
};

export const getPodcastById = (id: string): Podcast | undefined => {
  return CURATED_PODCASTS.find((p) => p.id === id);
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};
