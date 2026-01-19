export interface MentionUser {
  id: string;
  name: string;
  avatar: string;
}

// Regex to match @mentions (alphanumeric and underscores)
const MENTION_REGEX = /@(\w+)/g;

/**
 * Parse text and extract all @mentions
 * Returns array of mentioned usernames (without @)
 */
export function parseMentions(text: string): string[] {
  const matches = text.match(MENTION_REGEX);
  if (!matches) return [];

  return matches.map(m => m.slice(1)); // Remove @ prefix
}

/**
 * Check if text contains any mentions
 */
export function hasMentions(text: string): boolean {
  return MENTION_REGEX.test(text);
}

/**
 * Get mention suggestions based on query and available users
 */
export function getMentionSuggestions(
  query: string,
  users: MentionUser[],
  limit: number = 5
): MentionUser[] {
  const lowerQuery = query.toLowerCase();

  return users
    .filter(user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.name.toLowerCase().split(' ').some(part => part.startsWith(lowerQuery))
    )
    .slice(0, limit);
}

/**
 * Get the current mention being typed (for autocomplete)
 * Returns the partial mention text (without @) or null if not in a mention
 */
export function getCurrentMention(text: string, cursorPosition: number): string | null {
  // Get text up to cursor
  const textToCursor = text.slice(0, cursorPosition);

  // Find the last @ before cursor
  const lastAtIndex = textToCursor.lastIndexOf('@');
  if (lastAtIndex === -1) return null;

  // Get text after @
  const afterAt = textToCursor.slice(lastAtIndex + 1);

  // Check if it's a valid partial mention (no spaces)
  if (afterAt.includes(' ')) return null;

  return afterAt;
}

/**
 * Insert a mention at the current position
 */
export function insertMention(
  text: string,
  cursorPosition: number,
  userName: string
): { newText: string; newCursorPosition: number } {
  const textToCursor = text.slice(0, cursorPosition);
  const textAfterCursor = text.slice(cursorPosition);

  // Find the last @ before cursor
  const lastAtIndex = textToCursor.lastIndexOf('@');
  if (lastAtIndex === -1) {
    return { newText: text, newCursorPosition: cursorPosition };
  }

  // Replace from @ to cursor with the full mention
  const beforeMention = text.slice(0, lastAtIndex);
  const mention = `@${userName.replace(/\s+/g, '')} `; // Remove spaces from username
  const newText = beforeMention + mention + textAfterCursor;
  const newCursorPosition = beforeMention.length + mention.length;

  return { newText, newCursorPosition };
}

/**
 * Highlight mentions in text for display
 * Returns an array of text segments with mention flags
 */
export interface TextSegment {
  text: string;
  isMention: boolean;
  userId?: string;
}

export function highlightMentions(
  text: string,
  userMap?: Map<string, string> // username -> userId map
): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  const regex = new RegExp(MENTION_REGEX);
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add text before mention
    if (match.index > lastIndex) {
      segments.push({
        text: text.slice(lastIndex, match.index),
        isMention: false,
      });
    }

    // Add mention
    const username = match[1];
    segments.push({
      text: match[0],
      isMention: true,
      userId: userMap?.get(username.toLowerCase()),
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.slice(lastIndex),
      isMention: false,
    });
  }

  return segments;
}

/**
 * Convert user IDs from mentions to notification targets
 */
export function getMentionedUserIds(
  text: string,
  userMap: Map<string, string> // username -> userId map
): string[] {
  const mentions = parseMentions(text);
  const userIds: string[] = [];

  for (const mention of mentions) {
    const userId = userMap.get(mention.toLowerCase());
    if (userId && !userIds.includes(userId)) {
      userIds.push(userId);
    }
  }

  return userIds;
}

/**
 * Sanitize text for safe mention parsing
 */
export function sanitizeMentionText(text: string): string {
  // Remove any HTML tags
  return text.replace(/<[^>]*>/g, '');
}
