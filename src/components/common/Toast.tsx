import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast, ToastType } from '../../context/ToastContext';

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return { emoji: '✅', label: 'Success' };
    case 'error':
      return { emoji: '❌', label: 'Error' };
    case 'warning':
      return { emoji: '⚠️', label: 'Warning' };
    case 'info':
    default:
      return { emoji: 'ℹ️', label: 'Info' };
  }
};

export const ToastContainer: React.FC = () => {
  const { theme } = useTheme();
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '16px',
        right: '16px',
        zIndex: 250,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast, index) => {
        const config = getToastConfig(toast.type);
        const colors = {
          success: theme.colors.success,
          error: theme.colors.error,
          warning: '#f59e0b',
          info: theme.colors.accent.primary,
        };
        const color = colors[toast.type];

        return (
          <div
            key={toast.id}
            style={{
              background: theme.colors.card,
              borderRadius: '12px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: theme.shadows.medium,
              border: `1px solid ${color}30`,
              animation: 'slideUp 0.3s ease-out',
              animationDelay: `${index * 0.05}s`,
              pointerEvents: 'auto',
            }}
          >
            <span
              style={{
                fontSize: '20px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `${color}20`,
                borderRadius: '8px',
              }}
            >
              {config.emoji}
            </span>

            <p
              style={{
                flex: 1,
                margin: 0,
                fontSize: '14px',
                color: theme.colors.text.primary,
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </p>

            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'none',
                border: 'none',
                color: theme.colors.text.muted,
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                lineHeight: 1,
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};
