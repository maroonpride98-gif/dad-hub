import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Workout, WORKOUTS } from '../../data/workouts';
import { haptics } from '../../utils/haptics';

type ViewMode = 'browse' | 'workout';

export const WorkoutPage: React.FC = () => {
  const { theme } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 'morning', label: 'Morning', emoji: '☀️' },
    { id: 'desk', label: 'Desk Break', emoji: '💼' },
    { id: 'playground', label: 'Playground', emoji: '🛝' },
    { id: 'evening', label: 'Evening', emoji: '🌙' },
  ] as const;

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeRemaining === 0) {
      handleExerciseComplete();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeRemaining]);

  const startWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setCurrentExerciseIndex(0);
    setTimeRemaining(workout.exercises[0].duration);
    setIsComplete(false);
    setViewMode('workout');
    haptics.light();
  };

  const handleExerciseComplete = () => {
    haptics.success();

    if (selectedWorkout && currentExerciseIndex < selectedWorkout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setTimeRemaining(selectedWorkout.exercises[nextIndex].duration);
    } else {
      setIsRunning(false);
      setIsComplete(true);
      haptics.success();
    }
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
    haptics.light();
  };

  const skipExercise = () => {
    handleExerciseComplete();
  };

  const exitWorkout = () => {
    setViewMode('browse');
    setSelectedWorkout(null);
    setIsRunning(false);
    setCurrentExerciseIndex(0);
    setIsComplete(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: Workout['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return '#22c55e';
      case 'medium':
        return '#f59e0b';
      case 'hard':
        return '#ef4444';
    }
  };

  if (viewMode === 'workout' && selectedWorkout) {
    const currentExercise = selectedWorkout.exercises[currentExerciseIndex];
    const progress = ((currentExerciseIndex + 1) / selectedWorkout.exercises.length) * 100;

    if (isComplete) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: theme.colors.background.primary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 700, color: theme.colors.text.primary }}>
            Workout Complete!
          </h1>
          <p style={{ margin: '0 0 24px 0', color: theme.colors.text.secondary }}>
            Great job, dad! You finished {selectedWorkout.name}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '16px',
              background: theme.colors.background.secondary,
              borderRadius: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#22c55e' }}>
                {selectedWorkout.duration}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Minutes</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
                {selectedWorkout.exercises.length}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>Exercises</p>
            </div>
          </div>
          <button
            onClick={exitWorkout}
            style={{
              padding: '16px 48px',
              borderRadius: '16px',
              border: 'none',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      );
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.colors.background.primary,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={exitWorkout}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>
              {selectedWorkout.name}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
              Exercise {currentExerciseIndex + 1} of {selectedWorkout.exercises.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: theme.colors.background.secondary }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: theme.colors.accent.primary,
              transition: 'width 0.3s',
            }}
          />
        </div>

        {/* Main Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
          }}
        >
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>{currentExercise.emoji}</div>
          <h2
            style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: 700,
              color: theme.colors.text.primary,
              textAlign: 'center',
            }}
          >
            {currentExercise.name}
          </h2>
          <p style={{ margin: '0 0 40px 0', color: theme.colors.text.secondary, textAlign: 'center' }}>
            {currentExercise.description}
          </p>

          {/* Timer */}
          <div
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: `conic-gradient(${theme.colors.accent.primary} ${(timeRemaining / currentExercise.duration) * 360}deg, ${theme.colors.background.secondary} 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '170px',
                height: '170px',
                borderRadius: '50%',
                background: theme.colors.background.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '48px', fontWeight: 700, color: theme.colors.text.primary }}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={skipExercise}
              style={{
                padding: '14px 24px',
                borderRadius: '14px',
                border: `1px solid ${theme.colors.border}`,
                background: 'transparent',
                color: theme.colors.text.secondary,
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Skip
            </button>
            <button
              onClick={toggleTimer}
              style={{
                padding: '14px 48px',
                borderRadius: '14px',
                border: 'none',
                background: isRunning
                  ? '#f59e0b'
                  : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color: '#fff',
                fontSize: '18px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isRunning ? '⏸️ Pause' : '▶️ Start'}
            </button>
          </div>
        </div>

        {/* Next Exercise Preview */}
        {currentExerciseIndex < selectedWorkout.exercises.length - 1 && (
          <div
            style={{
              padding: '16px 20px',
              background: theme.colors.background.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>NEXT:</span>
            <span style={{ fontSize: '20px' }}>
              {selectedWorkout.exercises[currentExerciseIndex + 1].emoji}
            </span>
            <span style={{ fontWeight: 600, color: theme.colors.text.primary }}>
              {selectedWorkout.exercises[currentExerciseIndex + 1].name}
            </span>
          </div>
        )}
      </div>
    );
  }

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
          background: 'linear-gradient(135deg, #ef4444, #f97316)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          💪 Dad Bod Workout
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Quick workouts for busy dads
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {categories.map((category) => {
          const workouts = WORKOUTS.filter((w) => w.category === category.id);
          if (workouts.length === 0) return null;

          return (
            <div key={category.id} style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  margin: '0 0 12px 0',
                  fontSize: '16px',
                  fontWeight: 700,
                  color: theme.colors.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>{category.emoji}</span>
                <span>{category.label}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {workouts.map((workout) => (
                  <button
                    key={workout.id}
                    onClick={() => startWorkout(workout)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      background: theme.colors.card,
                      borderRadius: '16px',
                      border: `1px solid ${theme.colors.border}`,
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '36px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        background: theme.colors.background.secondary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {workout.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '16px',
                          fontWeight: 700,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {workout.name}
                      </h4>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: theme.colors.text.muted }}>
                        {workout.description}
                      </p>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                          ⏱️ {workout.duration} min
                        </span>
                        <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                          🏋️ {workout.exercises.length} exercises
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            background: `${getDifficultyColor(workout.difficulty)}20`,
                            color: getDifficultyColor(workout.difficulty),
                            fontWeight: 600,
                          }}
                        >
                          {workout.difficulty}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '20px', color: theme.colors.text.muted }}>▶️</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkoutPage;
