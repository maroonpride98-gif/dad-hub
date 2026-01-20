import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WelcomeCard } from './WelcomeCard';
import { QuickActions } from './QuickActions';
import { TrendingDiscussion } from './TrendingDiscussion';
import { UpcomingEvent } from './UpcomingEvent';
import { Leaderboard } from './Leaderboard';
import { DadOfTheWeek } from './DadOfTheWeek';
import { ActivityFeed } from './ActivityFeed';
import { DailySpinWheel, StreakDisplay } from '../rewards';
import { DailyTip } from '../tips';

export const HomePage: React.FC = () => {
  const { discussions, events, setActiveTab, setShowNewPost } = useApp();
  const [showSpinWheel, setShowSpinWheel] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'chat':
        setActiveTab('chat');
        break;
      case 'post':
        setActiveTab('board');
        setShowNewPost(true);
        break;
      case 'events':
        setActiveTab('events');
        break;
      case 'jokes':
        setActiveTab('jokes');
        break;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <DailyTip />
      <WelcomeCard />

      {/* Daily Rewards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <StreakDisplay />
        <div
          onClick={() => setShowSpinWheel(true)}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            borderRadius: '16px',
            padding: '20px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span style={{ fontSize: '40px' }}>🎰</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Daily Spin</span>
          <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Win up to 500 points!</span>
        </div>
      </div>

      <QuickActions onAction={handleQuickAction} />

      <DadOfTheWeek />

      {discussions.length > 0 && (
        <TrendingDiscussion
          discussion={discussions[0]}
          onSeeAll={() => setActiveTab('board')}
        />
      )}

      {events.length > 0 && (
        <UpcomingEvent
          event={events[0]}
          onSeeAll={() => setActiveTab('events')}
        />
      )}

      <Leaderboard />

      <ActivityFeed />

      {showSpinWheel && <DailySpinWheel onClose={() => setShowSpinWheel(false)} />}
    </div>
  );
};
