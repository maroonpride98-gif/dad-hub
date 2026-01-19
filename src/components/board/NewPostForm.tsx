import React, { useState, useRef } from 'react';
import { DiscussionCategory } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Button, TextArea } from '../common';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

const categories: DiscussionCategory[] = ['Advice', 'Wins', 'Gear', 'Recipes', 'Support'];

export const NewPostForm: React.FC = () => {
  const { theme } = useTheme();
  const { addDiscussion, user } = useApp();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<DiscussionCategory | ''>('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !category || isSubmitting) return;

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      // Upload image if selected
      if (selectedImage) {
        const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDiscussion({
        title,
        content,
        preview: content.slice(0, 100),
        category: category as DiscussionCategory,
        author: user.name,
        avatar: user.avatar,
        imageUrl,
      });

      setTitle('');
      setContent('');
      setCategory('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={{ border: `1px solid rgba(217, 119, 6, 0.3)` }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        style={{
          width: '100%',
          padding: '14px',
          marginBottom: '12px',
          background: `rgba(${theme.mode === 'dark' ? '28, 25, 23' : '231, 229, 228'}, 0.6)`,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '12px',
          color: theme.colors.text.primary,
          fontSize: '15px',
          outline: 'none',
        }}
      />
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share something with the dads..."
      />

      {/* Image Preview */}
      {imagePreview && (
        <div style={{ position: 'relative', marginTop: '12px' }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '200px',
              borderRadius: '12px',
              objectFit: 'cover',
            }}
          />
          <button
            onClick={removeImage}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            ×
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap' }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as DiscussionCategory)}
          style={{
            padding: '10px 16px',
            background: `rgba(${theme.mode === 'dark' ? '28, 25, 23' : '231, 229, 228'}, 0.6)`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '10px',
            color: theme.colors.text.primary,
            fontSize: '14px',
          }}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Image Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '10px 16px',
            background: `rgba(${theme.mode === 'dark' ? '28, 25, 23' : '231, 229, 228'}, 0.6)`,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '10px',
            color: theme.colors.text.primary,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          📷 {selectedImage ? 'Change Photo' : 'Add Photo'}
        </button>

        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post'}
        </Button>
      </div>
    </Card>
  );
};
