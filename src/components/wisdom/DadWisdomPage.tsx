import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { WisdomChat } from './WisdomChat';
import { WisdomPrompts } from './WisdomPrompts';
import { Card } from '../common';
import { WisdomCategory } from '../../types/wisdom';

export const DadWisdomPage: React.FC = () => {
  const { theme } = useTheme();
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WisdomCategory | null>(null);

  const handlePromptSelect = (_prompt: string) => {
    setShowChat(true);
  };

  if (showChat) {
    return (
      <div style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <WisdomChat onClose={() => setShowChat(false)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 800,
            color: theme.colors.text.primary,
          }}
        >
          Dad Wisdom AI
        </h2>
        <p
          style={{
            margin: '4px 0 0 0',
            fontSize: '14px',
            color: theme.colors.text.secondary,
          }}
        >
          Your AI-powered dad advice companion
        </p>
      </div>

      {/* Hero Card */}
      <Card
        style={{
          background: `linear-gradient(135deg, ${theme.colors.accent.primary}15 0%, ${theme.colors.accent.secondary}15 100%)`,
          border: `1px solid ${theme.colors.accent.primary}30`,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            🧔
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              Need some dad advice?
            </h3>
            <p
              style={{
                margin: '8px 0 0 0',
                fontSize: '14px',
                color: theme.colors.text.secondary,
                maxWidth: '400px',
              }}
            >
              Dad Wisdom AI is here to help with parenting questions, work-life balance, dad jokes, and everything in between.
            </p>
          </div>
          <button
            onClick={() => setShowChat(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: theme.colors.accent.gradient,
              color: theme.colors.background.primary,
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>💬</span>
            <span>Start Chatting</span>
          </button>
        </div>
      </Card>

      {/* Features */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
        }}
      >
        {[
          { icon: '👶', label: 'Parenting Tips' },
          { icon: '⚖️', label: 'Work-Life Balance' },
          { icon: '❤️', label: 'Relationship Advice' },
          { icon: '😂', label: 'Dad Humor' },
        ].map(feature => (
          <Card key={feature.label} padding="small">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '8px',
              }}
            >
              <span style={{ fontSize: '28px' }}>{feature.icon}</span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: theme.colors.text.secondary,
                }}
              >
                {feature.label}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Prompts */}
      <div>
        <h3
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: 700,
            color: theme.colors.text.primary,
          }}
        >
          Quick Questions
        </h3>
        <WisdomPrompts
          onSelectPrompt={handlePromptSelect}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Disclaimer */}
      <Card padding="small">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '20px' }}>ℹ️</span>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: theme.colors.text.muted,
                lineHeight: 1.5,
              }}
            >
              Dad Wisdom AI is designed for general advice and entertainment. For serious concerns about your child's health, development, or safety, please consult qualified professionals.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
