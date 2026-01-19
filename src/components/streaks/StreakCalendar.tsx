import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';
import { Card } from '../common';

interface StreakCalendarProps {
  weeks?: number;
}

export const StreakCalendar: React.FC<StreakCalendarProps> = ({ weeks = 12 }) => {
  const { theme } = useTheme();
  const { activityHistory, currentStreak, longestStreak, totalActiveDays } = useGamification();

  // Generate calendar data for the past N weeks
  const generateCalendarData = () => {
    const today = new Date();
    const days: { date: string; active: boolean; isToday: boolean; isFuture: boolean }[] = [];

    for (let i = weeks * 7 - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const isToday = i === 0;
      const isFuture = date > today;

      const activityDay = activityHistory.find(d => d.date === dateStr);

      days.push({
        date: dateStr,
        active: activityDay?.active || false,
        isToday,
        isFuture,
      });
    }

    return days;
  };

  const calendarData = generateCalendarData();

  // Group by weeks
  const weekGroups: typeof calendarData[] = [];
  for (let i = 0; i < calendarData.length; i += 7) {
    weekGroups.push(calendarData.slice(i, i + 7));
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              Activity Calendar
            </h3>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                color: theme.colors.text.muted,
              }}
            >
              Last {weeks} weeks
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: theme.colors.accent.primary,
                }}
              >
                🔥 {currentStreak}
              </div>
              <div style={{ fontSize: '11px', color: theme.colors.text.muted }}>
                Current
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: theme.colors.accent.secondary,
                }}
              >
                ⭐ {longestStreak}
              </div>
              <div style={{ fontSize: '11px', color: theme.colors.text.muted }}>
                Longest
              </div>
            </div>
          </div>
        </div>

        {/* Day Labels */}
        <div style={{ display: 'flex', gap: '4px', paddingLeft: '0' }}>
          {dayLabels.map((label, i) => (
            <div
              key={i}
              style={{
                width: '24px',
                textAlign: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: theme.colors.text.muted,
              }}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          {weekGroups.map((week, weekIndex) => (
            <div key={weekIndex} style={{ display: 'flex', gap: '4px' }}>
              {week.map((day, dayIndex) => {
                const getColor = () => {
                  if (day.isFuture) return theme.colors.border;
                  if (day.active) return theme.colors.accent.primary;
                  return `${theme.colors.border}`;
                };

                return (
                  <div
                    key={dayIndex}
                    title={`${day.date}${day.active ? ' - Active' : ''}`}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '4px',
                      background: getColor(),
                      opacity: day.isFuture ? 0.3 : day.active ? 1 : 0.4,
                      border: day.isToday
                        ? `2px solid ${theme.colors.accent.secondary}`
                        : 'none',
                      cursor: 'default',
                      transition: 'all 0.2s ease',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            fontSize: '11px',
            color: theme.colors.text.muted,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: theme.colors.border,
                opacity: 0.4,
              }}
            />
            <span>Inactive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '2px',
                background: theme.colors.accent.primary,
              }}
            />
            <span>Active</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            Total: {totalActiveDays} days
          </div>
        </div>
      </div>
    </Card>
  );
};
