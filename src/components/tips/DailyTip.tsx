import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { haptics } from '../../utils/haptics';

interface DadTip {
  id: string;
  category: 'parenting' | 'health' | 'relationship' | 'work' | 'fun';
  title: string;
  content: string;
  emoji: string;
}

const DAD_TIPS: DadTip[] = [
  { id: '1', category: 'parenting', emoji: '👶', title: 'Quality Over Quantity', content: "15 minutes of undivided attention beats hours of distracted presence. Put the phone down and be fully present." },
  { id: '2', category: 'parenting', emoji: '🎯', title: 'Catch Them Being Good', content: "Instead of always correcting bad behavior, make an effort to praise good behavior. Positive reinforcement works wonders!" },
  { id: '3', category: 'health', emoji: '💪', title: 'Dad Bod Maintenance', content: "Even 10 minutes of exercise a day makes a difference. Try doing pushups while your kid counts - they love it!" },
  { id: '4', category: 'relationship', emoji: '❤️', title: 'Date Night Matters', content: "Schedule regular one-on-one time with your partner. A strong relationship is the foundation of a happy family." },
  { id: '5', category: 'work', emoji: '⚖️', title: 'Work-Life Balance', content: "Set boundaries with work. Your kids won't remember you stayed late at the office, but they'll remember you at their games." },
  { id: '6', category: 'fun', emoji: '😂', title: 'Embrace the Dad Jokes', content: "Research shows dad jokes help kids develop a sense of humor and learn to handle embarrassment. Keep 'em coming!" },
  { id: '7', category: 'parenting', emoji: '📖', title: 'Read Together', content: "Reading 20 minutes a day exposes kids to 1.8 million words per year. Make it a nightly ritual!" },
  { id: '8', category: 'health', emoji: '😴', title: 'Sleep is King', content: "You can't pour from an empty cup. Prioritize 7-8 hours of sleep - it makes you a better dad." },
  { id: '9', category: 'parenting', emoji: '🎵', title: 'Create Traditions', content: "Whether it's Saturday pancakes or Sunday bike rides, family traditions create lasting memories." },
  { id: '10', category: 'relationship', emoji: '🤝', title: 'Be a Team', content: "Present a united front with your partner. Kids are experts at finding cracks - don't let them divide and conquer!" },
  { id: '11', category: 'fun', emoji: '🎮', title: 'Play Their Games', content: "Let your kids teach you their favorite video game. Role reversal builds confidence and strengthens bonds." },
  { id: '12', category: 'parenting', emoji: '👂', title: 'Listen More', content: "Sometimes kids just need to be heard, not fixed. Ask 'Do you want advice or just want to vent?'" },
  { id: '13', category: 'health', emoji: '🥗', title: 'Model Healthy Eating', content: "Kids mimic what they see. If you eat your vegetables, they're more likely to eat theirs." },
  { id: '14', category: 'work', emoji: '📱', title: 'Phone-Free Zones', content: "Create phone-free times like dinner or bedtime routines. Your kids will thank you for the undivided attention." },
  { id: '15', category: 'parenting', emoji: '🎨', title: 'Embrace the Mess', content: "Creativity is messy. Let them paint, play in mud, and make a mess. The memories are worth the cleanup." },
];

const CATEGORY_COLORS = {
  parenting: '#8b5cf6',
  health: '#22c55e',
  relationship: '#ec4899',
  work: '#3b82f6',
  fun: '#f59e0b',
};

interface DailyTipProps {
  onDismiss?: () => void;
  variant?: 'banner' | 'card' | 'modal';
}

export const DailyTip: React.FC<DailyTipProps> = ({ onDismiss, variant = 'card' }) => {
  const { theme } = useTheme();
  const [tip, setTip] = useState<DadTip | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Get tip based on day of year for consistency
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const tipIndex = dayOfYear % DAD_TIPS.length;
    setTip(DAD_TIPS[tipIndex]);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    haptics.light();
    onDismiss?.();
  };

  if (!tip || !isVisible) return null;

  const categoryColor = CATEGORY_COLORS[tip.category];

  if (variant === 'banner') {
    return (
      <div
        style={{
          background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}dd)`,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '24px' }}>{tip.emoji}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 2px 0', fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
            Daily Dad Tip
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#fff' }}>
            {tip.content}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: '#fff',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
    );
  }

  if (variant === 'modal') {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out',
        }}
        onClick={handleDismiss}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            background: theme.colors.background.primary,
            borderRadius: '24px',
            overflow: 'hidden',
            animation: 'scaleIn 0.3s ease-out',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${categoryColor}, ${categoryColor}cc)`,
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '56px', display: 'block', marginBottom: '12px' }}>{tip.emoji}</span>
            <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
              Daily Dad Tip
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: 700, color: theme.colors.text.primary }}>
              {tip.title}
            </h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '15px', color: theme.colors.text.secondary, lineHeight: 1.6 }}>
              {tip.content}
            </p>
            <button
              onClick={handleDismiss}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: theme.colors.accent.gradient,
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Got it! 👍
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div
      style={{
        background: theme.colors.card,
        borderRadius: '16px',
        border: `1px solid ${theme.colors.border}`,
        overflow: 'hidden',
      }}
    >
      {/* Colored accent bar */}
      <div style={{ height: '4px', background: categoryColor }} />

      <div style={{ padding: '16px', display: 'flex', gap: '14px' }}>
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `${categoryColor}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            flexShrink: 0,
          }}
        >
          {tip.emoji}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: categoryColor, textTransform: 'uppercase' }}>
              Daily Tip
            </p>
            <button
              onClick={handleDismiss}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: 'none',
                background: theme.colors.background.secondary,
                color: theme.colors.text.muted,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          </div>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: 600, color: theme.colors.text.primary }}>
            {tip.title}
          </h4>
          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.secondary, lineHeight: 1.5 }}>
            {tip.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyTip;
