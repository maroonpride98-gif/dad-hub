import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DAD_REACTIONS } from '../../types/reaction';

interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
  disabled?: boolean;
  compact?: boolean;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSelect,
  selectedEmoji,
  disabled = false,
  compact = false,
}) => {
  const { theme } = useTheme();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const handleSelect = (emoji: string) => {
    if (disabled) return;
    onSelect(emoji);
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: compact ? '4px' : '8px',
        padding: compact ? '6px 8px' : '8px 12px',
        background: theme.colors.card,
        borderRadius: '16px',
        border: `1px solid ${theme.colors.border}`,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      {DAD_REACTIONS.map((reaction) => (
        <div
          key={reaction.emoji}
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowTooltip(reaction.emoji)}
          onMouseLeave={() => setShowTooltip(null)}
        >
          <button
            onClick={() => handleSelect(reaction.emoji)}
            disabled={disabled}
            style={{
              fontSize: compact ? '18px' : '24px',
              padding: compact ? '4px 6px' : '6px 10px',
              background: selectedEmoji === reaction.emoji
                ? `rgba(217, 119, 6, 0.3)`
                : 'transparent',
              border: selectedEmoji === reaction.emoji
                ? `2px solid ${theme.colors.accent.primary}`
                : '2px solid transparent',
              borderRadius: '10px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
              transition: 'all 0.2s ease',
              transform: showTooltip === reaction.emoji ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            {reaction.emoji}
          </button>

          {/* Tooltip */}
          {showTooltip === reaction.emoji && !compact && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '8px',
                padding: '6px 10px',
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '12px',
                fontWeight: 500,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                zIndex: 100,
                boxShadow: theme.shadows.medium,
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              {reaction.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

interface ReactionPickerTriggerProps {
  onSelect: (emoji: string) => void;
  selectedEmoji?: string;
  disabled?: boolean;
  triggerIcon?: string;
}

export const ReactionPickerTrigger: React.FC<ReactionPickerTriggerProps> = ({
  onSelect,
  selectedEmoji,
  disabled = false,
  triggerIcon = '😀',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        style={{
          fontSize: '20px',
          padding: '6px 10px',
          background: 'transparent',
          border: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'transform 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      >
        {selectedEmoji || triggerIcon}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99,
            }}
            onClick={() => setIsOpen(false)}
          />

          {/* Picker Popup */}
          <div
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease',
            }}
          >
            <ReactionPicker
              onSelect={handleSelect}
              selectedEmoji={selectedEmoji}
              disabled={disabled}
              compact
            />
          </div>
        </>
      )}
    </div>
  );
};
