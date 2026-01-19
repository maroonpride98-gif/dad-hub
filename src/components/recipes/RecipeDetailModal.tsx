import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../common';
import { Recipe } from '../../types';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onLike: () => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose, onLike }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const isLiked = recipe.likedBy?.includes(user?.uid || '');

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return theme.colors.text.muted;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '20px',
    }}>
      <Card style={{
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.colors.text.muted,
            zIndex: 10,
          }}
        >
          ×
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                background: `${theme.colors.accent.primary}22`,
                color: theme.colors.accent.primary,
                fontSize: '13px',
                fontWeight: 600,
              }}>
                {recipe.category}
              </span>
              <span style={{
                padding: '6px 12px',
                borderRadius: '20px',
                background: `${getDifficultyColor(recipe.difficulty)}22`,
                color: getDifficultyColor(recipe.difficulty),
                fontSize: '13px',
                fontWeight: 600,
              }}>
                {recipe.difficulty}
              </span>
            </div>

            <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 700 }}>{recipe.title}</h2>
            <p style={{ margin: 0, color: theme.colors.text.muted, lineHeight: 1.5 }}>{recipe.description}</p>
          </div>

          {/* Author & Stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px',
            background: theme.colors.cardHover,
            borderRadius: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>{recipe.avatar}</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>{recipe.author}</p>
                <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>{recipe.time}</p>
              </div>
            </div>
            <button
              onClick={onLike}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: isLiked ? 'rgba(239, 68, 68, 0.1)' : theme.colors.card,
                border: isLiked ? '1px solid #ef4444' : `1px solid ${theme.colors.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                color: isLiked ? '#ef4444' : theme.colors.text.primary,
                fontWeight: 600,
              }}
            >
              {isLiked ? '❤️' : '🤍'} {recipe.likes || 0}
            </button>
          </div>

          {/* Quick Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}>
            <div style={{
              padding: '16px',
              background: theme.colors.cardHover,
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '24px' }}>⏱️</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{recipe.prepTime}</p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Prep Time</p>
            </div>
            <div style={{
              padding: '16px',
              background: theme.colors.cardHover,
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '24px' }}>🍳</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{recipe.cookTime}</p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Cook Time</p>
            </div>
            <div style={{
              padding: '16px',
              background: theme.colors.cardHover,
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '24px' }}>👥</p>
              <p style={{ margin: 0, fontWeight: 600 }}>{recipe.servings}</p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Servings</p>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700 }}>Ingredients</h3>
            <ul style={{
              margin: 0,
              padding: '0 0 0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} style={{ color: theme.colors.text.primary }}>{ing}</li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: 700 }}>Instructions</h3>
            <ol style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
              {recipe.instructions.map((inst, i) => (
                <li key={i} style={{ display: 'flex', gap: '16px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    background: theme.colors.accent.gradient,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, lineHeight: 1.6, paddingTop: '4px' }}>{inst}</p>
                </li>
              ))}
            </ol>
          </div>

          <Button onClick={onClose} fullWidth>
            Close Recipe
          </Button>
        </div>
      </Card>
    </div>
  );
};
