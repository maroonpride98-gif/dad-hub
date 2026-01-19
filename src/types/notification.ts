export type NotificationType =
  | 'message'
  | 'like'
  | 'comment'
  | 'event'
  | 'badge'
  | 'mention'
  | 'friend_request'
  | 'friend_accepted'
  | 'dm_message'
  | 'reaction'
  | 'group_invite'
  | 'group_post'
  | 'story_view'
  | 'story_reaction'
  | 'level_up'
  | 'streak_milestone'
  | 'leaderboard_rank'
  | 'xp_gained';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  actionUrl?: string;
  relatedUserId?: string;
  relatedChatId?: number;
  relatedRequestId?: string;
}
