import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../common';

interface StatCardProps {
  icon: string;
  label: string;
  value: number | string;
  trend?: string;
  variant?: 'default' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  variant = 'default',
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'warning':
        return { borderLeft: `4px solid ${theme.colors.accent.secondary}` };
      case 'success':
        return { borderLeft: `4px solid ${theme.colors.success}` };
      default:
        return {};
    }
  };

  return (
    <Card style={getVariantStyles()}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '24px' }}>{icon}</span>
        <span style={{ color: theme.colors.text.muted, fontSize: '14px' }}>{label}</span>
      </div>
      <div style={{ fontSize: '32px', fontWeight: 800 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {trend && (
        <p
          style={{
            margin: '8px 0 0',
            fontSize: '12px',
            color: theme.colors.success,
          }}
        >
          {trend}
        </p>
      )}
    </Card>
  );
};
