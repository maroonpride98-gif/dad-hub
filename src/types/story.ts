export type StoryType = 'image' | 'text';

export interface StoryReaction {
  emoji: string;
  userId: string;
  userName: string;
  timestamp?: Date;
}

export interface Story {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  type: StoryType;
  content: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
  expiresAt: Date;
  createdAt: Date;
  viewedBy: string[];
  viewCount: number;
  reactions: StoryReaction[];
  hasViewed?: boolean;
}

export interface UserStories {
  userId: string;
  userName: string;
  userAvatar: string;
  stories: Story[];
  hasUnviewed: boolean;
  latestStoryTime: Date;
}

export interface StoryInput {
  type: StoryType;
  content: string;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

export const STORY_BACKGROUNDS = [
  { id: 'gradient1', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 'gradient2', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 'gradient3', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 'gradient4', value: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 'gradient5', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 'gradient6', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { id: 'gradient7', value: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)' },
  { id: 'gradient8', value: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 'solid1', value: '#1a1a2e' },
  { id: 'solid2', value: '#16213e' },
  { id: 'solid3', value: '#0f3460' },
  { id: 'solid4', value: '#533483' },
];

export const STORY_DURATION_HOURS = 24;

export function isStoryExpired(story: Story): boolean {
  return new Date() > new Date(story.expiresAt);
}

export function getStoryExpiresAt(): Date {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + STORY_DURATION_HOURS);
  return expiresAt;
}

export function groupStoriesByUser(stories: Story[], currentUserId?: string): UserStories[] {
  const userMap = new Map<string, UserStories>();

  for (const story of stories) {
    if (isStoryExpired(story)) continue;

    const existing = userMap.get(story.authorId);
    const hasViewed = currentUserId ? story.viewedBy.includes(currentUserId) : false;

    if (existing) {
      existing.stories.push({ ...story, hasViewed });
      if (!hasViewed) existing.hasUnviewed = true;
      if (new Date(story.createdAt) > existing.latestStoryTime) {
        existing.latestStoryTime = new Date(story.createdAt);
      }
    } else {
      userMap.set(story.authorId, {
        userId: story.authorId,
        userName: story.authorName,
        userAvatar: story.authorAvatar,
        stories: [{ ...story, hasViewed }],
        hasUnviewed: !hasViewed,
        latestStoryTime: new Date(story.createdAt),
      });
    }
  }

  return Array.from(userMap.values()).sort((a, b) => {
    if (a.hasUnviewed && !b.hasUnviewed) return -1;
    if (!a.hasUnviewed && b.hasUnviewed) return 1;
    return b.latestStoryTime.getTime() - a.latestStoryTime.getTime();
  });
}
