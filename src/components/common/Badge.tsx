import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DiscussionCategory } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'category';
  category?: DiscussionCategory;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', category }) => {
  const { theme, categoryColors } = useTheme();

  const getStyles = (): React.CSSProperties => {
    if (variant === 'category' && category) {
      return {
        background: categoryColors[category].bg,
        color: categoryColors[category].text,
      };
    }
    return {
      background: `rgba(${theme.mode === 'dark' ? '28, 25, 23' : '0, 0, 0'}, 0.6)`,
      color: theme.colors.accent.secondary,
      border: `1px solid rgba(251, 191, 36, 0.2)`,
    };
  };

  return (
    <span
      style={{
        padding: variant === 'category' ? '4px 10px' : '6px 14px',
        borderRadius: variant === 'category' ? '6px' : '20px',
        fontSize: variant === 'category' ? '11px' : '12px',
        fontWeight: variant === 'category' ? 700 : 600,
        textTransform: variant === 'category' ? 'uppercase' : 'none',
        letterSpacing: variant === 'category' ? '0.5px' : 'normal',
        display: 'inline-block',
        ...getStyles(),
      }}
    >
      {children}
    </span>
  );
};
