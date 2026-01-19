import React from 'react';
import { DadEvent } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { Card, Button } from '../common';

interface UpcomingEventProps {
  event: DadEvent;
  onSeeAll: () => void;
}

export const UpcomingEvent: React.FC<UpcomingEventProps> = ({ event, onSeeAll }) => {
  const { theme } = useTheme();

  const [month, day] = event.date.split(' ');

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>📅 Next Event</h3>
        <Button variant="ghost" size="small" onClick={onSeeAll}>
          All Events →
        </Button>
      </div>
      <Card variant="success" hover onClick={onSeeAll}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              background: `rgba(${theme.mode === 'dark' ? '28, 25, 23' : '0, 0, 0'}, 0.6)`,
              borderRadius: '14px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontSize: '11px',
                color: theme.colors.success,
                fontWeight: 700,
              }}
            >
              {month.toUpperCase()}
            </span>
            <span style={{ fontSize: '24px', fontWeight: 800, color: theme.colors.text.primary }}>
              {day}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '17px', fontWeight: 700 }}>
              {event.emoji} {event.title}
            </h4>
            <p
              style={{
                margin: 0,
                color: theme.colors.text.secondary,
                fontSize: '14px',
              }}
            >
              {event.time} • {event.location}
            </p>
            <p
              style={{
                margin: '6px 0 0 0',
                color: theme.colors.success,
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {event.attendees} dads attending
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
