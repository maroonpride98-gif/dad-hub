import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import {
  Milestone,
  MilestoneCategory,
  MILESTONE_CATEGORIES,
  MILESTONE_SUGGESTIONS,
} from '../../types/milestone';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

export const MilestonesPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<MilestoneCategory | 'all'>('all');

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<MilestoneCategory>('first');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [kidName, setKidName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMilestones();
  }, []);

  const loadMilestones = async () => {
    if (!user?.uid) return;

    try {
      const milestonesRef = collection(db, 'milestones');
      const q = query(
        milestonesRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );
      const snapshot = await getDocs(q);

      const milestoneData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Milestone[];

      setMilestones(milestoneData);
    } catch (error) {
      console.error('Error loading milestones:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMilestone = async () => {
    if (!newTitle.trim() || !kidName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      const milestoneDate = new Date(newDate);

      await addDoc(collection(db, 'milestones'), {
        userId: user.uid,
        kidId: kidName.toLowerCase().replace(/\s+/g, '_'),
        kidName: kidName.trim(),
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        category: newCategory,
        date: milestoneDate,
        isFavorite: false,
        createdAt: serverTimestamp(),
      });

      haptics.success();
      setShowAddModal(false);
      resetForm();
      loadMilestones();
    } catch (error) {
      console.error('Error adding milestone:', error);
      alert('Failed to add milestone. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (milestoneId: string, currentValue: boolean) => {
    haptics.light();

    try {
      await updateDoc(doc(db, 'milestones', milestoneId), {
        isFavorite: !currentValue,
      });

      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, isFavorite: !currentValue } : m))
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm('Are you sure you want to delete this milestone?')) return;

    haptics.light();

    try {
      await deleteDoc(doc(db, 'milestones', milestoneId));
      setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      haptics.success();
    } catch (error) {
      console.error('Error deleting milestone:', error);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDescription('');
    setNewCategory('first');
    setNewDate(new Date().toISOString().split('T')[0]);
    setKidName('');
  };

  const filteredMilestones =
    filterCategory === 'all'
      ? milestones
      : milestones.filter((m) => m.category === filterCategory);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const categories: { id: MilestoneCategory | 'all'; label: string; emoji: string }[] = [
    { id: 'all', label: 'All', emoji: '📋' },
    ...Object.entries(MILESTONE_CATEGORIES).map(([id, info]) => ({
      id: id as MilestoneCategory,
      label: info.label,
      emoji: info.emoji,
    })),
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
          background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          📸 Kid Milestones
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Capture and cherish every special moment
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px 20px',
          background: theme.colors.background.secondary,
          overflowX: 'auto',
        }}
      >
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {milestones.length}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Total</p>
        </div>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#f59e0b' }}>
            {milestones.filter((m) => m.isFavorite).length}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Favorites</p>
        </div>
        <div style={{ textAlign: 'center', minWidth: '80px' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
            {new Set(milestones.map((m) => m.kidName)).size}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Kids</p>
        </div>
      </div>

      {/* Add Button */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '14px',
            border: 'none',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
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
          ✨ Add New Milestone
        </button>
      </div>

      {/* Category Filter */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '0 20px 16px',
          overflowX: 'auto',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            style={{
              padding: '8px 14px',
              background:
                filterCategory === cat.id
                  ? theme.colors.accent.primary
                  : theme.colors.background.secondary,
              border: 'none',
              borderRadius: '16px',
              color: filterCategory === cat.id ? '#fff' : theme.colors.text.secondary,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Milestones Timeline */}
      <div style={{ padding: '0 20px' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>
              📸
            </div>
            <p style={{ color: theme.colors.text.muted }}>Loading milestones...</p>
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              No milestones yet
            </h3>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              Start capturing those precious moments!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredMilestones.map((milestone) => {
              const categoryInfo = MILESTONE_CATEGORIES[milestone.category];
              return (
                <div
                  key={milestone.id}
                  style={{
                    background: theme.colors.card,
                    borderRadius: '16px',
                    padding: '16px',
                    border: `1px solid ${theme.colors.border}`,
                    borderLeft: `4px solid ${categoryInfo.color}`,
                    position: 'relative',
                  }}
                >
                  {/* Favorite Button */}
                  <button
                    onClick={() => handleToggleFavorite(milestone.id, milestone.isFavorite || false)}
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    {milestone.isFavorite ? '⭐' : '☆'}
                  </button>

                  {/* Kid & Date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: `${categoryInfo.color}20`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: categoryInfo.color,
                      }}
                    >
                      {milestone.kidName}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
                      {formatDate(milestone.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary, paddingRight: '30px' }}>
                    {categoryInfo.emoji} {milestone.title}
                  </h4>

                  {/* Description */}
                  {milestone.description && (
                    <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: theme.colors.text.secondary }}>
                      {milestone.description}
                    </p>
                  )}

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteMilestone(milestone.id)}
                    style={{
                      padding: '6px 12px',
                      background: 'none',
                      border: 'none',
                      color: theme.colors.text.muted,
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
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
              maxWidth: '480px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>✨ New Milestone</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px' }}>
              {/* Kid Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  Kid's Name *
                </label>
                <input
                  type="text"
                  value={kidName}
                  onChange={(e) => setKidName(e.target.value)}
                  placeholder="e.g., Emma"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                  }}
                />
              </div>

              {/* Title */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  What happened? *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., First steps!"
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                  }}
                />
                {/* Suggestions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {MILESTONE_SUGGESTIONS.slice(0, 6).map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setNewTitle(s.title);
                        setNewCategory(s.category);
                      }}
                      style={{
                        padding: '4px 10px',
                        background: theme.colors.background.secondary,
                        border: `1px solid ${theme.colors.border}`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: theme.colors.text.secondary,
                        cursor: 'pointer',
                      }}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  Category
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(MILESTONE_CATEGORIES).map(([key, info]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewCategory(key as MilestoneCategory)}
                      style={{
                        padding: '8px 14px',
                        background: newCategory === key ? `${info.color}20` : theme.colors.background.secondary,
                        border: newCategory === key ? `2px solid ${info.color}` : `1px solid ${theme.colors.border}`,
                        borderRadius: '16px',
                        fontSize: '13px',
                        color: newCategory === key ? info.color : theme.colors.text.secondary,
                        fontWeight: newCategory === key ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{info.emoji}</span>
                      <span>{info.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  When did it happen?
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                  }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  Details (optional)
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Any extra details you want to remember..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleAddMilestone}
                disabled={!newTitle.trim() || !kidName.trim() || isSubmitting}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background:
                    !newTitle.trim() || !kidName.trim()
                      ? theme.colors.background.secondary
                      : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                  color: !newTitle.trim() || !kidName.trim() ? theme.colors.text.muted : '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: !newTitle.trim() || !kidName.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Milestone'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestonesPage;
