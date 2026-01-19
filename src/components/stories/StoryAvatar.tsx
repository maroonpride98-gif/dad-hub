import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { UserStories } from '../../types/story';

interface StoryAvatarProps {
  userStories: UserStories;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  isOwn?: boolean;
}

export const StoryAvatar: React.FC<StoryAvatarProps> = ({
  userStories,
  onClick,
  size = 'medium',
  isOwn = false,
}) => {
  const { theme } = useTheme();

  const sizeStyles = {
    small: { avatar: 48, ring: 52, fontSize: '24px', name: '11px' },
    medium: { avatar: 60, ring: 66, fontSize: '32px', name: '12px' },
    large: { avatar: 72, ring: 80, fontSize: '40px', name: '13px' },
  };

  const styles = sizeStyles[size];
  const hasUnviewed = userStories.hasUnviewed;

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
      }}
    >
      {/* Avatar with ring */}
      <div
        style={{
          position: 'relative',
          width: styles.ring,
          height: styles.ring,
        }}
      >
        {/* Ring */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: hasUnviewed
              ? 'linear-gradient(45deg, #f59e0b, #ef4444, #ec4899)'
              : theme.colors.border,
            padding: '3px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: theme.colors.background.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: styles.avatar,
                height: styles.avatar,
                borderRadius: '50%',
                background: theme.colors.background.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: styles.fontSize,
              }}
            >
              {userStories.userAvatar}
            </div>
          </div>
        </div>

        {/* Add button for own stories */}
        {isOwn && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: theme.colors.accent.primary,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700,
              border: `2px solid ${theme.colors.background.primary}`,
            }}
          >
            +
          </div>
        )}
      </div>

      {/* Name */}
      <span
        style={{
          fontSize: styles.name,
          color: theme.colors.text.secondary,
          maxWidth: styles.ring + 10,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {isOwn ? 'Your Story' : userStories.userName.split(' ')[0]}
      </span>
    </button>
  );
};
