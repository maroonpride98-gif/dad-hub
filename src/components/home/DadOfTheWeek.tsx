import React from 'react';

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

const CURRENT_DAD: DadOfTheWeekData = {
  name: 'Mike Thompson',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
  title: 'Grill Master',
  achievement: 'Most helpful dad this week',
  stats: {
    posts: 47,
    likes: 234,
    streak: 28,
  },
  quote: "Being a dad is the greatest adventure of my life!",
};

export const DadOfTheWeek: React.FC = () => {
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
            src={CURRENT_DAD.avatar}
            alt={CURRENT_DAD.name}
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
            {CURRENT_DAD.name}
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
              🔥 {CURRENT_DAD.title}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>
            {CURRENT_DAD.achievement}
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
            {CURRENT_DAD.stats.posts}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>Posts</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
            {CURRENT_DAD.stats.likes}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>Likes</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#78350f' }}>
            {CURRENT_DAD.stats.streak}🔥
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#92400e' }}>Day Streak</p>
        </div>
      </div>

      {/* Quote */}
      {CURRENT_DAD.quote && (
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
            "{CURRENT_DAD.quote}"
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
