import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface DadOfTheWeekData {
  name: string;
  avatar: string;
  title: string;
  achievement: string;
  stats: {
    posts: number;
    likes: number;
    streak: number;
  };
  quote?: string;
}

export const DadOfTheWeek: React.FC = () => {
  const [dadOfWeek, setDadOfWeek] = useState<DadOfTheWeekData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDadOfWeek = async () => {
      try {
        // Try to load from Firebase
        const dadRef = collection(db, 'dadOfTheWeek');
        const q = query(dadRef, orderBy('weekOf', 'desc'), limit(1));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data() as DadOfTheWeekData;
          setDadOfWeek(data);
        }
      } catch (error) {
        console.error('Error loading dad of the week:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDadOfWeek();
  }, []);

  // Don't render if no dad of the week is set
  if (isLoading) {
    return null;
  }

  if (!dadOfWeek) {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '40px' }}>🏆</span>
        <h3 style={{ margin: '12px 0 8px', fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
          Dad of the Week
        </h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
          Be active in the community to be featured!
        </p>
      </div>
    );
  }
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
        borderRadius: '20px',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '80px',
          opacity: 0.2,
        }}
      >
        🏆
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>⭐</span>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
          Dad of the Week
        </h3>
      </div>

      {/* Dad Profile */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ position: 'relative' }}>
          <img
            src={dadOfWeek.avatar}
            alt={dadOfWeek.name}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              border: '3px solid #fff',
              background: '#fff',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-4px',
              right: '-4px',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            👑
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
            {dadOfWeek.name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'rgba(120, 53, 15, 0.15)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#78350f',
              }}
            >
              🔥 {dadOfWeek.title}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
            {dadOfWeek.achievement}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '16px',
          padding: '12px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '12px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
            {dadOfWeek.stats.posts}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>Posts</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
            {dadOfWeek.stats.likes}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>Likes</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
            {dadOfWeek.stats.streak}🔥
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>Day Streak</p>
        </div>
      </div>

      {/* Quote */}
      {dadOfWeek.quote && (
        <div
          style={{
            marginTop: '14px',
            padding: '12px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            borderLeft: '3px solid #78350f',
          }}
        >
          <p style={{ margin: 0, fontSize: '13px', fontStyle: 'italic', color: '#78350f' }}>
            "{dadOfWeek.quote}"
          </p>
        </div>
      )}

      {/* Nominate Button */}
      <button
        style={{
          width: '100%',
          marginTop: '14px',
          padding: '10px',
          borderRadius: '10px',
          border: '2px solid rgba(120, 53, 15, 0.3)',
          background: 'transparent',
          color: '#78350f',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        🌟 Nominate a Dad
      </button>
    </div>
  );
};

export default DadOfTheWeek;
