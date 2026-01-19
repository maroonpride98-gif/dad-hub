import React from 'react';
import { DiscussionCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';

type FilterCategory = DiscussionCategory | 'All';

const categories: FilterCategory[] = ['All', 'Advice', 'Wins', 'Gear', 'Recipes', 'Support'];

interface CategoryFilterProps {
  activeCategory: FilterCategory;
  onCategoryChange: (category: FilterCategory) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
      }}
    >
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          style={{
            padding: '8px 16px',
            background:
              cat === activeCategory ? theme.colors.accent.gradient : theme.colors.cardHover,
            border: 'none',
            borderRadius: '20px',
            color:
              cat === activeCategory
                ? theme.colors.background.primary
                : theme.colors.text.primary,
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
