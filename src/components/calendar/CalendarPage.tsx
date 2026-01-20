import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { haptics } from '../../utils/haptics';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  category: 'school' | 'sports' | 'medical' | 'birthday' | 'activity' | 'other';
  kidName?: string;
  notes?: string;
  reminder?: boolean;
}

const EVENT_CATEGORIES = [
  { id: 'school', label: 'School', emoji: '🏫', color: '#3b82f6' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: '#22c55e' },
  { id: 'medical', label: 'Medical', emoji: '🏥', color: '#ef4444' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂', color: '#ec4899' },
  { id: 'activity', label: 'Activity', emoji: '🎨', color: '#f59e0b' },
  { id: 'other', label: 'Other', emoji: '📌', color: '#8b5cf6' },
];

const SAMPLE_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Soccer Practice', date: new Date(), time: '4:00 PM', category: 'sports', kidName: 'Jake' },
  { id: '2', title: 'Parent-Teacher Conference', date: new Date(Date.now() + 86400000 * 2), time: '3:30 PM', category: 'school', kidName: 'Emma' },
  { id: '3', title: 'Dentist Appointment', date: new Date(Date.now() + 86400000 * 5), time: '10:00 AM', category: 'medical', kidName: 'Jake' },
  { id: '4', title: "Emma's Birthday", date: new Date(Date.now() + 86400000 * 10), category: 'birthday', kidName: 'Emma' },
];

export const CalendarPage: React.FC = () => {
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<CalendarEvent[]>(SAMPLE_EVENTS);
  const [showAddModal, setShowAddModal] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
    haptics.light();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getCategoryInfo = (category: CalendarEvent['category']) => {
    return EVENT_CATEGORIES.find((c) => c.id === category) || EVENT_CATEGORIES[5];
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          📅 Dad Calendar
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Track all your family events
        </p>
      </div>

      {/* Calendar */}
      <div style={{ padding: '20px' }}>
        <div
          style={{
            background: theme.colors.card,
            borderRadius: '20px',
            padding: '16px',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          {/* Month Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <button
              onClick={() => navigateMonth(-1)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              ←
            </button>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              →
            </button>
          </div>

          {/* Day Names */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
              marginBottom: '8px',
            }}
          >
            {dayNames.map((day) => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: theme.colors.text.muted,
                  padding: '8px 0',
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '4px',
            }}
          >
            {days.map((day, index) => {
              const dayEvents = day ? getEventsForDate(day) : [];
              const hasEvents = dayEvents.length > 0;

              return (
                <button
                  key={index}
                  onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                  disabled={!day}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '10px',
                    border: 'none',
                    background: isToday(day!)
                      ? theme.colors.accent.primary
                      : selectedDate?.getDate() === day
                      ? `${theme.colors.accent.primary}30`
                      : 'transparent',
                    color: isToday(day!)
                      ? '#fff'
                      : day
                      ? theme.colors.text.primary
                      : 'transparent',
                    fontSize: '14px',
                    fontWeight: isToday(day!) ? 700 : 500,
                    cursor: day ? 'pointer' : 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px',
                    position: 'relative',
                  }}
                >
                  {day}
                  {hasEvents && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '2px',
                        position: 'absolute',
                        bottom: '4px',
                      }}
                    >
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <div
                          key={i}
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: getCategoryInfo(event.category).color,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Event Button */}
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '16px',
            borderRadius: '14px',
            border: 'none',
            background: theme.colors.accent.gradient,
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          ➕ Add Event
        </button>

        {/* Upcoming Events */}
        <div style={{ marginTop: '24px' }}>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Upcoming Events
          </h3>

          {upcomingEvents.length === 0 ? (
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                background: theme.colors.card,
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <p style={{ fontSize: '32px', marginBottom: '8px' }}>📅</p>
              <p style={{ margin: 0, color: theme.colors.text.muted }}>No upcoming events</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {upcomingEvents.map((event) => {
                const categoryInfo = getCategoryInfo(event.category);
                const eventDate = new Date(event.date);

                return (
                  <div
                    key={event.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px',
                      background: theme.colors.card,
                      borderRadius: '14px',
                      border: `1px solid ${theme.colors.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: `${categoryInfo.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                      }}
                    >
                      {categoryInfo.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          margin: '0 0 4px 0',
                          fontSize: '15px',
                          fontWeight: 600,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {event.title}
                      </p>
                      <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
                        {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        {event.time && ` • ${event.time}`}
                        {event.kidName && ` • ${event.kidName}`}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        background: `${categoryInfo.color}20`,
                        color: categoryInfo.color,
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {categoryInfo.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category Legend */}
        <div style={{ marginTop: '24px' }}>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.secondary,
            }}
          >
            Categories
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {EVENT_CATEGORIES.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  background: theme.colors.background.secondary,
                  borderRadius: '20px',
                }}
              >
                <span style={{ fontSize: '14px' }}>{cat.emoji}</span>
                <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Event Modal - Placeholder */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700, color: theme.colors.text.primary }}>
              Add New Event
            </h3>
            <p style={{ margin: '0 0 20px 0', color: theme.colors.text.muted }}>
              Event creation coming soon!
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: theme.colors.accent.gradient,
                color: '#fff',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
