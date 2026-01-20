import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

export interface MovieOption {
  id: string;
  title: string;
  year: number;
  genre: string;
  emoji: string;
  votes: number;
  voterIds: string[];
}

export interface WeeklyMoviePoll {
  id: string;
  weekNumber: number;
  year: number;
  theme: string;
  movies: MovieOption[];
  totalVotes: number;
  startsAt: Date;
  endsAt: Date;
  winnerId?: string;
  status: 'active' | 'ended';
}

interface MoviePollProps {
  poll: WeeklyMoviePoll;
  onVote?: () => void;
}

export const MoviePoll: React.FC<MoviePollProps> = ({ poll, onVote }) => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [isVoting, setIsVoting] = useState(false);
  const [localPoll, setLocalPoll] = useState(poll);

  const userVotedMovie = localPoll.movies.find((m) => m.voterIds.includes(user.uid));
  const hasVoted = !!userVotedMovie;
  const isEnded = localPoll.status === 'ended';

  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(localPoll.endsAt);
    if (end < now) return 'Voting ended';

    const diff = end.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const handleVote = async (movieId: string) => {
    if (hasVoted || isVoting || isEnded) return;

    setIsVoting(true);
    haptics.light();

    try {
      const movieIndex = localPoll.movies.findIndex((m) => m.id === movieId);
      if (movieIndex === -1) return;

      // Update locally first
      setLocalPoll((prev) => ({
        ...prev,
        totalVotes: prev.totalVotes + 1,
        movies: prev.movies.map((m, i) =>
          i === movieIndex
            ? { ...m, votes: m.votes + 1, voterIds: [...m.voterIds, user.uid] }
            : m
        ),
      }));

      // Update in Firestore
      const pollRef = doc(db, 'moviePolls', poll.id);
      await updateDoc(pollRef, {
        totalVotes: increment(1),
        [`movies.${movieIndex}.votes`]: increment(1),
        [`movies.${movieIndex}.voterIds`]: arrayUnion(user.uid),
      });

      haptics.success();
      onVote?.();
    } catch (error) {
      console.error('Error voting:', error);
      setLocalPoll(poll);
    } finally {
      setIsVoting(false);
    }
  };

  const sortedMovies = [...localPoll.movies].sort((a, b) => b.votes - a.votes);

  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '20px',
        overflow: 'hidden',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            🎬 Movie Night Poll
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' }}>
            Theme: {localPoll.theme}
          </p>
        </div>
        <div
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '12px',
          }}
        >
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
            {isEnded ? '🏆 Ended' : `⏱️ ${getTimeRemaining()}`}
          </span>
        </div>
      </div>

      {/* Movies List */}
      <div style={{ padding: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sortedMovies.map((movie, index) => {
            const percentage =
              localPoll.totalVotes > 0
                ? Math.round((movie.votes / localPoll.totalVotes) * 100)
                : 0;
            const isUserVote = movie.voterIds.includes(user.uid);
            const isWinner = isEnded && localPoll.winnerId === movie.id;

            return (
              <button
                key={movie.id}
                onClick={() => handleVote(movie.id)}
                disabled={hasVoted || isVoting || isEnded}
                style={{
                  position: 'relative',
                  padding: '14px 16px',
                  background: theme.colors.background.secondary,
                  border: isUserVote
                    ? `2px solid ${theme.colors.accent.primary}`
                    : isWinner
                    ? '2px solid #ffd700'
                    : `1px solid ${theme.colors.border}`,
                  borderRadius: '14px',
                  cursor: hasVoted || isEnded ? 'default' : 'pointer',
                  textAlign: 'left',
                  overflow: 'hidden',
                }}
              >
                {/* Progress bar */}
                {(hasVoted || isEnded) && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      width: `${percentage}%`,
                      background: isUserVote
                        ? 'rgba(217, 119, 6, 0.2)'
                        : isWinner
                        ? 'rgba(255, 215, 0, 0.2)'
                        : 'rgba(255,255,255,0.05)',
                      transition: 'width 0.5s ease',
                    }}
                  />
                )}

                <div
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  {/* Rank */}
                  {(hasVoted || isEnded) && index < 3 && (
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background:
                          index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#000',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                  )}

                  {/* Movie emoji */}
                  <span style={{ fontSize: '28px' }}>{movie.emoji}</span>

                  {/* Movie info */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        fontSize: '15px',
                        color: theme.colors.text.primary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {movie.title}
                      {isWinner && <span style={{ fontSize: '16px' }}>👑</span>}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                      {movie.year} • {movie.genre}
                    </p>
                  </div>

                  {/* Votes */}
                  {(hasVoted || isEnded) && (
                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          margin: 0,
                          fontWeight: 700,
                          fontSize: '16px',
                          color: theme.colors.accent.primary,
                        }}
                      >
                        {percentage}%
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>
                        {movie.votes} vote{movie.votes !== 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Total votes */}
        <p
          style={{
            margin: '16px 0 0 0',
            textAlign: 'center',
            fontSize: '13px',
            color: theme.colors.text.muted,
          }}
        >
          {localPoll.totalVotes} total vote{localPoll.totalVotes !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default MoviePoll;
