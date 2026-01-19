import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePresence } from '../../context/PresenceContext';

interface OnlineStatusProps {
  userId: string;
  size?: 'small' | 'medium' | 'large';
  showLastSeen?: boolean;
  style?: React.CSSProperties;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  userId,
  size = 'medium',
  showLastSeen = false,
  style,
}) => {
  const { theme } = useTheme();
  const { getUserStatus, getLastSeen } = usePresence();

  const status = getUserStatus(userId);
  const lastSeen = getLastSeen(userId);

  const sizes = {
    small: 8,
    medium: 10,
    large: 14,
  };

  const dotSize = sizes[size];

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.success;
      case 'away':
        return '#f59e0b'; // Yellow/amber
      case 'offline':
      default:
        return theme.colors.text.muted;
    }
  };

  const formatLastSeen = (date: Date | null): string => {
    if (!date) return 'Offline';

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...style,
      }}
    >
      <div
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: getStatusColor(),
          boxShadow: status === 'online' ? `0 0 6px ${theme.colors.success}` : 'none',
          animation: status === 'online' ? 'pulse 2s infinite' : 'none',
        }}
      />

      {showLastSeen && status !== 'online' && (
        <span
          style={{
            fontSize: size === 'small' ? '10px' : '11px',
            color: theme.colors.text.muted,
          }}
        >
          {formatLastSeen(lastSeen)}
        </span>
      )}
    </div>
  );
};

// Simplified dot-only version for avatars
export const OnlineDot: React.FC<{
  userId: string;
  size?: number;
  position?: 'bottom-right' | 'top-right';
}> = ({ userId, size = 12, position = 'bottom-right' }) => {
  const { theme } = useTheme();
  const { isUserOnline } = usePresence();

  if (!isUserOnline(userId)) return null;

  const positionStyles: React.CSSProperties =
    position === 'bottom-right'
      ? { bottom: 0, right: 0 }
      : { top: 0, right: 0 };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles,
        width: size,
        height: size,
        borderRadius: '50%',
        background: theme.colors.success,
        border: `2px solid ${theme.colors.card}`,
        boxShadow: `0 0 6px ${theme.colors.success}`,
      }}
    />
  );
};
