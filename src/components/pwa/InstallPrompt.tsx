import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../common';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const { theme } = useTheme();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed or dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (dismissed || isStandalone) {
      return;
    }

    // Check for iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after a delay for better UX
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Show iOS prompt after delay
    if (iOS && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '16px',
        right: '16px',
        background: theme.colors.card,
        borderRadius: '16px',
        padding: '16px',
        boxShadow: theme.shadows.large,
        zIndex: 200,
        animation: 'slideUp 0.3s ease-out',
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            fontSize: '32px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}20, ${theme.colors.accent.secondary}20)`,
            borderRadius: '12px',
          }}
        >
          👨‍👧‍👦
        </div>

        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: '0 0 4px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Install DadHub
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: theme.colors.text.secondary,
              lineHeight: 1.4,
            }}
          >
            {isIOS
              ? 'Tap the share button and "Add to Home Screen" for the best experience!'
              : 'Add DadHub to your home screen for quick access and offline support.'}
          </p>
        </div>

        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            color: theme.colors.text.muted,
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px',
          }}
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>

      {!isIOS && deferredPrompt && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
          <Button variant="secondary" onClick={handleDismiss} style={{ flex: 1 }}>
            Not Now
          </Button>
          <Button onClick={handleInstall} style={{ flex: 1 }}>
            Install
          </Button>
        </div>
      )}

      {isIOS && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            background: theme.colors.background.secondary,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: theme.colors.text.secondary,
          }}
        >
          <span style={{ fontSize: '16px' }}>📤</span>
          <span>
            Tap <strong>Share</strong> → <strong>Add to Home Screen</strong>
          </span>
        </div>
      )}
    </div>
  );
};
