import React, { useState, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { haptics } from '../../utils/haptics';

export interface Chore {
  id: string;
  name: string;
  emoji: string;
  color: string;
}

interface ChoreWheelProps {
  chores: Chore[];
  onResult: (chore: Chore) => void;
}

export const ChoreWheel: React.FC<ChoreWheelProps> = ({ chores, onResult }) => {
  const { theme } = useTheme();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const spin = () => {
    if (isSpinning || chores.length < 2) return;

    setIsSpinning(true);
    haptics.light();

    // Calculate spin
    const spinDuration = 4000;
    const minRotations = 5;
    const maxRotations = 8;
    const rotations = minRotations + Math.random() * (maxRotations - minRotations);
    const extraDegrees = Math.random() * 360;
    const totalRotation = rotations * 360 + extraDegrees;

    setRotation((prev) => prev + totalRotation);

    // Calculate which chore wins
    const segmentAngle = 360 / chores.length;
    const finalAngle = (rotation + totalRotation) % 360;
    const adjustedAngle = (360 - finalAngle + 90) % 360; // Adjust for pointer at top
    const winningIndex = Math.floor(adjustedAngle / segmentAngle) % chores.length;

    setTimeout(() => {
      setIsSpinning(false);
      haptics.success();
      onResult(chores[winningIndex]);
    }, spinDuration);
  };

  const segmentAngle = 360 / chores.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Pointer */}
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: `25px solid ${theme.colors.accent.primary}`,
          marginBottom: '-5px',
          zIndex: 10,
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      />

      {/* Wheel Container */}
      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
        }}
      >
        {/* Wheel */}
        <div
          ref={wheelRef}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 0 0 8px rgba(255,255,255,0.1)',
            position: 'relative',
          }}
        >
          {/* Segments */}
          {chores.map((chore, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const midAngle = startAngle + segmentAngle / 2;

            // Create conic gradient slice
            return (
              <div
                key={chore.id}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  top: 0,
                  left: 0,
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(((startAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((startAngle - 90) * Math.PI) / 180)}%, ${50 + 50 * Math.cos(((endAngle - 90) * Math.PI) / 180)}% ${50 + 50 * Math.sin(((endAngle - 90) * Math.PI) / 180)}%)`,
                  background: chore.color,
                }}
              >
                {/* Label */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${midAngle}deg) translateY(-70px)`,
                    transformOrigin: '0 0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      transform: `rotate(${-midAngle - rotation}deg)`,
                      transition: isSpinning ? 'none' : 'transform 0.3s',
                    }}
                  >
                    {chore.emoji}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Center circle */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: theme.colors.background.primary,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            🎯
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spin}
        disabled={isSpinning || chores.length < 2}
        style={{
          marginTop: '24px',
          padding: '16px 48px',
          borderRadius: '30px',
          border: 'none',
          background:
            isSpinning || chores.length < 2
              ? theme.colors.background.secondary
              : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
          color: isSpinning || chores.length < 2 ? theme.colors.text.muted : '#fff',
          fontSize: '18px',
          fontWeight: 700,
          cursor: isSpinning || chores.length < 2 ? 'not-allowed' : 'pointer',
          boxShadow: isSpinning ? 'none' : '0 4px 15px rgba(217, 119, 6, 0.4)',
          transform: isSpinning ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.3s',
        }}
      >
        {isSpinning ? '🎡 Spinning...' : '🎲 SPIN!'}
      </button>

      {chores.length < 2 && (
        <p style={{ marginTop: '12px', fontSize: '13px', color: theme.colors.text.muted }}>
          Add at least 2 chores to spin the wheel
        </p>
      )}
    </div>
  );
};

export default ChoreWheel;
