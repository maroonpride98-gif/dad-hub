import { useState } from 'react';
import { PanicModal } from './PanicModal';
import { haptics } from '../../utils/haptics';

interface PanicButtonProps {
  position?: 'bottom-right' | 'bottom-left';
}

export const PanicButton: React.FC<PanicButtonProps> = ({ position = 'bottom-right' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = () => {
    haptics.medium();
    setIsModalOpen(true);
  };

  const positionStyles =
    position === 'bottom-right'
      ? { right: '20px', bottom: '90px' }
      : { left: '20px', bottom: '90px' };

  return (
    <>
      <button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
        style={{
          position: 'fixed',
          ...positionStyles,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          boxShadow: isPressed
            ? '0 2px 8px rgba(239, 68, 68, 0.4)'
            : '0 4px 16px rgba(239, 68, 68, 0.4)',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          animation: 'pulse-shadow 2s infinite',
        }}
        aria-label="Panic Button - Get quick parenting help"
      >
        🆘
      </button>

      <PanicModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <style>
        {`
          @keyframes pulse-shadow {
            0%, 100% {
              box-shadow: 0 4px 16px rgba(239, 68, 68, 0.4);
            }
            50% {
              box-shadow: 0 4px 24px rgba(239, 68, 68, 0.6);
            }
          }
        `}
      </style>
    </>
  );
};

export default PanicButton;
