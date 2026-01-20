import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ChoreWheelPage } from './ChoreWheelPage';
import { MilestonesPage } from './MilestonesPage';
import { AllowancePage } from './AllowancePage';
import { WorkoutPage } from './WorkoutPage';
import { SleepPage } from './SleepPage';
import { haptics } from '../../utils/haptics';

type ToolView = 'menu' | 'chores' | 'milestones' | 'allowance' | 'workout' | 'sleep';

interface ToolItem {
  id: ToolView;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

const TOOLS: ToolItem[] = [
  {
    id: 'chores',
    emoji: '🎡',
    label: 'Chore Wheel',
    description: 'Spin to assign tasks fairly',
    color: '#8b5cf6',
  },
  {
    id: 'milestones',
    emoji: '📸',
    label: 'Kid Milestones',
    description: "Track your kids' special moments",
    color: '#ec4899',
  },
  {
    id: 'allowance',
    emoji: '💰',
    label: 'Allowance Manager',
    description: 'Manage pocket money & savings',
    color: '#22c55e',
  },
  {
    id: 'workout',
    emoji: '💪',
    label: 'Dad Bod Workout',
    description: 'Quick workouts for busy dads',
    color: '#ef4444',
  },
  {
    id: 'sleep',
    emoji: '😴',
    label: 'Sleep Tracker',
    description: 'Log and analyze your sleep',
    color: '#6366f1',
  },
];

export const ToolsPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState<ToolView>('menu');

  const handleToolClick = (toolId: ToolView) => {
    setActiveView(toolId);
    haptics.light();
  };

  const handleBack = () => {
    setActiveView('menu');
    haptics.light();
  };

  // Render the selected tool page
  if (activeView === 'chores') {
    return (
      <div>
        <BackButton onBack={handleBack} theme={theme} />
        <ChoreWheelPage />
      </div>
    );
  }

  if (activeView === 'milestones') {
    return (
      <div>
        <BackButton onBack={handleBack} theme={theme} />
        <MilestonesPage />
      </div>
    );
  }

  if (activeView === 'allowance') {
    return (
      <div>
        <BackButton onBack={handleBack} theme={theme} />
        <AllowancePage />
      </div>
    );
  }

  if (activeView === 'workout') {
    return (
      <div>
        <BackButton onBack={handleBack} theme={theme} />
        <WorkoutPage />
      </div>
    );
  }

  if (activeView === 'sleep') {
    return (
      <div>
        <BackButton onBack={handleBack} theme={theme} />
        <SleepPage />
      </div>
    );
  }

  // Main menu view
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
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🔧 Dad Tools
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Handy utilities for everyday dad life
        </p>
      </div>

      {/* Tools Grid */}
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleToolClick(tool.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px',
                background: theme.colors.card,
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${tool.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: `${tool.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  flexShrink: 0,
                }}
              >
                {tool.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    margin: '0 0 4px 0',
                    fontSize: '17px',
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                  }}
                >
                  {tool.label}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.muted }}>
                  {tool.description}
                </p>
              </div>
              <span
                style={{
                  fontSize: '20px',
                  color: tool.color,
                }}
              >
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Back button component
const BackButton: React.FC<{ onBack: () => void; theme: ReturnType<typeof useTheme>['theme'] }> = ({
  onBack,
  theme,
}) => (
  <button
    onClick={onBack}
    style={{
      position: 'fixed',
      top: '80px',
      left: '20px',
      zIndex: 50,
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: 'none',
      background: theme.colors.card,
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      color: theme.colors.text.primary,
      fontSize: '18px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    ←
  </button>
);

export default ToolsPage;
