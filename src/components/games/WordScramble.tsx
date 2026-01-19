import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../common';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';

const DAD_WORDS = [
  { word: 'GRILL', hint: 'Summer cooking essential' },
  { word: 'LAWNMOWER', hint: 'Weekend warrior tool' },
  { word: 'THERMOSTAT', hint: 'Touch it and dads everywhere will know' },
  { word: 'DADBOT', hint: 'Bad joke machine' },
  { word: 'TOOLBOX', hint: 'Home repair essential' },
  { word: 'RECLINER', hint: 'Dads favorite seat' },
  { word: 'GARAGE', hint: 'Dads happy place' },
  { word: 'BARBECUE', hint: 'Outdoor cooking event' },
  { word: 'SNEAKERS', hint: 'Comfortable footwear' },
  { word: 'NAPPING', hint: 'Sunday afternoon activity' },
  { word: 'REMOTE', hint: 'Never let go of this' },
  { word: 'COFFEE', hint: 'Morning fuel' },
];

interface WordScrambleProps {
  onBack: () => void;
}

export const WordScramble: React.FC<WordScrambleProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [currentWord, setCurrentWord] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [words, setWords] = useState<typeof DAD_WORDS>([]);

  useEffect(() => {
    const shuffled = [...DAD_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
    setWords(shuffled);
  }, []);

  useEffect(() => {
    if (words.length > 0 && currentWord < words.length) {
      const word = words[currentWord].word;
      setScrambledWord(scrambleWord(word));
    }
  }, [currentWord, words]);

  const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    // Make sure it's actually scrambled
    if (arr.join('') === word) {
      return scrambleWord(word);
    }
    return arr.join('');
  };

  const handleSubmit = () => {
    const correct = guess.toUpperCase().trim() === words[currentWord].word;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + (showHint ? 5 : 10));
    }
  };

  const nextWord = async () => {
    if (currentWord + 1 >= words.length) {
      setGameOver(true);

      // Award points
      if (score > 0 && user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            points: increment(score),
          });
          await updateProfile({ points: (user.points || 0) + score });
        } catch (error) {
          console.error('Error awarding points:', error);
        }
      }
    } else {
      setCurrentWord(currentWord + 1);
      setGuess('');
      setShowHint(false);
      setShowResult(false);
      setIsCorrect(false);
    }
  };

  const playAgain = () => {
    const shuffled = [...DAD_WORDS].sort(() => Math.random() - 0.5).slice(0, 5);
    setWords(shuffled);
    setCurrentWord(0);
    setScore(0);
    setGuess('');
    setShowHint(false);
    setShowResult(false);
    setIsCorrect(false);
    setGameOver(false);
  };

  if (words.length === 0) {
    return <div>Loading...</div>;
  }

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
            {score >= 40 ? '🏆' : score >= 25 ? '🎉' : '😊'}
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Game Over!</h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '20px', color: theme.colors.text.muted }}>
            Final Score: {score} points
          </p>
          <p style={{
            margin: '0 0 24px 0',
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '12px',
            color: theme.colors.success,
            fontWeight: 600,
          }}>
            +{score} points earned!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="secondary" onClick={onBack}>
              Back to Games
            </Button>
            <Button onClick={playAgain}>
              Play Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const word = words[currentWord];

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
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Word Scramble</h2>
        <span style={{
          padding: '8px 16px',
          background: theme.colors.accent.gradient,
          borderRadius: '20px',
          color: '#fff',
          fontWeight: 600,
        }}>
          Score: {score}
        </span>
      </div>

      {/* Progress */}
      <div style={{
        height: '8px',
        background: theme.colors.border,
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${((currentWord + 1) / words.length) * 100}%`,
          background: theme.colors.accent.gradient,
          transition: 'width 0.3s',
        }} />
      </div>

      <Card style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: theme.colors.text.muted }}>
          Word {currentWord + 1} of {words.length}
        </p>

        {/* Scrambled Word Display */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          margin: '24px 0',
          flexWrap: 'wrap',
        }}>
          {scrambledWord.split('').map((letter, i) => (
            <div
              key={i}
              style={{
                width: '48px',
                height: '48px',
                background: theme.colors.accent.gradient,
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {!showHint && !showResult && (
          <button
            onClick={() => setShowHint(true)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.accent.secondary,
              cursor: 'pointer',
              fontSize: '14px',
              marginBottom: '16px',
            }}
          >
            Need a hint? (-5 points)
          </button>
        )}

        {showHint && !showResult && (
          <p style={{
            margin: '0 0 16px 0',
            padding: '12px',
            background: theme.colors.cardHover,
            borderRadius: '8px',
            color: theme.colors.text.muted,
          }}>
            Hint: {word.hint}
          </p>
        )}

        {!showResult ? (
          <div style={{ display: 'flex', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
            <Input
              placeholder="Your guess..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              style={{ flex: 1, textTransform: 'uppercase', textAlign: 'center', fontWeight: 600 }}
            />
            <Button onClick={handleSubmit}>
              Check
            </Button>
          </div>
        ) : (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              padding: '16px',
              background: isCorrect ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              borderRadius: '12px',
              marginBottom: '16px',
            }}>
              <p style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 600,
                color: isCorrect ? theme.colors.success : theme.colors.error,
              }}>
                {isCorrect ? '✓ Correct!' : `✗ The word was: ${word.word}`}
              </p>
              {isCorrect && (
                <p style={{ margin: '8px 0 0 0', color: theme.colors.text.muted }}>
                  +{showHint ? 5 : 10} points
                </p>
              )}
            </div>
            <Button onClick={nextWord}>
              {currentWord + 1 >= words.length ? 'See Results' : 'Next Word'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
