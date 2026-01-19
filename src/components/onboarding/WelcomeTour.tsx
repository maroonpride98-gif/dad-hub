import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useOnboarding } from '../../context/OnboardingContext';
import { haptics } from '../../utils/haptics';

interface SpotlightPosition {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const WelcomeTour: React.FC = () => {
  const { theme } = useTheme();
  const {
    isTourActive,
    currentTourStep,
    tourSteps,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
  } = useOnboarding();
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const currentStep = tourSteps[currentTourStep];
  const isFirstStep = currentTourStep === 0;
  const isLastStep = currentTourStep === tourSteps.length - 1;
  const progress = ((currentTourStep + 1) / tourSteps.length) * 100;

  // Find and position spotlight on target element
  useEffect(() => {
    if (!isTourActive || !currentStep?.targetSelector) {
      setSpotlightPosition(null);
      return;
    }

    const targetElement = document.querySelector(currentStep.targetSelector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const padding = 8;
      setSpotlightPosition({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });
    } else {
      setSpotlightPosition(null);
    }
  }, [isTourActive, currentStep]);

  // Position card based on spotlight
  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const cardRect = card.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    // Center by default
    let top = (windowHeight - cardRect.height) / 2;
    let left = (windowWidth - cardRect.width) / 2;

    if (spotlightPosition) {
      const position = currentStep?.position || 'bottom';
      const gap = 16;

      switch (position) {
        case 'top':
          top = spotlightPosition.top - cardRect.height - gap;
          left = spotlightPosition.left + (spotlightPosition.width - cardRect.width) / 2;
          break;
        case 'bottom':
          top = spotlightPosition.top + spotlightPosition.height + gap;
          left = spotlightPosition.left + (spotlightPosition.width - cardRect.width) / 2;
          break;
        case 'left':
          top = spotlightPosition.top + (spotlightPosition.height - cardRect.height) / 2;
          left = spotlightPosition.left - cardRect.width - gap;
          break;
        case 'right':
          top = spotlightPosition.top + (spotlightPosition.height - cardRect.height) / 2;
          left = spotlightPosition.left + spotlightPosition.width + gap;
          break;
      }

      // Keep within viewport
      top = Math.max(16, Math.min(top, windowHeight - cardRect.height - 16));
      left = Math.max(16, Math.min(left, windowWidth - cardRect.width - 16));
    }

    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
  }, [spotlightPosition, currentStep]);

  const handleNext = () => {
    haptics.light();
    nextStep();
  };

  const handlePrev = () => {
    haptics.light();
    prevStep();
  };

  const handleSkip = () => {
    haptics.medium();
    skipTour();
  };

  const handleComplete = () => {
    haptics.success();
    completeTour();
  };

  if (!isTourActive) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      {/* Backdrop with spotlight cutout */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {spotlightPosition && (
              <rect
                x={spotlightPosition.left}
                y={spotlightPosition.top}
                width={spotlightPosition.width}
                height={spotlightPosition.height}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.75)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border glow */}
      {spotlightPosition && (
        <div
          style={{
            position: 'absolute',
            top: spotlightPosition.top,
            left: spotlightPosition.left,
            width: spotlightPosition.width,
            height: spotlightPosition.height,
            borderRadius: '8px',
            boxShadow: `0 0 0 4px ${theme.colors.accent.primary}, 0 0 20px ${theme.colors.accent.primary}`,
            pointerEvents: 'none',
            animation: 'glow 2s ease-in-out infinite',
          }}
        />
      )}

      {/* Tour Card */}
      <div
        ref={cardRef}
        style={{
          position: 'absolute',
          width: '320px',
          maxWidth: 'calc(100vw - 32px)',
          background: theme.colors.background.primary,
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        {/* Progress Bar */}
        <div
          style={{
            height: '4px',
            background: theme.colors.background.tertiary,
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
              transition: 'width 0.3s ease-out',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {/* Emoji */}
          <div
            style={{
              fontSize: '48px',
              textAlign: 'center',
              marginBottom: '16px',
              animation: 'popIn 0.5s ease-out',
            }}
          >
            {currentStep.emoji}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '20px',
              fontWeight: 700,
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: '8px',
            }}
          >
            {currentStep.title}
          </h2>

          {/* Description */}
          <p
            style={{
              fontSize: '14px',
              color: theme.colors.text.secondary,
              textAlign: 'center',
              lineHeight: 1.6,
              marginBottom: '24px',
            }}
          >
            {currentStep.description}
          </p>

          {/* Step Indicator */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              marginBottom: '20px',
            }}
          >
            {tourSteps.map((_, index) => (
              <div
                key={index}
                style={{
                  width: index === currentTourStep ? '20px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background:
                    index === currentTourStep
                      ? theme.colors.accent.primary
                      : index < currentTourStep
                        ? theme.colors.accent.secondary
                        : theme.colors.background.tertiary,
                  transition: 'all 0.3s ease-out',
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
            }}
          >
            {!isFirstStep && (
              <button
                onClick={handlePrev}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  border: `1px solid ${theme.colors.border}`,
                  background: 'transparent',
                  color: theme.colors.text.secondary,
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={isLastStep ? handleComplete : handleNext}
              style={{
                flex: isFirstStep ? 1 : 2,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                color: '#fff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isLastStep ? "Let's Go!" : 'Next'}
            </button>
          </div>

          {/* Skip Button */}
          {!isLastStep && (
            <button
              onClick={handleSkip}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: theme.colors.text.muted,
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Skip Tour
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
