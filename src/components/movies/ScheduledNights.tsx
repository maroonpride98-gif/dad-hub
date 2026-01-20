import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';

export interface MovieNight {
  id: string;
  movieTitle: string;
  movieYear: number;
  movieEmoji: string;
  movieGenre: string;
  date: Date;
  time: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  attendeeCount: number;
  maxAttendees: number;
  attendeeIds: string[];
  description?: string;
  isVirtual: boolean;
  meetingLink?: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface ScheduledNightsProps {
  nights: MovieNight[];
  onJoin: (nightId: string) => void;
  onLeave: (nightId: string) => void;
}

export const ScheduledNights: React.FC<ScheduledNightsProps> = ({
  nights,
  onJoin,
  onLeave,
}) => {
  const { theme } = useTheme();
  const { user } = useApp();

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (night: MovieNight) => {
    switch (night.status) {
      case 'live':
        return { text: '🔴 LIVE NOW', color: '#ef4444', bg: '#ef444420' };
      case 'upcoming':
        return { text: 'Upcoming', color: '#22c55e', bg: '#22c55e20' };
      case 'completed':
        return { text: 'Completed', color: '#6b7280', bg: '#6b728020' };
    }
  };

  if (nights.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📅</div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
          No scheduled movie nights
        </h3>
        <p style={{ margin: 0, color: theme.colors.text.muted }}>
          Be the first to host a movie night!
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {nights.map((night) => {
        const isAttending = night.attendeeIds.includes(user.uid);
        const isFull = night.attendeeCount >= night.maxAttendees;
        const statusBadge = getStatusBadge(night);

        return (
          <div
            key={night.id}
            style={{
              background: theme.colors.card,
              borderRadius: '16px',
              overflow: 'hidden',
              border:
                night.status === 'live'
                  ? '2px solid #ef4444'
                  : `1px solid ${theme.colors.border}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '14px 16px',
                background:
                  night.status === 'live'
                    ? 'linear-gradient(135deg, #ef4444, #f97316)'
                    : theme.colors.background.secondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '24px' }}>{night.movieEmoji}</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: '16px',
                      color: night.status === 'live' ? '#fff' : theme.colors.text.primary,
                    }}
                  >
                    {night.movieTitle}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '12px',
                      color:
                        night.status === 'live'
                          ? 'rgba(255,255,255,0.8)'
                          : theme.colors.text.muted,
                    }}
                  >
                    {night.movieYear} • {night.movieGenre}
                  </p>
                </div>
              </div>

              <span
                style={{
                  padding: '4px 10px',
                  background: night.status === 'live' ? 'rgba(255,255,255,0.2)' : statusBadge.bg,
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: night.status === 'live' ? '#fff' : statusBadge.color,
                }}
              >
                {statusBadge.text}
              </span>
            </div>

            {/* Content */}
            <div style={{ padding: '16px' }}>
              {/* Date & Time */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>📅</span>
                  <span style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                    {formatDate(night.date)}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '14px' }}>🕐</span>
                  <span style={{ fontSize: '14px', color: theme.colors.text.secondary }}>
                    {night.time}
                  </span>
                </div>
                {night.isVirtual && (
                  <span
                    style={{
                      padding: '2px 8px',
                      background: '#3b82f620',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#3b82f6',
                    }}
                  >
                    🖥️ Virtual
                  </span>
                )}
              </div>

              {/* Host */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '24px' }}>{night.hostAvatar}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
                    Hosted by
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      fontWeight: 600,
                      color: theme.colors.text.primary,
                    }}
                  >
                    {night.hostName}
                  </p>
                </div>
              </div>

              {/* Description */}
              {night.description && (
                <p
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: '13px',
                    color: theme.colors.text.secondary,
                    lineHeight: 1.5,
                  }}
                >
                  {night.description}
                </p>
              )}

              {/* Attendees & Action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: `1px solid ${theme.colors.border}`,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '14px',
                      color: theme.colors.text.secondary,
                    }}
                  >
                    👥 {night.attendeeCount}/{night.maxAttendees} attending
                  </p>
                  {isFull && !isAttending && (
                    <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>
                      This event is full
                    </p>
                  )}
                </div>

                {night.status === 'upcoming' && (
                  <>
                    {isAttending ? (
                      <button
                        onClick={() => onLeave(night.id)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '10px',
                          border: `1px solid ${theme.colors.border}`,
                          background: 'transparent',
                          color: theme.colors.text.secondary,
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Attending
                      </button>
                    ) : (
                      <button
                        onClick={() => onJoin(night.id)}
                        disabled={isFull}
                        style={{
                          padding: '10px 20px',
                          borderRadius: '10px',
                          border: 'none',
                          background: isFull
                            ? theme.colors.background.secondary
                            : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                          color: isFull ? theme.colors.text.muted : '#fff',
                          fontSize: '14px',
                          fontWeight: 600,
                          cursor: isFull ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Join
                      </button>
                    )}
                  </>
                )}

                {night.status === 'live' && night.meetingLink && (
                  <a
                    href={night.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #ef4444, #f97316)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    🎬 Join Now
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScheduledNights;
