import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { MoviePoll, WeeklyMoviePoll } from './MoviePoll';
import { ScheduledNights, MovieNight } from './ScheduledNights';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

type TabType = 'poll' | 'scheduled' | 'past';

export const MovieNightPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('poll');
  const [currentPoll, setCurrentPoll] = useState<WeeklyMoviePoll | null>(null);
  const [upcomingNights, setUpcomingNights] = useState<MovieNight[]>([]);
  const [pastNights, setPastNights] = useState<MovieNight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentPoll();
    loadMovieNights();
  }, []);

  const loadCurrentPoll = async () => {
    try {
      const pollsRef = collection(db, 'moviePolls');
      const q = query(
        pollsRef,
        where('status', '==', 'active'),
        orderBy('startsAt', 'desc'),
        limit(1)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const pollData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
          startsAt: snapshot.docs[0].data().startsAt?.toDate(),
          endsAt: snapshot.docs[0].data().endsAt?.toDate(),
        } as WeeklyMoviePoll;
        setCurrentPoll(pollData);
      }
    } catch (error) {
      console.error('Error loading poll:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMovieNights = async () => {
    try {
      const nightsRef = collection(db, 'movieNights');

      // Get upcoming nights
      const upcomingQuery = query(
        nightsRef,
        where('status', 'in', ['upcoming', 'live']),
        orderBy('date', 'asc'),
        limit(10)
      );

      // Get past nights
      const pastQuery = query(
        nightsRef,
        where('status', '==', 'completed'),
        orderBy('date', 'desc'),
        limit(10)
      );

      const [upcomingSnap, pastSnap] = await Promise.all([
        getDocs(upcomingQuery),
        getDocs(pastQuery),
      ]);

      const upcoming = upcomingSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as MovieNight[];

      const past = pastSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate(),
      })) as MovieNight[];

      setUpcomingNights(upcoming);
      setPastNights(past);
    } catch (error) {
      console.error('Error loading movie nights:', error);
    }
  };

  const handleJoinNight = async (nightId: string) => {
    if (!user?.uid) return;

    haptics.light();

    try {
      const nightRef = doc(db, 'movieNights', nightId);
      await updateDoc(nightRef, {
        attendeeCount: increment(1),
        attendeeIds: arrayUnion(user.uid),
      });

      // Update local state
      setUpcomingNights((prev) =>
        prev.map((n) =>
          n.id === nightId
            ? {
                ...n,
                attendeeCount: n.attendeeCount + 1,
                attendeeIds: [...n.attendeeIds, user.uid],
              }
            : n
        )
      );

      haptics.success();
    } catch (error) {
      console.error('Error joining night:', error);
    }
  };

  const handleLeaveNight = async (nightId: string) => {
    if (!user?.uid) return;

    haptics.light();

    try {
      const nightRef = doc(db, 'movieNights', nightId);
      await updateDoc(nightRef, {
        attendeeCount: increment(-1),
        attendeeIds: arrayRemove(user.uid),
      });

      // Update local state
      setUpcomingNights((prev) =>
        prev.map((n) =>
          n.id === nightId
            ? {
                ...n,
                attendeeCount: n.attendeeCount - 1,
                attendeeIds: n.attendeeIds.filter((id) => id !== user.uid),
              }
            : n
        )
      );

      haptics.success();
    } catch (error) {
      console.error('Error leaving night:', error);
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'poll', label: 'This Week', icon: '🗳️' },
    { id: 'scheduled', label: 'Upcoming', icon: '📅' },
    { id: 'past', label: 'Past', icon: '📜' },
  ];

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
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎬 Dad Movie Night
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Vote for movies and join virtual watch parties
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          padding: '16px 20px',
          background: theme.colors.background.secondary,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {currentPoll?.totalVotes || 0}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Votes</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {upcomingNights.length}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Upcoming</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {pastNights.length}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Completed</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              padding: '12px',
              background:
                activeTab === tab.id ? theme.colors.accent.primary : theme.colors.background.secondary,
              border: 'none',
              borderRadius: '12px',
              color: activeTab === tab.id ? '#fff' : theme.colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>
              🎬
            </div>
            <p style={{ color: theme.colors.text.muted }}>Loading...</p>
          </div>
        ) : activeTab === 'poll' ? (
          currentPoll ? (
            <MoviePoll poll={currentPoll} onVote={loadCurrentPoll} />
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗳️</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
                No active poll
              </h3>
              <p style={{ margin: 0, color: theme.colors.text.muted }}>
                Check back soon for the next movie vote!
              </p>
            </div>
          )
        ) : activeTab === 'scheduled' ? (
          <ScheduledNights
            nights={upcomingNights}
            onJoin={handleJoinNight}
            onLeave={handleLeaveNight}
          />
        ) : (
          <ScheduledNights
            nights={pastNights}
            onJoin={handleJoinNight}
            onLeave={handleLeaveNight}
          />
        )}
      </div>

      {/* Host a Movie Night CTA */}
      <div style={{ padding: '0 20px 20px' }}>
        <div
          style={{
            padding: '20px',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
            borderRadius: '16px',
            border: `1px dashed ${theme.colors.accent.primary}40`,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎥</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
            Host a Movie Night
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: theme.colors.text.secondary }}>
            Pick a movie and invite other dads to watch together virtually!
          </p>
          <button
            style={{
              padding: '12px 24px',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Schedule Movie Night
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieNightPage;
