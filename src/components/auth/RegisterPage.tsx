import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../common';

interface RegisterPageProps {
  onSwitchToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSwitchToLogin }) => {
  const { theme } = useTheme();
  const { register, loginWithGoogle, error, clearError, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }

    try {
      await register(email, password);
    } catch {
      // Error is handled in context
    }
  };

  const handleGoogleLogin = async () => {
    clearError();
    try {
      await loginWithGoogle();
    } catch {
      // Error is handled in context
    }
  };

  const displayError = localError || error;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Card variant="default" padding="large" style={{ maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>👨‍👧‍👦</div>
          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '28px',
              fontWeight: 800,
              color: theme.colors.text.primary,
            }}
          >
            Join DadHub
          </h1>
          <p
            style={{
              margin: 0,
              color: theme.colors.text.secondary,
              fontSize: '14px',
            }}
          >
            Connect with fellow dads
          </p>
        </div>

        {displayError && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: theme.colors.error,
              fontSize: '14px',
              marginBottom: '20px',
            }}
          >
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <Input
              type="email"
              placeholder="Email address"
              icon="📧"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <Input
              type="password"
              placeholder="Password (min 6 characters)"
              icon="🔒"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <Input
              type="password"
              placeholder="Confirm password"
              icon="🔒"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <Button type="submit" fullWidth disabled={isLoading} style={{ marginBottom: '16px' }}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '24px 0',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
          <span style={{ color: theme.colors.text.muted, fontSize: '13px' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: theme.colors.border }} />
        </div>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{ marginBottom: '24px' }}
        >
          <span style={{ marginRight: '8px' }}>G</span>
          Continue with Google
        </Button>

        <p
          style={{
            textAlign: 'center',
            margin: 0,
            color: theme.colors.text.secondary,
            fontSize: '14px',
          }}
        >
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.accent.primary,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            Sign in
          </button>
        </p>
      </Card>
    </div>
  );
};
