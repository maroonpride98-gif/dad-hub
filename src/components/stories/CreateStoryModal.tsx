import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useStories } from '../../context/StoriesContext';
import { StoryType, STORY_BACKGROUNDS } from '../../types/story';
import { Card, Button, TextArea } from '../common';

interface CreateStoryModalProps {
  onClose: () => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const { createStory } = useStories();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [storyType, setStoryType] = useState<StoryType>('text');
  const [textContent, setTextContent] = useState('');
  const [selectedBackground, setSelectedBackground] = useState(STORY_BACKGROUNDS[0].value);
  const [textColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setStoryType('image');
    }
  };

  const handleSubmit = async () => {
    if (storyType === 'text' && !textContent.trim()) return;
    if (storyType === 'image' && !imageFile) return;

    setIsSubmitting(true);
    try {
      await createStory(
        {
          type: storyType,
          content: storyType === 'text' ? textContent : '',
          backgroundColor: storyType === 'text' ? selectedBackground : undefined,
          textColor: storyType === 'text' ? textColor : undefined,
          fontSize: storyType === 'text' ? fontSize : undefined,
        },
        imageFile || undefined
      );
      onClose();
    } catch (error) {
      console.error('Failed to create story:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 400,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <Card
        style={{
          maxWidth: '420px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
        }}
        onClick={(e) => e?.stopPropagation()}
      >
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
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              Create Story
            </h2>
            <button
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

          {/* Type Toggle */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              padding: '4px',
              background: theme.colors.background.secondary,
              borderRadius: '12px',
            }}
          >
            <button
              onClick={() => setStoryType('text')}
              style={{
                flex: 1,
                padding: '10px',
                background: storyType === 'text'
                  ? theme.colors.accent.gradient
                  : 'transparent',
                color: storyType === 'text'
                  ? theme.colors.background.primary
                  : theme.colors.text.secondary,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              📝 Text
            </button>
            <button
              onClick={() => {
                setStoryType('image');
                if (!imageFile) fileInputRef.current?.click();
              }}
              style={{
                flex: 1,
                padding: '10px',
                background: storyType === 'image'
                  ? theme.colors.accent.gradient
                  : 'transparent',
                color: storyType === 'image'
                  ? theme.colors.background.primary
                  : theme.colors.text.secondary,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              📷 Photo
            </button>
          </div>

          {/* Preview */}
          <div
            style={{
              aspectRatio: '9/16',
              maxHeight: '300px',
              borderRadius: '12px',
              overflow: 'hidden',
              background: storyType === 'text' ? selectedBackground : '#000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {storyType === 'image' ? (
              imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: `2px dashed ${theme.colors.border}`,
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    color: theme.colors.text.muted,
                  }}
                >
                  <span style={{ fontSize: '32px' }}>📷</span>
                  <span>Click to upload</span>
                </button>
              )
            ) : (
              <p
                style={{
                  color: textColor,
                  fontSize: fontSize === 'large'
                    ? '20px'
                    : fontSize === 'small'
                    ? '12px'
                    : '16px',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '16px',
                  margin: 0,
                  wordBreak: 'break-word',
                }}
              >
                {textContent || 'Your story text here...'}
              </p>
            )}
          </div>

          {/* Text Options */}
          {storyType === 'text' && (
            <>
              <TextArea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={3}
                maxLength={200}
              />

              {/* Background Picker */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: theme.colors.text.secondary,
                  }}
                >
                  Background
                </label>
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  {STORY_BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => setSelectedBackground(bg.value)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: bg.value,
                        border: selectedBackground === bg.value
                          ? `3px solid ${theme.colors.accent.primary}`
                          : '3px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: theme.colors.text.secondary,
                  }}
                >
                  Text Size
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(['small', 'medium', 'large'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setFontSize(size)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: fontSize === size
                          ? theme.colors.accent.primary + '30'
                          : theme.colors.background.secondary,
                        color: fontSize === size
                          ? theme.colors.accent.primary
                          : theme.colors.text.secondary,
                        border: `1px solid ${fontSize === size ? theme.colors.accent.primary : theme.colors.border}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '12px',
                        textTransform: 'capitalize',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />

          {/* Change Image Button */}
          {storyType === 'image' && imagePreview && (
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              fullWidth
            >
              Change Photo
            </Button>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button variant="secondary" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                (storyType === 'text' && !textContent.trim()) ||
                (storyType === 'image' && !imageFile)
              }
              fullWidth
            >
              {isSubmitting ? 'Posting...' : 'Share Story'}
            </Button>
          </div>

          {/* Info */}
          <p
            style={{
              margin: 0,
              fontSize: '11px',
              color: theme.colors.text.muted,
              textAlign: 'center',
            }}
          >
            Stories disappear after 24 hours
          </p>
        </div>
      </Card>
    </div>
  );
};
