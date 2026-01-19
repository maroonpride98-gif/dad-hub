import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const OfflineIndicator: React.FC = () => {
  const { theme } = useTheme();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      // Show "back online" briefly
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial state
    if (!navigator.onLine) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '70px',
        left: '16px',
        right: '16px',
        padding: '12px 16px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        zIndex: 150,
        animation: 'slideDown 0.3s ease-out',
        background: isOffline
          ? `linear-gradient(135deg, ${theme.colors.error}15, ${theme.colors.error}25)`
          : `linear-gradient(135deg, ${theme.colors.success}15, ${theme.colors.success}25)`,
        border: `1px solid ${isOffline ? theme.colors.error : theme.colors.success}40`,
      }}
    >
      <span style={{ fontSize: '18px' }}>{isOffline ? '📡' : '✅'}</span>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: '13px',
            fontWeight: 600,
            color: isOffline ? theme.colors.error : theme.colors.success,
          }}
        >
          {isOffline ? "You're offline" : 'Back online!'}
        </p>
        {isOffline && (
          <p
            style={{
              margin: '2px 0 0 0',
              fontSize: '11px',
              color: theme.colors.text.muted,
            }}
          >
            Some features may be limited
          </p>
        )}
      </div>
      {!isOffline && (
        <button
          onClick={() => setShowBanner(false)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.text.muted,
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
