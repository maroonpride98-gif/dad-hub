import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import {
  MentionUser,
  getCurrentMention,
  getMentionSuggestions,
  insertMention,
} from '../../utils/mentions';

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;
  submitOnEnter?: boolean;
}

export const MentionInput: React.FC<MentionInputProps> = ({
  value,
  onChange,
  placeholder = 'Type a message...',
  multiline = false,
  rows = 3,
  maxLength,
  disabled = false,
  autoFocus = false,
  onSubmit,
  submitOnEnter = false,
}) => {
  const { theme } = useTheme();
  const { friends } = useFriends();
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Convert friends to MentionUser format
  const mentionUsers: MentionUser[] = friends.map(f => ({
    id: f.friendId,
    name: f.friendName,
    avatar: f.friendAvatar,
  }));

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart || 0;

    onChange(newValue);
    setCursorPosition(newPosition);

    // Check for mention autocomplete
    const currentMention = getCurrentMention(newValue, newPosition);
    if (currentMention !== null) {
      const matches = getMentionSuggestions(currentMention, mentionUsers);
      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
      setSelectedIndex(0);
    } else {
      setShowSuggestions(false);
    }
  }, [onChange, mentionUsers]);

  // Handle selecting a suggestion
  const selectSuggestion = useCallback((user: MentionUser) => {
    const { newText, newCursorPosition } = insertMention(value, cursorPosition, user.name);
    onChange(newText);
    setShowSuggestions(false);

    // Focus back on input and set cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  }, [value, cursorPosition, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (showSuggestions) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % suggestions.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
          break;
        case 'Enter':
          if (suggestions[selectedIndex]) {
            e.preventDefault();
            selectSuggestion(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowSuggestions(false);
          break;
        case 'Tab':
          if (suggestions[selectedIndex]) {
            e.preventDefault();
            selectSuggestion(suggestions[selectedIndex]);
          }
          break;
      }
    } else if (submitOnEnter && e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  }, [showSuggestions, suggestions, selectedIndex, selectSuggestion, submitOnEnter, onSubmit]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    background: theme.colors.input,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: '12px',
    color: theme.colors.text.primary,
    fontSize: '14px',
    outline: 'none',
    resize: multiline ? 'vertical' : 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease',
  };

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <InputComponent
        ref={inputRef as React.RefObject<HTMLInputElement & HTMLTextAreaElement>}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onClick={(e) => {
          const target = e.target as HTMLInputElement | HTMLTextAreaElement;
          setCursorPosition(target.selectionStart || 0);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        maxLength={maxLength}
        rows={multiline ? rows : undefined}
        style={inputStyles}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.colors.accent.primary;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
        }}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: '4px',
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: theme.shadows.medium,
            zIndex: 100,
            maxHeight: '200px',
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {suggestions.map((user, index) => (
            <button
              key={user.id}
              onClick={() => selectSuggestion(user)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                background: index === selectedIndex
                  ? `rgba(217, 119, 6, 0.15)`
                  : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span style={{ fontSize: '24px' }}>{user.avatar}</span>
              <span
                style={{
                  color: theme.colors.text.primary,
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              >
                {user.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Hint text */}
      {value.includes('@') && !showSuggestions && (
        <div
          style={{
            position: 'absolute',
            right: '12px',
            bottom: multiline ? '12px' : '50%',
            transform: multiline ? 'none' : 'translateY(50%)',
            fontSize: '11px',
            color: theme.colors.text.muted,
          }}
        >
          Type @ to mention friends
        </div>
      )}
    </div>
  );
};

export default MentionInput;
