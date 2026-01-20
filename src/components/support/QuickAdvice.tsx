import { useTheme } from '../../context/ThemeContext';

interface QuickAdviceProps {
  category: string;
  onClose: () => void;
}

interface AdviceItem {
  emoji: string;
  title: string;
  content: string;
}

const ADVICE_DATA: Record<string, { title: string; emoji: string; advice: AdviceItem[] }> = {
  tantrum: {
    title: 'Handling Tantrums',
    emoji: '😤',
    advice: [
      {
        emoji: '🧘',
        title: 'Stay Calm',
        content: "Your calm energy helps them regulate. Take a deep breath. They're not giving you a hard time—they're having a hard time.",
      },
      {
        emoji: '🏠',
        title: 'Safe Space',
        content: "Move to a quiet, safe area if possible. Sometimes a change of environment helps break the cycle.",
      },
      {
        emoji: '👂',
        title: 'Acknowledge Feelings',
        content: '"I can see you\'re really upset. It\'s okay to feel angry." Naming emotions helps them process.',
      },
      {
        emoji: '⏰',
        title: 'Wait It Out',
        content: "Sometimes they just need to ride the wave. Stay nearby, offer comfort when they're ready.",
      },
      {
        emoji: '🤗',
        title: 'Reconnect After',
        content: "Once calm, a hug and simple talk about what happened. Don't lecture—just connect.",
      },
    ],
  },
  bedtime: {
    title: 'Bedtime Battles',
    emoji: '🌙',
    advice: [
      {
        emoji: '📋',
        title: 'Consistent Routine',
        content: 'Same time, same order: bath, brush, book, bed. Predictability reduces resistance.',
      },
      {
        emoji: '📵',
        title: 'Screen Cutoff',
        content: 'No screens 1 hour before bed. The blue light messes with their melatonin.',
      },
      {
        emoji: '🌡️',
        title: 'Environment Check',
        content: 'Cool room (65-70°F), dim lights, white noise if needed. Make it cozy.',
      },
      {
        emoji: '📖',
        title: 'Wind Down Activity',
        content: 'Quiet reading, soft music, or gentle stretching helps signal "sleep time" to their brain.',
      },
      {
        emoji: '💪',
        title: 'Stay Firm, Stay Kind',
        content: 'Boundaries with love. "I know you want to stay up. Bedtime is now. I love you."',
      },
    ],
  },
  picky_eating: {
    title: 'Picky Eating',
    emoji: '🥦',
    advice: [
      {
        emoji: '🍽️',
        title: 'No Pressure',
        content: "Offer food, don't force it. Pressure backfires. Your job is to offer, their job is to eat.",
      },
      {
        emoji: '🔄',
        title: 'Repeated Exposure',
        content: 'It can take 10-15 exposures to a new food. Keep offering without pressure.',
      },
      {
        emoji: '👨‍🍳',
        title: 'Involve Them',
        content: 'Let them help cook, pick veggies at the store. Investment increases interest.',
      },
      {
        emoji: '🎯',
        title: 'Small Portions',
        content: 'One bite of the new thing alongside favorites. No big deal if they skip it.',
      },
      {
        emoji: '🚫',
        title: 'No Short-Order Cooking',
        content: "One meal for the family. Include something they usually eat, but don't make separate meals.",
      },
    ],
  },
  sibling_fights: {
    title: 'Sibling Conflicts',
    emoji: '👊',
    advice: [
      {
        emoji: '👀',
        title: "Don't Take Sides",
        content: 'Unless someone is getting hurt, stay neutral. "I see two kids who are upset."',
      },
      {
        emoji: '🗣️',
        title: 'Coach, Don\'t Referee',
        content: '"Can you two figure out a solution?" Give them a chance to problem-solve first.',
      },
      {
        emoji: '⏱️',
        title: 'Separation When Needed',
        content: '"You both need a break. Go to separate spaces and come back when you\'re calm."',
      },
      {
        emoji: '💕',
        title: 'One-on-One Time',
        content: 'Sometimes fights are about attention. Make sure each kid gets individual time with you.',
      },
      {
        emoji: '📝',
        title: 'Clear Family Rules',
        content: '"We don\'t hit. We use words." Simple, consistent rules for everyone.',
      },
    ],
  },
  overwhelmed: {
    title: 'Feeling Overwhelmed',
    emoji: '😰',
    advice: [
      {
        emoji: '🌬️',
        title: 'Breathe First',
        content: 'Box breathing: 4 seconds in, 4 hold, 4 out, 4 hold. Do this 3 times. It actually works.',
      },
      {
        emoji: '🚿',
        title: 'Quick Reset',
        content: 'Splash cold water on your face. It triggers your body\'s dive reflex and calms you down.',
      },
      {
        emoji: '📞',
        title: 'Call for Backup',
        content: "Tag out if you can. Partner, family, friend—it's okay to ask for help.",
      },
      {
        emoji: '✅',
        title: 'Lower the Bar',
        content: "Survival mode is okay. Cereal for dinner? Fine. Screen time? It's fine. You're doing your best.",
      },
      {
        emoji: '🙏',
        title: 'This Too Shall Pass',
        content: "Hard moments aren't forever. You're not a bad dad—you're a human dad having a hard time.",
      },
    ],
  },
  emergency: {
    title: 'Emergency Help',
    emoji: '🆘',
    advice: [
      {
        emoji: '📱',
        title: 'Call 911',
        content: 'For any life-threatening emergency: difficulty breathing, unconsciousness, severe injury, poisoning.',
      },
      {
        emoji: '☠️',
        title: 'Poison Control',
        content: '1-800-222-1222 (US). Call if your child ingests something potentially harmful.',
      },
      {
        emoji: '🏥',
        title: 'Nurse Hotline',
        content: "Many insurance plans have 24/7 nurse lines. Check your card—they can help you decide if it's ER-worthy.",
      },
      {
        emoji: '🩹',
        title: 'First Aid Basics',
        content: 'Cuts: pressure + clean + bandage. Burns: cool water 10-20 min. Bumps: ice pack wrapped in cloth.',
      },
      {
        emoji: '💙',
        title: 'Mental Health Crisis',
        content: '988 Suicide & Crisis Lifeline. For yourself or someone else. Text or call 988.',
      },
    ],
  },
};

export const QuickAdvice: React.FC<QuickAdviceProps> = ({ category, onClose }) => {
  const { theme } = useTheme();
  const data = ADVICE_DATA[category];

  if (!data) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: theme.colors.text.muted }}>Category not found</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: '40px',
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
          position: 'sticky',
          top: 0,
          background: theme.colors.background.primary,
          zIndex: 10,
        }}
      >
        <button
          onClick={onClose}
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
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
            {data.emoji} {data.title}
          </h2>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
            Quick tips to help right now
          </p>
        </div>
      </div>

      {/* Advice Cards */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {data.advice.map((item, index) => (
          <div
            key={index}
            style={{
              background: theme.colors.card,
              borderRadius: '16px',
              border: `1px solid ${theme.colors.border}`,
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <span style={{ fontSize: '24px' }}>{item.emoji}</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.colors.text.primary }}>
                {item.title}
              </h3>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: theme.colors.text.secondary,
                lineHeight: 1.6,
              }}
            >
              {item.content}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Reminder */}
      <div
        style={{
          margin: '0 20px',
          padding: '16px',
          background: `${theme.colors.accent.primary}15`,
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.secondary }}>
          💪 You've got this, dad. Take it one moment at a time.
        </p>
      </div>
    </div>
  );
};

export default QuickAdvice;
