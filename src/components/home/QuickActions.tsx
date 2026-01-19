import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface QuickAction {
  icon: string;
  label: string;
  action: string;
}

const quickActions: QuickAction[] = [
  { icon: '💬', label: 'New Chat', action: 'chat' },
  { icon: '📝', label: 'New Post', action: 'post' },
  { icon: '📅', label: 'Events', action: 'events' },
  { icon: '😂', label: 'Jokes', action: 'jokes' },
];

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const { theme } = useTheme();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
      {quickActions.map((item) => (
        <button
          key={item.action}
          onClick={() => onAction(item.action)}
          className="card-hover"
          style={{
            padding: '20px 12px',
            background: theme.colors.card,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: theme.colors.text.primary,
          }}
        >
          <span style={{ fontSize: '28px' }}>{item.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: 600 }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
};
