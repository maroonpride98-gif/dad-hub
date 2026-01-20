import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { PartyRoom, WatchParty } from './PartyRoom';
import { haptics } from '../../utils/haptics';

type ViewMode = 'browse' | 'create' | 'room';

const CONTENT_TYPES = [
  { id: 'movie', label: 'Movie Night', emoji: '🎬' },
  { id: 'sports', label: 'Sports Watch', emoji: '🏈' },
  { id: 'show', label: 'TV Show', emoji: '📺' },
  { id: 'custom', label: 'Custom Stream', emoji: '🎥' },
] as const;

const SAMPLE_PARTIES: WatchParty[] = [
  {
    id: '1',
    title: 'Sunday Football Watch Party',
    description: 'Join us for the big game! Bring your best commentary.',
    hostId: 'host1',
    hostName: 'SportsDad_Mike',
    hostAvatar: '🏈',
    contentType: 'sports',
    contentTitle: 'NFL Sunday Night Football',
    scheduledFor: new Date(Date.now() + 3600000),
    status: 'scheduled',
    participants: ['host1', 'user2', 'user3', 'user4', 'user5'],
    maxParticipants: 20,
    isPrivate: false,
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Classic Dad Movie Marathon',
    description: 'Watching the greatest dad movies ever made.',
    hostId: 'host2',
    hostName: 'CinematicDad',
    hostAvatar: '🎬',
    contentType: 'movie',
    contentTitle: 'Back to the Future',
    scheduledFor: new Date(),
    status: 'live',
    participants: ['host2', 'user1', 'user3', 'user6'],
    isPrivate: false,
    createdAt: new Date(),
  },
  {
    id: '3',
    title: 'Late Night Comedy Show',
    description: 'Winding down with some laughs after the kids are asleep.',
    hostId: 'host3',
    hostName: 'LateNiteDad',
    hostAvatar: '😂',
    contentType: 'show',
    contentTitle: 'Stand-up Comedy Special',
    scheduledFor: new Date(Date.now() + 86400000),
    status: 'scheduled',
    participants: ['host3', 'user4'],
    maxParticipants: 10,
    isPrivate: true,
    createdAt: new Date(),
  },
];

