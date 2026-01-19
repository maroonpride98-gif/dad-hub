import { useState, useRef, useCallback } from 'react';

interface PullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
  disabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export function usePullToRefresh(config: PullToRefreshConfig) {
  const { onRefresh, threshold = 80, maxPull = 120, disabled = false } = config;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || state.isRefreshing) return;

      // Only start pull if at top of scrollable area
      const element = e.currentTarget as HTMLElement;
      if (element.scrollTop > 0) return;

      startY.current = e.touches[0].clientY;
      setState((prev) => ({ ...prev, isPulling: true }));
    },
    [disabled, state.isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!state.isPulling || disabled || state.isRefreshing) return;

      currentY.current = e.touches[0].clientY;
      const delta = currentY.current - startY.current;

      if (delta > 0) {
        // Apply resistance to make it feel natural
        const resistance = 0.5;
        const pullDistance = Math.min(delta * resistance, maxPull);
        setState((prev) => ({ ...prev, pullDistance }));

        // Prevent default scroll when pulling
        if (pullDistance > 10) {
          e.preventDefault();
        }
      }
    },
    [state.isPulling, state.isRefreshing, disabled, maxPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!state.isPulling || disabled) return;

    if (state.pullDistance >= threshold) {
      setState((prev) => ({ ...prev, isRefreshing: true, pullDistance: threshold }));

      try {
        await onRefresh();
      } finally {
        setState({ isPulling: false, pullDistance: 0, isRefreshing: false });
      }
    } else {
      setState({ isPulling: false, pullDistance: 0, isRefreshing: false });
    }
  }, [state.isPulling, state.pullDistance, threshold, onRefresh, disabled]);

  const progress = Math.min(state.pullDistance / threshold, 1);
  const shouldTrigger = state.pullDistance >= threshold;

  return {
    pullDistance: state.pullDistance,
    isRefreshing: state.isRefreshing,
    isPulling: state.isPulling,
    progress,
    shouldTrigger,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
