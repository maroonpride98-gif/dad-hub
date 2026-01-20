import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { haptics } from '../../utils/haptics';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'family' | 'health' | 'career' | 'personal' | 'financial';
  targetDate?: Date;
  progress: number;
  milestones: Milestone[];
  isCompleted: boolean;
  createdAt: Date;
}

interface Milestone {
  id: string;
  title: string;
  isCompleted: boolean;
  completedAt?: Date;
}

const GOAL_CATEGORIES = [
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧‍👦', color: '#ec4899' },
  { id: 'health', label: 'Health', emoji: '💪', color: '#22c55e' },
  { id: 'career', label: 'Career', emoji: '💼', color: '#3b82f6' },
  { id: 'personal', label: 'Personal', emoji: '🎯', color: '#f59e0b' },
  { id: 'financial', label: 'Financial', emoji: '💰', color: '#8b5cf6' },
];

const SAMPLE_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Family Vacation to Disney',
    description: 'Plan and save for a magical trip to Disney World',
    category: 'family',
    targetDate: new Date(Date.now() + 86400000 * 180),
    progress: 65,
    milestones: [
      { id: 'm1', title: 'Research hotels', isCompleted: true, completedAt: new Date(Date.now() - 86400000 * 30) },
      { id: 'm2', title: 'Book flights', isCompleted: true, completedAt: new Date(Date.now() - 86400000 * 15) },
      { id: 'm3', title: 'Purchase park tickets', isCompleted: false },
      { id: 'm4', title: 'Plan itinerary', isCompleted: false },
    ],
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 60),
  },
  {
    id: '2',
    title: 'Run a 5K',
    description: 'Complete a 5K race with the family',
    category: 'health',
    targetDate: new Date(Date.now() + 86400000 * 90),
    progress: 40,
    milestones: [
      { id: 'm1', title: 'Start couch to 5K program', isCompleted: true },
      { id: 'm2', title: 'Run 2K without stopping', isCompleted: true },
      { id: 'm3', title: 'Register for race', isCompleted: false },
      { id: 'm4', title: 'Complete the race', isCompleted: false },
    ],
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 30),
  },
  {
    id: '3',
    title: 'Build Emergency Fund',
    description: 'Save 3 months of expenses',
    category: 'financial',
    progress: 80,
    milestones: [
      { id: 'm1', title: 'Open savings account', isCompleted: true },
      { id: 'm2', title: 'Save month 1', isCompleted: true },
      { id: 'm3', title: 'Save month 2', isCompleted: true },
      { id: 'm4', title: 'Save month 3', isCompleted: false },
    ],
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 90),
  },
  {
    id: '4',
    title: 'Learn Guitar',
    description: 'Learn enough to play songs with the kids',
    category: 'personal',
    progress: 25,
    milestones: [
      { id: 'm1', title: 'Buy a guitar', isCompleted: true },
      { id: 'm2', title: 'Learn basic chords', isCompleted: false },
      { id: 'm3', title: 'Learn first song', isCompleted: false },
      { id: 'm4', title: 'Play for family', isCompleted: false },
    ],
    isCompleted: false,
    createdAt: new Date(Date.now() - 86400000 * 45),
  },
];

