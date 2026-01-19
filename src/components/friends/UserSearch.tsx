import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { Input } from '../common';
import { UserSearchResult } from './UserSearchResult';
import { UserSearchResult as UserSearchResultType } from '../../types';

export const UserSearch: React.FC = () => {
  const { theme } = useTheme();
  const { searchUsers } = useFriends();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResultType[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search effect
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await searchUsers(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchUsers]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Input
        placeholder="Search by name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        icon="🔍"
      />

      {query.trim() === '' ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <span style={{ fontSize: '40px' }}>🔍</span>
          <p style={{ color: theme.colors.text.muted, margin: '12px 0 0' }}>
            Search for other dads to add as friends
          </p>
        </div>
      ) : isSearching ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <p style={{ color: theme.colors.text.muted }}>Searching...</p>
        </div>
      ) : results.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <span style={{ fontSize: '40px' }}>🤷</span>
          <p style={{ color: theme.colors.text.muted, margin: '12px 0 0' }}>
            No dads found matching "{query}"
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <p
            style={{ margin: 0, color: theme.colors.text.muted, fontSize: '13px' }}
          >
            {results.length} result{results.length !== 1 ? 's' : ''}
          </p>
          {results.map((user) => (
            <UserSearchResult key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};
