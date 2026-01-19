import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { WISDOM_PROMPTS, WISDOM_CATEGORIES, WisdomCategory } from '../../types/wisdom';

interface WisdomPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  selectedCategory?: WisdomCategory | null;
  onCategoryChange?: (category: WisdomCategory | null) => void;
}

export const WisdomPrompts: React.FC<WisdomPromptsProps> = ({
  onSelectPrompt,
  selectedCategory,
  onCategoryChange,
}) => {
  const { theme } = useTheme();

  const filteredPrompts = selectedCategory
    ? WISDOM_PROMPTS.filter(p => p.category === selectedCategory)
    : WISDOM_PROMPTS;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Category Filters */}
      {onCategoryChange && (
        <div
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => onCategoryChange(null)}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: 600,
              background: !selectedCategory
                ? theme.colors.accent.gradient
                : theme.colors.card,
              color: !selectedCategory
                ? theme.colors.background.primary
                : theme.colors.text.secondary,
              border: `1px solid ${!selectedCategory ? 'transparent' : theme.colors.border}`,
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            All
          </button>
          {WISDOM_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 600,
                background: selectedCategory === cat.id
                  ? `${cat.color}30`
                  : theme.colors.card,
                color: selectedCategory === cat.id
                  ? cat.color
                  : theme.colors.text.secondary,
                border: `1px solid ${selectedCategory === cat.id ? cat.color : theme.colors.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Prompts Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '12px',
        }}
      >
        {filteredPrompts.map(prompt => {
          const category = WISDOM_CATEGORIES.find(c => c.id === prompt.category);

          return (
            <button
              key={prompt.id}
              onClick={() => onSelectPrompt(prompt.prompt)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = category?.color || theme.colors.accent.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            >
              <span style={{ fontSize: '24px' }}>{prompt.icon}</span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 500,
                    color: theme.colors.text.primary,
                    lineHeight: 1.4,
                  }}
                >
                  {prompt.prompt}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '6px',
                    fontSize: '10px',
                    color: category?.color,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {category?.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
