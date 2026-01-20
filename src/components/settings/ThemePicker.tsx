import { useTheme } from '../../context/ThemeContext';
import { ACCENT_COLORS } from '../../styles/theme';
import { haptics } from '../../utils/haptics';

export const ThemePicker: React.FC = () => {
  const { theme, mode, accentId, toggleTheme, setAccentColor } = useTheme();

  const handleAccentChange = (id: string) => {
    setAccentColor(id);
    haptics.light();
  };

  return (
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
        🎨 Appearance
      </h3>

      {/* Dark/Light Mode Toggle */}
      <div style={{ marginBottom: '20px' }}>
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '13px',
            fontWeight: 600,
            color: theme.colors.text.secondary,
          }}
        >
          Theme Mode
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              if (mode !== 'light') toggleTheme();
              haptics.light();
            }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: `2px solid ${mode === 'light' ? theme.colors.accent.primary : theme.colors.border}`,
              background: mode === 'light' ? `${theme.colors.accent.primary}15` : theme.colors.background.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>☀️</span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: mode === 'light' ? 600 : 500,
                color: mode === 'light' ? theme.colors.accent.primary : theme.colors.text.secondary,
              }}
            >
              Light
            </span>
          </button>
          <button
            onClick={() => {
              if (mode !== 'dark') toggleTheme();
              haptics.light();
            }}
            style={{
              flex: 1,
              padding: '14px',
              borderRadius: '12px',
              border: `2px solid ${mode === 'dark' ? theme.colors.accent.primary : theme.colors.border}`,
              background: mode === 'dark' ? `${theme.colors.accent.primary}15` : theme.colors.background.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '20px' }}>🌙</span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: mode === 'dark' ? 600 : 500,
                color: mode === 'dark' ? theme.colors.accent.primary : theme.colors.text.secondary,
              }}
            >
              Dark
            </span>
          </button>
        </div>
      </div>

      {/* Accent Color */}
      <div>
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '13px',
            fontWeight: 600,
            color: theme.colors.text.secondary,
          }}
        >
          Accent Color
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
          }}
        >
          {ACCENT_COLORS.map((color) => {
            const isSelected = accentId === color.id;
            return (
              <button
                key={color.id}
                onClick={() => handleAccentChange(color.id)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '12px',
                  border: `2px solid ${isSelected ? color.primary : 'transparent'}`,
                  background: isSelected ? `${color.primary}20` : theme.colors.background.secondary,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${color.primary}, ${color.secondary})`,
                    boxShadow: isSelected ? `0 2px 8px ${color.primary}50` : 'none',
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isSelected ? 600 : 500,
                    color: isSelected ? color.primary : theme.colors.text.muted,
                  }}
                >
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${theme.colors.border}` }}>
        <p
          style={{
            margin: '0 0 10px 0',
            fontSize: '13px',
            fontWeight: 600,
            color: theme.colors.text.secondary,
          }}
        >
          Preview
        </p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              background: theme.colors.accent.gradient,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Primary Button
          </button>
          <button
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: `1px solid ${theme.colors.accent.primary}`,
              background: 'transparent',
              color: theme.colors.accent.primary,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Secondary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemePicker;
