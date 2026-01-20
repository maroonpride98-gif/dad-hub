export type TitleRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface TitleDefinition {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: TitleRarity;
  requirement: TitleRequirement;
}

export interface TitleRequirement {
  type: 'level' | 'badges' | 'streak' | 'posts' | 'jokes' | 'friends' | 'xp' | 'special';
  threshold: number;
  specialCondition?: string;
}

export const TITLE_RARITY_COLORS: Record<TitleRarity, string> = {
  common: '#78716c',
  rare: '#3b82f6',
  epic: '#8b5cf6',
  legendary: '#f59e0b',
};

export const DAD_TITLES: TitleDefinition[] = [
  // Common Titles (Level & Basic Requirements)
  {
    id: 'rookie_dad',
    name: 'Rookie Dad',
    emoji: '🍼',
    description: 'Just getting started on the dad journey',
    rarity: 'common',
    requirement: { type: 'level', threshold: 1 },
  },
  {
    id: 'diaper_champ',
    name: 'Diaper Champ',
    emoji: '👶',
    description: 'Survived the diaper days',
    rarity: 'common',
    requirement: { type: 'level', threshold: 2 },
  },
  {
    id: 'bedtime_storyteller',
    name: 'Bedtime Storyteller',
    emoji: '📖',
    description: 'Master of "just one more story"',
    rarity: 'common',
    requirement: { type: 'level', threshold: 3 },
  },
  {
    id: 'snack_provider',
    name: 'Snack Provider',
    emoji: '🍎',
    description: 'Always has goldfish crackers ready',
    rarity: 'common',
    requirement: { type: 'posts', threshold: 5 },
  },
  {
    id: 'playground_warrior',
    name: 'Playground Warrior',
    emoji: '🏃',
    description: 'Champion of tag and hide-and-seek',
    rarity: 'common',
    requirement: { type: 'xp', threshold: 250 },
  },

  // Rare Titles (Achievement-based)
  {
    id: 'grill_sergeant',
    name: 'Grill Sergeant',
    emoji: '🔥',
    description: 'Master of the backyard BBQ',
    rarity: 'rare',
    requirement: { type: 'level', threshold: 4 },
  },
  {
    id: 'joke_guru',
    name: 'Joke Guru',
    emoji: '😂',
    description: 'Certified dad joke expert',
    rarity: 'rare',
    requirement: { type: 'jokes', threshold: 10 },
  },
  {
    id: 'bedtime_whisperer',
    name: 'Bedtime Whisperer',
    emoji: '🌙',
    description: 'Gets kids to sleep on the first try',
    rarity: 'rare',
    requirement: { type: 'streak', threshold: 7 },
  },
  {
    id: 'tech_dad',
    name: 'Tech Dad',
    emoji: '💻',
    description: 'Fixes WiFi and sets up the Xbox',
    rarity: 'rare',
    requirement: { type: 'badges', threshold: 5 },
  },
  {
    id: 'carpool_captain',
    name: 'Carpool Captain',
    emoji: '🚗',
    description: 'Navigates school traffic like a pro',
    rarity: 'rare',
    requirement: { type: 'friends', threshold: 10 },
  },
  {
    id: 'lunch_box_artist',
    name: 'Lunch Box Artist',
    emoji: '🎨',
    description: 'Creates Instagram-worthy lunches',
    rarity: 'rare',
    requirement: { type: 'xp', threshold: 750 },
  },
  {
    id: 'assembly_master',
    name: 'Assembly Master',
    emoji: '🔧',
    description: 'Builds IKEA furniture without leftover parts',
    rarity: 'rare',
    requirement: { type: 'posts', threshold: 15 },
  },

  // Epic Titles (Hard to achieve)
  {
    id: 'super_dad',
    name: 'Super Dad',
    emoji: '🦸',
    description: 'Handles chaos with superhuman calm',
    rarity: 'epic',
    requirement: { type: 'level', threshold: 6 },
  },
  {
    id: 'dad_bod_legend',
    name: 'Dad Bod Legend',
    emoji: '💪',
    description: 'Rocks the dad bod with pride',
    rarity: 'epic',
    requirement: { type: 'streak', threshold: 30 },
  },
  {
    id: 'pun_master',
    name: 'Pun Master',
    emoji: '🎭',
    description: 'Weaponizes wordplay at every opportunity',
    rarity: 'epic',
    requirement: { type: 'jokes', threshold: 50 },
  },
  {
    id: 'homework_hero',
    name: 'Homework Hero',
    emoji: '📚',
    description: 'Explains common core math without crying',
    rarity: 'epic',
    requirement: { type: 'badges', threshold: 10 },
  },
  {
    id: 'patience_saint',
    name: 'Saint of Patience',
    emoji: '😇',
    description: 'Survives "are we there yet?" 1000 times',
    rarity: 'epic',
    requirement: { type: 'xp', threshold: 2500 },
  },
  {
    id: 'community_pillar',
    name: 'Community Pillar',
    emoji: '🏛️',
    description: 'A cornerstone of the dad community',
    rarity: 'epic',
    requirement: { type: 'friends', threshold: 25 },
  },

  // Legendary Titles (Elite status)
  {
    id: 'dad_of_the_year',
    name: 'Dad of the Year',
    emoji: '🏆',
    description: 'Recognized excellence in dadding',
    rarity: 'legendary',
    requirement: { type: 'level', threshold: 8 },
  },
  {
    id: 'legendary_father',
    name: 'Legendary Father',
    emoji: '👑',
    description: 'Stories of your dadding will echo through eternity',
    rarity: 'legendary',
    requirement: { type: 'level', threshold: 9 },
  },
  {
    id: 'dad_god',
    name: 'Dad God',
    emoji: '🌟',
    description: 'Achieved true enlightenment in fatherhood',
    rarity: 'legendary',
    requirement: { type: 'level', threshold: 10 },
  },
  {
    id: 'joke_champion',
    name: 'Joke Champion',
    emoji: '🎖️',
    description: 'Won the ultimate dad joke showdown',
    rarity: 'legendary',
    requirement: { type: 'special', threshold: 1, specialCondition: 'win_joke_battle' },
  },
  {
    id: 'founding_father',
    name: 'Founding Father',
    emoji: '🦅',
    description: 'One of the original Dad Hub members',
    rarity: 'legendary',
    requirement: { type: 'special', threshold: 1, specialCondition: 'early_adopter' },
  },
  {
    id: 'iron_streak',
    name: 'Iron Streak',
    emoji: '⚡',
    description: 'Maintained a 100-day login streak',
    rarity: 'legendary',
    requirement: { type: 'streak', threshold: 100 },
  },
];

// Helper functions
export function getTitleById(id: string): TitleDefinition | undefined {
  return DAD_TITLES.find(t => t.id === id);
}

export function getTitlesByRarity(rarity: TitleRarity): TitleDefinition[] {
  return DAD_TITLES.filter(t => t.rarity === rarity);
}

export function getUnlockedTitles(stats: {
  level: number;
  badges: number;
  streak: number;
  posts: number;
  jokes: number;
  friends: number;
  xp: number;
}): TitleDefinition[] {
  return DAD_TITLES.filter(title => {
    if (title.requirement.type === 'special') return false;

    switch (title.requirement.type) {
      case 'level':
        return stats.level >= title.requirement.threshold;
      case 'badges':
        return stats.badges >= title.requirement.threshold;
      case 'streak':
        return stats.streak >= title.requirement.threshold;
      case 'posts':
        return stats.posts >= title.requirement.threshold;
      case 'jokes':
        return stats.jokes >= title.requirement.threshold;
      case 'friends':
        return stats.friends >= title.requirement.threshold;
      case 'xp':
        return stats.xp >= title.requirement.threshold;
      default:
        return false;
    }
  });
}

export function getDefaultTitle(): TitleDefinition {
  return DAD_TITLES[0]; // Rookie Dad
}
