import React, { useEffect, useState } from 'react';
import { useStories } from '../../context/StoriesContext';
import { DAD_REACTIONS } from '../../types/reaction';

const STORY_DURATION = 5000; // 5 seconds per story

export const StoryViewer: React.FC = () => {
  const {
    activeUserStories,
    activeStoryIndex,
    nextStory,
    prevStory,
    closeStoryViewer,
    viewStory,
    reactToStory,
  } = useStories();

  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const currentStory = activeUserStories?.stories[activeStoryIndex];

  // Auto-advance and progress
  useEffect(() => {
    if (!currentStory || isPaused) return;

    // Mark as viewed
    viewStory(currentStory.id);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentStory?.id, isPaused, nextStory, viewStory]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentStory?.id]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevStory();
          break;
        case 'ArrowRight':
          nextStory();
          break;
        case 'Escape':
          closeStoryViewer();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStory, prevStory, closeStoryViewer]);

  if (!activeUserStories || !currentStory) return null;

  const handleReact = (emoji: string) => {
    reactToStory(currentStory.id, emoji);
    setShowReactions(false);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return 'Yesterday';
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        zIndex: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeStoryViewer();
      }}
    >
      {/* Story Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          maxHeight: '800px',
          background: currentStory.type === 'text'
            ? currentStory.backgroundColor || '#1a1a2e'
            : '#000',
          borderRadius: '16px',
          overflow: 'hidden',
        }}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            display: 'flex',
            gap: '4px',
            zIndex: 10,
          }}
        >
          {activeUserStories.stories.map((_, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: '3px',
                background: 'rgba(255,255,255,0.3)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#fff',
                  width: index < activeStoryIndex
                    ? '100%'
                    : index === activeStoryIndex
                    ? `${progress}%`
                    : '0%',
                  transition: index === activeStoryIndex ? 'none' : 'width 0.3s',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '12px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: '32px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
            }}
          >
            {activeUserStories.userAvatar}
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: '14px',
              }}
            >
              {activeUserStories.userName}
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '12px',
              }}
            >
              {formatTime(currentStory.createdAt)}
            </div>
          </div>

          <button
            onClick={closeStoryViewer}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: '#fff',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        {currentStory.type === 'image' ? (
          <img
            src={currentStory.content}
            alt="Story"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 24px',
            }}
          >
            <p
              style={{
                color: currentStory.textColor || '#fff',
                fontSize: currentStory.fontSize === 'large'
                  ? '28px'
                  : currentStory.fontSize === 'small'
                  ? '18px'
                  : '24px',
                fontWeight: 600,
                textAlign: 'center',
                lineHeight: 1.4,
                wordBreak: 'break-word',
              }}
            >
              {currentStory.content}
            </p>
          </div>
        )}

        {/* Navigation Zones */}
        <div
          onClick={prevStory}
          style={{
            position: 'absolute',
            left: 0,
            top: '80px',
            bottom: '100px',
            width: '30%',
            cursor: 'pointer',
          }}
        />
        <div
          onClick={nextStory}
          style={{
            position: 'absolute',
            right: 0,
            top: '80px',
            bottom: '100px',
            width: '30%',
            cursor: 'pointer',
          }}
        />

        {/* Footer - Reactions */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '12px',
            right: '12px',
            zIndex: 10,
          }}
        >
          {/* Reaction Count */}
          {currentStory.reactions.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '12px',
                flexWrap: 'wrap',
              }}
            >
              {currentStory.reactions.slice(0, 5).map((reaction, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.userName.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reaction Button */}
          <button
            onClick={() => setShowReactions(!showReactions)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '20px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            <span>😀</span>
            <span>React</span>
          </button>

          {/* Reaction Picker */}
          {showReactions && (
            <div
              style={{
                position: 'absolute',
                bottom: '50px',
                left: 0,
                display: 'flex',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(0,0,0,0.8)',
                borderRadius: '20px',
                animation: 'fadeIn 0.2s ease',
              }}
            >
              {DAD_REACTIONS.map(reaction => (
                <button
                  key={reaction.emoji}
                  onClick={() => handleReact(reaction.emoji)}
                  style={{
                    fontSize: '24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {reaction.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Count */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '12px',
          }}
        >
          👁 {currentStory.viewCount}
        </div>
      </div>
    </div>
  );
};
