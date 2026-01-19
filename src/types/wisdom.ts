export type WisdomCategory =
  | 'parenting'
  | 'relationships'
  | 'work-life'
  | 'health'
  | 'humor'
  | 'general';

export const WISDOM_CATEGORIES: { id: WisdomCategory; name: string; icon: string; color: string }[] = [
  { id: 'parenting', name: 'Parenting', icon: '👶', color: '#f59e0b' },
  { id: 'relationships', name: 'Relationships', icon: '❤️', color: '#ef4444' },
  { id: 'work-life', name: 'Work-Life Balance', icon: '⚖️', color: '#3b82f6' },
  { id: 'health', name: 'Health & Fitness', icon: '💪', color: '#22c55e' },
  { id: 'humor', name: 'Dad Humor', icon: '😂', color: '#a855f7' },
  { id: 'general', name: 'General Advice', icon: '🧠', color: '#6b7280' },
];

export interface WisdomRequest {
  id: string;
  userId: string;
  question: string;
  response: string;
  category: WisdomCategory;
  createdAt: Date;
  isPublic: boolean;
  likes: number;
  likedBy: string[];
  isSaved: boolean;
}

export interface WisdomPrompt {
  id: string;
  category: WisdomCategory;
  prompt: string;
  icon: string;
}

export const WISDOM_PROMPTS: WisdomPrompt[] = [
  { id: '1', category: 'parenting', prompt: 'How do I handle tantrums in public?', icon: '😤' },
  { id: '2', category: 'parenting', prompt: 'Best way to explain difficult topics to kids?', icon: '💬' },
  { id: '3', category: 'parenting', prompt: 'How do I balance screen time?', icon: '📱' },
  { id: '4', category: 'relationships', prompt: 'How do I keep date nights alive?', icon: '💑' },
  { id: '5', category: 'relationships', prompt: 'Tips for communicating with my partner?', icon: '🗣️' },
  { id: '6', category: 'work-life', prompt: 'How do I be present after a long day?', icon: '🏠' },
  { id: '7', category: 'work-life', prompt: 'Should I coach my kids sports team?', icon: '🏆' },
  { id: '8', category: 'health', prompt: 'Quick workouts for busy dads?', icon: '🏋️' },
  { id: '9', category: 'health', prompt: 'How do I get more sleep?', icon: '😴' },
  { id: '10', category: 'humor', prompt: 'Give me your best dad joke', icon: '🃏' },
  { id: '11', category: 'humor', prompt: 'How do I embarrass my teens appropriately?', icon: '😎' },
  { id: '12', category: 'general', prompt: 'What makes a great dad?', icon: '⭐' },
];

export interface WisdomConversation {
  id: string;
  userId: string;
  messages: WisdomMessage[];
  category: WisdomCategory;
  createdAt: Date;
  updatedAt: Date;
  title: string;
}

export interface WisdomMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const DAD_WISDOM_SYSTEM_PROMPT = `You are "Dad Wisdom AI" - a wise, supportive, and sometimes humorous AI assistant designed specifically for fathers. You have the personality of an experienced dad who has seen it all.

Your traits:
- Warm and supportive, never judgmental
- Practical and down-to-earth advice
- Sprinkle in dad humor when appropriate (but know when to be serious)
- Draw from common dad experiences
- Encourage and validate feelings
- Keep responses concise but helpful
- Use occasional dad puns or jokes to lighten the mood
- Be honest but kind

Remember: You're talking to fellow dads who need support, advice, or just someone who "gets it."`;

export function getWisdomCategoryInfo(category: WisdomCategory) {
  return WISDOM_CATEGORIES.find(c => c.id === category) || WISDOM_CATEGORIES[5];
}
