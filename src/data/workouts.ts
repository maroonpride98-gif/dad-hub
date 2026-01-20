export interface Exercise {
  name: string;
  duration: number; // in seconds
  emoji: string;
  description: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  emoji: string;
  duration: number; // total minutes
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'morning' | 'desk' | 'playground' | 'evening';
  exercises: Exercise[];
}

export const WORKOUTS: Workout[] = [
  {
    id: 'morning-energy',
    name: 'Morning Energy Boost',
    description: 'Quick wake-up routine before the kids are up',
    emoji: '☀️',
    duration: 10,
    difficulty: 'easy',
    category: 'morning',
    exercises: [
      { name: 'Jumping Jacks', duration: 45, emoji: '⭐', description: 'Get the blood flowing' },
      { name: 'Bodyweight Squats', duration: 45, emoji: '🦵', description: '15 reps, keep form' },
      { name: 'Push-ups', duration: 45, emoji: '💪', description: 'As many as you can' },
      { name: 'High Knees', duration: 30, emoji: '🏃', description: 'Run in place' },
      { name: 'Plank Hold', duration: 30, emoji: '🧘', description: 'Core engaged' },
      { name: 'Lunges', duration: 45, emoji: '🦿', description: 'Alternate legs' },
      { name: 'Mountain Climbers', duration: 30, emoji: '⛰️', description: 'Keep it steady' },
      { name: 'Burpees', duration: 30, emoji: '🔥', description: 'Full body blast' },
      { name: 'Cool Down Stretch', duration: 60, emoji: '🧘', description: 'Wind down' },
    ],
  },
  {
    id: 'desk-break',
    name: 'Desk Break Stretches',
    description: 'Quick stretches for work-from-home dads',
    emoji: '💼',
    duration: 5,
    difficulty: 'easy',
    category: 'desk',
    exercises: [
      { name: 'Neck Rolls', duration: 30, emoji: '🔄', description: 'Both directions' },
      { name: 'Shoulder Shrugs', duration: 30, emoji: '🤷', description: 'Release tension' },
      { name: 'Wrist Circles', duration: 20, emoji: '✋', description: 'Both directions' },
      { name: 'Standing Stretch', duration: 30, emoji: '🙆', description: 'Reach for the sky' },
      { name: 'Hip Flexor Stretch', duration: 30, emoji: '🦵', description: 'Hold each side' },
      { name: 'Spinal Twist', duration: 30, emoji: '🔄', description: 'Seated twist' },
      { name: 'Deep Breaths', duration: 30, emoji: '🌬️', description: 'Relax and reset' },
    ],
  },
  {
    id: 'playground-workout',
    name: 'Playground Dad Workout',
    description: 'Work out while watching the kids play',
    emoji: '🛝',
    duration: 15,
    difficulty: 'medium',
    category: 'playground',
    exercises: [
      { name: 'Bench Step-ups', duration: 60, emoji: '📈', description: 'Use the park bench' },
      { name: 'Tricep Dips', duration: 45, emoji: '💪', description: 'On the bench' },
      { name: 'Walking Lunges', duration: 60, emoji: '🚶', description: 'Around the area' },
      { name: 'Incline Push-ups', duration: 45, emoji: '📐', description: 'Hands on bench' },
      { name: 'Playground Pull-ups', duration: 30, emoji: '🎢', description: 'Use the bars' },
      { name: 'Sprint Intervals', duration: 60, emoji: '🏃', description: '20 sec sprint, 40 rest' },
      { name: 'Bench Jumps', duration: 45, emoji: '⬆️', description: 'Jump up, step down' },
      { name: 'Plank Hold', duration: 45, emoji: '🧘', description: 'Find a flat spot' },
      { name: 'Cool Down Walk', duration: 90, emoji: '🚶', description: 'Walk with the kids' },
    ],
  },
  {
    id: 'bedtime-stretch',
    name: 'Bedtime Wind Down',
    description: 'Relaxing stretches before sleep',
    emoji: '🌙',
    duration: 10,
    difficulty: 'easy',
    category: 'evening',
    exercises: [
      { name: 'Child\'s Pose', duration: 60, emoji: '🧒', description: 'Relax and breathe' },
      { name: 'Cat-Cow Stretch', duration: 45, emoji: '🐱', description: 'Gentle spinal movement' },
      { name: 'Seated Forward Fold', duration: 45, emoji: '🙇', description: 'Hamstring stretch' },
      { name: 'Supine Twist', duration: 45, emoji: '🔄', description: 'Each side' },
      { name: 'Happy Baby', duration: 45, emoji: '👶', description: 'Hip opener' },
      { name: 'Legs Up Wall', duration: 60, emoji: '🦵', description: 'Relaxation pose' },
      { name: 'Deep Breathing', duration: 60, emoji: '🌬️', description: 'Box breathing' },
    ],
  },
  {
    id: 'dad-bod-blast',
    name: 'Dad Bod Blast',
    description: 'High intensity circuit for busy dads',
    emoji: '🔥',
    duration: 20,
    difficulty: 'hard',
    category: 'morning',
    exercises: [
      { name: 'Warm Up Jog', duration: 60, emoji: '🏃', description: 'In place or outside' },
      { name: 'Burpees', duration: 45, emoji: '💥', description: 'Full effort' },
      { name: 'Jump Squats', duration: 45, emoji: '🦵', description: 'Explosive' },
      { name: 'Push-up Variations', duration: 60, emoji: '💪', description: 'Wide, narrow, regular' },
      { name: 'Mountain Climbers', duration: 45, emoji: '⛰️', description: 'Fast pace' },
      { name: 'Box Jumps', duration: 45, emoji: '📦', description: 'Use stairs or step' },
      { name: 'Plank Jacks', duration: 45, emoji: '⭐', description: 'Core burner' },
      { name: 'Tuck Jumps', duration: 30, emoji: '🚀', description: 'Explosive' },
      { name: 'Bear Crawls', duration: 45, emoji: '🐻', description: 'Forward and back' },
      { name: 'Bicycle Crunches', duration: 60, emoji: '🚴', description: 'Core focus' },
      { name: 'Cool Down Stretch', duration: 120, emoji: '🧘', description: 'Full body stretch' },
    ],
  },
];

export const getWorkoutById = (id: string): Workout | undefined => {
  return WORKOUTS.find((w) => w.id === id);
};

export const getWorkoutsByCategory = (category: Workout['category']): Workout[] => {
  return WORKOUTS.filter((w) => w.category === category);
};
