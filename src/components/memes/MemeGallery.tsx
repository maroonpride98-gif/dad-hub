import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { collection, query, orderBy, limit, getDocs, doc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface Meme {
  id: string;
  templateId: string;
  templateName: string;
  imageData: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  likes: number;
  likedBy: string[];
  createdAt: Date;
}

type SortBy = 'recent' | 'popular';

export const MemeGallery: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [memes, setMemes] = useState<Meme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [likingId, setLikingId] = useState<string | null>(null);

  useEffect(() => {
    loadMemes();
  }, [sortBy]);

  const loadMemes = async () => {
    setIsLoading(true);
    try {
      const memesRef = collection(db, 'memes');
      const q = query(
        memesRef,
        orderBy(sortBy === 'recent' ? 'createdAt' : 'likes', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);

      const memeData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Meme[];

      setMemes(memeData);
    } catch (error) {
      console.error('Error loading memes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (memeId: string) => {
    if (!user?.uid || likingId) return;

    const meme = memes.find((m) => m.id === memeId);
    if (!meme) return;

    const isLiked = meme.likedBy.includes(user.uid);
    setLikingId(memeId);
    haptics.light();

    try {
      const memeRef = doc(db, 'memes', memeId);

      if (isLiked) {
        await updateDoc(memeRef, {
          likes: increment(-1),
          likedBy: arrayRemove(user.uid),
        });
      } else {
        await updateDoc(memeRef, {
          likes: increment(1),
          likedBy: arrayUnion(user.uid),
        });
      }

      // Update local state
      setMemes((prev) =>
        prev.map((m) =>
          m.id === memeId
            ? {
                ...m,
                likes: isLiked ? m.likes - 1 : m.likes + 1,
                likedBy: isLiked
                  ? m.likedBy.filter((id) => id !== user.uid)
                  : [...m.likedBy, user.uid],
              }
            : m
        )
      );

      if (!isLiked) haptics.success();
    } catch (error) {
      console.error('Error liking meme:', error);
    } finally {
      setLikingId(null);
    }
  };

  const handleShare = async (meme: Meme) => {
    try {
      const blob = await (await fetch(meme.imageData)).blob();
      const file = new File([blob], 'dad-meme.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Check out this Dad Meme!',
          text: `Made by ${meme.authorName} on Dad Hub`,
          files: [file],
        });
        haptics.success();
      } else {
        // Fallback: download
        const link = document.createElement('a');
        link.download = `dadhub-meme-${meme.id}.png`;
        link.href = meme.imageData;
        link.click();
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div style={{ padding: '16px 20px' }}>
      {/* Sort Options */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setSortBy('recent')}
          style={{
            padding: '10px 16px',
            background: sortBy === 'recent' ? theme.colors.accent.primary : theme.colors.background.secondary,
            border: 'none',
            borderRadius: '20px',
            color: sortBy === 'recent' ? '#fff' : theme.colors.text.secondary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🕐 Recent
        </button>
        <button
          onClick={() => setSortBy('popular')}
          style={{
            padding: '10px 16px',
            background: sortBy === 'popular' ? theme.colors.accent.primary : theme.colors.background.secondary,
            border: 'none',
            borderRadius: '20px',
            color: sortBy === 'popular' ? '#fff' : theme.colors.text.secondary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          🔥 Popular
        </button>
      </div>

      {/* Memes Grid */}
      {isLoading ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', animation: 'float 2s ease-in-out infinite' }}>
            🎨
          </div>
          <p style={{ color: theme.colors.text.muted }}>Loading memes...</p>
        </div>
      ) : memes.length === 0 ? (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🖼️</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
            No memes yet
          </h3>
          <p style={{ margin: 0, color: theme.colors.text.muted }}>
            Be the first to create a dad meme!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '16px',
          }}
        >
          {memes.map((meme) => {
            const isLiked = meme.likedBy.includes(user.uid);
            return (
              <div
                key={meme.id}
                style={{
                  background: theme.colors.card,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                {/* Image */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '1',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={meme.imageData}
                    alt="Meme"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '12px' }}>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{meme.authorAvatar}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          fontWeight: 600,
                          color: theme.colors.text.primary,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {meme.authorName}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>
                        {formatDate(meme.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleLike(meme.id)}
                      disabled={likingId === meme.id}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: isLiked ? '#ef444420' : theme.colors.background.secondary,
                        border: 'none',
                        borderRadius: '8px',
                        color: isLiked ? '#ef4444' : theme.colors.text.secondary,
                        fontSize: '13px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      {isLiked ? '❤️' : '🤍'} {meme.likes}
                    </button>
                    <button
                      onClick={() => handleShare(meme)}
                      style={{
                        padding: '8px 12px',
                        background: theme.colors.background.secondary,
                        border: 'none',
                        borderRadius: '8px',
                        color: theme.colors.text.secondary,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      📤
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MemeGallery;
