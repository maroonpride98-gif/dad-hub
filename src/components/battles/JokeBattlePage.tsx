import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { JokeBattle, BattleStats, BattleLeaderboardEntry, BATTLE_THEMES } from '../../types/battle';
import { BattleCard } from './BattleCard';
import { CreateBattleModal } from './CreateBattleModal';
import { collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

type TabType = 'active' | 'my_battles' | 'leaderboard';

export const JokeBattlePage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [battles, setBattles] = useState<JokeBattle[]>([]);
  const [myBattles, setMyBattles] = useState<JokeBattle[]>([]);
  const [leaderboard, setLeaderboard] = useState<BattleLeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<BattleStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadActiveBattles();
    loadUserStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'my_battles') {
      loadMyBattles();
    } else if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab]);

  const loadActiveBattles = async () => {
    try {
      const battlesRef = collection(db, 'jokeBattles');
      const q = query(
        battlesRef,
        where('status', 'in', ['active', 'voting']),
        orderBy('endsAt', 'asc'),
        limit(20)
      );
      const snapshot = await getDocs(q);

      const battleData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startsAt: doc.data().startsAt?.toDate(),
        endsAt: doc.data().endsAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as JokeBattle[];

      setBattles(battleData);
    } catch (error) {
      console.error('Error loading battles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMyBattles = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    try {
      const battlesRef = collection(db, 'jokeBattles');

      // Get battles where user is participant1
      const q1 = query(
        battlesRef,
        where('participant1.userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      // Get battles where user is participant2
      const q2 = query(
        battlesRef,
        where('participant2.userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(20)
      );

      const [snapshot1, snapshot2] = await Promise.all([getDocs(q1), getDocs(q2)]);

      const battles1 = snapshot1.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startsAt: doc.data().startsAt?.toDate(),
        endsAt: doc.data().endsAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as JokeBattle[];

      const battles2 = snapshot2.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startsAt: doc.data().startsAt?.toDate(),
        endsAt: doc.data().endsAt?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as JokeBattle[];

      // Combine and dedupe
      const allBattles = [...battles1, ...battles2];
      const uniqueBattles = allBattles.filter(
        (battle, index, self) => index === self.findIndex((b) => b.id === battle.id)
      );

      // Sort by date
      uniqueBattles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setMyBattles(uniqueBattles);
    } catch (error) {
      console.error('Error loading my battles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const statsRef = collection(db, 'battleStats');
      const q = query(statsRef, orderBy('wins', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const leaderboardData = snapshot.docs.map((doc, index) => ({
        rank: index + 1,
        userId: doc.id,
        ...doc.data(),
      })) as BattleLeaderboardEntry[];

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserStats = async () => {
    if (!user?.uid) return;

    try {
      const statsDoc = await getDoc(doc(db, 'battleStats', user.uid));
      if (statsDoc.exists()) {
        setUserStats(statsDoc.data() as BattleStats);
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'active', label: 'Active Battles', icon: '⚔️' },
    { id: 'my_battles', label: 'My Battles', icon: '🏆' },
    { id: 'leaderboard', label: 'Champions', icon: '👑' },
  ];

  const featuredBattle = battles.find((b) => b.isFeatured);
  const regularBattles = battles.filter((b) => !b.isFeatured);

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
          background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fff' }}>
            ⚔️ Joke Battles
          </h1>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            🎯 Challenge
          </button>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Go head-to-head with other dads in epic joke showdowns!
        </p>
      </div>

      {/* User Stats */}
      {userStats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            padding: '16px 20px',
            background: theme.colors.background.secondary,
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>
              {userStats.wins}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Wins</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>
              {userStats.losses}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Losses</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.accent.primary }}>
              {userStats.currentStreak}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Streak</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: theme.colors.text.primary }}>
              {userStats.totalBattles > 0
                ? Math.round((userStats.wins / userStats.totalBattles) * 100)
                : 0}%
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Win Rate</p>
          </div>
        </div>
      )}

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
              background:
                activeTab === tab.id ? theme.colors.accent.primary : theme.colors.background.secondary,
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

      {/* Content */}
      <div style={{ padding: '16px 20px' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>
              ⚔️
            </div>
            <p style={{ color: theme.colors.text.muted }}>Loading battles...</p>
          </div>
        ) : activeTab === 'active' ? (
          <>
            {/* Featured Battle */}
            {featuredBattle && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
                  🔥 Featured Battle
                </h3>
                <BattleCard battle={featuredBattle} onVote={loadActiveBattles} />
              </div>
            )}

            {/* Regular Battles */}
            {regularBattles.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {regularBattles.map((battle) => (
                  <BattleCard key={battle.id} battle={battle} onVote={loadActiveBattles} />
                ))}
              </div>
            ) : !featuredBattle ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎭</div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
                  No active battles
                </h3>
                <p style={{ margin: '0 0 16px 0', color: theme.colors.text.muted }}>
                  Be the first to challenge another dad!
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  style={{
                    padding: '14px 24px',
                    background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Start a Battle
                </button>
              </div>
            ) : null}
          </>
        ) : activeTab === 'my_battles' ? (
          myBattles.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myBattles.map((battle) => (
                <BattleCard key={battle.id} battle={battle} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎯</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
                No battles yet
              </h3>
              <p style={{ margin: '0 0 16px 0', color: theme.colors.text.muted }}>
                Challenge another dad to start your battle record!
              </p>
            </div>
          )
        ) : (
          /* Leaderboard */
          leaderboard.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: theme.colors.card,
                    borderRadius: '12px',
                    border:
                      entry.rank <= 3
                        ? `2px solid ${
                            entry.rank === 1 ? '#ffd700' : entry.rank === 2 ? '#c0c0c0' : '#cd7f32'
                          }`
                        : `1px solid ${theme.colors.border}`,
                  }}
                >
                  {/* Rank */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background:
                        entry.rank === 1
                          ? '#ffd700'
                          : entry.rank === 2
                          ? '#c0c0c0'
                          : entry.rank === 3
                          ? '#cd7f32'
                          : theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: entry.rank <= 3 ? '16px' : '14px',
                      fontWeight: 700,
                      color: entry.rank <= 3 ? '#000' : theme.colors.text.secondary,
                    }}
                  >
                    {entry.rank <= 3
                      ? entry.rank === 1
                        ? '👑'
                        : entry.rank === 2
                        ? '🥈'
                        : '🥉'
                      : entry.rank}
                  </div>

                  {/* Avatar */}
                  <div
                    style={{
                      fontSize: '28px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {entry.userAvatar}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: '15px',
                        color: theme.colors.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {entry.userName}
                      {entry.titleEmoji && <span>{entry.titleEmoji}</span>}
                    </p>
                    {entry.title && (
                      <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                        {entry.title}
                      </p>
                    )}
                  </div>

                  {/* Stats */}
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '16px', color: '#22c55e' }}>
                      {entry.wins} wins
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                      {Math.round(entry.winRate * 100)}% rate
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
                No champions yet
              </h3>
              <p style={{ margin: 0, color: theme.colors.text.muted }}>
                Win battles to climb the leaderboard!
              </p>
            </div>
          )
        )}
      </div>

      {/* Battle Themes Info */}
      <div style={{ padding: '0 20px 20px' }}>
        <div
          style={{
            padding: '16px',
            background: theme.colors.background.secondary,
            borderRadius: '16px',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700, color: theme.colors.text.primary }}>
            Battle Themes
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {BATTLE_THEMES.map((theme) => (
              <span
                key={theme.id}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: '#9ca3af',
                }}
              >
                {theme.emoji} {theme.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Create Battle Modal */}
      {showCreateModal && (
        <CreateBattleModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            loadActiveBattles();
            loadMyBattles();
          }}
        />
      )}
    </div>
  );
};

export default JokeBattlePage;
