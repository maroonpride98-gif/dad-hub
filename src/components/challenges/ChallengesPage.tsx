import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../common';
import { Challenge } from '../../types';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { ChallengeCard } from './ChallengeCard';
import { CreateChallengeModal } from './CreateChallengeModal';

export const ChallengesPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filter, setFilter] = useState<'active' | 'upcoming' | 'completed' | 'all'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const challengesRef = collection(db, 'challenges');
    const q = query(challengesRef, orderBy('startDate', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const now = new Date();
      const challengeData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        const startDate = data.startDate?.toDate?.() || new Date(data.startDate);
        const endDate = data.endDate?.toDate?.() || new Date(data.endDate);

        let status: 'upcoming' | 'active' | 'completed' = 'upcoming';
        if (now > endDate) {
          status = 'completed';
        } else if (now >= startDate && now <= endDate) {
          status = 'active';
        }

        return {
          id: docSnap.id,
          ...data,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status,
        } as Challenge;
      });
      setChallenges(challengeData);
    });

    return () => unsubscribe();
  }, []);

  const filteredChallenges = filter === 'all'
    ? challenges
    : challenges.filter((c) => c.status === filter);

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return 'Ended';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Weekly Challenges</h2>
          <p style={{ margin: '4px 0 0 0', color: theme.colors.text.muted, fontSize: '14px' }}>
            Compete with other dads and earn bonus points!
          </p>
        </div>
        {user?.isAdmin && (
          <Button icon="+" onClick={() => setShowCreateModal(true)}>
            New Challenge
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        {(['active', 'upcoming', 'completed', 'all'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 20px',
              borderRadius: '20px',
              border: 'none',
              background: filter === status ? theme.colors.accent.primary : theme.colors.card,
              color: filter === status ? '#fff' : theme.colors.text.primary,
              fontWeight: 600,
              cursor: 'pointer',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'all' ? 'All' : status}
            {status !== 'all' && (
              <span style={{ marginLeft: '6px', opacity: 0.8 }}>
                ({challenges.filter((c) => c.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Active Challenge Highlight */}
      {filter === 'active' && filteredChallenges.length > 0 && (
        <Card style={{
          background: `linear-gradient(135deg, ${theme.colors.accent.primary}22, ${theme.colors.accent.secondary}22)`,
          border: `1px solid ${theme.colors.accent.primary}44`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: theme.colors.accent.gradient,
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
            }}>
              🏆
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: '13px', color: theme.colors.accent.secondary, fontWeight: 600 }}>
                THIS WEEK'S CHALLENGE
              </p>
              <h3 style={{ margin: '4px 0', fontSize: '20px', fontWeight: 700 }}>
                {filteredChallenges[0].title}
              </h3>
              <p style={{ margin: 0, color: theme.colors.text.muted, fontSize: '14px' }}>
                {getTimeRemaining(filteredChallenges[0].endDate)} • {filteredChallenges[0].points} points
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Challenge List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredChallenges.map((challenge) => (
          <ChallengeCard key={challenge.id} challenge={challenge} />
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.muted }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>🏆</p>
          <p>No {filter === 'all' ? '' : filter} challenges right now.</p>
          {filter === 'active' && (
            <p style={{ fontSize: '14px' }}>Check back soon for new challenges!</p>
          )}
        </div>
      )}

      {showCreateModal && (
        <CreateChallengeModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};
