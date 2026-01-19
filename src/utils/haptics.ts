/**
 * Haptic feedback utilities for mobile devices
 * Uses the Vibration API where supported
 */

type VibrationPattern = number | number[];

const vibrate = (pattern: VibrationPattern): boolean => {
  if ('vibrate' in navigator) {
    return navigator.vibrate(pattern);
  }
  return false;
};

export const haptics = {
  /**
   * Light tap feedback - for selections, toggles
   */
  light: () => vibrate(10),

  /**
   * Medium feedback - for confirmations, button presses
   */
  medium: () => vibrate(25),

  /**
   * Heavy feedback - for important actions
   */
  heavy: () => vibrate(50),

  /**
   * Success feedback - for completed actions
   */
  success: () => vibrate([10, 50, 10]),

  /**
   * Error feedback - for failed actions
   */
  error: () => vibrate([50, 25, 50]),

  /**
   * Warning feedback - for caution alerts
   */
  warning: () => vibrate([25, 50, 25]),

  /**
   * Selection changed feedback
   */
  selection: () => vibrate(5),

  /**
   * Impact feedback for collisions, snaps
   */
  impact: () => vibrate([15, 10, 15]),

  /**
   * Notification feedback
   */
  notification: () => vibrate([20, 100, 20]),

  /**
   * Custom pattern
   */
  pattern: (pattern: VibrationPattern) => vibrate(pattern),

  /**
   * Stop any ongoing vibration
   */
  cancel: () => vibrate(0),

  /**
   * Check if haptics are supported
   */
  isSupported: () => 'vibrate' in navigator,
};

/**
 * Play haptic feedback with fallback handling
 */
export function playHaptic(type: keyof typeof haptics = 'light'): void {
  if (type === 'isSupported' || type === 'cancel' || type === 'pattern') return;

  try {
    const hapticFn = haptics[type];
    if (typeof hapticFn === 'function') {
      hapticFn();
    }
  } catch {
    // Silently fail - haptics are non-critical
  }
}
