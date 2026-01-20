import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { MemeTemplate, MEME_TEMPLATES } from '../../data/memeTemplates';

interface MemeTemplatesProps {
  selectedId: string | null;
  onSelect: (template: MemeTemplate) => void;
}

export const MemeTemplates: React.FC<MemeTemplatesProps> = ({ selectedId, onSelect }) => {
  const { theme } = useTheme();

  const categories = [
    { id: 'classic', label: 'Classic Dad', emoji: '👴' },
    { id: 'relatable', label: 'Relatable', emoji: '😅' },
    { id: 'trending', label: 'Trending', emoji: '🔥' },
    { id: 'custom', label: 'Custom', emoji: '🎨' },
  ] as const;

  return (
    <div>
      {categories.map((category) => {
        const templates = MEME_TEMPLATES.filter((t) => t.category === category.id);
        if (templates.length === 0) return null;

        return (
          <div key={category.id} style={{ marginBottom: '20px' }}>
            <h4
              style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: 600,
                color: theme.colors.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{category.emoji}</span>
              <span>{category.label}</span>
            </h4>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '12px',
              }}
            >
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template)}
                  style={{
                    padding: '16px 12px',
                    background:
                      selectedId === template.id
                        ? `${theme.colors.accent.primary}20`
                        : theme.colors.background.secondary,
                    border:
                      selectedId === template.id
                        ? `2px solid ${theme.colors.accent.primary}`
                        : `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '32px' }}>{template.emoji}</span>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: selectedId === template.id ? 600 : 400,
                      color:
                        selectedId === template.id
                          ? theme.colors.accent.primary
                          : theme.colors.text.secondary,
                      textAlign: 'center',
                    }}
                  >
                    {template.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MemeTemplates;
