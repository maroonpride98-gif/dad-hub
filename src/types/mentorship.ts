export interface Mentor {
  userId: string;
  name: string;
  avatar: string;
  bio?: string;
  expertise: MentorExpertise[];
  yearsAsDad: number;
  kidsCount: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  matchedMentees: string[];
  maxMentees: number;
}

export type MentorExpertise =
  | 'newborn'
  | 'toddler'
  | 'school_age'
  | 'teenager'
  | 'work_life_balance'
  | 'single_dad'
  | 'step_dad'
  | 'special_needs'
  | 'sports_coaching'
  | 'education'
  | 'tech_parenting'
  | 'nutrition';

export const EXPERTISE_INFO: Record<MentorExpertise, { label: string; emoji: string }> = {
  newborn: { label: 'Newborn Care', emoji: '👶' },
  toddler: { label: 'Toddler Wrangling', emoji: '🧸' },
  school_age: { label: 'School Age Kids', emoji: '📚' },
  teenager: { label: 'Teen Parenting', emoji: '🎮' },
  work_life_balance: { label: 'Work-Life Balance', emoji: '⚖️' },
  single_dad: { label: 'Single Dad Life', emoji: '💪' },
  step_dad: { label: 'Blended Families', emoji: '👨‍👩‍👧‍👦' },
  special_needs: { label: 'Special Needs', emoji: '💙' },
  sports_coaching: { label: 'Sports & Coaching', emoji: '⚽' },
  education: { label: 'Education Support', emoji: '🎓' },
  tech_parenting: { label: 'Tech & Screen Time', emoji: '📱' },
  nutrition: { label: 'Healthy Eating', emoji: '🥗' },
};

export interface MentorshipRequest {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  mentorId: string;
  message: string;
  expertiseNeeded: MentorExpertise[];
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface MentorshipMatch {
  id: string;
  mentorId: string;
  menteeId: string;
  startedAt: Date;
  lastActivity: Date;
  status: 'active' | 'completed' | 'paused';
}

export interface MentorReview {
  id: string;
  mentorId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}
