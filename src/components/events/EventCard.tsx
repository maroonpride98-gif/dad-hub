import React from 'react';
import { DadEvent } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../common';

interface EventCardProps {
  event: DadEvent;
  isFirst?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isFirst = false }) => {
  const { theme, mode } = useTheme();
  const { toggleEventAttendance } = useApp();

  const [month, day] = event.date.split(' ');

  return (
    <Card hover>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          style={{
            width: '70px',
            height: '70px',
            background:
              isFirst && event.isAttending
                ? `linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.1))`
                : `rgba(${mode === 'dark' ? '28, 25, 23' : '231, 229, 228'}, 0.6)`,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border:
              isFirst && event.isAttending
                ? '1px solid rgba(34, 197, 94, 0.3)'
                : `1px solid ${theme.colors.border}`,
          }}
        >
          <span
            style={{
              fontSize: '11px',
              color: isFirst && event.isAttending ? theme.colors.success : theme.colors.text.muted,
              fontWeight: 700,
            }}
          >
            {month.toUpperCase()}
          </span>
          <span style={{ fontSize: '26px', fontWeight: 800 }}>{day}</span>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '17px', fontWeight: 700 }}>
            {event.emoji} {event.title}
          </h4>
          <p
            style={{
              margin: '0 0 4px 0',
              color: theme.colors.text.secondary,
              fontSize: '14px',
            }}
          >
            {event.time} • {event.location}
          </p>
          <p
            style={{
              margin: 0,
              color: event.isAttending ? theme.colors.success : theme.colors.accent.secondary,
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {event.attendees} dads attending
          </p>
        </div>
        <Button
          variant={event.isAttending ? 'success' : 'secondary'}
          size="small"
          onClick={() => toggleEventAttendance(event.id)}
        >
          {event.isAttending ? '✓ Going' : 'Join'}
        </Button>
      </div>
    </Card>
  );
};
