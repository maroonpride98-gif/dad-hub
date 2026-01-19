import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '8px',
  style,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: theme.colors.background.secondary,
        animation: 'shimmer 1.5s infinite linear',
        backgroundImage: `linear-gradient(
          90deg,
          ${theme.colors.background.secondary} 0%,
          ${theme.colors.card} 50%,
          ${theme.colors.background.secondary} 100%
        )`,
        backgroundSize: '200% 100%',
        ...style,
      }}
    />
  );
};

export const SkeletonText: React.FC<{ lines?: number; gap?: number }> = ({
  lines = 3,
  gap = 8,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="14px"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: number }> = ({ size = 48 }) => {
  return <Skeleton width={size} height={size} borderRadius="50%" />;
};

export const SkeletonCard: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        padding: '20px',
        background: theme.colors.card,
        borderRadius: '20px',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <SkeletonAvatar size={44} />
        <div style={{ flex: 1 }}>
          <Skeleton width="40%" height="14px" style={{ marginBottom: '8px' }} />
          <Skeleton width="25%" height="12px" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number; gap?: number }> = ({
  count = 3,
  gap = 16,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonChatItem: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: theme.colors.card,
        borderRadius: '12px',
      }}
    >
      <SkeletonAvatar size={52} />
      <div style={{ flex: 1 }}>
        <Skeleton width="50%" height="14px" style={{ marginBottom: '8px' }} />
        <Skeleton width="70%" height="12px" />
      </div>
      <Skeleton width="40px" height="12px" />
    </div>
  );
};
