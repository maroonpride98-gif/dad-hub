import { PostReaction } from './reaction';

export type DiscussionCategory = 'Advice' | 'Wins' | 'Gear' | 'Recipes' | 'Support';

export interface Discussion {
  id: string;
  category: DiscussionCategory;
  title: string;
  preview: string;
  content?: string;
  imageUrl?: string;
  authorId?: string;
  author: string;
  avatar: string;
  replies: number;
  likes: number;
  likedBy?: string[];
  reactions?: PostReaction[];
  mentions?: string[];
  time: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  discussionId: string;
  authorId: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  createdAt?: string;
  reactions?: PostReaction[];
  mentions?: string[];
}

export interface CategoryStyle {
  bg: string;
  text: string;
}

export type CategoryColors = Record<DiscussionCategory, CategoryStyle>;
