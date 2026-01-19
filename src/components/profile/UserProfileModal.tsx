import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useFriends } from '../../context/FriendsContext';
import { Card, Button } from '../common';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface UserProfile {
  uid: string;
  name: string;
  avatar: string;
  email?: string;
  dadSince?: string;
  kids?: number;
  points?: number;
  isAdmin?: boolean;
  isModerator?: boolean;
  joinedAt?: string;
}

interface UserProfileModalProps {
  userId: string;
  onClose: () => void;
  onStartChat?: (userId: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, onClose, onStartChat }) => {
  const { theme } = useTheme();
  const { user: currentUser } = useAuth();
  const { friends, sendFriendRequest, incomingRequests, outgoingRequests } = useFriends();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.uid === userId;
  const isFriend = friends.some((f) => f.friendId === userId);
  const hasPendingRequest = incomingRequests.some((r) => r.fromUserId === userId);
  const hasSentRequest = outgoingRequests.some((r) => r.toUserId === userId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setProfile({
            uid: userDoc.id,
            ...userDoc.data(),
          } as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleSendFriendRequest = async () => {
    if (!profile) return;
    try {
      await sendFriendRequest(profile.uid, profile.name, profile.avatar);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const getDadLevel = (points: number = 0): { level: number; title: string; color: string } => {
    const levels = [
      { min: 0, level: 1, title: 'Rookie Dad', color: '#78716c' },
      { min: 100, level: 2, title: 'Learning Dad', color: '#22c55e' },
      { min: 300, level: 3, title: 'Growing Dad', color: '#3b82f6' },
      { min: 600, level: 4, title: 'Skilled Dad', color: '#8b5cf6' },
      { min: 1000, level: 5, title: 'Expert Dad', color: '#f59e0b' },
      { min: 2000, level: 6, title: 'Master Dad', color: '#ef4444' },
      { min: 4000, level: 7, title: 'Legendary Dad', color: '#ec4899' },
      { min: 8000, level: 8, title: 'Dad God', color: '#d97706' },
    ];

    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].min) {
        return levels[i];
      }
    }
    return levels[0];
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
      }}>
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <p>Loading profile...</p>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
      }}>
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <p>Profile not found</p>
          <Button onClick={onClose}>Close</Button>
        </Card>
      </div>
    );
  }

  const level = getDadLevel(profile.points || 0);

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
        maxWidth: '400px',
        width: '100%',
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

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: theme.colors.accent.gradient,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            margin: '0 auto 16px',
          }}>
            {profile.avatar}
          </div>

          <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: 700 }}>
            {profile.name}
          </h2>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
            {profile.isAdmin && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
              }}>
                Admin
              </span>
            )}
            {profile.isModerator && !profile.isAdmin && (
              <span style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3b82f6',
              }}>
                Moderator
              </span>
            )}
          </div>
        </div>

        {/* Level */}
        <div style={{
          padding: '16px',
          background: theme.colors.cardHover,
          borderRadius: '12px',
          marginBottom: '16px',
          textAlign: 'center',
        }}>
          <span style={{
            padding: '6px 12px',
            background: `${level.color}22`,
            color: level.color,
            borderRadius: '20px',
            fontWeight: 600,
            fontSize: '14px',
          }}>
            Level {level.level}: {level.title}
          </span>
          <p style={{ margin: '12px 0 0 0', fontSize: '24px', fontWeight: 700 }}>
            {profile.points || 0} points
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {profile.dadSince && (
            <div style={{
              padding: '12px',
              background: theme.colors.cardHover,
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>Dad Since</p>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{profile.dadSince}</p>
            </div>
          )}
          {profile.kids !== undefined && (
            <div style={{
              padding: '12px',
              background: theme.colors.cardHover,
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>Kids</p>
              <p style={{ margin: '4px 0 0 0', fontWeight: 600 }}>{profile.kids}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isOwnProfile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isFriend ? (
              <Button onClick={() => onStartChat?.(userId)} fullWidth>
                Send Message
              </Button>
            ) : hasPendingRequest ? (
              <Button fullWidth disabled>
                Respond to Request
              </Button>
            ) : hasSentRequest ? (
              <Button variant="secondary" fullWidth disabled>
                Request Sent
              </Button>
            ) : (
              <Button onClick={handleSendFriendRequest} fullWidth>
                Add Friend
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};
