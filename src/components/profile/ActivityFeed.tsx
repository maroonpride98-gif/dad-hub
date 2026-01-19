import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { Card } from '../common';

export const ActivityFeed: React.FC = () => {
  const { theme } = useTheme();
  const { user, discussions, events, jokes } = useApp();

  // Gather recent activity
  const activities: Array<{
    type: string;
    icon: string;
    text: string;
    time: string;
  }> = [];

  // Add posts
  discussions
    .filter(d => d.authorId === user.uid)
    .slice(0, 3)
    .forEach(d => {
      activities.push({
        type: 'post',
        icon: '📝',
        text: `Posted "${d.title}"`,
        time: d.time,
      });
    });

  // Add event RSVPs
  events
    .filter(e => e.attendeeIds?.includes(user.uid))
    .slice(0, 3)
    .forEach(e => {
      activities.push({
        type: 'event',
        icon: '📅',
        text: `RSVP'd to "${e.title}"`,
        time: 'Recently',
      });
    });

  // Add jokes submitted
  jokes
    .filter(joke => joke.isUserSubmitted && joke.author === user.name)
    .slice(0, 3)
    .forEach(() => {
      activities.push({
        type: 'joke',
        icon: '😂',
        text: `Shared a dad joke`,
        time: 'Recently',
      });
    });

  // Sort by most recent (simplified)
  const recentActivities = activities.slice(0, 5);

  return (
    <div>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 700 }}>
        ⚡ Recent Activity
      </h3>
      <Card>
        {recentActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <span style={{ fontSize: '40px' }}>🌱</span>
            <p style={{ color: theme.colors.text.muted, margin: '12px 0 0 0' }}>
              No activity yet. Start posting, joining events, or sharing jokes!
            </p>
          </div>
        ) : (
          recentActivities.map((activity, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 0',
                borderBottom: i < recentActivities.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
              }}
            >
              <span style={{ fontSize: '24px' }}>{activity.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: '14px' }}>{activity.text}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: theme.colors.text.muted }}>
                  {activity.time}
                </p>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};
