export type MilestoneCategory = 'first' | 'school' | 'sports' | 'funny' | 'health' | 'social' | 'creative' | 'other';

export const MILESTONE_CATEGORIES: Record<MilestoneCategory, { label: string; emoji: string; color: string }> = {
  first: { label: 'First Times', emoji: '⭐', color: '#f59e0b' },
  school: { label: 'School', emoji: '📚', color: '#3b82f6' },
  sports: { label: 'Sports', emoji: '⚽', color: '#22c55e' },
  funny: { label: 'Funny Moments', emoji: '😂', color: '#ec4899' },
  health: { label: 'Health', emoji: '💪', color: '#ef4444' },
  social: { label: 'Social', emoji: '👫', color: '#8b5cf6' },
  creative: { label: 'Creative', emoji: '🎨', color: '#06b6d4' },
  other: { label: 'Other', emoji: '📌', color: '#6b7280' },
};

export interface Kid {
  id: string;
  name: string;
  birthDate: Date;
  avatar: string;
  color: string;
}

export interface Milestone {
  id: string;
  userId: string;
  kidId: string;
  kidName: string;
  title: string;
  description?: string;
  category: MilestoneCategory;
  date: Date;
  age?: string; // e.g., "2 years, 3 months"
  imageUrl?: string;
  photoUrl?: string; // Photo gallery URL
  isFavorite?: boolean;
  createdAt: Date;
}

export const calculateAge = (birthDate: Date, milestoneDate: Date): string => {
  const birth = new Date(birthDate);
  const milestone = new Date(milestoneDate);

  let years = milestone.getFullYear() - birth.getFullYear();
  let months = milestone.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years === 0) {
    return months === 1 ? '1 month' : `${months} months`;
  }

  if (months === 0) {
    return years === 1 ? '1 year' : `${years} years`;
  }

  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
};

export const MILESTONE_SUGGESTIONS: { category: MilestoneCategory; title: string }[] = [
  { category: 'first', title: 'First steps' },
  { category: 'first', title: 'First words' },
  { category: 'first', title: 'First tooth' },
  { category: 'first', title: 'First haircut' },
  { category: 'first', title: 'First bike ride' },
  { category: 'school', title: 'First day of school' },
  { category: 'school', title: 'Learned to read' },
  { category: 'school', title: 'Got an A+' },
  { category: 'school', title: 'School play' },
  { category: 'sports', title: 'First goal' },
  { category: 'sports', title: 'Joined a team' },
  { category: 'sports', title: 'Won a trophy' },
  { category: 'sports', title: 'Learned to swim' },
  { category: 'funny', title: 'Said something hilarious' },
  { category: 'funny', title: 'Epic tantrum' },
  { category: 'funny', title: 'Caught being sneaky' },
  { category: 'social', title: 'Made a best friend' },
  { category: 'social', title: 'First sleepover' },
  { category: 'social', title: 'Birthday party' },
  { category: 'creative', title: 'First drawing' },
  { category: 'creative', title: 'Built something cool' },
  { category: 'creative', title: 'Learned an instrument' },
  { category: 'health', title: 'Lost first tooth' },
  { category: 'health', title: 'Grew 2 inches' },
];
