import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { haptics } from '../../utils/haptics';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  category: 'school' | 'sports' | 'medical' | 'birthday' | 'activity' | 'other';
  kidName?: string;
  notes?: string;
  reminder?: boolean;
  userId?: string;
}

const EVENT_CATEGORIES = [
  { id: 'school', label: 'School', emoji: '🏫', color: '#3b82f6' },
  { id: 'sports', label: 'Sports', emoji: '⚽', color: '#22c55e' },
  { id: 'medical', label: 'Medical', emoji: '🏥', color: '#ef4444' },
  { id: 'birthday', label: 'Birthday', emoji: '🎂', color: '#ec4899' },
  { id: 'activity', label: 'Activity', emoji: '🎨', color: '#f59e0b' },
  { id: 'other', label: 'Other', emoji: '📌', color: '#8b5cf6' },
];

export const CalendarPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('');
  const [newCategory, setNewCategory] = useState<CalendarEvent['category']>('other');
  const [newKidName, setNewKidName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const eventsRef = collection(db, 'calendarEvents');
    const q = query(eventsRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userEvents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as CalendarEvent[];

      setEvents(userEvents);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleAddEvent = async () => {
    if (!newTitle.trim() || !user?.uid || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      await addDoc(collection(db, 'calendarEvents'), {
        userId: user.uid,
        title: newTitle.trim(),
        date: new Date(newDate),
        time: newTime || null,
        category: newCategory,
        kidName: newKidName.trim() || null,
        notes: newNotes.trim() || null,
        reminder: true,
        createdAt: serverTimestamp(),
      });

      haptics.success();
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewTitle('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewTime('');
    setNewCategory('other');
    setNewKidName('');
    setNewNotes('');
  };

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

      {/* Add Event Modal */}
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
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 700, color: theme.colors.text.primary }}>
              Add New Event
            </h3>

            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Event Title *
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Soccer Practice"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            {/* Date & Time */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                  Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '15px',
                  }}
                />
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Category
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {EVENT_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setNewCategory(cat.id as CalendarEvent['category'])}
                    style={{
                      padding: '8px 14px',
                      background: newCategory === cat.id ? `${cat.color}20` : theme.colors.background.secondary,
                      border: newCategory === cat.id ? `2px solid ${cat.color}` : `1px solid ${theme.colors.border}`,
                      borderRadius: '16px',
                      fontSize: '13px',
                      color: newCategory === cat.id ? cat.color : theme.colors.text.secondary,
                      fontWeight: newCategory === cat.id ? 600 : 400,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Kid Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Kid's Name (optional)
              </label>
              <input
                type="text"
                value={newKidName}
                onChange={(e) => setNewKidName(e.target.value)}
                placeholder="e.g., Jake"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Notes (optional)
              </label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="Any additional details..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  background: 'transparent',
                  color: theme.colors.text.secondary,
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                disabled={!newTitle.trim() || isSubmitting}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: !newTitle.trim() ? theme.colors.background.secondary : theme.colors.accent.gradient,
                  color: !newTitle.trim() ? theme.colors.text.muted : '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: !newTitle.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
