import { useTheme } from '../../context/ThemeContext';
import { ThemePicker } from './ThemePicker';

export const SettingsPage: React.FC = () => {
  const { theme } = useTheme();

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
          background: theme.colors.accent.gradient,
        }}
      >
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          ⚙️ Settings
        </h1>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          Customize your Dad Hub experience
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Theme Picker */}
        <ThemePicker />

        {/* Notifications Settings */}
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
            🔔 Notifications
          </h3>

          {[
            { label: 'Push Notifications', description: 'Get notified about activity', enabled: true },
            { label: 'Daily Tips', description: 'Receive daily dad tips', enabled: true },
            { label: 'Friend Activity', description: 'When friends post or achieve', enabled: false },
            { label: 'Challenge Reminders', description: 'Weekly challenge updates', enabled: true },
          ].map((setting, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: index < 3 ? `1px solid ${theme.colors.border}` : 'none',
              }}
            >
              <div>
                <p
                  style={{
                    margin: '0 0 2px 0',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: theme.colors.text.primary,
                  }}
                >
                  {setting.label}
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: theme.colors.text.muted }}>
                  {setting.description}
                </p>
              </div>
              <div
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  background: setting.enabled ? theme.colors.accent.primary : theme.colors.border,
                  position: 'relative',
                  cursor: 'pointer',
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
                    left: setting.enabled ? '22px' : '2px',
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* About */}
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
            ℹ️ About
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.text.secondary }}>Version</span>
              <span style={{ color: theme.colors.text.primary, fontWeight: 600 }}>2.0.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: theme.colors.text.secondary }}>Build</span>
              <span style={{ color: theme.colors.text.primary, fontWeight: 600 }}>2026.01.19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
