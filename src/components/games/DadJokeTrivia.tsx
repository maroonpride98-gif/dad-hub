import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button } from '../common';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface TriviaQuestion {
  joke: string;
  correctAnswer: string;
  wrongAnswers: string[];
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    joke: "Why don't scientists trust atoms?",
    correctAnswer: "Because they make up everything!",
    wrongAnswers: ["Because they're too small", "Because they split up", "Because they're negative"],
  },
  {
    joke: "What do you call a fake noodle?",
    correctAnswer: "An impasta!",
    wrongAnswers: ["A noodle impersonator", "A pasta pretender", "A flour fraud"],
  },
  {
    joke: "Why did the scarecrow win an award?",
    correctAnswer: "He was outstanding in his field!",
    wrongAnswers: ["He scared the most crows", "He had the best costume", "He never took breaks"],
  },
  {
    joke: "What do you call a bear with no teeth?",
    correctAnswer: "A gummy bear!",
    wrongAnswers: ["A soft bear", "A harmless bear", "A baby bear"],
  },
  {
    joke: "Why don't eggs tell jokes?",
    correctAnswer: "They'd crack each other up!",
    wrongAnswers: ["They're too fragile", "They can't talk", "They're chicken"],
  },
  {
    joke: "What do you call a fish without eyes?",
    correctAnswer: "A fsh!",
    wrongAnswers: ["A blind fish", "A dark fish", "A cave fish"],
  },
  {
    joke: "Why did the bicycle fall over?",
    correctAnswer: "Because it was two-tired!",
    wrongAnswers: ["It lost its balance", "The wind knocked it", "Someone pushed it"],
  },
  {
    joke: "What do you call cheese that isn't yours?",
    correctAnswer: "Nacho cheese!",
    wrongAnswers: ["Stolen cheese", "Someone else's cheese", "Shared cheese"],
  },
];

interface DadJokeTriviaProps {
  onBack: () => void;
}

export const DadJokeTrivia: React.FC<DadJokeTriviaProps> = ({ onBack }) => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);

  useEffect(() => {
    // Shuffle and pick 5 questions
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      const q = questions[currentQuestion];
      const answers = [q.correctAnswer, ...q.wrongAnswers].sort(() => Math.random() - 0.5);
      setShuffledAnswers(answers);
    }
  }, [currentQuestion, questions]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = async () => {
    if (currentQuestion + 1 >= questions.length) {
      setGameOver(true);

      // Award points based on score
      const pointsEarned = score * 10;
      if (pointsEarned > 0 && user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            points: increment(pointsEarned),
          });
          await updateProfile({ points: (user.points || 0) + pointsEarned });
        } catch (error) {
          console.error('Error awarding points:', error);
        }
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const playAgain = () => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 5);
    setQuestions(shuffled);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
  };

  if (questions.length === 0) {
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
            {score === 5 ? '🏆' : score >= 3 ? '🎉' : '😊'}
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px' }}>Game Over!</h2>
          <p style={{ margin: '0 0 24px 0', fontSize: '20px', color: theme.colors.text.muted }}>
            You scored {score} out of {questions.length}
          </p>
          <p style={{
            margin: '0 0 24px 0',
            padding: '16px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '12px',
            color: theme.colors.success,
            fontWeight: 600,
          }}>
            +{score * 10} points earned!
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

  const question = questions[currentQuestion];

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
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Dad Joke Trivia</h2>
        <span style={{
          padding: '8px 16px',
          background: theme.colors.accent.gradient,
          borderRadius: '20px',
          color: '#fff',
          fontWeight: 600,
        }}>
          Score: {score}/{questions.length}
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
          width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          background: theme.colors.accent.gradient,
          transition: 'width 0.3s',
        }} />
      </div>

      <Card>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: theme.colors.text.muted }}>
          Question {currentQuestion + 1} of {questions.length}
        </p>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '22px', fontWeight: 700, lineHeight: 1.4 }}>
          {question.joke}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {shuffledAnswers.map((answer, i) => {
            const isCorrect = answer === question.correctAnswer;
            const isSelected = answer === selectedAnswer;

            let background = theme.colors.cardHover;
            let border = `1px solid ${theme.colors.border}`;

            if (showResult) {
              if (isCorrect) {
                background = 'rgba(34, 197, 94, 0.2)';
                border = '2px solid #22c55e';
              } else if (isSelected && !isCorrect) {
                background = 'rgba(239, 68, 68, 0.2)';
                border = '2px solid #ef4444';
              }
            } else if (isSelected) {
              border = `2px solid ${theme.colors.accent.primary}`;
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(answer)}
                disabled={showResult}
                style={{
                  padding: '16px 20px',
                  background,
                  border,
                  borderRadius: '12px',
                  cursor: showResult ? 'default' : 'pointer',
                  textAlign: 'left',
                  color: theme.colors.text.primary,
                  fontSize: '16px',
                  fontWeight: isSelected || (showResult && isCorrect) ? 600 : 400,
                  transition: 'all 0.2s',
                }}
              >
                {answer}
                {showResult && isCorrect && ' ✓'}
                {showResult && isSelected && !isCorrect && ' ✗'}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={nextQuestion}>
              {currentQuestion + 1 >= questions.length ? 'See Results' : 'Next Question'}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
