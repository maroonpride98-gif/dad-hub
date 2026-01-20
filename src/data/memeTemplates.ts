export interface MemeTemplate {
  id: string;
  name: string;
  description: string;
  emoji: string;
  textPositions: TextPosition[];
  backgroundColor: string;
  category: 'classic' | 'relatable' | 'trending' | 'custom';
}

export interface TextPosition {
  id: string;
  label: string;
  x: number; // percentage from left
  y: number; // percentage from top
  width: number; // percentage of canvas
  fontSize: number; // base font size
  color: string;
  strokeColor: string;
  align: 'left' | 'center' | 'right';
  placeholder: string;
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'dad_saying',
    name: 'Dad Wisdom',
    description: 'Classic dad advice meme',
    emoji: '👴',
    backgroundColor: '#1a1a2e',
    category: 'classic',
    textPositions: [
      {
        id: 'top',
        label: 'Dad Says',
        x: 50,
        y: 15,
        width: 90,
        fontSize: 32,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'I\'m not sleeping...',
      },
      {
        id: 'bottom',
        label: 'Reality',
        x: 50,
        y: 85,
        width: 90,
        fontSize: 32,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'I\'m just resting my eyes',
      },
    ],
  },
  {
    id: 'me_vs_dad',
    name: 'Me vs My Dad',
    description: 'Generation comparison meme',
    emoji: '👨‍👦',
    backgroundColor: '#16213e',
    category: 'relatable',
    textPositions: [
      {
        id: 'left',
        label: 'Me',
        x: 25,
        y: 50,
        width: 40,
        fontSize: 28,
        color: '#60a5fa',
        strokeColor: '#1e3a5f',
        align: 'center',
        placeholder: 'Using GPS',
      },
      {
        id: 'right',
        label: 'My Dad',
        x: 75,
        y: 50,
        width: 40,
        fontSize: 28,
        color: '#f59e0b',
        strokeColor: '#78350f',
        align: 'center',
        placeholder: 'Using the sun',
      },
    ],
  },
  {
    id: 'dad_bod_energy',
    name: 'Dad Bod Energy',
    description: 'Embrace the dad bod',
    emoji: '💪',
    backgroundColor: '#0f0f0f',
    category: 'trending',
    textPositions: [
      {
        id: 'top',
        label: 'Expectation',
        x: 50,
        y: 20,
        width: 90,
        fontSize: 28,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: '6-pack abs',
      },
      {
        id: 'bottom',
        label: 'Reality',
        x: 50,
        y: 80,
        width: 90,
        fontSize: 36,
        color: '#22c55e',
        strokeColor: '#166534',
        align: 'center',
        placeholder: '6-pack of beer',
      },
    ],
  },
  {
    id: 'thermostat',
    name: 'Thermostat Guardian',
    description: 'The sacred thermostat',
    emoji: '🌡️',
    backgroundColor: '#1e3a5f',
    category: 'classic',
    textPositions: [
      {
        id: 'top',
        label: 'When someone touches',
        x: 50,
        y: 15,
        width: 90,
        fontSize: 24,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'When someone touches the thermostat',
      },
      {
        id: 'bottom',
        label: 'Dad\'s reaction',
        x: 50,
        y: 85,
        width: 90,
        fontSize: 36,
        color: '#ef4444',
        strokeColor: '#7f1d1d',
        align: 'center',
        placeholder: '🚨 CODE RED 🚨',
      },
    ],
  },
  {
    id: 'dad_joke_reaction',
    name: 'Dad Joke Reaction',
    description: 'When the joke lands (or not)',
    emoji: '😂',
    backgroundColor: '#2d1f47',
    category: 'trending',
    textPositions: [
      {
        id: 'setup',
        label: 'The Joke',
        x: 50,
        y: 25,
        width: 90,
        fontSize: 26,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'Why don\'t scientists trust atoms?',
      },
      {
        id: 'punchline',
        label: 'Punchline',
        x: 50,
        y: 75,
        width: 90,
        fontSize: 30,
        color: '#fbbf24',
        strokeColor: '#78350f',
        align: 'center',
        placeholder: 'Because they make up everything! 😂',
      },
    ],
  },
  {
    id: 'weekend_plans',
    name: 'Weekend Plans',
    description: 'Dad\'s ideal weekend',
    emoji: '📺',
    backgroundColor: '#1a1a1a',
    category: 'relatable',
    textPositions: [
      {
        id: 'friday',
        label: 'Friday Night',
        x: 50,
        y: 20,
        width: 90,
        fontSize: 24,
        color: '#22c55e',
        strokeColor: '#166534',
        align: 'center',
        placeholder: 'Big weekend plans!',
      },
      {
        id: 'saturday',
        label: 'Saturday Reality',
        x: 50,
        y: 80,
        width: 90,
        fontSize: 28,
        color: '#9ca3af',
        strokeColor: '#374151',
        align: 'center',
        placeholder: '*Falls asleep at 8pm*',
      },
    ],
  },
  {
    id: 'grill_master',
    name: 'Grill Master',
    description: 'BBQ dad vibes',
    emoji: '🍖',
    backgroundColor: '#451a03',
    category: 'classic',
    textPositions: [
      {
        id: 'top',
        label: 'Top Text',
        x: 50,
        y: 15,
        width: 90,
        fontSize: 30,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'Nobody:',
      },
      {
        id: 'bottom',
        label: 'Bottom Text',
        x: 50,
        y: 85,
        width: 90,
        fontSize: 28,
        color: '#f97316',
        strokeColor: '#7c2d12',
        align: 'center',
        placeholder: 'Dad: These burgers need 2 more minutes',
      },
    ],
  },
  {
    id: 'custom_blank',
    name: 'Custom Meme',
    description: 'Start from scratch',
    emoji: '🎨',
    backgroundColor: '#1c1917',
    category: 'custom',
    textPositions: [
      {
        id: 'top',
        label: 'Top Text',
        x: 50,
        y: 15,
        width: 90,
        fontSize: 32,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'Your text here',
      },
      {
        id: 'middle',
        label: 'Middle Text',
        x: 50,
        y: 50,
        width: 90,
        fontSize: 28,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'Optional middle text',
      },
      {
        id: 'bottom',
        label: 'Bottom Text',
        x: 50,
        y: 85,
        width: 90,
        fontSize: 32,
        color: '#ffffff',
        strokeColor: '#000000',
        align: 'center',
        placeholder: 'Your punchline',
      },
    ],
  },
];

export const getMemeTemplate = (id: string): MemeTemplate | undefined => {
  return MEME_TEMPLATES.find((t) => t.id === id);
};

export const getMemesByCategory = (category: MemeTemplate['category']): MemeTemplate[] => {
  return MEME_TEMPLATES.filter((t) => t.category === category);
};
