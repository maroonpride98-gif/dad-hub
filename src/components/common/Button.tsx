import React, { ButtonHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  style,
  ...props
}) => {
  const { theme } = useTheme();

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.accent.gradient,
          color: theme.colors.background.primary,
          border: 'none',
          fontWeight: 700,
        };
      case 'secondary':
        return {
          background: theme.colors.card,
          color: theme.colors.text.primary,
          border: `1px solid ${theme.colors.border}`,
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: theme.colors.accent.secondary,
          border: 'none',
        };
      case 'success':
        return {
          background: `rgba(34, 197, 94, ${theme.mode === 'dark' ? 0.2 : 0.15})`,
          color: theme.colors.success,
          border: `1px solid rgba(34, 197, 94, 0.3)`,
        };
      case 'danger':
        return {
          background: `rgba(239, 68, 68, ${theme.mode === 'dark' ? 0.2 : 0.15})`,
          color: theme.colors.error,
          border: `1px solid rgba(239, 68, 68, 0.3)`,
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '13px',
          borderRadius: '10px',
        };
      case 'medium':
        return {
          padding: '10px 20px',
          fontSize: '14px',
          borderRadius: '12px',
        };
      case 'large':
        return {
          padding: '14px 28px',
          fontSize: '16px',
          borderRadius: '16px',
        };
    }
  };

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        transition: 'all 0.3s ease',
        width: fullWidth ? '100%' : 'auto',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};
