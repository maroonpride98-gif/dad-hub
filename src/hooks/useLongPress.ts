import { useRef, useCallback, useState } from 'react';

interface LongPressConfig {
  onLongPress: () => void;
  onPress?: () => void;
  duration?: number;
  cancelOnMove?: boolean;
  moveThreshold?: number;
}

export function useLongPress(config: LongPressConfig) {
  const {
    onLongPress,
    onPress,
    duration = 500,
    cancelOnMove = true,
    moveThreshold = 10,
  } = config;

  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const longPressTriggeredRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      setIsPressed(true);
      longPressTriggeredRef.current = false;

      // Get start position
      if ('touches' in e) {
        startPosRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else {
        startPosRef.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }

      // Start timer for long press
      timerRef.current = setTimeout(() => {
        longPressTriggeredRef.current = true;
        onLongPress();
      }, duration);
    },
    [duration, onLongPress]
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!cancelOnMove || !startPosRef.current) return;

      let currentX: number, currentY: number;
      if ('touches' in e) {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }

      const deltaX = Math.abs(currentX - startPosRef.current.x);
      const deltaY = Math.abs(currentY - startPosRef.current.y);

      if (deltaX > moveThreshold || deltaY > moveThreshold) {
        clearTimer();
        setIsPressed(false);
      }
    },
    [cancelOnMove, moveThreshold, clearTimer]
  );

  const handleEnd = useCallback(() => {
    clearTimer();
    setIsPressed(false);

    // If long press wasn't triggered, handle as regular press
    if (!longPressTriggeredRef.current && onPress) {
      onPress();
    }

    startPosRef.current = null;
  }, [clearTimer, onPress]);

  const handleCancel = useCallback(() => {
    clearTimer();
    setIsPressed(false);
    startPosRef.current = null;
  }, [clearTimer]);

  return {
    isPressed,
    handlers: {
      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
      onTouchCancel: handleCancel,
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleCancel,
    },
  };
}
