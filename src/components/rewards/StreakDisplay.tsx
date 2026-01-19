import React, { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Card } from '../common';

export const StreakDisplay: React.FC = () => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [streakBonus, setStreakBonus] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      checkAndUpdateStreak();
    }
  }, [user]);

  const checkAndUpdateStreak = async () => {
    if (!user) return;

    try {
      const streakRef = doc(db, 'streaks', user.uid);
      const streakDoc = await getDoc(streakRef);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (streakDoc.exists()) {
        const data = streakDoc.data();
        const lastLogin = data.lastLogin?.toDate();
        lastLogin?.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let currentStreak = data.currentStreak || 0;
        let longest = data.longestStreak || 0;

        if (lastLogin?.getTime() === today.getTime()) {
          // Already logged in today
          setStreak(currentStreak);
          setLongestStreak(longest);
        } else if (lastLogin?.getTime() === yesterday.getTime()) {
          // Consecutive day - increase streak!
          currentStreak += 1;
          longest = Math.max(longest, currentStreak);

          // Calculate bonus points (10 per day, caps at 70)
          const bonus = Math.min(currentStreak * 10, 70);
          setStreakBonus(bonus);

          await updateDoc(streakRef, {
            currentStreak,
            longestStreak: longest,
            lastLogin: new Date(),
          });

          // Award bonus points
          await updateDoc(doc(db, 'users', user.uid), {
            points: increment(bonus),
          });

          await updateProfile({ points: (user.points || 0) + bonus });

          setStreak(currentStreak);
          setLongestStreak(longest);
        } else {
          // Streak broken - reset to 1
          currentStreak = 1;
          setStreakBonus(10);

          await updateDoc(streakRef, {
            currentStreak: 1,
            lastLogin: new Date(),
          });

          // Award day 1 bonus
          await updateDoc(doc(db, 'users', user.uid), {
            points: increment(10),
          });

          await updateProfile({ points: (user.points || 0) + 10 });

          setStreak(1);
          setLongestStreak(longest);
        }
      } else {
        // First time - start streak
        await setDoc(streakRef, {
          currentStreak: 1,
          longestStreak: 1,
          lastLogin: new Date(),
        });

        // Award day 1 bonus
        await updateDoc(doc(db, 'users', user.uid), {
          points: increment(10),
        });

        await updateProfile({ points: (user.points || 0) + 10 });

        setStreak(1);
        setLongestStreak(1);
        setStreakBonus(10);
      }
    } catch (error) {
      console.error('Error checking streak:', error);
    }
  };

  const getStreakEmoji = () => {
    if (streak >= 30) return '👑';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '✨';
    return '🌱';
  };

  const getStreakMessage = () => {
    if (streak >= 30) return 'Legendary!';
    if (streak >= 14) return 'On fire!';
    if (streak >= 7) return 'Great week!';
    if (streak >= 3) return 'Building momentum!';
    return 'Keep it up!';
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              background: streak >= 7
                ? 'linear-gradient(135deg, #f97316, #ef4444)'
                : 'linear-gradient(135deg, #d97706, #f59e0b)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
            }}
          >
            {getStreakEmoji()}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
              {streak} day{streak !== 1 ? 's' : ''}
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
              {getStreakMessage()}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
            Best streak
          </p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.accent.secondary }}>
            {longestStreak} days
          </p>
        </div>
      </div>

      {streakBonus && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px',
            background: 'rgba(34, 197, 94, 0.15)',
            borderRadius: '8px',
            textAlign: 'center',
          }}
        >
          <p style={{ margin: 0, color: theme.colors.success, fontWeight: 600 }}>
            🎁 +{streakBonus} streak bonus points!
          </p>
        </div>
      )}

      {/* Streak progress dots */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '6px' }}>
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: i < (streak % 7 || (streak >= 7 ? 7 : 0))
                ? 'linear-gradient(135deg, #f97316, #ef4444)'
                : theme.colors.border,
            }}
          />
        ))}
      </div>
      <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: theme.colors.text.muted, textAlign: 'center' }}>
        {7 - (streak % 7 || 7)} days until weekly bonus!
      </p>
    </Card>
  );
};
