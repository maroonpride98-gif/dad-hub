import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Card, Button } from '../common';

interface SpinWheelProps {
  onClose: () => void;
}

const PRIZES = [
  { label: '10', points: 10, color: '#ef4444', probability: 0.25 },
  { label: '25', points: 25, color: '#f97316', probability: 0.20 },
  { label: '50', points: 50, color: '#eab308', probability: 0.18 },
  { label: '75', points: 75, color: '#22c55e', probability: 0.15 },
  { label: '100', points: 100, color: '#3b82f6', probability: 0.12 },
  { label: '150', points: 150, color: '#8b5cf6', probability: 0.07 },
  { label: '250', points: 250, color: '#ec4899', probability: 0.025 },
  { label: '500', points: 500, color: '#f59e0b', probability: 0.005 },
];

const SEGMENT_ANGLE = 360 / PRIZES.length;

export const DailySpinWheel: React.FC<SpinWheelProps> = ({ onClose }) => {
  const { theme, mode } = useTheme();
  const { user, updateProfile } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [hasSpunToday, setHasSpunToday] = useState(false);
  const [wonPrize, setWonPrize] = useState<typeof PRIZES[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkIfSpunToday();
  }, []);

  const checkIfSpunToday = async () => {
    if (!user) return;
    try {
      const spinDoc = await getDoc(doc(db, 'dailySpins', user.uid));
      if (spinDoc.exists()) {
        const lastSpin = spinDoc.data().lastSpin?.toDate();
        const today = new Date();
        if (lastSpin &&
            lastSpin.getDate() === today.getDate() &&
            lastSpin.getMonth() === today.getMonth() &&
            lastSpin.getFullYear() === today.getFullYear()) {
          setHasSpunToday(true);
        }
      }
    } catch (error) {
      console.error('Error checking spin status:', error);
    }
    setLoading(false);
  };

  const selectPrize = (): typeof PRIZES[0] => {
    const random = Math.random();
    let cumulative = 0;
    for (const prize of PRIZES) {
      cumulative += prize.probability;
      if (random <= cumulative) return prize;
    }
    return PRIZES[0];
  };

  const handleSpin = async () => {
    if (isSpinning || hasSpunToday || !user) return;

    setIsSpinning(true);
    setWonPrize(null);

    const prize = selectPrize();
    const prizeIndex = PRIZES.indexOf(prize);

    // Calculate rotation: multiple full spins + land on prize
    const spins = 5 + Math.random() * 3;
    const targetAngle = 360 - (prizeIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2);
    const totalRotation = spins * 360 + targetAngle;

    setRotation(totalRotation);

    // Wait for spin animation
    setTimeout(async () => {
      setWonPrize(prize);
      setIsSpinning(false);
      setHasSpunToday(true);

      // Save spin and award points
      try {
        await setDoc(doc(db, 'dailySpins', user.uid), {
          lastSpin: new Date(),
          lastPrize: prize.points,
        });

        await updateDoc(doc(db, 'users', user.uid), {
          points: increment(prize.points),
        });

        // Update local user state
        await updateProfile({ points: (user.points || 0) + prize.points });
      } catch (error) {
        console.error('Error saving spin:', error);
      }
    }, 4000);
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
      }}>
        <p style={{ color: '#fff' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
    }}>
      <Card style={{
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        padding: '24px',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: theme.colors.text.muted,
          }}
        >
          ×
        </button>

        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px' }}>🎰 Daily Spin</h2>
        <p style={{ margin: '0 0 24px 0', color: theme.colors.text.muted }}>
          Spin once per day to win bonus points!
        </p>

        {/* Wheel */}
        <div style={{ position: 'relative', width: '280px', height: '280px', margin: '0 auto 24px' }}>
          {/* Pointer */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            fontSize: '32px',
          }}>
            ▼
          </div>

          {/* Wheel SVG */}
          <svg
            width="280"
            height="280"
            viewBox="0 0 280 280"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
            }}
          >
            {PRIZES.map((prize, i) => {
              const startAngle = i * SEGMENT_ANGLE - 90;
              const endAngle = startAngle + SEGMENT_ANGLE;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const x1 = 140 + 130 * Math.cos(startRad);
              const y1 = 140 + 130 * Math.sin(startRad);
              const x2 = 140 + 130 * Math.cos(endRad);
              const y2 = 140 + 130 * Math.sin(endRad);
              const largeArc = SEGMENT_ANGLE > 180 ? 1 : 0;

              const labelAngle = startAngle + SEGMENT_ANGLE / 2;
              const labelRad = (labelAngle * Math.PI) / 180;
              const labelX = 140 + 85 * Math.cos(labelRad);
              const labelY = 140 + 85 * Math.sin(labelRad);

              return (
                <g key={i}>
                  <path
                    d={`M 140 140 L ${x1} ${y1} A 130 130 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={prize.color}
                    stroke={mode === 'dark' ? '#1c1917' : '#fff'}
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={labelY}
                    fill="#fff"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${labelAngle + 90}, ${labelX}, ${labelY})`}
                  >
                    {prize.label}
                  </text>
                </g>
              );
            })}
            <circle cx="140" cy="140" r="30" fill={mode === 'dark' ? '#292524' : '#fafaf9'} stroke={theme.colors.border} strokeWidth="3" />
            <text x="140" y="145" fill={theme.colors.text.primary} fontSize="12" fontWeight="bold" textAnchor="middle">
              SPIN
            </text>
          </svg>
        </div>

        {/* Result */}
        {wonPrize && (
          <div style={{
            padding: '16px',
            background: `linear-gradient(135deg, ${wonPrize.color}33, ${wonPrize.color}11)`,
            borderRadius: '12px',
            marginBottom: '16px',
          }}>
            <p style={{ margin: 0, fontSize: '18px' }}>
              🎉 You won <strong style={{ color: wonPrize.color }}>{wonPrize.points} points</strong>!
            </p>
          </div>
        )}

        {/* Spin Button */}
        {hasSpunToday && !wonPrize ? (
          <div style={{ padding: '16px', background: theme.colors.card, borderRadius: '12px' }}>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              ⏰ Come back tomorrow for another spin!
            </p>
          </div>
        ) : !wonPrize ? (
          <Button onClick={handleSpin} disabled={isSpinning} fullWidth size="large">
            {isSpinning ? '🎰 Spinning...' : '🎲 SPIN TO WIN!'}
          </Button>
        ) : (
          <Button onClick={onClose} fullWidth size="large">
            Awesome! Close
          </Button>
        )}
      </Card>
    </div>
  );
};
