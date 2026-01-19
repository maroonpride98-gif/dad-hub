import React from 'react';
import { Discussion } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card, Badge, Button } from '../common';

interface TrendingDiscussionProps {
  discussion: Discussion;
  onSeeAll: () => void;
}

export const TrendingDiscussion: React.FC<TrendingDiscussionProps> = ({
  discussion,
  onSeeAll,
}) => {
  const { theme } = useTheme();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>🔥 Trending Now</h3>
        <Button variant="ghost" size="small" onClick={onSeeAll}>
          See All →
        </Button>
      </div>
      <Card hover onClick={onSeeAll}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ fontSize: '40px' }}>{discussion.avatar}</div>
          <div style={{ flex: 1 }}>
            <Badge variant="category" category={discussion.category}>
              {discussion.category}
            </Badge>
            <h4 style={{ margin: '10px 0 6px 0', fontSize: '17px', fontWeight: 700 }}>
              {discussion.title}
            </h4>
            <p style={{ margin: 0, color: theme.colors.text.secondary, fontSize: '14px' }}>
              {discussion.preview}
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                marginTop: '12px',
                color: theme.colors.text.muted,
                fontSize: '13px',
              }}
            >
              <span>💬 {discussion.replies}</span>
              <span>❤️ {discussion.likes}</span>
              <span>• {discussion.time}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
