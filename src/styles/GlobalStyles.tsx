import React from 'react';
import { Theme } from './theme';
import { keyframes } from './animations';

interface GlobalStylesProps {
  theme: Theme;
}

export const GlobalStyles: React.FC<GlobalStylesProps> = ({ theme }) => {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Playfair+Display:wght@700;800&display=swap');

      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: 'Outfit', system-ui, sans-serif;
        background: ${theme.colors.background.gradient};
        color: ${theme.colors.text.primary};
        min-height: 100vh;
        transition: background 0.3s ease, color 0.3s ease;
      }

      ::-webkit-scrollbar {
        width: 6px;
      }

      ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }

      ::-webkit-scrollbar-thumb {
        background: ${theme.colors.text.muted};
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${theme.colors.text.secondary};
      }

      input, textarea, select, button {
        font-family: inherit;
      }

      input::placeholder,
      textarea::placeholder {
        color: ${theme.colors.text.muted};
      }

      .card-hover {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .card-hover:hover {
        transform: translateY(-4px);
        box-shadow: ${theme.shadows.large};
      }

      .message-bubble {
        animation: slideUp 0.3s ease-out;
      }

      .notification-enter {
        animation: slideIn 0.3s ease-out;
      }

      .fade-in {
        animation: fadeIn 0.3s ease-out;
      }

      .notification-bell-ring {
        animation: ring 1s ease-in-out;
      }

      ${keyframes}
    `}</style>
  );
};
