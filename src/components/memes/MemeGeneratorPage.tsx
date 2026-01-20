import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { MemeTemplate, MEME_TEMPLATES } from '../../data/memeTemplates';
import { MemeCanvas, MemeCanvasHandle } from './MemeCanvas';
import { MemeTemplates } from './MemeTemplates';
import { MemeGallery } from './MemeGallery';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

type ViewMode = 'create' | 'gallery';

export const MemeGeneratorPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const canvasRef = useRef<MemeCanvasHandle>(null);

  const [viewMode, setViewMode] = useState<ViewMode>('create');
  const [selectedTemplate, setSelectedTemplate] = useState<MemeTemplate | null>(MEME_TEMPLATES[0]);
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTemplateSelect = (template: MemeTemplate) => {
    setSelectedTemplate(template);
    setTexts({});
  };

  const handleTextChange = (positionId: string, value: string) => {
    setTexts((prev) => ({
      ...prev,
      [positionId]: value,
    }));
  };

  const handleSave = async () => {
    if (!selectedTemplate || isSaving) return;

    const imageData = canvasRef.current?.exportImage();
    if (!imageData) return;

    setIsSaving(true);
    haptics.light();

    try {
      await addDoc(collection(db, 'memes'), {
        templateId: selectedTemplate.id,
        templateName: selectedTemplate.name,
        texts,
        imageData,
        authorId: user.uid,
        authorName: user.name,
        authorAvatar: user.avatar,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });

      haptics.success();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving meme:', error);
      alert('Failed to save meme. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const imageData = canvasRef.current?.exportImage();
    if (!imageData) return;

    const link = document.createElement('a');
    link.download = `dadhub-meme-${Date.now()}.png`;
    link.href = imageData;
    link.click();
    haptics.success();
  };

  const handleShare = async () => {
    const imageData = canvasRef.current?.exportImage();
    if (!imageData) return;

    try {
      const blob = await (await fetch(imageData)).blob();
      const file = new File([blob], 'dad-meme.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Check out my Dad Meme!',
          text: 'Made with Dad Hub Meme Generator',
          files: [file],
        });
        haptics.success();
      } else {
        // Fallback: copy to clipboard or download
        handleDownload();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      handleDownload();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #ec4899, #f97316)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎨 Meme Generator
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Create and share hilarious dad memes!
        </p>
      </div>

      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <button
          onClick={() => setViewMode('create')}
          style={{
            flex: 1,
            padding: '12px',
            background: viewMode === 'create' ? theme.colors.accent.primary : theme.colors.background.secondary,
            border: 'none',
            borderRadius: '10px',
            color: viewMode === 'create' ? '#fff' : theme.colors.text.secondary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          ✨ Create
        </button>
        <button
          onClick={() => setViewMode('gallery')}
          style={{
            flex: 1,
            padding: '12px',
            background: viewMode === 'gallery' ? theme.colors.accent.primary : theme.colors.background.secondary,
            border: 'none',
            borderRadius: '10px',
            color: viewMode === 'gallery' ? '#fff' : theme.colors.text.secondary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          🖼️ Gallery
        </button>
      </div>

      {viewMode === 'create' ? (
        <div style={{ padding: '16px 20px' }}>
          {/* Canvas Preview */}
          {selectedTemplate && (
            <div
              style={{
                marginBottom: '20px',
                borderRadius: '16px',
                overflow: 'hidden',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <MemeCanvas
                ref={canvasRef}
                template={selectedTemplate}
                texts={texts}
                width={400}
                height={400}
              />
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div
              style={{
                padding: '14px',
                background: '#22c55e20',
                borderRadius: '12px',
                marginBottom: '16px',
                textAlign: 'center',
              }}
            >
              <span style={{ color: '#22c55e', fontWeight: 600 }}>
                ✓ Meme saved to gallery!
              </span>
            </div>
          )}

          {/* Text Inputs */}
          {selectedTemplate && (
            <div style={{ marginBottom: '20px' }}>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}
              >
                Add Your Text
              </h3>
              {selectedTemplate.textPositions.map((pos) => (
                <div key={pos.id} style={{ marginBottom: '12px' }}>
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: theme.colors.text.secondary,
                    }}
                  >
                    {pos.label}
                  </label>
                  <input
                    type="text"
                    value={texts[pos.id] || ''}
                    onChange={(e) => handleTextChange(pos.id, e.target.value)}
                    placeholder={pos.placeholder}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '10px',
                      color: theme.colors.text.primary,
                      fontSize: '15px',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color: '#fff',
                fontSize: '15px',
                fontWeight: 600,
                cursor: isSaving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isSaving ? '💾 Saving...' : '💾 Save'}
            </button>
            <button
              onClick={handleDownload}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: 'transparent',
                color: theme.colors.text.primary,
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⬇️
            </button>
            <button
              onClick={handleShare}
              style={{
                padding: '14px 20px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: 'transparent',
                color: theme.colors.text.primary,
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              📤
            </button>
          </div>

          {/* Templates */}
          <div>
            <h3
              style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              Choose Template
            </h3>
            <MemeTemplates
              selectedId={selectedTemplate?.id || null}
              onSelect={handleTemplateSelect}
            />
          </div>
        </div>
      ) : (
        <MemeGallery />
      )}
    </div>
  );
};

export default MemeGeneratorPage;
