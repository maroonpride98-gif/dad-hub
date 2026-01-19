import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGroups } from '../../context/GroupsContext';
import { GroupCategory, GROUP_CATEGORIES } from '../../types/group';
import { Card, Button, Input, TextArea } from '../common';

interface CreateGroupModalProps {
  onClose: () => void;
  onSuccess?: (groupId: string) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  onSuccess,
}) => {
  const { theme } = useTheme();
  const { createGroup } = useGroups();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('Other');
  const [icon, setIcon] = useState('👨‍👧‍👦');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const icons = ['👨‍👧‍👦', '🍖', '🏈', '👶', '💻', '🔨', '🏠', '💼', '🎮', '💪', '🏕️', '🎸', '⚽', '🎯', '🎨', '📚'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const groupId = await createGroup({
        name: name.trim(),
        description: description.trim(),
        category,
        icon,
        isPublic,
        createdBy: '',
        createdByName: '',
      });

      onSuccess?.(groupId);
      onClose();
    } catch (err) {
      setError('Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <Card
        style={{
          maxWidth: '480px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'slideUp 0.3s ease',
        }}
        onClick={(e) => e?.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}
              >
                Create Group
              </h2>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: theme.colors.text.muted,
                }}
              >
                ×
              </button>
            </div>

            {/* Icon Selection */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                Group Icon
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {icons.map(i => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    style={{
                      fontSize: '24px',
                      padding: '8px',
                      background: icon === i
                        ? theme.colors.accent.primary + '30'
                        : theme.colors.background.secondary,
                      border: icon === i
                        ? `2px solid ${theme.colors.accent.primary}`
                        : '2px solid transparent',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                Group Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Grill Masters United"
                maxLength={50}
              />
            </div>

            {/* Category */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                Category
              </label>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {GROUP_CATEGORIES.map(cat => (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => setCategory(cat.category)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: category === cat.category
                        ? `${cat.color}30`
                        : theme.colors.background.secondary,
                      color: category === cat.category
                        ? cat.color
                        : theme.colors.text.secondary,
                      border: category === cat.category
                        ? `1px solid ${cat.color}`
                        : `1px solid ${theme.colors.border}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                Description
              </label>
              <TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this group about?"
                rows={3}
                maxLength={300}
              />
            </div>

            {/* Public/Private Toggle */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: theme.colors.background.secondary,
                borderRadius: '12px',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: theme.colors.text.primary,
                  }}
                >
                  Public Group
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: theme.colors.text.muted,
                  }}
                >
                  Anyone can find and join
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  background: isPublic
                    ? theme.colors.accent.primary
                    : theme.colors.border,
                  border: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: '#fff',
                    position: 'absolute',
                    top: '3px',
                    left: isPublic ? '23px' : '3px',
                    transition: 'left 0.2s ease',
                  }}
                />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '12px',
                  background: `rgba(239, 68, 68, 0.1)`,
                  border: `1px solid rgba(239, 68, 68, 0.3)`,
                  borderRadius: '12px',
                  color: theme.colors.error,
                  fontSize: '14px',
                }}
              >
                {error}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};
