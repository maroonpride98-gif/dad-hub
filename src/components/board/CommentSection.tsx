import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Comment } from '../../types';
import { Button, Input } from '../common';

interface CommentSectionProps {
  discussionId: string;
  onClose: () => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ discussionId, onClose }) => {
  const { theme } = useTheme();
  const { comments, fetchComments, addComment } = useApp();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const discussionComments = comments[discussionId] || [];

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      await fetchComments(discussionId);
      setIsLoading(false);
    };
    loadComments();
  }, [discussionId, fetchComments]);

  const handleSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(discussionId, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>
          Comments ({discussionComments.length})
        </h4>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.text.muted,
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          ×
        </button>
      </div>

      {/* Comment Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSubmit} disabled={isSubmitting} size="small">
          {isSubmitting ? '...' : 'Post'}
        </Button>
      </div>

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading ? (
          <p style={{ color: theme.colors.text.muted, fontSize: '14px', textAlign: 'center' }}>
            Loading comments...
          </p>
        ) : discussionComments.length === 0 ? (
          <p style={{ color: theme.colors.text.muted, fontSize: '14px', textAlign: 'center' }}>
            No comments yet. Be the first to comment!
          </p>
        ) : (
          discussionComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const { theme, mode } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        padding: '10px',
        background: mode === 'dark' ? 'rgba(28, 25, 23, 0.5)' : 'rgba(231, 229, 228, 0.5)',
        borderRadius: '10px',
      }}
    >
      <div style={{ fontSize: '24px' }}>{comment.avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontWeight: 600, fontSize: '13px' }}>{comment.author}</span>
          <span style={{ color: theme.colors.text.muted, fontSize: '11px' }}>{comment.time}</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.secondary }}>
          {comment.text}
        </p>
      </div>
    </div>
  );
};
