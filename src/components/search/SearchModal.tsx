import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { useSearch } from '../../hooks/useSearch';
import { Input } from '../common';
import { SearchResults } from './SearchResults';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { theme, mode } = useTheme();
  const { discussions, events, chats, setActiveTab } = useApp();

  const {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
  } = useSearch({ discussions, chats, events });

  if (!isOpen) return null;

  const handleResultClick = (result: { type: string; id: string }) => {
    clearSearch();
    onClose();

    // Navigate to the appropriate tab based on result type
    switch (result.type) {
      case 'post':
        setActiveTab('board');
        break;
      case 'chat':
        setActiveTab('chat');
        break;
      case 'event':
        setActiveTab('events');
        break;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 200,
        }}
      />

      {/* Modal */}
      <div
        className="fade-in"
        style={{
          position: 'fixed',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 200px)',
          background: mode === 'dark' ? '#292524' : '#fafaf9',
          borderRadius: '20px',
          boxShadow: theme.shadows.large,
          border: `1px solid ${theme.colors.border}`,
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Search Input */}
        <div style={{ padding: '20px', borderBottom: `1px solid ${theme.colors.border}` }}>
          <Input
            icon="🔍"
            placeholder="Search posts, chats, events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {/* Results */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {!isSearching ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme.colors.text.muted,
              }}
            >
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>
                🔍
              </span>
              <p>Start typing to search</p>
            </div>
          ) : results.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: theme.colors.text.muted,
              }}
            >
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>
                😕
              </span>
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <SearchResults results={results} onResultClick={handleResultClick} />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: `1px solid ${theme.colors.border}`,
            fontSize: '12px',
            color: theme.colors.text.muted,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Press ESC to close</span>
          <span>{results.length} results</span>
        </div>
      </div>
    </>
  );
};
