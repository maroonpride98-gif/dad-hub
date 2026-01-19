import React, { useState, useEffect } from 'react';
import { DiscussionCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common';
import { CategoryFilter } from './CategoryFilter';
import { NewPostForm } from './NewPostForm';
import { PostCard } from './PostCard';
import { PollCard, Poll } from './PollCard';
import { CreatePollForm } from './CreatePollForm';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export const BoardPage: React.FC = () => {
  const { discussions, showNewPost, setShowNewPost } = useApp();
  const { theme } = useTheme();
  const [activeCategory, setActiveCategory] = useState<DiscussionCategory | 'All'>('All');
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [viewMode, setViewMode] = useState<'posts' | 'polls'>('posts');

  useEffect(() => {
    const pollsRef = collection(db, 'polls');
    const q = query(pollsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const pollData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question,
          options: data.options,
          authorId: data.authorId,
          author: data.author,
          avatar: data.avatar,
          totalVotes: data.totalVotes,
          time: data.createdAt?.toDate()
            ? formatTimeAgo(data.createdAt.toDate())
            : 'Just now',
        } as Poll;
      });
      setPolls(pollData);
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

  const filteredDiscussions =
    activeCategory === 'All'
      ? discussions
      : discussions.filter((d) => d.category === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Discussion Board</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {viewMode === 'posts' ? (
            <Button icon="+" onClick={() => setShowNewPost(!showNewPost)}>
              New Post
            </Button>
          ) : (
            <Button icon="+" onClick={() => setShowCreatePoll(!showCreatePoll)}>
              New Poll
            </Button>
          )}
        </div>
      </div>

      {/* View Mode Toggle */}
      <div style={{ display: 'flex', gap: '8px', padding: '4px', background: theme.colors.card, borderRadius: '12px', width: 'fit-content' }}>
        <button
          onClick={() => setViewMode('posts')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            background: viewMode === 'posts' ? theme.colors.accent.primary : 'transparent',
            color: viewMode === 'posts' ? '#fff' : theme.colors.text.muted,
            transition: 'all 0.2s',
          }}
        >
          Posts
        </button>
        <button
          onClick={() => setViewMode('polls')}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            background: viewMode === 'polls' ? theme.colors.accent.primary : 'transparent',
            color: viewMode === 'polls' ? '#fff' : theme.colors.text.muted,
            transition: 'all 0.2s',
          }}
        >
          Polls ({polls.length})
        </button>
      </div>

      {viewMode === 'posts' ? (
        <>
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          {showNewPost && <NewPostForm />}

          {filteredDiscussions.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}

          {filteredDiscussions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.muted }}>
              <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>💬</p>
              <p>No posts yet. Be the first to start a discussion!</p>
            </div>
          )}
        </>
      ) : (
        <>
          {showCreatePoll && (
            <CreatePollForm
              onClose={() => setShowCreatePoll(false)}
              onCreated={() => setShowCreatePoll(false)}
            />
          )}

          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}

          {polls.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: theme.colors.text.muted }}>
              <p style={{ fontSize: '48px', margin: '0 0 16px 0' }}>📊</p>
              <p>No polls yet. Create one to get the community's opinion!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