export const GoalsPage: React.FC = () => {
  const { theme } = useTheme();
  const [goals, setGoals] = useState<Goal[]>(SAMPLE_GOALS);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredGoals = filterCategory
    ? goals.filter(g => g.category === filterCategory)
    : goals;

  const activeGoals = filteredGoals.filter(g => !g.isCompleted);
  const completedGoals = filteredGoals.filter(g => g.isCompleted);

  const getCategoryInfo = (categoryId: string) => {
    return GOAL_CATEGORIES.find(c => c.id === categoryId) || GOAL_CATEGORIES[0];
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const updatedMilestones = goal.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              isCompleted: !m.isCompleted,
              completedAt: !m.isCompleted ? new Date() : undefined
            };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...goal,
          milestones: updatedMilestones,
          progress: newProgress,
          isCompleted: newProgress === 100,
        };
      }
      return goal;
    }));

    if (selectedGoal?.id === goalId) {
      setSelectedGoal(prev => {
        if (!prev) return null;
        const updatedMilestones = prev.milestones.map(m => {
          if (m.id === milestoneId) {
            return {
              ...m,
              isCompleted: !m.isCompleted,
              completedAt: !m.isCompleted ? new Date() : undefined
            };
          }
          return m;
        });
        const completedCount = updatedMilestones.filter(m => m.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
        return {
          ...prev,
          milestones: updatedMilestones,
          progress: newProgress,
          isCompleted: newProgress === 100,
        };
      });
    }

    haptics.light();
  };

  const getDaysUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    return Math.ceil(diff / 86400000);
  };

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
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎯 Goal Tracker
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Set goals and track your progress
        </p>
      </div>

      {/* Stats Overview */}
      <div style={{ padding: '20px', display: 'flex', gap: '12px' }}>
        <div
          style={{
            flex: 1,
            padding: '16px',
            background: theme.colors.card,
            borderRadius: '14px',
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {activeGoals.length}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Active Goals</p>
        </div>
        <div
          style={{
            flex: 1,
            padding: '16px',
            background: theme.colors.card,
            borderRadius: '14px',
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 700, color: '#22c55e' }}>
            {completedGoals.length}
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Completed</p>
        </div>
        <div
          style={{
            flex: 1,
            padding: '16px',
            background: theme.colors.card,
            borderRadius: '14px',
            border: `1px solid ${theme.colors.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ margin: '0 0 4px 0', fontSize: '28px', fontWeight: 700, color: '#8b5cf6' }}>
            {Math.round(activeGoals.reduce((sum, g) => sum + g.progress, 0) / (activeGoals.length || 1))}%
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Avg Progress</p>
        </div>
      </div>

      {/* Category Filters */}
      <div style={{ padding: '0 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          <button
            onClick={() => {
              setFilterCategory(null);
              haptics.light();
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filterCategory === null ? theme.colors.accent.primary : theme.colors.background.secondary,
              color: filterCategory === null ? '#fff' : theme.colors.text.secondary,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            All
          </button>
          {GOAL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setFilterCategory(cat.id);
                haptics.light();
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                border: 'none',
                background: filterCategory === cat.id ? cat.color : theme.colors.background.secondary,
                color: filterCategory === cat.id ? '#fff' : theme.colors.text.secondary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Active Goals */}
        {activeGoals.length > 0 && (
          <>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
              Active Goals
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {activeGoals.map(goal => {
                const categoryInfo = getCategoryInfo(goal.category);
                const daysUntil = goal.targetDate ? getDaysUntil(goal.targetDate) : null;

                return (
                  <button
                    key={goal.id}
                    onClick={() => {
                      setSelectedGoal(goal);
                      haptics.medium();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px',
                      background: theme.colors.card,
                      borderRadius: '16px',
                      border: `1px solid ${theme.colors.border}`,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${categoryInfo.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                      }}
                    >
                      {categoryInfo.emoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: theme.colors.text.primary }}>
                        {goal.title}
                      </p>
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: theme.colors.text.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {goal.description}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            flex: 1,
                            height: '6px',
                            background: theme.colors.background.secondary,
                            borderRadius: '3px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              height: '100%',
                              width: `${goal.progress}%`,
                              background: categoryInfo.color,
                              borderRadius: '3px',
                              transition: 'width 0.3s',
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: categoryInfo.color }}>
                          {goal.progress}%
                        </span>
                      </div>
                      {daysUntil !== null && (
                        <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: daysUntil < 30 ? '#ef4444' : theme.colors.text.muted }}>
                          {daysUntil > 0 ? `${daysUntil} days left` : daysUntil === 0 ? 'Due today!' : `${Math.abs(daysUntil)} days overdue`}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Add Goal Button */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: theme.colors.accent.gradient,
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          ➕ Add New Goal
        </button>
      </div>

      {/* Goal Detail Modal */}
      {selectedGoal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
          }}
          onClick={() => setSelectedGoal(null)}
        >
          <div
            style={{
              width: '100%',
              maxHeight: '80vh',
              background: theme.colors.background.primary,
              borderRadius: '24px 24px 0 0',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px',
                background: getCategoryInfo(selectedGoal.category).color,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px' }}>{getCategoryInfo(selectedGoal.category).emoji}</span>
                <button
                  onClick={() => setSelectedGoal(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    fontSize: '18px',
                    cursor: 'pointer',
                  }}
                >
                  ×
                </button>
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: 700, color: '#fff' }}>
                {selectedGoal.title}
              </h2>
              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
                {selectedGoal.description}
              </p>
            </div>

            {/* Progress */}
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>Progress</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: getCategoryInfo(selectedGoal.category).color }}>
                  {selectedGoal.progress}%
                </span>
              </div>
              <div
                style={{
                  height: '12px',
                  background: theme.colors.background.secondary,
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${selectedGoal.progress}%`,
                    background: getCategoryInfo(selectedGoal.category).color,
                    borderRadius: '6px',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>

            {/* Milestones */}
            <div style={{ padding: '0 20px 20px', maxHeight: '300px', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.secondary }}>
                Milestones
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedGoal.milestones.map(milestone => (
                  <button
                    key={milestone.id}
                    onClick={() => toggleMilestone(selectedGoal.id, milestone.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px',
                      background: milestone.isCompleted ? `${getCategoryInfo(selectedGoal.category).color}10` : theme.colors.card,
                      borderRadius: '12px',
                      border: `1px solid ${milestone.isCompleted ? getCategoryInfo(selectedGoal.category).color : theme.colors.border}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: `2px solid ${milestone.isCompleted ? getCategoryInfo(selectedGoal.category).color : theme.colors.border}`,
                        background: milestone.isCompleted ? getCategoryInfo(selectedGoal.category).color : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        flexShrink: 0,
                      }}
                    >
                      {milestone.isCompleted && '✓'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '14px',
                          fontWeight: 500,
                          color: milestone.isCompleted ? getCategoryInfo(selectedGoal.category).color : theme.colors.text.primary,
                          textDecoration: milestone.isCompleted ? 'line-through' : 'none',
                        }}
                      >
                        {milestone.title}
                      </p>
                      {milestone.completedAt && (
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: theme.colors.text.muted }}>
                          Completed {milestone.completedAt.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Goal Modal Placeholder */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700, color: theme.colors.text.primary }}>
              Add New Goal
            </h3>
            <p style={{ margin: '0 0 20px 0', color: theme.colors.text.muted }}>
              Goal creation coming soon!
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: theme.colors.accent.gradient,
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
