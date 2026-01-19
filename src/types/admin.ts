// Admin user with moderation fields
export interface AdminUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  avatar: string;
  dadSince: string;
  kids: number;
  points: number;
  isAdmin: boolean;
  isModerator?: boolean;
  isBanned?: boolean;
  banReason?: string;
  status: 'active' | 'suspended' | 'banned';
  createdAt: Date;
  lastLogin: Date;
}

// Platform analytics
export interface PlatformAnalytics {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  activeUsersMonth: number;
  newUsersToday: number;
  newUsersWeek: number;
  newUsersMonth: number;
}

// Engagement metrics
export interface EngagementMetrics {
  totalPosts: number;
  totalComments: number;
  totalEvents: number;
  totalJokes: number;
  postsToday: number;
  commentsToday: number;
  eventsCreatedToday: number;
  jokesSharedToday: number;
}

// Growth data point for charts
export interface GrowthDataPoint {
  date: string;
  users: number;
  posts: number;
  events: number;
}

// Combined analytics
export interface AdminAnalytics {
  platform: PlatformAnalytics;
  engagement: EngagementMetrics;
  growth: GrowthDataPoint[];
}

// Content types that can be reported
export type ContentType = 'post' | 'comment' | 'joke' | 'event' | 'chat';

// Report status
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

// Report reasons
export type ReportReason = 'spam' | 'harassment' | 'inappropriate' | 'misinformation' | 'other';

// Content report
export interface ContentReport {
  id: string;
  contentId: string;
  contentType: ContentType;
  contentPreview: string;
  reportedBy: string;
  reportedByName: string;
  authorId: string;
  authorName: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  resolution?: string;
  createdAt: Date;
}

// Moderation action log
export interface ModerationAction {
  id: string;
  adminId: string;
  adminName: string;
  targetUserId?: string;
  targetContentId?: string;
  actionType: 'ban' | 'unban' | 'warn' | 'delete' | 'restore' | 'set_moderator' | 'remove_moderator';
  reason: string;
  createdAt: Date;
}

// Admin dashboard views
export type AdminView = 'overview' | 'users' | 'moderation' | 'analytics';
