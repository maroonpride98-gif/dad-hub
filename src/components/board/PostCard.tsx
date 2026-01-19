import React, { useState } from 'react';
import { Discussion } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Badge } from '../common';
import { CommentSection } from './CommentSection';
import { UserProfileModal } from '../profile';

interface PostCardProps {
  post: Discussion;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme } = useTheme();
  const { likedPosts, toggleLike } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isLiked = likedPosts.has(post.id);
  const likeCount = post.likes + (isLiked ? 1 : 0);

  return (
    <>
      <Card hover>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div
            style={{ fontSize: '40px', cursor: 'pointer' }}
            onClick={() => post.authorId && setShowProfile(true)}
          >
            {post.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '8px',
              }}
            >
              <Badge variant="category" category={post.category}>
                {post.category}
              </Badge>
              <span style={{ color: theme.colors.text.muted, fontSize: '12px' }}>
                {post.time}
              </span>
            </div>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>
              {post.title}
            </h4>
            <p style={{ margin: '0 0 4px 0', color: theme.colors.text.muted, fontSize: '13px' }}>
              by{' '}
              <span
                onClick={() => post.authorId && setShowProfile(true)}
                style={{ cursor: 'pointer', color: theme.colors.accent.secondary }}
              >
                {post.author}
              </span>
            </p>
          <p
            style={{
              margin: '0 0 12px 0',
              color: theme.colors.text.secondary,
              fontSize: '14px',
            }}
          >
            {post.content || post.preview}
          </p>

          {/* Post Image */}
          {post.imageUrl && (
            <div style={{ marginBottom: '12px' }}>
              <img
                src={post.imageUrl}
                alt="Post image"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                }}
                onClick={() => window.open(post.imageUrl, '_blank')}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '20px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(post.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: isLiked ? theme.colors.error : theme.colors.text.muted,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s',
              }}
            >
              {isLiked ? '❤️' : '🤍'} {likeCount}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: showComments ? theme.colors.accent.primary : theme.colors.text.muted,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'color 0.2s',
              }}
            >
              💬 {post.replies}
            </button>
          </div>

          {showComments && (
            <CommentSection
              discussionId={post.id}
              onClose={() => setShowComments(false)}
            />
          )}
        </div>
      </div>
    </Card>

    {showProfile && post.authorId && (
      <UserProfileModal
        userId={post.authorId}
        onClose={() => setShowProfile(false)}
      />
    )}
  </>
  );
};
