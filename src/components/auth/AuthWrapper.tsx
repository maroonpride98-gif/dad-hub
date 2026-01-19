import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { ProfileSetupPage } from './ProfileSetupPage';

type AuthView = 'login' | 'register';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { theme } = useTheme();
  const { isAuthenticated, isLoading, needsProfileSetup } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

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
        <div style={{ fontSize: '48px' }}>👨‍👧‍👦</div>
        <p style={{ color: theme.colors.text.muted }}>Loading DadHub...</p>
      </div>
    );
  }

  if (needsProfileSetup) {
    return <ProfileSetupPage />;
  }

  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onSwitchToRegister={() => setAuthView('register')} />;
    }
    return <RegisterPage onSwitchToLogin={() => setAuthView('login')} />;
  }

  return <>{children}</>;
};
