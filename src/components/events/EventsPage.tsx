import React from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common';
import { EventCard } from './EventCard';

export const EventsPage: React.FC = () => {
  const { events } = useApp();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>Upcoming Events</h2>
        <Button icon="+">Create Event</Button>
      </div>

      {events.map((event, index) => (
        <EventCard key={event.id} event={event} isFirst={index === 0} />
      ))}
    </div>
  );
};
