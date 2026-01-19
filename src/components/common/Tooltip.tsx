import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface TooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Calculate position
  useEffect(() => {
    if (!isVisible || !triggerRef.current || !tooltipRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = trigger.top - tooltip.height - gap;
        left = trigger.left + (trigger.width - tooltip.width) / 2;
        break;
      case 'bottom':
        top = trigger.bottom + gap;
        left = trigger.left + (trigger.width - tooltip.width) / 2;
        break;
      case 'left':
        top = trigger.top + (trigger.height - tooltip.height) / 2;
        left = trigger.left - tooltip.width - gap;
        break;
      case 'right':
        top = trigger.top + (trigger.height - tooltip.height) / 2;
        left = trigger.right + gap;
        break;
    }

    // Keep within viewport
    const padding = 8;
    top = Math.max(padding, Math.min(top, window.innerHeight - tooltip.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltip.width - padding));

    setTooltipStyle({
      position: 'fixed',
      top,
      left,
    });
  }, [isVisible, position]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onTouchStart={showTooltip}
      onTouchEnd={hideTooltip}
      style={{ display: 'inline-block' }}
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          style={{
            ...tooltipStyle,
            zIndex: 1100,
            padding: '8px 12px',
            background: theme.colors.background.tertiary,
            color: theme.colors.text.primary,
            fontSize: '12px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            maxWidth: '200px',
            animation: 'fadeIn 0.2s ease-out',
            pointerEvents: 'none',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

// Feature hint tooltip that appears once
interface FeatureHintProps {
  id: string;
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onDismiss?: () => void;
}

export const FeatureHint: React.FC<FeatureHintProps> = ({
  id,
  content,
  children,
  position = 'bottom',
  onDismiss,
}) => {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hintStyle, setHintStyle] = useState<React.CSSProperties>({});
  const triggerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem(`hint-${id}`);
    if (!dismissed) {
      // Show hint after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [id]);

  useEffect(() => {
    if (!isVisible || !triggerRef.current || !hintRef.current) return;

    const trigger = triggerRef.current.getBoundingClientRect();
    const hint = hintRef.current.getBoundingClientRect();
    const gap = 12;

    let top = 0;
    let left = 0;

    switch (position) {
      case 'top':
        top = trigger.top - hint.height - gap;
        left = trigger.left + (trigger.width - hint.width) / 2;
        break;
      case 'bottom':
        top = trigger.bottom + gap;
        left = trigger.left + (trigger.width - hint.width) / 2;
        break;
      case 'left':
        top = trigger.top + (trigger.height - hint.height) / 2;
        left = trigger.left - hint.width - gap;
        break;
      case 'right':
        top = trigger.top + (trigger.height - hint.height) / 2;
        left = trigger.right + gap;
        break;
    }

    // Keep within viewport
    const padding = 8;
    top = Math.max(padding, Math.min(top, window.innerHeight - hint.height - padding));
    left = Math.max(padding, Math.min(left, window.innerWidth - hint.width - padding));

    setHintStyle({
      position: 'fixed',
      top,
      left,
    });
  }, [isVisible, position]);

  const dismiss = () => {
    localStorage.setItem(`hint-${id}`, 'true');
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div ref={triggerRef} style={{ display: 'inline-block' }}>
      {children}
      {isVisible && (
        <div
          ref={hintRef}
          style={{
            ...hintStyle,
            zIndex: 1100,
            padding: '12px 16px',
            background: theme.colors.accent.primary,
            color: '#fff',
            fontSize: '13px',
            borderRadius: '10px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            maxWidth: '220px',
            animation: 'scaleIn 0.3s ease-out',
          }}
        >
          <div style={{ marginBottom: '8px' }}>{content}</div>
          <button
            onClick={dismiss}
            style={{
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Got it!
          </button>
          {/* Arrow */}
          <div
            style={{
              position: 'absolute',
              width: '12px',
              height: '12px',
              background: theme.colors.accent.primary,
              transform: 'rotate(45deg)',
              ...(position === 'bottom' && {
                top: '-6px',
                left: '50%',
                marginLeft: '-6px',
              }),
              ...(position === 'top' && {
                bottom: '-6px',
                left: '50%',
                marginLeft: '-6px',
              }),
              ...(position === 'left' && {
                right: '-6px',
                top: '50%',
                marginTop: '-6px',
              }),
              ...(position === 'right' && {
                left: '-6px',
                top: '50%',
                marginTop: '-6px',
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};
