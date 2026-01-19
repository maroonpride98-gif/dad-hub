import { useState, useMemo, useCallback } from 'react';
import { SearchResult, Discussion, Chat, DadEvent } from '../types';

interface UseSearchProps {
  discussions: Discussion[];
  chats: Chat[];
  events: DadEvent[];
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isSearching: boolean;
  clearSearch: () => void;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
}

export const useSearch = ({ discussions, chats, events }: UseSearchProps): UseSearchReturn => {
  const [query, setQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const isSearching = query.length > 0;

  const results = useMemo<SearchResult[]>(() => {
    if (!query.trim()) return [];

    const lowerQuery = query.toLowerCase();
    const searchResults: SearchResult[] = [];

    // Search discussions
    discussions.forEach((discussion) => {
      if (
        discussion.title.toLowerCase().includes(lowerQuery) ||
        discussion.preview.toLowerCase().includes(lowerQuery) ||
        discussion.author.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: `post-${discussion.id}`,
          type: 'post',
          title: discussion.title,
          subtitle: `${discussion.category} • ${discussion.author}`,
          emoji: discussion.avatar,
        });
      }
    });

    // Search chats
    chats.forEach((chat) => {
      if (chat.name.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: `chat-${chat.id}`,
          type: 'chat',
          title: chat.name,
          subtitle: `${chat.members} members`,
          emoji: chat.emoji,
        });
      }
    });

    // Search events
    events.forEach((event) => {
      if (
        event.title.toLowerCase().includes(lowerQuery) ||
        event.location.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: `event-${event.id}`,
          type: 'event',
          title: event.title,
          subtitle: `${event.date} • ${event.location}`,
          emoji: event.emoji,
        });
      }
    });

    return searchResults.slice(0, 10); // Limit results
  }, [query, discussions, chats, events]);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
    showSearch,
    setShowSearch,
  };
};
