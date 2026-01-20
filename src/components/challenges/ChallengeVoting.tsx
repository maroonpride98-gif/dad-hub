import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { doc, updateDoc, arrayUnion, increment, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  votes: number;
  voterIds: string[];
  createdAt: Date;
}

interface ChallengeVotingProps {
  challengeId: string;
  challengeTitle: string;
  onClose: () => void;
}

export const ChallengeVoting: React.FC<ChallengeVotingProps> = ({
  challengeId,
  challengeTitle,
  onClose,
}) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [votingSubmissionId, setVotingSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    loadSubmissions();
  }, [challengeId]);

  const loadSubmissions = async () => {
    try {
      const submissionsRef = collection(db, 'challengeSubmissions');
      const q = query(submissionsRef, where('challengeId', '==', challengeId));
      const snapshot = await getDocs(q);

      const submissionData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as ChallengeSubmission[];

      // Sort by votes descending
      submissionData.sort((a, b) => b.votes - a.votes);
      setSubmissions(submissionData);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = async (submissionId: string) => {
    if (!user?.uid || votingSubmissionId) return;

    const submission = submissions.find(s => s.id === submissionId);
    if (!submission || submission.voterIds?.includes(user.uid)) return;

    setVotingSubmissionId(submissionId);
    haptics.light();

    try {
      await updateDoc(doc(db, 'challengeSubmissions', submissionId), {
        votes: increment(1),
        voterIds: arrayUnion(user.uid),
      });

      // Update local state
      setSubmissions(prev =>
        prev.map(s =>
          s.id === submissionId
            ? { ...s, votes: s.votes + 1, voterIds: [...(s.voterIds || []), user.uid] }
            : s
        ).sort((a, b) => b.votes - a.votes)
      );

      haptics.success();
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVotingSubmissionId(null);
    }
  };

  const hasVoted = (submission: ChallengeSubmission) => {
    return submission.voterIds?.includes(user?.uid || '');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: theme.colors.background.primary,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: 'none',
            background: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            fontSize: '18px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ←
        </button>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Vote for Submissions</h3>
          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
            {challengeTitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', animation: 'float 2s ease-in-out infinite' }}>🗳️</div>
            <p style={{ color: theme.colors.text.muted }}>Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: theme.colors.text.muted }}>No submissions yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {submissions.map((submission, index) => (
              <div
                key={submission.id}
                style={{
                  background: theme.colors.card,
                  borderRadius: '16px',
                  padding: '16px',
                  border: `1px solid ${theme.colors.border}`,
                  position: 'relative',
                }}
              >
                {/* Rank badge for top 3 */}
                {index < 3 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      left: '-8px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#000',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    {index + 1}
                  </div>
                )}

                {/* User info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div
                    style={{
                      fontSize: '28px',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {submission.userAvatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>
                      {submission.userName}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                      {submission.votes} vote{submission.votes !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <p style={{ margin: '0 0 12px 0', color: theme.colors.text.secondary }}>
                  {submission.content}
                </p>

                {/* Image if available */}
                {submission.imageUrl && (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '12px',
                    }}
                  >
                    <img
                      src={submission.imageUrl}
                      alt="Submission"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                )}

                {/* Vote button */}
                <button
                  onClick={() => handleVote(submission.id)}
                  disabled={hasVoted(submission) || votingSubmissionId === submission.id}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: hasVoted(submission)
                      ? theme.colors.background.secondary
                      : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                    color: hasVoted(submission) ? theme.colors.text.muted : '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: hasVoted(submission) ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {hasVoted(submission) ? (
                    <>✓ Voted</>
                  ) : votingSubmissionId === submission.id ? (
                    <>Voting...</>
                  ) : (
                    <>👍 Vote for this</>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeVoting;
