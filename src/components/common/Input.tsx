import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: string;
}

export const Input: React.FC<InputProps> = ({ icon, style, ...props }) => {
  const { theme } = useTheme();

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      {icon && (
        <span
          style={{
            position: 'absolute',
            left: '16px',
            fontSize: '16px',
            pointerEvents: 'none',
          }}
        >
          {icon}
        </span>
      )}
      <input
        style={{
          width: '100%',
          padding: icon ? '14px 20px 14px 48px' : '14px 20px',
          background: theme.colors.input,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: '16px',
          color: theme.colors.text.primary,
          fontSize: '15px',
          outline: 'none',
          transition: 'border-color 0.2s ease',
          ...style,
        }}
        {...props}
      />
    </div>
  );
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const TextArea: React.FC<TextAreaProps> = ({ style, ...props }) => {
  const { theme } = useTheme();

  return (
    <textarea
      style={{
        width: '100%',
        minHeight: '100px',
        padding: '14px',
        background: `rgba(${theme.mode === 'dark' ? '28, 25, 23' : '231, 229, 228'}, 0.6)`,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: '12px',
        color: theme.colors.text.primary,
        fontSize: '15px',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit',
        ...style,
      }}
      {...props}
    />
  );
};
