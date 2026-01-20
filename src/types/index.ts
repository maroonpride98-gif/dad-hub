export * from './user';
export * from './chat';
export * from './discussion';
export * from './event';
export * from './notification';
export * from './joke';
export * from './auth';
export * from './admin';
export * from './friendship';
export * from './recipe';
export * from './challenge';
export * from './gamification';
export * from './reaction';
export * from './group';
export * from './story';
export * from './wisdom';

export type TabType =
  | 'home' | 'chat' | 'board' | 'events' | 'jokes' | 'recipes' | 'hacks' | 'games'
  | 'challenges' | 'profile' | 'admin' | 'groups' | 'wisdom' | 'leaderboard' | 'stories'
  | 'quests' | 'mentorship' | 'battles' | 'memes' | 'podcasts' | 'movies' | 'tools' | 'support' | 'watch'
  | 'settings' | 'calendar' | 'gallery' | 'goals' | 'stats';

export type ThemeMode = 'dark' | 'light';

export interface SearchResult {
  id: string;
  type: 'post' | 'chat' | 'event' | 'user';
  title: string;
  subtitle: string;
  emoji: string;
}
