import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Group, getCategoryInfo } from '../../types/group';
import { Card, Button } from '../common';

interface GroupCardProps {
  group: Group;
  onJoin?: () => void;
  onLeave?: () => void;
  onClick?: () => void;
  compact?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  group,
  onJoin,
  onLeave,
  onClick,
  compact = false,
}) => {
  const { theme } = useTheme();
  const categoryInfo = getCategoryInfo(group.category);

  if (compact) {
    return (
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px',
          background: theme.colors.card,
          borderRadius: '12px',
          border: `1px solid ${theme.colors.border}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (onClick) e.currentTarget.style.transform = 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          if (onClick) e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <div
          style={{
            fontSize: '32px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${categoryInfo.color}20`,
            borderRadius: '12px',
          }}
        >
          {group.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.primary,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {group.name}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: theme.colors.text.muted,
            }}
          >
            {group.memberCount} members
          </div>
        </div>

        {group.isMember && (
          <span
            style={{
              fontSize: '10px',
              padding: '4px 8px',
              background: theme.colors.success + '20',
              color: theme.colors.success,
              borderRadius: '8px',
              fontWeight: 600,
            }}
          >
            Joined
          </span>
        )}
      </div>
    );
  }

  return (
    <Card hover onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <div
            style={{
              fontSize: '40px',
              width: '64px',
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `${categoryInfo.color}20`,
              borderRadius: '16px',
              flexShrink: 0,
            }}
          >
            {group.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {group.name}
            </h3>

            <div
              style={{
                display: 'inline-block',
                marginTop: '4px',
                padding: '2px 8px',
                background: `${categoryInfo.color}20`,
                color: categoryInfo.color,
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
              }}
            >
              {group.category}
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: theme.colors.text.secondary,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {group.description}
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '12px',
            color: theme.colors.text.muted,
          }}
        >
          <span>👥 {group.memberCount} members</span>
          <span>📝 {group.postCount} posts</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {group.isMember ? (
            <>
              <Button
                variant="primary"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                fullWidth
              >
                View Group
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onLeave?.();
                }}
              >
                Leave
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onJoin?.();
              }}
              fullWidth
            >
              Join Group
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
