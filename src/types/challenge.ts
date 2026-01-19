export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  points: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  participantCount: number;
  createdBy: string;
  createdAt?: string;
}

export type ChallengeType =
  | 'photo'       // Submit a photo
  | 'activity'    // Complete an activity and share
  | 'poll'        // Vote-based challenge
  | 'streak';     // Daily streak challenge

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedBy: string[];
  createdAt?: string;
}
