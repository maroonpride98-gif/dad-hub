import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { ChoreWheel, Chore } from './ChoreWheel';
import { collection, doc, getDocs, addDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

const DEFAULT_CHORES: Omit<Chore, 'id'>[] = [
  { name: 'Dishes', emoji: '🍽️', color: '#3b82f6' },
  { name: 'Vacuum', emoji: '🧹', color: '#22c55e' },
  { name: 'Laundry', emoji: '👕', color: '#f59e0b' },
  { name: 'Trash', emoji: '🗑️', color: '#ef4444' },
  { name: 'Yard Work', emoji: '🌿', color: '#84cc16' },
  { name: 'Cooking', emoji: '🍳', color: '#ec4899' },
];

const CHORE_COLORS = [
  '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

export const ChoreWheelPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [chores, setChores] = useState<Chore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChore, setSelectedChore] = useState<Chore | null>(null);
  const [newChoreName, setNewChoreName] = useState('');
  const [newChoreEmoji, setNewChoreEmoji] = useState('✨');
  const [showAddForm, setShowAddForm] = useState(false);
  const [history, setHistory] = useState<{ chore: Chore; timestamp: Date }[]>([]);

  useEffect(() => {
    loadChores();
  }, []);

  const loadChores = async () => {
    if (!user?.uid) return;

    try {
      const choresRef = collection(db, 'chores');
      const q = query(choresRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        // Initialize with default chores
        const defaultChoresWithIds = await Promise.all(
          DEFAULT_CHORES.map(async (chore, index) => {
            const docRef = await addDoc(collection(db, 'chores'), {
              ...chore,
              userId: user.uid,
              color: CHORE_COLORS[index % CHORE_COLORS.length],
            });
            return { id: docRef.id, ...chore, color: CHORE_COLORS[index % CHORE_COLORS.length] };
          })
        );
        setChores(defaultChoresWithIds);
      } else {
        const choreData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Chore[];
        setChores(choreData);
      }
    } catch (error) {
      console.error('Error loading chores:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddChore = async () => {
    if (!newChoreName.trim() || !user?.uid) return;

    haptics.light();

    try {
      const newChore = {
        name: newChoreName.trim(),
        emoji: newChoreEmoji,
        color: CHORE_COLORS[chores.length % CHORE_COLORS.length],
        userId: user.uid,
      };

      const docRef = await addDoc(collection(db, 'chores'), newChore);

      setChores((prev) => [...prev, { id: docRef.id, ...newChore }]);
      setNewChoreName('');
      setNewChoreEmoji('✨');
      setShowAddForm(false);
      haptics.success();
    } catch (error) {
      console.error('Error adding chore:', error);
    }
  };

  const handleDeleteChore = async (choreId: string) => {
    haptics.light();

    try {
      await deleteDoc(doc(db, 'chores', choreId));
      setChores((prev) => prev.filter((c) => c.id !== choreId));
      haptics.success();
    } catch (error) {
      console.error('Error deleting chore:', error);
    }
  };

  const handleSpinResult = (chore: Chore) => {
    setSelectedChore(chore);
    setHistory((prev) => [{ chore, timestamp: new Date() }, ...prev.slice(0, 9)]);
  };

  const closeResult = () => {
    setSelectedChore(null);
  };

  const commonEmojis = ['🧹', '🍽️', '👕', '🗑️', '🌿', '🍳', '🛏️', '🚿', '🧽', '📦', '🐕', '🚗', '📚', '💊', '🛒'];

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
          background: 'linear-gradient(135deg, #f59e0b, #f97316)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎡 Chore Wheel
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Let fate decide who does the chores!
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {isLoading ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>
              🎡
            </div>
            <p style={{ color: theme.colors.text.muted }}>Loading chores...</p>
          </div>
        ) : (
          <>
            {/* Wheel */}
            <ChoreWheel chores={chores} onResult={handleSpinResult} />

            {/* Chore List */}
            <div style={{ marginTop: '32px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
                  Chores ({chores.length})
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: 'none',
                    background: showAddForm
                      ? theme.colors.background.secondary
                      : theme.colors.accent.primary,
                    color: showAddForm ? theme.colors.text.secondary : '#fff',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {showAddForm ? 'Cancel' : '+ Add Chore'}
                </button>
              </div>

              {/* Add Chore Form */}
              {showAddForm && (
                <div
                  style={{
                    padding: '16px',
                    background: theme.colors.card,
                    borderRadius: '16px',
                    marginBottom: '16px',
                    border: `1px solid ${theme.colors.border}`,
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: theme.colors.text.secondary }}>
                      Chore Name
                    </label>
                    <input
                      type="text"
                      value={newChoreName}
                      onChange={(e) => setNewChoreName(e.target.value)}
                      placeholder="e.g., Mow the lawn"
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

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: theme.colors.text.secondary }}>
                      Choose Emoji
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {commonEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewChoreEmoji(emoji)}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            border:
                              newChoreEmoji === emoji
                                ? `2px solid ${theme.colors.accent.primary}`
                                : `1px solid ${theme.colors.border}`,
                            background:
                              newChoreEmoji === emoji
                                ? `${theme.colors.accent.primary}20`
                                : theme.colors.background.secondary,
                            fontSize: '20px',
                            cursor: 'pointer',
                          }}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddChore}
                    disabled={!newChoreName.trim()}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: !newChoreName.trim()
                        ? theme.colors.background.secondary
                        : theme.colors.accent.primary,
                      color: !newChoreName.trim() ? theme.colors.text.muted : '#fff',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: !newChoreName.trim() ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Add Chore
                  </button>
                </div>
              )}

              {/* Chores Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: '12px',
                }}
              >
                {chores.map((chore) => (
                  <div
                    key={chore.id}
                    style={{
                      padding: '16px',
                      background: theme.colors.card,
                      borderRadius: '14px',
                      border: `1px solid ${theme.colors.border}`,
                      borderLeft: `4px solid ${chore.color}`,
                      position: 'relative',
                    }}
                  >
                    <button
                      onClick={() => handleDeleteChore(chore.id)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        background: theme.colors.background.secondary,
                        color: theme.colors.text.muted,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      ×
                    </button>
                    <span style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}>
                      {chore.emoji}
                    </span>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        fontWeight: 600,
                        color: theme.colors.text.primary,
                      }}
                    >
                      {chore.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div style={{ marginTop: '32px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
                  Recent Spins
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        background: theme.colors.background.secondary,
                        borderRadius: '10px',
                      }}
                    >
                      <span style={{ fontSize: '20px' }}>{item.chore.emoji}</span>
                      <span style={{ flex: 1, fontSize: '14px', color: theme.colors.text.primary }}>
                        {item.chore.name}
                      </span>
                      <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Result Modal */}
      {selectedChore && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={closeResult}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '24px',
              padding: '32px',
              textAlign: 'center',
              maxWidth: '320px',
              width: '100%',
              animation: 'bounce 0.5s ease',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>{selectedChore.emoji}</div>
            <h2
              style={{
                margin: '0 0 8px 0',
                fontSize: '24px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              {selectedChore.name}
            </h2>
            <p style={{ margin: '0 0 24px 0', color: theme.colors.text.secondary }}>
              The wheel has spoken! Time to get to work! 💪
            </p>
            <button
              onClick={closeResult}
              style={{
                padding: '14px 32px',
                borderRadius: '14px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChoreWheelPage;
