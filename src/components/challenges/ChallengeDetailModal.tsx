import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../common';
import { Challenge, ChallengeSubmission } from '../../types';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, increment, arrayUnion, arrayRemove, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../config/firebase';

interface ChallengeDetailModalProps {
  challenge: Challenge;
  onClose: () => void;
}

export const ChallengeDetailModal: React.FC<ChallengeDetailModalProps> = ({ challenge, onClose }) => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasParticipated, setHasParticipated] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const submissionsRef = collection(db, 'challenges', challenge.id, 'submissions');
    const q = query(submissionsRef, orderBy('likes', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const submissionData = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      } as ChallengeSubmission));
      setSubmissions(submissionData);

      // Check if user has already participated
      if (user) {
        setHasParticipated(submissionData.some((s) => s.userId === user.uid));
      }
    });

    return () => unsubscribe();
  }, [challenge.id, user]);

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

  const handleSubmit = async () => {
    if (!user || !content.trim() || isSubmitting || hasParticipated) return;
    if (challenge.type === 'photo' && !selectedImage) {
      alert('Please add a photo for this challenge');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl: string | undefined;

      if (selectedImage) {
        const imageRef = ref(storage, `challenges/${challenge.id}/${user.uid}/${Date.now()}_${selectedImage.name}`);
        await uploadBytes(imageRef, selectedImage);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, 'challenges', challenge.id, 'submissions'), {
        challengeId: challenge.id,
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
        content: content.trim(),
        imageUrl,
        likes: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
      });

      // Update participant count
      await updateDoc(doc(db, 'challenges', challenge.id), {
        participantCount: increment(1),
      });

      // Award points
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(challenge.points),
      });
      await updateProfile({ points: (user.points || 0) + challenge.points });

      setContent('');
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (submissionId: string) => {
    if (!user) return;

    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return;

    const submissionRef = doc(db, 'challenges', challenge.id, 'submissions', submissionId);
    const isLiked = submission.likedBy?.includes(user.uid);

    if (isLiked) {
      await updateDoc(submissionRef, {
        likes: increment(-1),
        likedBy: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(submissionRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
      });
    }
  };

  const getTypeEmoji = () => {
    switch (challenge.type) {
      case 'photo': return '📸';
      case 'activity': return '🎯';
      case 'poll': return '📊';
      case 'streak': return '🔥';
      default: return '🏆';
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
            zIndex: 10,
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '32px' }}>{getTypeEmoji()}</span>
            <div>
              <span style={{
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '11px',
                fontWeight: 600,
                background: challenge.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(120, 113, 108, 0.2)',
                color: challenge.status === 'active' ? '#22c55e' : '#78716c',
                textTransform: 'uppercase',
              }}>
                {challenge.status}
              </span>
            </div>
          </div>

          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>{challenge.title}</h2>
          <p style={{ margin: 0, color: theme.colors.text.muted, lineHeight: 1.5 }}>{challenge.description}</p>

          <div style={{
            display: 'flex',
            gap: '16px',
            marginTop: '16px',
            padding: '12px',
            background: theme.colors.cardHover,
            borderRadius: '12px',
          }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.accent.primary }}>
                {challenge.points}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Points</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>
                {submissions.length}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Entries</p>
            </div>
          </div>
        </div>

        {/* Submit Form */}
        {challenge.status === 'active' && !hasParticipated && (
          <div style={{
            padding: '16px',
            background: theme.colors.cardHover,
            borderRadius: '12px',
            marginBottom: '24px',
          }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>
              Submit Your Entry
            </h4>

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your entry..."
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
                marginBottom: '12px',
              }}
            />

            {imagePreview && (
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '150px',
                    borderRadius: '8px',
                    objectFit: 'cover',
                  }}
                />
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
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
                  background: theme.colors.card,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                📷 {challenge.type === 'photo' ? 'Add Photo *' : 'Add Photo'}
              </button>
              <Button onClick={handleSubmit} disabled={isSubmitting} style={{ flex: 1 }}>
                {isSubmitting ? 'Submitting...' : `Submit (+${challenge.points} pts)`}
              </Button>
            </div>
          </div>
        )}

        {hasParticipated && (
          <div style={{
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '12px',
            marginBottom: '24px',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, color: theme.colors.success, fontWeight: 600 }}>
              ✓ You've already participated in this challenge!
            </p>
          </div>
        )}

        {/* Submissions */}
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
            Entries ({submissions.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {submissions.map((submission, index) => (
              <div
                key={submission.id}
                style={{
                  padding: '16px',
                  background: index === 0 ? 'rgba(245, 158, 11, 0.1)' : theme.colors.cardHover,
                  borderRadius: '12px',
                  border: index === 0 ? `1px solid ${theme.colors.accent.primary}44` : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  {index === 0 && <span style={{ fontSize: '20px' }}>🥇</span>}
                  {index === 1 && <span style={{ fontSize: '20px' }}>🥈</span>}
                  {index === 2 && <span style={{ fontSize: '20px' }}>🥉</span>}
                  <span style={{ fontSize: '24px' }}>{submission.userAvatar}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600 }}>{submission.userName}</p>
                  </div>
                  <button
                    onClick={() => handleLike(submission.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 12px',
                      background: submission.likedBy?.includes(user?.uid || '') ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '16px',
                      cursor: 'pointer',
                      color: submission.likedBy?.includes(user?.uid || '') ? '#ef4444' : theme.colors.text.primary,
                    }}
                  >
                    {submission.likedBy?.includes(user?.uid || '') ? '❤️' : '🤍'} {submission.likes || 0}
                  </button>
                </div>

                <p style={{ margin: '0 0 8px 0', lineHeight: 1.5 }}>{submission.content}</p>

                {submission.imageUrl && (
                  <img
                    src={submission.imageUrl}
                    alt="Submission"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(submission.imageUrl, '_blank')}
                  />
                )}
              </div>
            ))}

            {submissions.length === 0 && (
              <p style={{ textAlign: 'center', color: theme.colors.text.muted, padding: '20px' }}>
                No entries yet. Be the first to participate!
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
