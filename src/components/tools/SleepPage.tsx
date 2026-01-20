import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { collection, query, where, getDocs, addDoc, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { haptics } from '../../utils/haptics';

interface SleepLog {
  id: string;
  userId: string;
  date: Date;
  bedTime: string;
  wakeTime: string;
  duration: number; // hours
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  interruptions: number;
}

export const SleepPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useApp();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [bedTime, setBedTime] = useState('22:00');
  const [wakeTime, setWakeTime] = useState('06:00');
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [interruptions, setInterruptions] = useState(0);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    if (!user?.uid) return;

    try {
      const logsRef = collection(db, 'sleepLogs');
      const q = query(
        logsRef,
        where('userId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(30)
      );
      const snapshot = await getDocs(q);

      const logData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as SleepLog[];

      setLogs(logData);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDuration = (bed: string, wake: string): number => {
    const [bedH, bedM] = bed.split(':').map(Number);
    const [wakeH, wakeM] = wake.split(':').map(Number);

    let bedMins = bedH * 60 + bedM;
    let wakeMins = wakeH * 60 + wakeM;

    if (wakeMins < bedMins) {
      wakeMins += 24 * 60; // Next day
    }

    return (wakeMins - bedMins) / 60;
  };

  const handleAddLog = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      const duration = calculateDuration(bedTime, wakeTime);

      await addDoc(collection(db, 'sleepLogs'), {
        userId: user.uid,
        date: new Date(),
        bedTime,
        wakeTime,
        duration,
        quality,
        interruptions,
        notes: notes.trim() || null,
        createdAt: serverTimestamp(),
      });

      haptics.success();
      setShowAddModal(false);
      resetForm();
      loadLogs();
    } catch (error) {
      console.error('Error adding log:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setBedTime('22:00');
    setWakeTime('06:00');
    setQuality(3);
    setInterruptions(0);
    setNotes('');
  };

  const getQualityEmoji = (q: number) => {
    switch (q) {
      case 1:
        return '😩';
      case 2:
        return '😕';
      case 3:
        return '😐';
      case 4:
        return '😊';
      case 5:
        return '😴';
      default:
        return '😐';
    }
  };

  const getQualityLabel = (q: number) => {
    switch (q) {
      case 1:
        return 'Terrible';
      case 2:
        return 'Poor';
      case 3:
        return 'Okay';
      case 4:
        return 'Good';
      case 5:
        return 'Great';
      default:
        return 'Okay';
    }
  };

  const getQualityColor = (q: number) => {
    switch (q) {
      case 1:
        return '#ef4444';
      case 2:
        return '#f97316';
      case 3:
        return '#f59e0b';
      case 4:
        return '#22c55e';
      case 5:
        return '#3b82f6';
      default:
        return '#f59e0b';
    }
  };

  const formatDuration = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  // Calculate stats
  const avgDuration = logs.length > 0
    ? logs.reduce((sum, log) => sum + log.duration, 0) / logs.length
    : 0;
  const avgQuality = logs.length > 0
    ? logs.reduce((sum, log) => sum + log.quality, 0) / logs.length
    : 0;
  const last7Days = logs.slice(0, 7);

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
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          😴 Sleep Tracker
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Track your sleep and improve your rest
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          padding: '16px 20px',
          background: theme.colors.background.secondary,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {formatDuration(avgDuration)}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Avg Sleep</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '24px' }}>
            {getQualityEmoji(Math.round(avgQuality))}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Avg Quality</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: theme.colors.accent.primary }}>
            {logs.length}
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: theme.colors.text.muted }}>Total Logs</p>
        </div>
      </div>

      {/* Log Button */}
      <div style={{ padding: '16px 20px' }}>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
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
          🌙 Log Last Night's Sleep
        </button>
      </div>

      {/* Weekly Chart */}
      {last7Days.length > 0 && (
        <div style={{ padding: '0 20px 20px' }}>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            Last 7 Days
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              height: '120px',
              alignItems: 'flex-end',
              padding: '16px',
              background: theme.colors.card,
              borderRadius: '16px',
              border: `1px solid ${theme.colors.border}`,
            }}
          >
            {last7Days.reverse().map((log, i) => {
              const maxHeight = 80;
              const height = (log.duration / 10) * maxHeight;
              return (
                <div
                  key={log.id || i}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: `${height}px`,
                      background: `linear-gradient(to top, ${getQualityColor(log.quality)}, ${getQualityColor(log.quality)}80)`,
                      borderRadius: '6px',
                      transition: 'height 0.3s',
                    }}
                  />
                  <span style={{ fontSize: '10px', color: theme.colors.text.muted }}>
                    {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Logs */}
      <div style={{ padding: '0 20px' }}>
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '16px',
            fontWeight: 700,
            color: theme.colors.text.primary,
          }}
        >
          Sleep History
        </h3>

        {isLoading ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>😴</div>
            <p style={{ color: theme.colors.text.muted }}>Loading...</p>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌙</div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
              No sleep logs yet
            </h3>
            <p style={{ margin: 0, color: theme.colors.text.muted }}>
              Start tracking your sleep to see patterns!
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {logs.slice(0, 14).map((log) => (
              <div
                key={log.id}
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
                <div style={{ fontSize: '32px' }}>{getQualityEmoji(log.quality)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        fontSize: '16px',
                        color: theme.colors.text.primary,
                      }}
                    >
                      {formatDuration(log.duration)}
                    </p>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: `${getQualityColor(log.quality)}20`,
                        color: getQualityColor(log.quality),
                        fontSize: '11px',
                        fontWeight: 600,
                      }}
                    >
                      {getQualityLabel(log.quality)}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                    {log.bedTime} → {log.wakeTime}
                    {log.interruptions > 0 && ` • ${log.interruptions} wake-up${log.interruptions > 1 ? 's' : ''}`}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                  {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
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
              maxWidth: '400px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '20px',
                borderBottom: `1px solid ${theme.colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>🌙 Log Sleep</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Times */}
              <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                    Bedtime
                  </label>
                  <input
                    type="time"
                    value={bedTime}
                    onChange={(e) => setBedTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '10px',
                      color: theme.colors.text.primary,
                      fontSize: '16px',
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                    Wake Time
                  </label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: theme.colors.background.secondary,
                      border: `1px solid ${theme.colors.border}`,
                      borderRadius: '10px',
                      color: theme.colors.text.primary,
                      fontSize: '16px',
                    }}
                  />
                </div>
              </div>

              {/* Duration Preview */}
              <div
                style={{
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  borderRadius: '10px',
                  textAlign: 'center',
                  marginBottom: '20px',
                }}
              >
                <p style={{ margin: 0, fontSize: '14px', color: theme.colors.text.muted }}>
                  Total Sleep: <strong style={{ color: theme.colors.accent.primary }}>{formatDuration(calculateDuration(bedTime, wakeTime))}</strong>
                </p>
              </div>

              {/* Quality */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontSize: '14px', fontWeight: 600 }}>
                  Sleep Quality
                </label>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {[1, 2, 3, 4, 5].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuality(q as 1 | 2 | 3 | 4 | 5)}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        border: quality === q ? `2px solid ${getQualityColor(q)}` : `1px solid ${theme.colors.border}`,
                        background: quality === q ? `${getQualityColor(q)}20` : 'transparent',
                        fontSize: '28px',
                        cursor: 'pointer',
                      }}
                    >
                      {getQualityEmoji(q)}
                    </button>
                  ))}
                </div>
                <p style={{ margin: '8px 0 0 0', textAlign: 'center', fontSize: '14px', color: getQualityColor(quality), fontWeight: 600 }}>
                  {getQualityLabel(quality)}
                </p>
              </div>

              {/* Interruptions */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  Night Wake-ups
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setInterruptions(Math.max(0, interruptions - 1))}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '24px', fontWeight: 700, minWidth: '40px', textAlign: 'center' }}>
                    {interruptions}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInterruptions(interruptions + 1)}
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      border: `1px solid ${theme.colors.border}`,
                      background: theme.colors.background.secondary,
                      color: theme.colors.text.primary,
                      fontSize: '20px',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600 }}>
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any notes about your sleep..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '12px',
                    background: theme.colors.background.secondary,
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: '10px',
                    color: theme.colors.text.primary,
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleAddLog}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '14px',
                  border: 'none',
                  background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Sleep Log'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SleepPage;
