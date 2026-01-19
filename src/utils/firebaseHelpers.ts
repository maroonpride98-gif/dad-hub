import { Timestamp } from 'firebase/firestore';

/**
 * Format a date into a relative time string
 */
export function formatTime(date: Date | undefined | null): string {
  if (!date) return '';

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
}

/**
 * Format a date for display (e.g., "2:33 PM")
 */
export function formatMessageTime(date: Date | undefined | null): string {
  if (!date) return '';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Convert a JavaScript Date to Firestore Timestamp
 */
export function toFirestoreTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Convert a Firestore Timestamp to JavaScript Date
 */
export function fromFirestoreTimestamp(timestamp: Timestamp | undefined | null): Date | null {
  if (!timestamp) return null;
  return timestamp.toDate();
}

/**
 * Format a date for event display (e.g., "Jan 25")
 */
export function formatEventDate(date: Date | undefined | null): string {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format time for event display (e.g., "2:00 PM")
 */
export function formatEventTime(date: Date | undefined | null): string {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Generate a unique ID (for client-side use before Firestore generates one)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
