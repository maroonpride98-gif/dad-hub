import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../common';
import { RecipeCategory } from '../../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

const CATEGORIES: RecipeCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Grilling', 'Quick & Easy', 'Kid-Friendly', 'Meal Prep'];

interface AddRecipeModalProps {
  onClose: () => void;
}

export const AddRecipeModal: React.FC<AddRecipeModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<RecipeCategory>('Dinner');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('4');
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addIngredient = () => setIngredients([...ingredients, '']);
  const addInstruction = () => setInstructions([...instructions, '']);

  const updateIngredient = (index: number, value: string) => {
    setIngredients(ingredients.map((ing, i) => i === index ? value : ing));
  };

  const updateInstruction = (index: number, value: string) => {
    setInstructions(instructions.map((inst, i) => i === index ? value : inst));
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  const removeInstruction = (index: number) => {
    if (instructions.length > 1) {
      setInstructions(instructions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !user || isSubmitting) return;

    const validIngredients = ingredients.filter(i => i.trim());
    const validInstructions = instructions.filter(i => i.trim());

    if (validIngredients.length === 0 || validInstructions.length === 0) {
      alert('Please add at least one ingredient and one instruction.');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'recipes'), {
        title: title.trim(),
        description: description.trim(),
        category,
        difficulty,
        prepTime: prepTime || '15 min',
        cookTime: cookTime || '30 min',
        servings: parseInt(servings) || 4,
        ingredients: validIngredients,
        instructions: validInstructions,
        authorId: user.uid,
        author: user.name,
        avatar: user.avatar,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (error) {
      console.error('Error adding recipe:', error);
      alert('Failed to add recipe. Please try again.');
    } finally {
      setIsSubmitting(false);
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
        maxWidth: '600px',
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
          }}
        >
          ×
        </button>

        <h2 style={{ margin: '0 0 24px 0', fontSize: '24px' }}>Share a Recipe</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title</label>
            <Input
              placeholder="What's cooking?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
            <textarea
              placeholder="Tell us about this recipe..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.card,
                color: theme.colors.text.primary,
                fontSize: '15px',
                resize: 'vertical',
                minHeight: '80px',
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.card,
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  background: theme.colors.card,
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Prep Time</label>
              <Input
                placeholder="15 min"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Cook Time</label>
              <Input
                placeholder="30 min"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Servings</label>
              <Input
                type="number"
                placeholder="4"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Ingredients</label>
            {ingredients.map((ing, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <Input
                  placeholder={`Ingredient ${i + 1}`}
                  value={ing}
                  onChange={(e) => updateIngredient(i, e.target.value)}
                  style={{ flex: 1 }}
                />
                {ingredients.length > 1 && (
                  <button
                    onClick={() => removeIngredient(i)}
                    style={{
                      padding: '0 12px',
                      background: 'none',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                      color: theme.colors.error,
                      cursor: 'pointer',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addIngredient}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: `1px dashed ${theme.colors.border}`,
                borderRadius: '8px',
                color: theme.colors.text.muted,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + Add Ingredient
            </button>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Instructions</label>
            {instructions.map((inst, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <span style={{ padding: '12px', fontWeight: 700, color: theme.colors.accent.primary }}>{i + 1}.</span>
                <textarea
                  placeholder={`Step ${i + 1}`}
                  value={inst}
                  onChange={(e) => updateInstruction(i, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.colors.border}`,
                    background: theme.colors.card,
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                    resize: 'vertical',
                    minHeight: '60px',
                  }}
                />
                {instructions.length > 1 && (
                  <button
                    onClick={() => removeInstruction(i)}
                    style={{
                      padding: '0 12px',
                      background: 'none',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '8px',
                      color: theme.colors.error,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addInstruction}
              style={{
                padding: '8px 16px',
                background: 'none',
                border: `1px dashed ${theme.colors.border}`,
                borderRadius: '8px',
                color: theme.colors.text.muted,
                cursor: 'pointer',
                width: '100%',
              }}
            >
              + Add Step
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting ? 'Sharing...' : 'Share Recipe'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
