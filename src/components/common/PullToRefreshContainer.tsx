import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { usePullToRefresh } from '../../hooks/usePullToRefresh';
import { haptics } from '../../utils/haptics';

interface PullToRefreshContainerProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
}

export const PullToRefreshContainer: React.FC<PullToRefreshContainerProps> = ({
  children,
  onRefresh,
  disabled = false,
}) => {
  const { theme } = useTheme();

  const handleRefresh = async () => {
    haptics.medium();
    await onRefresh();
    haptics.success();
  };

  const { pullDistance, isRefreshing, progress, shouldTrigger, handlers } =
    usePullToRefresh({
      onRefresh: handleRefresh,
      threshold: 80,
      disabled,
    });

  // Trigger haptic when threshold is reached
  React.useEffect(() => {
    if (shouldTrigger && !isRefreshing) {
      haptics.selection();
    }
  }, [shouldTrigger, isRefreshing]);

  return (
    <div
      {...handlers}
      style={{
        position: 'relative',
        minHeight: '100%',
      }}
    >
      {/* Pull Indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: `${Math.max(pullDistance, isRefreshing ? 60 : 0)}px`,
            overflow: 'hidden',
            transition: isRefreshing ? 'height 0.3s ease' : 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              opacity: Math.min(progress, 1),
              transform: `scale(${0.5 + progress * 0.5}) rotate(${progress * 180}deg)`,
              transition: isRefreshing ? 'transform 0.3s ease' : 'none',
            }}
          >
            {isRefreshing ? (
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  border: `2px solid ${theme.colors.border}`,
                  borderTopColor: theme.colors.accent.primary,
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: '24px',
                  transform: shouldTrigger ? 'scale(1.2)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                {shouldTrigger ? '🔄' : '⬇️'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  );
};
