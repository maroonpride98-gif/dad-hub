import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useGroups } from '../../context/GroupsContext';
import { getCategoryInfo } from '../../types/group';
import { Card, Button, MentionInput } from '../common';
import { GroupPostCard } from './GroupPostCard';

interface GroupDetailPageProps {
  groupId: string;
  onBack: () => void;
}

export const GroupDetailPage: React.FC<GroupDetailPageProps> = ({
  groupId,
  onBack,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    getGroupById,
    groupPosts,
    isLoadingPosts,
    fetchGroupPosts,
    createGroupPost,
    likeGroupPost,
    reactToGroupPost,
    groupMembers,
    fetchGroupMembers,
    joinGroup,
    leaveGroup,
  } = useGroups();

  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const group = getGroupById(groupId);

  useEffect(() => {
    fetchGroupPosts(groupId);
    fetchGroupMembers(groupId);
  }, [groupId, fetchGroupPosts, fetchGroupMembers]);

  if (!group) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          Group not found
        </div>
      </Card>
    );
  }

  const categoryInfo = getCategoryInfo(group.category);

  const handlePost = async () => {
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      await createGroupPost(groupId, newPostContent.trim());
      setNewPostContent('');
    } catch (error) {
      console.error('Failed to post:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: theme.colors.text.secondary,
          fontSize: '14px',
          cursor: 'pointer',
          padding: 0,
        }}
      >
        ← Back to Groups
      </button>

      {/* Group Header */}
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div
              style={{
                fontSize: '56px',
                width: '80px',
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${categoryInfo.color}20`,
                borderRadius: '20px',
              }}
            >
              {group.icon}
            </div>

            <div style={{ flex: 1 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                }}
              >
                {group.name}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '8px',
                }}
              >
                <span
                  style={{
                    padding: '4px 10px',
                    background: `${categoryInfo.color}20`,
                    color: categoryInfo.color,
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {group.category}
                </span>
                <span style={{ color: theme.colors.text.muted, fontSize: '13px' }}>
                  👥 {group.memberCount} members
                </span>
              </div>

              <p
                style={{
                  margin: '12px 0 0 0',
                  fontSize: '14px',
                  color: theme.colors.text.secondary,
                  lineHeight: 1.5,
                }}
              >
                {group.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            {group.isMember ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setShowMembers(!showMembers)}
                >
                  👥 Members
                </Button>
                <Button variant="danger" onClick={() => leaveGroup(groupId)}>
                  Leave Group
                </Button>
              </>
            ) : (
              <Button onClick={() => joinGroup(groupId)}>
                Join Group
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Members Panel */}
      {showMembers && (
        <Card>
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}
          >
            Members ({groupMembers.length})
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '12px',
            }}
          >
            {groupMembers.map(member => (
              <div
                key={member.userId}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  background: theme.colors.background.secondary,
                  borderRadius: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>{member.userAvatar}</span>
                <div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {member.userName}
                  </div>
                  {member.role !== 'member' && (
                    <div
                      style={{
                        fontSize: '10px',
                        color: theme.colors.accent.primary,
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      {member.role}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* New Post (only for members) */}
      {group.isMember && (
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <MentionInput
              value={newPostContent}
              onChange={setNewPostContent}
              placeholder="Share something with the group..."
              multiline
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                onClick={handlePost}
                disabled={isPosting || !newPostContent.trim()}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Posts */}
      <div>
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: theme.colors.text.primary,
          }}
        >
          Posts
        </h3>

        {isLoadingPosts ? (
          <Card>
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: theme.colors.text.muted,
              }}
            >
              Loading posts...
            </div>
          </Card>
        ) : groupPosts.length === 0 ? (
          <Card>
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: theme.colors.text.muted,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
              <p style={{ margin: 0 }}>No posts yet. Be the first to share!</p>
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {groupPosts.map(post => (
              <GroupPostCard
                key={post.id}
                post={post}
                currentUserId={user?.uid}
                onLike={() => likeGroupPost(groupId, post.id)}
                onReact={(emoji) => reactToGroupPost(groupId, post.id, emoji)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
