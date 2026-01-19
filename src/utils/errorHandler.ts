// Firebase error code to user-friendly message mapping
const firebaseErrorMessages: Record<string, string> = {
  // Auth errors
  'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Check your connection and try again.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/cancelled-popup-request': 'Only one sign-in popup can be open at a time.',
  'auth/requires-recent-login': 'Please log out and log back in to continue.',

  // Firestore errors
  'permission-denied': "You don't have permission to do that.",
  'not-found': 'The requested data was not found.',
  'already-exists': 'This item already exists.',
  'resource-exhausted': 'Too many requests. Please wait a moment.',
  'failed-precondition': 'Operation failed. Please refresh and try again.',
  'aborted': 'Operation was cancelled. Please try again.',
  'out-of-range': 'Invalid data provided.',
  'unavailable': 'Service temporarily unavailable. Please try again later.',
  'data-loss': 'Data was corrupted. Please contact support.',
  'unauthenticated': 'Please log in to continue.',

  // Storage errors
  'storage/unauthorized': "You don't have permission to access this file.",
  'storage/canceled': 'Upload was cancelled.',
  'storage/unknown': 'An unknown error occurred during upload.',
  'storage/object-not-found': 'File not found.',
  'storage/quota-exceeded': 'Storage quota exceeded.',
  'storage/retry-limit-exceeded': 'Upload failed. Please try again.',
};

// Generic error messages
const genericMessages: Record<string, string> = {
  network: 'Connection error. Please check your internet and try again.',
  timeout: 'Request timed out. Please try again.',
  unknown: 'Something went wrong. Please try again.',
  offline: "You're offline. Some features may be limited.",
};

/**
 * Get a user-friendly error message from an error
 */
export function getUserFriendlyError(error: unknown): string {
  // Handle null/undefined
  if (!error) {
    return genericMessages.unknown;
  }

  // Handle Firebase errors
  if (typeof error === 'object' && error !== null) {
    const err = error as { code?: string; message?: string };

    // Check for Firebase error codes
    if (err.code) {
      const message = firebaseErrorMessages[err.code];
      if (message) {
        return message;
      }
    }

    // Check for network errors
    if (err.message) {
      if (err.message.toLowerCase().includes('network')) {
        return genericMessages.network;
      }
      if (err.message.toLowerCase().includes('timeout')) {
        return genericMessages.timeout;
      }
      if (err.message.toLowerCase().includes('offline')) {
        return genericMessages.offline;
      }
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  return genericMessages.unknown;
}

/**
 * Check if the user is offline
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Log error for debugging (in production, send to error tracking service)
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(`[${timestamp}]${context ? ` [${context}]` : ''} Error:`, errorMessage);
  if (stack) {
    console.error('Stack:', stack);
  }

  // In production, you'd send this to an error tracking service like Sentry
  // if (process.env.NODE_ENV === 'production') {
  //   sendToErrorTracking({ error, context, timestamp });
  // }
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  onError?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    logError(error);
    onError?.(error);
    return null;
  }
}
