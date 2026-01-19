import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '../common';
import { DadHack, DadHackCategory } from '../../types';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AddHackModal } from './AddHackModal';

const CATEGORIES: DadHackCategory[] = ['Parenting', 'Home', 'Car', 'Tech', 'Money', 'Health', 'Travel', 'Life'];

export const DadHacksPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [hacks, setHacks] = useState<DadHack[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DadHackCategory | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const hacksRef = collection(db, 'dadHacks');
    const q = query(hacksRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const hackData = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          time: data.createdAt?.toDate()
            ? formatTimeAgo(data.createdAt.toDate())
            : 'Just now',
        } as DadHack;
      });
      setHacks(hackData);
    });

    return () => unsubscribe();
  }, []);

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredHacks = selectedCategory === 'All'
    ? hacks
    : hacks.filter(h => h.category === selectedCategory);

  const handleLike = async (hackId: string) => {
    if (!user) return;

    const hack = hacks.find(h => h.id === hackId);
    if (!hack) return;

    const hackRef = doc(db, 'dadHacks', hackId);
    const isLiked = hack.likedBy?.includes(user.uid);

    if (isLiked) {
      await updateDoc(hackRef, {
        likes: increment(-1),
        likedBy: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(hackRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
      });
    }
  };

  const getCategoryEmoji = (category: DadHackCategory): string => {
    const emojis: Record<DadHackCategory, string> = {
      'Parenting': '👶',
      'Home': '🏠',
      'Car': '🚗',
      'Tech': '💻',
      'Money': '💰',
      'Health': '💪',
      'Travel': '✈️',
      'Life': '🌟',
    };
    return emojis[category];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Dad Hacks & Tips</h2>
          <p style={{ margin: '4px 0 0 0', color: theme.colors.text.muted, fontSize: '14px' }}>
            Life hacks from dads, for dads
          </p>
        </div>
        <Button icon="+" onClick={() => setShowAddModal(true)}>
          Share Hack
        </Button>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
        <button
          onClick={() => setSelectedCategory('All')}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            background: selectedCategory === 'All' ? theme.colors.accent.primary : theme.colors.card,
            color: selectedCategory === 'All' ? '#fff' : theme.colors.text.primary,
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: selectedCategory === cat ? theme.colors.accent.primary : theme.colors.card,
              color: selectedCategory === cat ? '#fff' : theme.colors.text.primary,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {getCategoryEmoji(cat)} {cat}
          </button>
        ))}
      </div>

      {/* Hacks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredHacks.map((hack) => (
          <Card key={hack.id} hover>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                flexShrink: 0,
              }}>
                {getCategoryEmoji(hack.category)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <Badge variant="category" category="Support">
                      {hack.category}
                    </Badge>
                  </div>
                  <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>{hack.time}</span>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 700 }}>{hack.title}</h3>
                <p style={{ margin: '0 0 12px 0', color: theme.colors.text.muted, lineHeight: 1.5 }}>
                  {hack.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{hack.avatar}</span>
                    <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>{hack.author}</span>
                  </div>

                  <button
                    onClick={() => handleLike(hack.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 16px',
                      background: hack.likedBy?.includes(user?.uid || '') ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                      border: hack.likedBy?.includes(user?.uid || '') ? '1px solid #ef4444' : `1px solid ${theme.colors.border}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      color: hack.likedBy?.includes(user?.uid || '') ? '#ef4444' : theme.colors.text.primary,
                      fontWeight: 600,
                    }}
                  >
                    {hack.likedBy?.includes(user?.uid || '') ? '👍' : '👍'} {hack.likes || 0}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredHacks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.muted }}>
          <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>💡</p>
          <p>No hacks yet. Share your best dad life hack!</p>
        </div>
      )}

      {showAddModal && (
        <AddHackModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
};