export const WatchPartyPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [viewMode, setViewMode] = useState<ViewMode>('browse');
  const [selectedParty, setSelectedParty] = useState<WatchParty | null>(null);
  const [filter, setFilter] = useState<'all' | 'live' | 'scheduled'>('all');
  const [parties] = useState<WatchParty[]>(SAMPLE_PARTIES);

  // Create form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formContentType, setFormContentType] = useState<WatchParty['contentType']>('movie');
  const [formContentTitle, setFormContentTitle] = useState('');
  const [formIsPrivate, setFormIsPrivate] = useState(false);

  const filteredParties = parties.filter((party) => {
    if (filter === 'all') return true;
    return party.status === filter;
  });

  const joinParty = (party: WatchParty) => {
    setSelectedParty(party);
    setViewMode('room');
    haptics.light();
  };

  const handleCreateParty = () => {
    if (!formTitle.trim() || !formContentTitle.trim()) return;

    const newParty: WatchParty = {
      id: Date.now().toString(),
      title: formTitle,
      description: formDescription,
      hostId: user.uid,
      hostName: user.name,
      hostAvatar: user.avatar,
      contentType: formContentType,
      contentTitle: formContentTitle,
      scheduledFor: new Date(),
      status: 'live',
      participants: [user.uid],
      isPrivate: formIsPrivate,
      createdAt: new Date(),
    };

    setSelectedParty(newParty);
    setViewMode('room');
    haptics.success();
  };

  const formatScheduledTime = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();

    if (diff < 0) return 'Started';
    if (diff < 3600000) return `In ${Math.ceil(diff / 60000)}m`;
    if (diff < 86400000) return `In ${Math.ceil(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  if (viewMode === 'room' && selectedParty) {
    return (
      <PartyRoom
        party={selectedParty}
        onLeave={() => {
          setViewMode('browse');
          setSelectedParty(null);
        }}
      />
    );
  }

  if (viewMode === 'create') {
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
            padding: '16px 20px',
            borderBottom: `1px solid ${theme.colors.border}`,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <button
            onClick={() => setViewMode('browse')}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: theme.colors.background.secondary,
              color: theme.colors.text.primary,
              fontSize: '18px',
              cursor: 'pointer',
            }}
          >
            ←
          </button>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
            Create Watch Party
          </h2>
        </div>

        {/* Form */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Party Title */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Party Name
            </label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="e.g., Sunday Night Movie"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '16px',
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="What's the vibe?"
              rows={3}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '16px',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Content Type */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              Content Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {CONTENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFormContentType(type.id as WatchParty['contentType'])}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: `2px solid ${formContentType === type.id ? theme.colors.accent.primary : theme.colors.border}`,
                    background:
                      formContentType === type.id
                        ? `${theme.colors.accent.primary}15`
                        : theme.colors.background.secondary,
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{type.emoji}</div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color:
                        formContentType === type.id
                          ? theme.colors.accent.primary
                          : theme.colors.text.secondary,
                    }}
                  >
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Title */}
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: 600,
                color: theme.colors.text.primary,
              }}
            >
              What are you watching?
            </label>
            <input
              type="text"
              value={formContentTitle}
              onChange={(e) => setFormContentTitle(e.target.value)}
              placeholder="e.g., The Dark Knight"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.border}`,
                background: theme.colors.background.secondary,
                color: theme.colors.text.primary,
                fontSize: '16px',
              }}
            />
          </div>

          {/* Private Toggle */}
          <button
            onClick={() => setFormIsPrivate(!formIsPrivate)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px',
              borderRadius: '12px',
              border: `1px solid ${theme.colors.border}`,
              background: theme.colors.background.secondary,
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>{formIsPrivate ? '🔒' : '🌐'}</span>
              <span style={{ color: theme.colors.text.primary, fontWeight: 600 }}>
                {formIsPrivate ? 'Private Party' : 'Public Party'}
              </span>
            </div>
            <div
              style={{
                width: '48px',
                height: '28px',
                borderRadius: '14px',
                background: formIsPrivate ? theme.colors.accent.primary : theme.colors.border,
                position: 'relative',
                transition: 'background 0.3s',
              }}
            >
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: '2px',
                  left: formIsPrivate ? '22px' : '2px',
                  transition: 'left 0.3s',
                }}
              />
            </div>
          </button>

          {/* Create Button */}
          <button
            onClick={handleCreateParty}
            disabled={!formTitle.trim() || !formContentTitle.trim()}
            style={{
              padding: '16px',
              borderRadius: '14px',
              border: 'none',
              background:
                formTitle.trim() && formContentTitle.trim()
                  ? `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`
                  : theme.colors.background.secondary,
              color: formTitle.trim() && formContentTitle.trim() ? '#fff' : theme.colors.text.muted,
              fontSize: '16px',
              fontWeight: 600,
              cursor: formTitle.trim() && formContentTitle.trim() ? 'pointer' : 'not-allowed',
              marginTop: '10px',
            }}
          >
            🎬 Start Party Now
          </button>
        </div>
      </div>
    );
  }

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
          background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          🎬 Watch Parties
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Watch together, even when you're apart
        </p>
      </div>

      {/* Action Bar */}
      <div
        style={{
          padding: '16px 20px',
          display: 'flex',
          gap: '10px',
          borderBottom: `1px solid ${theme.colors.border}`,
        }}
      >
        <button
          onClick={() => setViewMode('create')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <span>➕</span> Create Party
        </button>
      </div>

      {/* Filters */}
      <div
        style={{
          padding: '12px 20px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
        }}
      >
        {(['all', 'live', 'scheduled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filter === f ? theme.colors.accent.primary : theme.colors.background.secondary,
              color: filter === f ? '#fff' : theme.colors.text.secondary,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {f === 'live' && '🔴 '}
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Parties List */}
      <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredParties.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎬</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              No parties found
            </h3>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              Create one to get started!
            </p>
          </div>
        ) : (
          filteredParties.map((party) => (
            <div
              key={party.id}
              style={{
                background: theme.colors.card,
                borderRadius: '16px',
                border: `1px solid ${theme.colors.border}`,
                overflow: 'hidden',
              }}
            >
              {/* Party Header */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                    }}
                  >
                    {CONTENT_TYPES.find((t) => t.id === party.contentType)?.emoji || '🎥'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: 700,
                          color: theme.colors.text.primary,
                        }}
                      >
                        {party.title}
                      </h3>
                      {party.status === 'live' && (
                        <span
                          style={{
                            padding: '2px 8px',
                            borderRadius: '8px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            fontSize: '11px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#ef4444',
                            }}
                          />
                          LIVE
                        </span>
                      )}
                      {party.isPrivate && <span style={{ fontSize: '12px' }}>🔒</span>}
                    </div>
                    <p
                      style={{
                        margin: '0 0 6px 0',
                        fontSize: '13px',
                        color: theme.colors.text.muted,
                      }}
                    >
                      📺 {party.contentTitle}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{party.hostAvatar}</span>
                      <span style={{ fontSize: '12px', color: theme.colors.text.secondary }}>
                        Hosted by {party.hostName}
                      </span>
                    </div>
                  </div>
                </div>

                {party.description && (
                  <p
                    style={{
                      margin: '12px 0 0 0',
                      fontSize: '14px',
                      color: theme.colors.text.secondary,
                      lineHeight: 1.5,
                    }}
                  >
                    {party.description}
                  </p>
                )}
              </div>

              {/* Party Footer */}
              <div
                style={{
                  padding: '12px 16px',
                  background: theme.colors.background.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
                    👥 {party.participants.length}
                    {party.maxParticipants && ` / ${party.maxParticipants}`}
                  </span>
                  <span style={{ fontSize: '13px', color: theme.colors.text.muted }}>
                    ⏰ {formatScheduledTime(party.scheduledFor)}
                  </span>
                </div>
                <button
                  onClick={() => joinParty(party)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    background:
                      party.status === 'live'
                        ? '#ef4444'
                        : `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {party.status === 'live' ? '🔴 Join Now' : '📅 Reserve Spot'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchPartyPage;
