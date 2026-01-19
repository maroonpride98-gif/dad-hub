import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useStories } from '../../context/StoriesContext';
import { StoryAvatar } from './StoryAvatar';
import { StoryViewer } from './StoryViewer';
import { CreateStoryModal } from './CreateStoryModal';
import { Card } from '../common';

export const StoriesBar: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    userStoriesGroups,
    myStories,
    isLoading,
    setActiveUserStories,
    activeUserStories,
    showCreateStory,
    setShowCreateStory,
  } = useStories();

  // Create a "Your Story" entry
  const myStoriesGroup = myStories.length > 0
    ? {
        userId: user?.uid || '',
        userName: 'Your Story',
        userAvatar: user?.avatar || '👨',
        stories: myStories,
        hasUnviewed: false,
        latestStoryTime: myStories[0]?.createdAt || new Date(),
      }
    : null;

  // Handle add story click
  const handleAddStory = () => {
    setShowCreateStory(true);
  };

  // Handle own story click
  const handleOwnStoryClick = () => {
    if (myStoriesGroup && myStories.length > 0) {
      setActiveUserStories(myStoriesGroup);
    } else {
      setShowCreateStory(true);
    }
  };

  if (isLoading && userStoriesGroups.length === 0) {
    return (
      <Card padding="small">
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            padding: '8px 0',
          }}
        >
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              style={{
                width: '66px',
                height: '90px',
                background: theme.colors.background.secondary,
                borderRadius: '12px',
                animation: 'pulse 1.5s infinite',
              }}
            />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card padding="small">
        <div
          style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            padding: '8px 0',
            scrollbarWidth: 'none',
          }}
        >
          {/* Add/View Own Story */}
          <div style={{ position: 'relative' }}>
            {myStoriesGroup ? (
              <StoryAvatar
                userStories={myStoriesGroup}
                onClick={handleOwnStoryClick}
                isOwn
              />
            ) : (
              <button
                onClick={handleAddStory}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <div
                  style={{
                    width: '66px',
                    height: '66px',
                    borderRadius: '50%',
                    border: `2px dashed ${theme.colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme.colors.background.secondary,
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      color: theme.colors.accent.primary,
                    }}
                  >
                    ➕
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: theme.colors.text.secondary,
                  }}
                >
                  Add Story
                </span>
              </button>
            )}
          </div>

          {/* Other Users' Stories */}
          {userStoriesGroups
            .filter(g => g.userId !== user?.uid)
            .map(userStories => (
              <StoryAvatar
                key={userStories.userId}
                userStories={userStories}
                onClick={() => setActiveUserStories(userStories)}
              />
            ))}

          {/* Empty state */}
          {userStoriesGroups.length === 0 && !myStoriesGroup && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                color: theme.colors.text.muted,
                fontSize: '13px',
              }}
            >
              <span>No stories yet. Be the first to share!</span>
            </div>
          )}
        </div>
      </Card>

      {/* Story Viewer */}
      {activeUserStories && <StoryViewer />}

      {/* Create Story Modal */}
      {showCreateStory && (
        <CreateStoryModal onClose={() => setShowCreateStory(false)} />
      )}
    </>
  );
};
