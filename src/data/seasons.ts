export interface SeasonDefinition {
  id: string;
  name: string;
  description: string;
  emoji: string;
  startMonth: number; // 1-12
  endMonth: number; // 1-12
  theme: SeasonTheme;
  exclusiveBadges: SeasonalBadge[];
  bonusXpMultiplier: number;
  specialQuests: SeasonalQuest[];
}

export interface SeasonTheme {
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  icon: string;
}

export interface SeasonalBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirement: string;
}

export interface SeasonalQuest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  target: number;
  type: string;
}

export const SEASONS: SeasonDefinition[] = [
  {
    id: 'fathers_day',
    name: "Father's Day Season",
    description: 'Celebrate the dads! Share your best dad moments and earn exclusive rewards.',
    emoji: '👔',
    startMonth: 6,
    endMonth: 6,
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      icon: '👔',
    },
    exclusiveBadges: [
      {
        id: 'fathers_day_2024',
        name: "Father's Day Hero",
        emoji: '👔',
        description: 'Celebrated Father\'s Day with Dad Hub',
        requirement: 'Log in during Father\'s Day week',
      },
      {
        id: 'super_dad_june',
        name: 'Super Dad of June',
        emoji: '🦸‍♂️',
        description: 'Top contributor during Father\'s Day season',
        requirement: 'Earn 500+ XP during the season',
      },
    ],
    bonusXpMultiplier: 1.5,
    specialQuests: [
      {
        id: 'fd_share_memory',
        title: 'Share a Dad Memory',
        description: 'Share a special memory with your dad or kids',
        xpReward: 50,
        target: 1,
        type: 'create_post',
      },
      {
        id: 'fd_spread_love',
        title: 'Spread the Love',
        description: 'React to 10 posts from other dads',
        xpReward: 30,
        target: 10,
        type: 'react_to_posts',
      },
    ],
  },
  {
    id: 'summer_bbq',
    name: 'Summer BBQ Season',
    description: 'Fire up the grill! Share recipes, tips, and backyard fun.',
    emoji: '🔥',
    startMonth: 7,
    endMonth: 8,
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      gradient: 'linear-gradient(135deg, #f59e0b, #dc2626)',
      icon: '🔥',
    },
    exclusiveBadges: [
      {
        id: 'grill_master_summer',
        name: 'Grill Master',
        emoji: '🔥',
        description: 'Mastered the summer BBQ',
        requirement: 'Share 5 BBQ-related posts',
      },
      {
        id: 'backyard_champion',
        name: 'Backyard Champion',
        emoji: '🏆',
        description: 'Dominated the summer leaderboard',
        requirement: 'Finish in top 10 of seasonal leaderboard',
      },
    ],
    bonusXpMultiplier: 1.25,
    specialQuests: [
      {
        id: 'bbq_recipe',
        title: 'Share a Recipe',
        description: 'Share your best BBQ recipe with the community',
        xpReward: 40,
        target: 1,
        type: 'create_post',
      },
      {
        id: 'bbq_tips',
        title: 'Grill Tips Master',
        description: 'Share 3 grilling tips',
        xpReward: 35,
        target: 3,
        type: 'add_comments',
      },
    ],
  },
  {
    id: 'back_to_school',
    name: 'Back to School Season',
    description: 'Share tips for the new school year and help fellow dads navigate it!',
    emoji: '📚',
    startMonth: 9,
    endMonth: 9,
    theme: {
      primaryColor: '#22c55e',
      secondaryColor: '#16a34a',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
      icon: '📚',
    },
    exclusiveBadges: [
      {
        id: 'homework_helper',
        name: 'Homework Helper',
        emoji: '📚',
        description: 'Helped fellow dads with school advice',
        requirement: 'Share 3 school-related tips',
      },
      {
        id: 'first_day_pro',
        name: 'First Day Pro',
        emoji: '🎒',
        description: 'Survived the first day of school chaos',
        requirement: 'Log in during first week of September',
      },
    ],
    bonusXpMultiplier: 1.25,
    specialQuests: [
      {
        id: 'bts_tips',
        title: 'School Tips',
        description: 'Share a back-to-school tip',
        xpReward: 35,
        target: 1,
        type: 'create_post',
      },
      {
        id: 'bts_support',
        title: 'Support Squad',
        description: 'Comment on 5 posts with helpful advice',
        xpReward: 30,
        target: 5,
        type: 'add_comments',
      },
    ],
  },
  {
    id: 'holiday_dad',
    name: 'Holiday Dad Season',
    description: 'Spread holiday cheer! Share traditions, gifts ideas, and festive moments.',
    emoji: '🎄',
    startMonth: 12,
    endMonth: 12,
    theme: {
      primaryColor: '#dc2626',
      secondaryColor: '#15803d',
      gradient: 'linear-gradient(135deg, #dc2626, #15803d)',
      icon: '🎄',
    },
    exclusiveBadges: [
      {
        id: 'holiday_spirit',
        name: 'Holiday Spirit',
        emoji: '🎄',
        description: 'Spread holiday cheer on Dad Hub',
        requirement: 'Share a holiday tradition post',
      },
      {
        id: 'santa_dad',
        name: 'Santa Dad',
        emoji: '🎅',
        description: 'The ultimate gift-giving dad',
        requirement: 'Help 10 dads with gift ideas',
      },
    ],
    bonusXpMultiplier: 1.5,
    specialQuests: [
      {
        id: 'holiday_tradition',
        title: 'Family Tradition',
        description: 'Share a family holiday tradition',
        xpReward: 50,
        target: 1,
        type: 'create_post',
      },
      {
        id: 'gift_helper',
        title: 'Gift Advisor',
        description: 'Help 5 dads with gift suggestions',
        xpReward: 40,
        target: 5,
        type: 'add_comments',
      },
    ],
  },
];

// Helper functions
export function getCurrentSeason(): SeasonDefinition | null {
  const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

  return SEASONS.find(season => {
    if (season.startMonth <= season.endMonth) {
      return currentMonth >= season.startMonth && currentMonth <= season.endMonth;
    } else {
      // Handle seasons that span year boundary (e.g., Dec-Jan)
      return currentMonth >= season.startMonth || currentMonth <= season.endMonth;
    }
  }) || null;
}

export function getSeasonById(id: string): SeasonDefinition | undefined {
  return SEASONS.find(s => s.id === id);
}

export function getUpcomingSeason(): SeasonDefinition | null {
  const currentMonth = new Date().getMonth() + 1;

  // Sort seasons by start month and find the next one
  const sortedSeasons = [...SEASONS].sort((a, b) => a.startMonth - b.startMonth);

  // Find next season after current month
  const upcoming = sortedSeasons.find(s => s.startMonth > currentMonth);

  // If none found, return the first season of next year
  return upcoming || sortedSeasons[0];
}

export function getSeasonProgress(season: SeasonDefinition): number {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (currentMonth < season.startMonth || currentMonth > season.endMonth) {
    return 0;
  }

  const totalDays = (season.endMonth - season.startMonth + 1) * 30; // Approximate
  const elapsedDays = (currentMonth - season.startMonth) * 30 + currentDay;

  return Math.min(Math.round((elapsedDays / totalDays) * 100), 100);
}
