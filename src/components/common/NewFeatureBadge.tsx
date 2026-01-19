import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useOnboarding } from '../../context/OnboardingContext';

interface NewFeatureBadgeProps {
  featureId: string;
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'small' | 'medium';
  showDot?: boolean;
}

export const NewFeatureBadge: React.FC<NewFeatureBadgeProps> = ({
  featureId,
  children,
  position = 'top-right',
  size = 'small',
  showDot = false,
}) => {
  const { theme } = useTheme();
  const { hasSeenFeature, markFeatureSeen } = useOnboarding();
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const seen = hasSeenFeature(featureId);
    setIsNew(!seen);
  }, [featureId, hasSeenFeature]);

  const handleInteraction = () => {
    if (isNew) {
      markFeatureSeen(featureId);
      setIsNew(false);
    }
  };

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '-4px', right: '-4px' },
    'top-left': { top: '-4px', left: '-4px' },
    'bottom-right': { bottom: '-4px', right: '-4px' },
    'bottom-left': { bottom: '-4px', left: '-4px' },
  };

  const sizes = {
    small: { padding: '2px 6px', fontSize: '10px', dotSize: 8 },
    medium: { padding: '4px 8px', fontSize: '11px', dotSize: 10 },
  };

  const s = sizes[size];

  if (!isNew) {
    return <>{children}</>;
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onClick={handleInteraction}
      onMouseEnter={handleInteraction}
    >
      {children}
      {showDot ? (
        <div
          style={{
            position: 'absolute',
            ...positionStyles[position],
            width: s.dotSize,
            height: s.dotSize,
            borderRadius: '50%',
            background: theme.colors.accent.primary,
            boxShadow: `0 0 8px ${theme.colors.accent.primary}`,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            ...positionStyles[position],
            padding: s.padding,
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
            color: '#fff',
            fontSize: s.fontSize,
            fontWeight: 700,
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: `0 2px 8px ${theme.colors.accent.primary}50`,
            animation: 'popIn 0.3s ease-out, glow 2s ease-in-out infinite',
            whiteSpace: 'nowrap',
          }}
        >
          New
        </div>
      )}
    </div>
  );
};

// Pulsing notification dot
export const NotificationDot: React.FC<{
  count?: number;
  position?: 'top-right' | 'top-left';
  style?: React.CSSProperties;
}> = ({ count, position = 'top-right', style }) => {
  const { theme } = useTheme();

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-right': { top: '-2px', right: '-2px' },
    'top-left': { top: '-2px', left: '-2px' },
  };

  if (count !== undefined && count <= 0) return null;

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles[position],
        minWidth: count ? '18px' : '10px',
        height: count ? '18px' : '10px',
        padding: count ? '0 5px' : 0,
        background: theme.colors.error,
        borderRadius: '9px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        color: '#fff',
        boxShadow: `0 0 8px ${theme.colors.error}`,
        animation: 'pulse 2s ease-in-out infinite',
        ...style,
      }}
    >
      {count && count > 0 ? (count > 99 ? '99+' : count) : null}
    </div>
  );
};

// Shimmer highlight for new features
export const ShimmerHighlight: React.FC<{
  children: React.ReactNode;
  active?: boolean;
}> = ({ children, active = true }) => {
  const { theme } = useTheme();

  if (!active) return <>{children}</>;

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, transparent 0%, ${theme.colors.accent.primary}20 50%, transparent 100%)`,
          animation: 'shimmer 2s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
