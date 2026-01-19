import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../common';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';

const DAD_EMOJIS = ['👔', '🔧', '🍖', '🏠', '🚗', '☕', '📺', '🧰'];

interface MemoryCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryMatchProps {
  onBack: () => void;
}

export const MemoryMatch: React.FC<MemoryMatchProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const emojis = [...DAD_EMOJIS, ...DAD_EMOJIS];
    const shuffled = emojis.sort(() => Math.random() - 0.5);
    const cardData: MemoryCard[] = shuffled.map((emoji, index) => ({
      id: index,
      emoji,
      isFlipped: false,
      isMatched: false,
    }));
    setCards(cardData);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setIsChecking(false);
  };

  const handleCardClick = (cardId: number) => {
    if (isChecking) return;
    if (flippedCards.length === 2) return;
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return;

    const newCards = [...cards];
    newCards[cardId].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      setIsChecking(true);

      const [first, second] = newFlipped;
      if (cards[first].emoji === newCards[second].emoji) {
        // Match!
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(matches + 1);
          setIsChecking(false);

          // Check for game over
          if (matches + 1 === DAD_EMOJIS.length) {
            handleGameOver(moves + 1);
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const handleGameOver = async (finalMoves: number) => {
    setGameOver(true);

    // Calculate points based on moves (fewer moves = more points)
    const basePoints = 50;
    const bonusPoints = Math.max(0, 30 - finalMoves) * 2;
    const totalPoints = basePoints + bonusPoints;

    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          points: increment(totalPoints),
        });
        await updateProfile({ points: (user.points || 0) + totalPoints });
      } catch (error) {
        console.error('Error awarding points:', error);
      }
    }
  };

  const calculatePoints = () => {
    const basePoints = 50;
    const bonusPoints = Math.max(0, 30 - moves) * 2;
    return basePoints + bonusPoints;
  };

  if (gameOver) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.text.muted,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: 0,
            fontSize: '14px',
          }}
        >
          ← Back to Games
        </button>

        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>
            {moves <= 12 ? '🏆' : moves <= 18 ? '🎉' : '😊'}
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>You Win!</h2>
          <p style={{ margin: '0 0 8px 0', fontSize: '20px', color: theme.colors.text.muted }}>
            Completed in {moves} moves
          </p>
          <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: theme.colors.text.muted }}>
            {moves <= 12 ? 'Amazing memory!' : moves <= 18 ? 'Great job!' : 'Nice work!'}
          </p>
          <p style={{
            margin: '0 0 24px 0',
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '12px',
            color: theme.colors.success,
            fontWeight: 600,
          }}>
            +{calculatePoints()} points earned!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onBack}>
              Back to Games
            </Button>
            <Button onClick={initializeGame}>
              Play Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          color: theme.colors.text.muted,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: 0,
          fontSize: '14px',
        }}
      >
        ← Back to Games
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Memory Match</h2>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{
            padding: '8px 16px',
            background: theme.colors.card,
            borderRadius: '20px',
            fontWeight: 600,
          }}>
            Moves: {moves}
          </span>
          <span style={{
            padding: '8px 16px',
            background: theme.colors.accent.gradient,
            borderRadius: '20px',
            color: '#fff',
            fontWeight: 600,
          }}>
            Matches: {matches}/{DAD_EMOJIS.length}
          </span>
        </div>
      </div>

      <Card>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          maxWidth: '400px',
          margin: '0 auto',
        }}>
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isFlipped || card.isMatched}
              style={{
                aspectRatio: '1',
                background: card.isFlipped || card.isMatched
                  ? card.isMatched
                    ? 'rgba(34, 197, 94, 0.2)'
                    : theme.colors.cardHover
                  : theme.colors.accent.gradient,
                border: card.isMatched
                  ? '2px solid #22c55e'
                  : `2px solid ${theme.colors.border}`,
                borderRadius: '12px',
                cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
                fontSize: '32px',
                transition: 'all 0.3s',
                transform: card.isFlipped || card.isMatched ? 'rotateY(0)' : 'rotateY(180deg)',
              }}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '❓'}
            </button>
          ))}
        </div>

        <p style={{
          margin: '24px 0 0 0',
          textAlign: 'center',
          color: theme.colors.text.muted,
          fontSize: '14px',
        }}>
          Match all pairs with as few moves as possible!
        </p>
      </Card>
    </div>
  );
};
