import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Mentor, MentorExpertise, EXPERTISE_INFO, MentorshipRequest } from '../../types/mentorship';
import { MentorCard } from './MentorCard';
import { RequestMentorModal } from './RequestMentorModal';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

type FilterTab = 'all' | 'available' | 'my_mentors';

export const MentorshipPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('available');
  const [selectedExpertise, setSelectedExpertise] = useState<MentorExpertise | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [pendingRequests, setPendingRequests] = useState<MentorshipRequest[]>([]);

  useEffect(() => {
    loadMentors();
    loadPendingRequests();
  }, []);

  const loadMentors = async () => {
    try {
      const mentorsRef = collection(db, 'mentors');
      const q = query(mentorsRef, orderBy('rating', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const mentorData = snapshot.docs.map((doc) => ({
        userId: doc.id,
        ...doc.data(),
      })) as Mentor[];

      setMentors(mentorData);
    } catch (error) {
      console.error('Error loading mentors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPendingRequests = async () => {
    if (!user?.uid) return;

    try {
      const requestsRef = collection(db, 'mentorshipRequests');
      const q = query(
        requestsRef,
        where('menteeId', '==', user.uid),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(q);

      const requests = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as MentorshipRequest[];

      setPendingRequests(requests);
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const filteredMentors = mentors.filter((mentor) => {
    if (activeTab === 'available' && (!mentor.isAvailable || mentor.matchedMentees.length >= mentor.maxMentees)) {
      return false;
    }
    if (activeTab === 'my_mentors' && !mentor.matchedMentees.includes(user.uid)) {
      return false;
    }
    if (selectedExpertise && !mentor.expertise.includes(selectedExpertise)) {
      return false;
    }
    return true;
  });

  const hasPendingRequest = (mentorId: string) => {
    return pendingRequests.some((req) => req.mentorId === mentorId);
  };

  const tabs: { id: FilterTab; label: string; icon: string }[] = [
    { id: 'available', label: 'Available', icon: '✅' },
    { id: 'all', label: 'All Mentors', icon: '👥' },
    { id: 'my_mentors', label: 'My Mentors', icon: '🤝' },
  ];

  const expertiseFilters = Object.entries(EXPERTISE_INFO) as [MentorExpertise, typeof EXPERTISE_INFO[MentorExpertise]][];

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
          background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎓 Dad Mentorship
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Connect with experienced dads for guidance and support
        </p>
      </div>

      {/* Stats Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '16px 20px',
          background: theme.colors.background.secondary,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {mentors.length}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Mentors</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {mentors.filter((m) => m.isAvailable).length}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Available</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {pendingRequests.length}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Pending</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '16px 20px',
          overflowX: 'auto',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              background: activeTab === tab.id ? theme.colors.accent.primary : theme.colors.background.secondary,
              border: 'none',
              borderRadius: '20px',
              color: activeTab === tab.id ? '#fff' : theme.colors.text.secondary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Expertise Filters */}
      <div
        style={{
          padding: '12px 20px',
          overflowX: 'auto',
          display: 'flex',
          gap: '8px',
        }}
      >
        <button
          onClick={() => setSelectedExpertise(null)}
          style={{
            padding: '8px 14px',
            background: selectedExpertise === null ? `${theme.colors.accent.primary}20` : 'transparent',
            border: selectedExpertise === null ? `2px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border}`,
            borderRadius: '16px',
            color: selectedExpertise === null ? theme.colors.accent.primary : theme.colors.text.secondary,
            fontSize: '13px',
            fontWeight: selectedExpertise === null ? 600 : 400,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All Topics
        </button>
        {expertiseFilters.map(([key, value]) => (
          <button
            key={key}
            onClick={() => setSelectedExpertise(key)}
            style={{
              padding: '8px 14px',
              background: selectedExpertise === key ? `${theme.colors.accent.primary}20` : 'transparent',
              border: selectedExpertise === key ? `2px solid ${theme.colors.accent.primary}` : `1px solid ${theme.colors.border}`,
              borderRadius: '16px',
              color: selectedExpertise === key ? theme.colors.accent.primary : theme.colors.text.secondary,
              fontSize: '13px',
              fontWeight: selectedExpertise === key ? 600 : 400,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{value.emoji}</span>
            <span>{value.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>
              🎓
            </div>
            <p style={{ color: theme.colors.text.muted }}>Loading mentors...</p>
          </div>
        ) : filteredMentors.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              No mentors found
            </h3>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              {activeTab === 'my_mentors'
                ? "You haven't connected with any mentors yet."
                : 'Try adjusting your filters to find mentors.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredMentors.map((mentor) => (
              <div key={mentor.userId} style={{ position: 'relative' }}>
                {hasPendingRequest(mentor.userId) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      padding: '4px 10px',
                      background: '#f59e0b',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#fff',
                      zIndex: 1,
                    }}
                  >
                    Request Pending
                  </div>
                )}
                <MentorCard
                  mentor={mentor}
                  onRequestMentorship={setSelectedMentor}
                  isRequesting={hasPendingRequest(mentor.userId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Become a Mentor CTA */}
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
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🌟</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
            Want to become a mentor?
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: theme.colors.text.secondary }}>
            Share your experience and help fellow dads on their journey.
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
            Apply to Mentor
          </button>
        </div>
      </div>

      {/* Request Modal */}
      {selectedMentor && (
        <RequestMentorModal
          mentor={selectedMentor}
          onClose={() => setSelectedMentor(null)}
          onSuccess={() => {
            loadPendingRequests();
          }}
        />
      )}
    </div>
  );
};

export default MentorshipPage;
