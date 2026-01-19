export interface PostReaction {
  emoji: string;
  userIds: string[];
  label: string;
}

export interface ReactionDefinition {
  emoji: string;
  label: string;
}

export const DAD_REACTIONS: ReactionDefinition[] = [
  { emoji: '👍', label: 'Dad Approved' },
  { emoji: '😂', label: 'Dad Joke Worthy' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💪', label: 'Strong Dad' },
  { emoji: '🍖', label: 'Grill Master' },
  { emoji: '🛠️', label: 'Handy Dad' },
  { emoji: '❤️', label: 'Love It' },
  { emoji: '🏆', label: 'Champion Dad' },
];

export interface ReactionSummary {
  totalCount: number;
  topReactions: { emoji: string; count: number }[];
  userReaction?: string;
}

export function getReactionSummary(reactions: PostReaction[], userId?: string): ReactionSummary {
  const totalCount = reactions.reduce((sum, r) => sum + r.userIds.length, 0);
  const topReactions = reactions
    .filter(r => r.userIds.length > 0)
    .sort((a, b) => b.userIds.length - a.userIds.length)
    .slice(0, 3)
    .map(r => ({ emoji: r.emoji, count: r.userIds.length }));

  let userReaction: string | undefined;
  if (userId) {
    const reaction = reactions.find(r => r.userIds.includes(userId));
    userReaction = reaction?.emoji;
  }

  return { totalCount, topReactions, userReaction };
}

export function initializeReactions(): PostReaction[] {
  return DAD_REACTIONS.map(r => ({
    emoji: r.emoji,
    label: r.label,
    userIds: [],
  }));
}
