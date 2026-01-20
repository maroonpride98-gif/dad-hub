import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { QuestCard } from './QuestCard';
import { QUEST_CATEGORY_INFO, QuestCategory } from '../../types/quests';

type FilterTab = 'all' | QuestCategory;

export const QuestsPanel: React.FC = () => {
  const { theme } = useTheme();
  const { dailyQuests, claimQuestReward, questsLoading, refreshDailyQuests } = useGamification();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate stats
  const completedCount = dailyQuests.filter(q => q.completed).length;
  const claimedCount = dailyQuests.filter(q => q.claimedAt).length;
  const totalXpAvailable = dailyQuests
    .filter(q => !q.claimedAt)
    .reduce((sum, q) => sum + q.quest.xpReward, 0);
  const totalXpEarned = dailyQuests
    .filter(q => q.claimedAt)
    .reduce((sum, q) => sum + q.quest.xpReward, 0);

  // Filter quests by tab
  const filteredQuests = activeTab === 'all'
    ? dailyQuests
    : dailyQuests.filter(q => q.quest.category === activeTab);

  // Time until quest reset (midnight)
  const [timeUntilReset, setTimeUntilReset] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setTimeUntilReset(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshDailyQuests();
    setIsRefreshing(false);
  };

  const handleClaimReward = async (questId: string) => {
    await claimQuestReward(questId);
  };

  const tabs: { id: FilterTab; label: string; icon?: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'social', label: QUEST_CATEGORY_INFO.social.label, icon: QUEST_CATEGORY_INFO.social.icon },
    { id: 'content', label: QUEST_CATEGORY_INFO.content.label, icon: QUEST_CATEGORY_INFO.content.icon },
    { id: 'activity', label: QUEST_CATEGORY_INFO.activity.label, icon: QUEST_CATEGORY_INFO.activity.icon },
  ];

  if (questsLoading) {
    return (
      <div
        style={{
          padding: '40px 20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '40px', marginBottom: '12px', animation: 'float 2s ease-in-out infinite' }}>
          📜
        </div>
        <p style={{ color: theme.colors.text.muted }}>Loading quests...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2
            style={{
              margin: '0 0 4px 0',
              fontSize: '24px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Daily Quests
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
            Resets in {timeUntilReset}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          style={{
            padding: '8px 12px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            color: theme.colors.text.secondary,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span style={{
            display: 'inline-block',
            animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
          }}>
            🔄
          </span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Card */}
      <div
        style={{
          background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          border: `1px solid ${theme.colors.accent.primary}30`,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {completedCount}/{dailyQuests.length}
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.text.muted }}>Completed</div>
          </div>
          <div
            style={{
              width: '1px',
              background: theme.colors.border,
            }}
          />
          <div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.colors.accent.primary,
              }}
            >
              +{totalXpEarned}
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.text.muted }}>XP Earned</div>
          </div>
          <div
            style={{
              width: '1px',
              background: theme.colors.border,
            }}
          />
          <div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 700,
                color: theme.colors.text.secondary,
              }}
            >
              {totalXpAvailable}
            </div>
            <div style={{ fontSize: '12px', color: theme.colors.text.muted }}>XP Available</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '16px' }}>
          <div
            style={{
              height: '8px',
              background: theme.colors.background.secondary,
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(claimedCount / dailyQuests.length) * 100}%`,
                background: `linear-gradient(90deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                borderRadius: '4px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '16px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '8px 16px',
              background: activeTab === tab.id
                ? `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
                : theme.colors.background.secondary,
              border: 'none',
              borderRadius: '20px',
              color: activeTab === tab.id ? '#fff' : theme.colors.text.secondary,
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Quest List */}
      <div>
        {filteredQuests.length === 0 ? (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              color: theme.colors.text.muted,
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
            <p>No quests in this category</p>
          </div>
        ) : (
          filteredQuests.map((questProgress) => (
            <QuestCard
              key={questProgress.quest.id}
              questProgress={questProgress}
              onClaim={() => handleClaimReward(questProgress.quest.id)}
            />
          ))
        )}
      </div>

      {/* Bonus tip */}
      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: theme.colors.background.secondary,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '24px' }}>💡</span>
        <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.secondary }}>
          Complete all daily quests to earn the "Overachiever" bonus!
        </p>
      </div>
    </div>
  );
};

export default QuestsPanel;
