import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '../common';
import { Recipe, RecipeCategory } from '../../types';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AddRecipeModal } from './AddRecipeModal';
import { RecipeDetailModal } from './RecipeDetailModal';

const CATEGORIES: RecipeCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Grilling', 'Quick & Easy', 'Kid-Friendly', 'Meal Prep'];

export const RecipesPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const recipeData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          time: data.createdAt?.toDate()
            ? formatTimeAgo(data.createdAt.toDate())
            : 'Just now',
        } as Recipe;
      });
      setRecipes(recipeData);
    });

    return () => unsubscribe();
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredRecipes = selectedCategory === 'All'
    ? recipes
    : recipes.filter(r => r.category === selectedCategory);

  const handleLike = async (recipeId: string) => {
    if (!user) return;

    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const recipeRef = doc(db, 'recipes', recipeId);
    const isLiked = recipe.likedBy?.includes(user.uid);

    if (isLiked) {
      await updateDoc(recipeRef, {
        likes: increment(-1),
        likedBy: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(recipeRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
      });
    }
  };

  const getCategoryEmoji = (category: RecipeCategory): string => {
    const emojis: Record<RecipeCategory, string> = {
      'Breakfast': '🍳',
      'Lunch': '🥪',
      'Dinner': '🍽️',
      'Snacks': '🍿',
      'Grilling': '🔥',
      'Quick & Easy': '⚡',
      'Kid-Friendly': '🧒',
      'Meal Prep': '📦',
    };
    return emojis[category];
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'Easy': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return theme.colors.text.muted;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Dad Recipes</h2>
        <Button icon="+" onClick={() => setShowAddModal(true)}>
          Add Recipe
        </Button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button
          onClick={() => setSelectedCategory('All')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            background: selectedCategory === 'All' ? theme.colors.accent.primary : theme.colors.card,
            color: selectedCategory === 'All' ? '#fff' : theme.colors.text.primary,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedCategory === cat ? theme.colors.accent.primary : theme.colors.card,
              color: selectedCategory === cat ? '#fff' : theme.colors.text.primary,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {getCategoryEmoji(cat)} {cat}
          </button>
        ))}
      </div>

      {/* Recipe Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            hover
            onClick={() => setSelectedRecipe(recipe)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Badge variant="category" category="Support">
                  {getCategoryEmoji(recipe.category)} {recipe.category}
                </Badge>
                <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>{recipe.time}</span>
              </div>

              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{recipe.title}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.muted, lineHeight: 1.4 }}>
                {recipe.description.substring(0, 100)}...
              </p>

              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: theme.colors.text.muted }}>
                <span>⏱️ {recipe.prepTime} prep</span>
                <span>🍳 {recipe.cookTime} cook</span>
                <span>👥 {recipe.servings} servings</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{recipe.avatar}</span>
                  <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>{recipe.author}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '8px',
                      background: `${getDifficultyColor(recipe.difficulty)}22`,
                      color: getDifficultyColor(recipe.difficulty),
                      fontWeight: 600,
                    }}
                  >
                    {recipe.difficulty}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(recipe.id);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: recipe.likedBy?.includes(user?.uid || '') ? '#ef4444' : theme.colors.text.muted,
                    }}
                  >
                    {recipe.likedBy?.includes(user?.uid || '') ? '❤️' : '🤍'} {recipe.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.muted }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🍳</p>
          <p>No recipes yet. Share your favorite dad recipe!</p>
        </div>
      )}

      {showAddModal && (
        <AddRecipeModal onClose={() => setShowAddModal(false)} />
      )}

      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onLike={() => handleLike(selectedRecipe.id)}
        />
      )}
    </div>
  );
};
