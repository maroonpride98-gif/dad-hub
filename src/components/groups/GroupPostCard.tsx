import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { GroupPost } from '../../types/group';
import { Card, ReactionBar } from '../common';
import { highlightMentions } from '../../utils/mentions';

interface GroupPostCardProps {
  post: GroupPost;
  currentUserId?: string;
  onLike: () => void;
  onReact: (emoji: string) => void;
  onComment?: () => void;
}

export const GroupPostCard: React.FC<GroupPostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onReact,
  onComment,
}) => {
  const { theme } = useTheme();
  const hasLiked = currentUserId ? post.likedBy?.includes(currentUserId) : false;

  // Format time
  const formatTime = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  // Render content with highlighted mentions
  const renderContent = () => {
    const segments = highlightMentions(post.content);

    return (
      <p
        style={{
          margin: 0,
          fontSize: '14px',
          color: theme.colors.text.primary,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
        }}
      >
        {segments.map((segment, i) =>
          segment.isMention ? (
            <span
              key={i}
              style={{
                color: theme.colors.accent.primary,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {segment.text}
            </span>
          ) : (
            <span key={i}>{segment.text}</span>
          )
        )}
      </p>
    );
  };

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '36px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.colors.background.secondary,
              borderRadius: '50%',
            }}
          >
            {post.avatar}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              {post.author}
            </div>
            <div
              style={{
                fontSize: '12px',
                color: theme.colors.text.muted,
              }}
            >
              {formatTime(post.createdAt)}
            </div>
          </div>

          {post.isPinned && (
            <span
              style={{
                fontSize: '12px',
                padding: '4px 8px',
                background: theme.colors.accent.primary + '20',
                color: theme.colors.accent.primary,
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              📌 Pinned
            </span>
          )}
        </div>

        {/* Content */}
        {renderContent()}

        {/* Image */}
        {post.imageUrl && (
          <img
            src={post.imageUrl}
            alt="Post"
            style={{
              width: '100%',
              borderRadius: '12px',
              maxHeight: '400px',
              objectFit: 'cover',
            }}
          />
        )}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '8px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Reactions */}
          <ReactionBar
            reactions={post.reactions}
            currentUserId={currentUserId}
            onReactionToggle={onReact}
          />

          {/* Like & Comment */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: hasLiked
                  ? `rgba(239, 68, 68, 0.15)`
                  : 'transparent',
                border: `1px solid ${hasLiked ? '#ef4444' : theme.colors.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                color: hasLiked ? '#ef4444' : theme.colors.text.secondary,
                fontWeight: hasLiked ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              <span>{hasLiked ? '❤️' : '🤍'}</span>
              <span>{post.likes}</span>
            </button>

            {onComment && (
              <button
                onClick={onComment}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: 'transparent',
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: theme.colors.text.secondary,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>💬</span>
                <span>{post.commentCount}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
