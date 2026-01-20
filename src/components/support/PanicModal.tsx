import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { QuickAdvice } from './QuickAdvice';
import { haptics } from '../../utils/haptics';

interface PanicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PANIC_CATEGORIES = [
  {
    id: 'tantrum',
    emoji: '😤',
    label: 'Tantrum',
    description: 'Kid is melting down',
    color: '#ef4444',
  },
  {
    id: 'bedtime',
    emoji: '🌙',
    label: 'Bedtime Battle',
    description: "They won't sleep",
    color: '#6366f1',
  },
  {
    id: 'picky_eating',
    emoji: '🥦',
    label: 'Picky Eating',
    description: "Won't eat dinner",
    color: '#22c55e',
  },
  {
    id: 'sibling_fights',
    emoji: '👊',
    label: 'Sibling Fight',
    description: 'Kids are fighting',
    color: '#f59e0b',
  },
  {
    id: 'overwhelmed',
    emoji: '😰',
    label: "I'm Overwhelmed",
    description: 'Need to calm down',
    color: '#8b5cf6',
  },
  {
    id: 'emergency',
    emoji: '🆘',
    label: 'Emergency',
    description: 'Medical/safety help',
    color: '#dc2626',
  },
];

export const PanicModal: React.FC<PanicModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    haptics.light();
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  const handleClose = () => {
    setSelectedCategory(null);
    onClose();
  };

  if (selectedCategory) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: theme.colors.background.primary,
          overflowY: 'auto',
        }}
      >
        <QuickAdvice category={selectedCategory} onClose={handleBack} />
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: theme.colors.background.primary,
          borderRadius: '24px',
          width: '100%',
          maxWidth: '400px',
          maxHeight: '85vh',
          overflow: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 20px 16px',
            textAlign: 'center',
            borderBottom: `1px solid ${theme.colors.border}`,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '32px',
            }}
          >
            🆘
          </div>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: '22px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Dad Panic Button
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.muted }}>
            Quick help for tough parenting moments
          </p>
        </div>

        {/* Categories */}
        <div style={{ padding: '16px 20px' }}>
          <p
            style={{
              margin: '0 0 12px 0',
              fontSize: '13px',
              fontWeight: 600,
              color: theme.colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            What's happening?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PANIC_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px 16px',
                  background: theme.colors.card,
                  borderRadius: '14px',
                  border: `1px solid ${theme.colors.border}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 4px 12px ${category.color}20`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${category.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                  }}
                >
                  {category.emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{
                      margin: '0 0 2px 0',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {category.label}
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
                    {category.description}
                  </p>
                </div>
                <span style={{ fontSize: '18px', color: theme.colors.text.muted }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 20px 24px',
            borderTop: `1px solid ${theme.colors.border}`,
          }}
        >
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`,
              background: 'transparent',
              color: theme.colors.text.secondary,
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            I'm okay, close this
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanicModal;
