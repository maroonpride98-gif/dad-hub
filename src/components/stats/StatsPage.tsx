import { useTheme } from '../../context/ThemeContext';
import { useGamification } from '../../context/GamificationContext';

export const StatsPage: React.FC = () => {
  const { theme } = useTheme();
  const { xp, level, xpToNextLevel, levelProgress, currentStreak, userStats } = useGamification();

  const stats = [
    { label: 'Total XP', value: xp.toLocaleString(), emoji: '⭐', color: '#f59e0b' },
    { label: 'Current Level', value: level, emoji: '🏆', color: '#8b5cf6' },
    { label: 'Day Streak', value: `${currentStreak} days`, emoji: '🔥', color: '#ef4444' },
    { label: 'Posts Made', value: userStats.postsCount.toString(), emoji: '📝', color: '#3b82f6' },
    { label: 'Jokes Shared', value: userStats.jokesCount.toString(), emoji: '😂', color: '#22c55e' },
    { label: 'Friends', value: userStats.friendsCount.toString(), emoji: '👥', color: '#ec4899' },
  ];

  const achievements = [
    { title: 'First Post', description: 'Made your first post', earned: true, emoji: '📝' },
    { title: 'Joke Master', description: 'Shared 10 jokes', earned: true, emoji: '😂' },
    { title: 'Social Dad', description: 'Added 5 friends', earned: true, emoji: '👥' },
    { title: 'Streak Warrior', description: '7-day login streak', earned: true, emoji: '🔥' },
    { title: 'Level 10', description: 'Reached level 10', earned: false, emoji: '🏆' },
    { title: 'Century Club', description: 'Earned 10,000 XP', earned: false, emoji: '💯' },
  ];

  const weeklyActivity = [
    { day: 'Mon', value: 85 },
    { day: 'Tue', value: 60 },
    { day: 'Wed', value: 90 },
    { day: 'Thu', value: 45 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 100 },
    { day: 'Sun', value: 55 },
  ];

  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value));

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
          📊 Dad Stats
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Track your journey as a dad
        </p>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Quick Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: theme.colors.card,
                borderRadius: '16px',
                padding: '16px',
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>{stat.emoji}</span>
                <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>{stat.label}</span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '24px',
                  fontWeight: 700,
                  color: stat.color,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Weekly Activity */}
        <div
          style={{
            background: theme.colors.card,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${theme.colors.border}`,
            marginBottom: '24px',
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            📈 Weekly Activity
          </h3>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '120px' }}>
            {weeklyActivity.map((day, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '32px',
                    height: `${(day.value / maxActivity) * 80}px`,
                    background: theme.colors.accent.gradient,
                    borderRadius: '6px 6px 0 0',
                    transition: 'height 0.3s',
                  }}
                />
                <span style={{ fontSize: '11px', color: theme.colors.text.muted }}>{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Level Progress */}
        <div
          style={{
            background: theme.colors.card,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${theme.colors.border}`,
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              Level Progress
            </h3>
            <span style={{ fontSize: '14px', color: theme.colors.accent.primary, fontWeight: 600 }}>
              Level {level}
            </span>
          </div>

          <div
            style={{
              height: '12px',
              background: theme.colors.background.secondary,
              borderRadius: '6px',
              overflow: 'hidden',
              marginBottom: '8px',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${levelProgress}%`,
                background: theme.colors.accent.gradient,
                borderRadius: '6px',
                transition: 'width 0.5s',
              }}
            />
          </div>

          <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted, textAlign: 'center' }}>
            {Math.round(levelProgress)}% to next level ({xpToNextLevel.toLocaleString()} XP needed)
          </p>
        </div>

        {/* Achievements */}
        <div
          style={{
            background: theme.colors.card,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${theme.colors.border}`,
          }}
        >
          <h3
            style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 700,
              color: theme.colors.text.primary,
            }}
          >
            🏅 Achievements
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            {achievements.map((achievement, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  borderRadius: '12px',
                  opacity: achievement.earned ? 1 : 0.5,
                  filter: achievement.earned ? 'none' : 'grayscale(1)',
                }}
              >
                <span style={{ fontSize: '28px', marginBottom: '6px' }}>{achievement.emoji}</span>
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    fontWeight: 600,
                    color: theme.colors.text.primary,
                    textAlign: 'center',
                  }}
                >
                  {achievement.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
