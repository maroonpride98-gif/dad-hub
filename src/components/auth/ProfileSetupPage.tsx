import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Input } from '../common';

const AVATAR_OPTIONS = [
  '👨',
  '👨‍🦲',
  '👨‍🦱',
  '👨‍🦳',
  '👨🏻',
  '👨🏼',
  '👨🏽',
  '👨🏾',
  '👨🏿',
  '🧔',
  '🧔‍♂️',
  '👴',
];

export const ProfileSetupPage: React.FC = () => {
  const { theme } = useTheme();
  const { completeProfileSetup, firebaseUser, isLoading, error } = useAuth();

  const [name, setName] = useState(firebaseUser?.displayName || '');
  const [avatar, setAvatar] = useState('👨');
  const [dadSince, setDadSince] = useState('');
  const [kids, setKids] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await completeProfileSetup({
        name,
        avatar,
        dadSince,
        kids,
      });
    } catch {
      // Error handled in context
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

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
      <Card variant="default" padding="large" style={{ maxWidth: '450px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: 800,
              color: theme.colors.text.primary,
            }}
          >
            Welcome to DadHub!
          </h1>
          <p
            style={{
              margin: 0,
              color: theme.colors.text.secondary,
              fontSize: '14px',
            }}
          >
            Let's set up your dad profile
          </p>
        </div>

        {error && (
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
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              What's your name?
            </label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Pick your avatar
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '8px',
              }}
            >
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  style={{
                    padding: '12px',
                    fontSize: '24px',
                    background:
                      avatar === emoji
                        ? `rgba(217, 119, 6, 0.2)`
                        : theme.colors.background.secondary,
                    border:
                      avatar === emoji
                        ? '2px solid rgba(217, 119, 6, 0.6)'
                        : `1px solid ${theme.colors.border}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Dad since
            </label>
            <select
              value={dadSince}
              onChange={(e) => setDadSince(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: theme.colors.input,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '16px',
                color: theme.colors.text.primary,
                fontSize: '15px',
              }}
            >
              <option value="">Select year</option>
              {yearOptions.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              How many kids?
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setKids(Math.max(1, kids - 1))}
                disabled={kids <= 1 || isLoading}
              >
                -
              </Button>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: 700,
                  minWidth: '40px',
                  textAlign: 'center',
                }}
              >
                {kids}
              </span>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setKids(kids + 1)}
                disabled={isLoading}
              >
                +
              </Button>
            </div>
          </div>

          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Setting up...' : 'Complete Setup'}
          </Button>
        </form>
      </Card>
    </div>
  );
};
