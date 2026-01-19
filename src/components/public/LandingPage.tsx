import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const { theme, mode } = useTheme();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      emoji: '🏠',
      title: 'Home Feed',
      description: 'Share moments, get support, and connect with fellow dads',
      color: '#3b82f6',
    },
    {
      emoji: '😂',
      title: 'Dad Jokes',
      description: 'The best (worst) dad jokes, rated by actual dads',
      color: '#f59e0b',
    },
    {
      emoji: '🧔',
      title: 'Dad Wisdom AI',
      description: 'Get parenting advice from our AI dad friend',
      color: '#8b5cf6',
    },
    {
      emoji: '🏆',
      title: 'Gamification',
      description: 'Earn XP, unlock badges, and climb the leaderboard',
      color: '#10b981',
    },
    {
      emoji: '👥',
      title: 'Dad Groups',
      description: 'Join Grill Masters, Coach Dads, Tech Dads & more',
      color: '#ef4444',
    },
    {
      emoji: '📖',
      title: 'Stories',
      description: 'Share quick moments that last 24 hours',
      color: '#ec4899',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Active Dads' },
    { value: '50K+', label: 'Dad Jokes' },
    { value: '100K+', label: 'Posts Shared' },
    { value: '4.9', label: 'App Rating' },
  ];

  const testimonials = [
    {
      name: 'Mike T.',
      avatar: '👨‍🦰',
      text: "Finally, a social app that gets dad life. The jokes alone are worth it!",
      role: 'Dad of 3',
    },
    {
      name: 'James R.',
      avatar: '👨‍🦱',
      text: "The Dad Wisdom AI helped me navigate my teenager's first breakup. Lifesaver!",
      role: 'Dad of 2',
    },
    {
      name: 'Carlos M.',
      avatar: '👨',
      text: "Love competing on the leaderboard. My kids think I'm cool now (I'm not).",
      role: 'Dad of 4',
    },
  ];

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: mode === 'dark'
          ? 'linear-gradient(180deg, #1c1917 0%, #292524 50%, #1c1917 100%)'
          : 'linear-gradient(180deg, #fffbeb 0%, #fef3c7 50%, #fffbeb 100%)',
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: theme.colors.text.primary,
        overflow: 'hidden',
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: `${theme.colors.background.primary}ee`,
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>👨‍👧‍👦</span>
          <span style={{ fontSize: '20px', fontWeight: 700 }}>DadHub</span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onLogin}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '10px',
              color: theme.colors.text.primary,
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Log In
          </button>
          <button
            onClick={onGetStarted}
            style={{
              padding: '10px 20px',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Join Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '300px',
            height: '300px',
            background: `radial-gradient(circle, ${theme.colors.accent.primary}20 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            right: '5%',
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${theme.colors.accent.secondary}15 0%, transparent 70%)`,
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite reverse',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: `${theme.colors.accent.primary}15`,
              borderRadius: '20px',
              marginBottom: '24px',
              border: `1px solid ${theme.colors.accent.primary}30`,
            }}
          >
            <span>🎉</span>
            <span style={{ fontSize: '14px', fontWeight: 500, color: theme.colors.accent.primary }}>
              Join 10,000+ dads already on the platform
            </span>
          </div>

          {/* Main heading */}
          <h1
            style={{
              fontSize: 'clamp(36px, 8vw, 64px)',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '0 0 24px 0',
            }}
          >
            The Brotherhood of{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Fatherhood
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(16px, 3vw, 20px)',
              color: theme.colors.text.secondary,
              maxWidth: '600px',
              margin: '0 auto 32px auto',
              lineHeight: 1.6,
            }}
          >
            Connect with fellow dads, share dad jokes, get parenting advice,
            and level up your dad game. Because being a dad is the most
            rewarding challenge there is.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={onGetStarted}
              style={{
                padding: '16px 32px',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                border: 'none',
                borderRadius: '14px',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: `0 4px 20px ${theme.colors.accent.primary}40`,
              }}
            >
              <span>Get Started - It's Free</span>
              <span>→</span>
            </button>

            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                padding: '16px 32px',
                background: theme.colors.card,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: '14px',
                color: theme.colors.text.primary,
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              See Features
            </button>
          </div>
        </div>

        {/* App Preview */}
        <div
          style={{
            marginTop: '60px',
            padding: '0 24px',
          }}
        >
          <div
            style={{
              maxWidth: '350px',
              margin: '0 auto',
              background: theme.colors.card,
              borderRadius: '24px',
              padding: '12px',
              boxShadow: theme.shadows.large,
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            {/* Mock phone screen */}
            <div
              style={{
                background: theme.colors.background.primary,
                borderRadius: '16px',
                height: '500px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Mock header */}
              <div
                style={{
                  padding: '16px',
                  borderBottom: `1px solid ${theme.colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '24px' }}>👨‍👧‍👦</span>
                <span style={{ fontWeight: 700 }}>DadHub</span>
              </div>

              {/* Feature showcase */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '20px',
                    background: `${features[currentFeature].color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    marginBottom: '16px',
                    animation: 'popIn 0.5s ease-out',
                  }}
                  key={currentFeature}
                >
                  {features[currentFeature].emoji}
                </div>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '20px',
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                  }}
                >
                  {features[currentFeature].title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: theme.colors.text.secondary,
                  }}
                >
                  {features[currentFeature].description}
                </p>
              </div>

              {/* Feature dots */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  paddingBottom: '20px',
                }}
              >
                {features.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFeature(index)}
                    style={{
                      width: index === currentFeature ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      border: 'none',
                      background: index === currentFeature
                        ? theme.colors.accent.primary
                        : theme.colors.border,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: '60px 24px',
          background: theme.colors.card,
        }}
      >
        <div
          style={{
            maxWidth: '900px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '32px',
          }}
        >
          {stats.map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: 'clamp(32px, 6vw, 48px)',
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 800,
              margin: '0 0 16px 0',
            }}
          >
            Everything a Dad Needs
          </h2>
          <p
            style={{
              textAlign: 'center',
              fontSize: '16px',
              color: theme.colors.text.secondary,
              maxWidth: '500px',
              margin: '0 auto 48px auto',
            }}
          >
            Built by dads, for dads. Every feature designed to make your dad life better.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  background: theme.colors.card,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${theme.colors.border}`,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = theme.shadows.large;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '14px',
                    background: `${feature.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    marginBottom: '16px',
                  }}
                >
                  {feature.emoji}
                </div>
                <h3
                  style={{
                    margin: '0 0 8px 0',
                    fontSize: '18px',
                    fontWeight: 700,
                    color: theme.colors.text.primary,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: theme.colors.text.secondary,
                    lineHeight: 1.5,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '80px 24px', background: theme.colors.card }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 800,
              margin: '0 0 48px 0',
            }}
          >
            What Dads Are Saying
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                style={{
                  background: theme.colors.background.primary,
                  borderRadius: '16px',
                  padding: '24px',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <p
                  style={{
                    margin: '0 0 16px 0',
                    fontSize: '15px',
                    color: theme.colors.text.primary,
                    lineHeight: 1.6,
                    fontStyle: 'italic',
                  }}
                >
                  "{testimonial.text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: theme.colors.text.primary }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: '13px', color: theme.colors.text.muted }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>👨‍👧‍👦</div>
          <h2
            style={{
              fontSize: 'clamp(28px, 5vw, 40px)',
              fontWeight: 800,
              margin: '0 0 16px 0',
            }}
          >
            Ready to Join the Brotherhood?
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: theme.colors.text.secondary,
              margin: '0 0 32px 0',
            }}
          >
            It's free, it's fun, and it's full of dad jokes. What more could you ask for?
          </p>
          <button
            onClick={onGetStarted}
            style={{
              padding: '18px 40px',
              background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: `0 4px 20px ${theme.colors.accent.primary}40`,
            }}
          >
            Join Dad Hub Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '40px 24px',
          background: theme.colors.background.secondary,
          borderTop: `1px solid ${theme.colors.border}`,
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
          <span style={{ fontSize: '24px' }}>👨‍👧‍👦</span>
          <span style={{ fontSize: '18px', fontWeight: 700 }}>DadHub</span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.muted }}>
          © {new Date().getFullYear()} DadHub. Made with ❤️ by dads, for dads.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
