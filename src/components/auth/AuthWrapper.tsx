import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ProfileSetupPage } from './ProfileSetupPage';
import { LandingPage } from '../public/LandingPage';
import { PublicProfile } from '../public/PublicProfile';

type AuthView = 'landing' | 'login' | 'register';

interface AuthWrapperProps {
  children: React.ReactNode;
}

// Check for special routes
const getInitialRoute = () => {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  // Check for public profile route
  if (path.startsWith('/dad/')) {
    const userId = path.split('/dad/')[1];
    return { type: 'profile' as const, userId };
  }

  // Check for referral code
  if (params.get('ref')) {
    return { type: 'landing' as const };
  }

  return { type: 'landing' as const };
};

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading, needsProfileSetup } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('landing');
  const [publicProfileId, setPublicProfileId] = useState<string | null>(null);

  // Handle routing
  useEffect(() => {
    const route = getInitialRoute();
    if (route.type === 'profile' && route.userId) {
      setPublicProfileId(route.userId);
    }
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const route = getInitialRoute();
      if (route.type === 'profile' && route.userId) {
        setPublicProfileId(route.userId);
      } else {
        setPublicProfileId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          background: theme.colors.background.primary,
        }}
      >
        <div style={{ fontSize: '48px', animation: 'float 2s ease-in-out infinite' }}>👨‍👧‍👦</div>
        <p style={{ color: theme.colors.text.muted }}>Loading DadHub...</p>
      </div>
    );
  }

  // Show public profile if visiting /dad/:id
  if (publicProfileId && !isAuthenticated) {
    return (
      <PublicProfile
        userId={publicProfileId}
        onJoinClick={() => {
          setPublicProfileId(null);
          setAuthView('register');
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  if (needsProfileSetup) {
    return <ProfileSetupPage />;
  }

  if (!isAuthenticated) {
    if (authView === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => setAuthView('register')}
          onLogin={() => setAuthView('login')}
        />
      );
    }
    if (authView === 'login') {
      return (
        <LoginPage
          onSwitchToRegister={() => setAuthView('register')}
        />
      );
    }
    return (
      <RegisterPage
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  return <>{children}</>;
};
