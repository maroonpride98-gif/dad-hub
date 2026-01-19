import React from 'react';
import { SearchResult } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, onResultClick }) => {
  const { theme } = useTheme();

  const getTypeLabel = (type: SearchResult['type']): string => {
    switch (type) {
      case 'post':
        return 'Discussion';
      case 'chat':
        return 'Chat';
      case 'event':
        return 'Event';
      case 'user':
        return 'User';
      default:
        return 'Result';
    }
  };

  const getTypeBgColor = (type: SearchResult['type']): string => {
    switch (type) {
      case 'post':
        return 'rgba(59, 130, 246, 0.15)';
      case 'chat':
        return 'rgba(34, 197, 94, 0.15)';
      case 'event':
        return 'rgba(249, 115, 22, 0.15)';
      case 'user':
        return 'rgba(168, 85, 247, 0.15)';
      default:
        return theme.colors.card;
    }
  };

  const getTypeTextColor = (type: SearchResult['type']): string => {
    switch (type) {
      case 'post':
        return '#60a5fa';
      case 'chat':
        return '#4ade80';
      case 'event':
        return '#fb923c';
      case 'user':
        return '#c084fc';
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {results.map((result) => (
        <div
          key={result.id}
          onClick={() => onResultClick(result)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            borderRadius: '12px',
            background: theme.colors.card,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: getTypeBgColor(result.type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0,
            }}
          >
            {result.emoji}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontWeight: 600,
                fontSize: '14px',
                color: theme.colors.text.primary,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {result.title}
            </p>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: theme.colors.text.muted,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {result.subtitle}
            </p>
          </div>

          <span
            style={{
              padding: '4px 10px',
              background: getTypeBgColor(result.type),
              color: getTypeTextColor(result.type),
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {getTypeLabel(result.type)}
          </span>
        </div>
      ))}
    </div>
  );
};
