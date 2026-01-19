import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useReferral } from '../../context/ReferralContext';
import { useToast } from '../../context/ToastContext';
import { haptics } from '../../utils/haptics';

export const InviteCard: React.FC = () => {
  const { theme } = useTheme();
  const { referralCode, referralLink, stats } = useReferral();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      haptics.success();
      showToast('Referral link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Failed to copy link', 'error');
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      haptics.success();
      showToast('Code copied!', 'success');
    } catch {
      showToast('Failed to copy code', 'error');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Dad Hub!',
          text: `Join the Brotherhood of Fatherhood! Use my referral code: ${referralCode}`,
          url: referralLink,
        });
        haptics.success();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyLink();
        }
      }
    } else {
      copyLink();
    }
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${theme.colors.accent.primary}30`,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍👧‍👦</div>
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '20px',
            fontWeight: 700,
            color: theme.colors.text.primary,
          }}
        >
          Invite Fellow Dads
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: '14px',
            color: theme.colors.text.secondary,
          }}
        >
          Earn <strong style={{ color: theme.colors.accent.primary }}>100 XP</strong> for each dad who joins!
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px',
        }}
      >
        <StatBox
          label="Invited"
          value={stats.totalReferrals}
          emoji="📨"
          theme={theme}
        />
        <StatBox
          label="Joined"
          value={stats.successfulReferrals}
          emoji="✅"
          theme={theme}
        />
        <StatBox
          label="XP Earned"
          value={stats.xpEarned}
          emoji="⭐"
          theme={theme}
        />
      </div>

      {/* Referral Code */}
      <div
        style={{
          background: theme.colors.background.primary,
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: theme.colors.text.muted,
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Your Referral Code
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: '24px',
              fontWeight: 700,
              fontFamily: 'monospace',
              color: theme.colors.accent.primary,
              letterSpacing: '2px',
            }}
          >
            {referralCode || '...'}
          </div>
          <button
            onClick={copyCode}
            style={{
              padding: '8px 16px',
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: '8px',
              color: theme.colors.text.primary,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Copy
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={copyLink}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '12px',
            color: theme.colors.text.primary,
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span>{copied ? '✅' : '📋'}</span>
          <span>{copied ? 'Copied!' : 'Copy Link'}</span>
        </button>

        <button
          onClick={shareNative}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            background: `linear-gradient(135deg, ${theme.colors.accent.primary}, ${theme.colors.accent.secondary})`,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <span>📤</span>
          <span>Share</span>
        </button>
      </div>

      {/* Social Share */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.colors.border}`,
        }}
      >
        <SocialButton
          icon="𝕏"
          label="Twitter"
          onClick={() => {
            const text = encodeURIComponent(`Join the Brotherhood of Fatherhood on Dad Hub! Use my code: ${referralCode}`);
            window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}&hashtags=DadHub,DadLife`, '_blank');
          }}
          theme={theme}
        />
        <SocialButton
          icon="📘"
          label="Facebook"
          onClick={() => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
          }}
          theme={theme}
        />
        <SocialButton
          icon="💬"
          label="WhatsApp"
          onClick={() => {
            const text = encodeURIComponent(`Join the Brotherhood of Fatherhood! Use my referral code: ${referralCode}\n\n${referralLink}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
          }}
          theme={theme}
        />
        <SocialButton
          icon="📧"
          label="Email"
          onClick={() => {
            const subject = encodeURIComponent('Join Dad Hub!');
            const body = encodeURIComponent(`Hey!\n\nI've been using Dad Hub - a social app for dads. It's great for sharing parenting tips, dad jokes, and connecting with other fathers.\n\nUse my referral code: ${referralCode}\n\nOr click here to join: ${referralLink}\n\nSee you there!`);
            window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
          }}
          theme={theme}
        />
      </div>
    </div>
  );
};

const StatBox: React.FC<{
  label: string;
  value: number;
  emoji: string;
  theme: any;
}> = ({ label, value, emoji, theme }) => (
  <div
    style={{
      background: theme.colors.background.primary,
      borderRadius: '10px',
      padding: '12px',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '20px', marginBottom: '4px' }}>{emoji}</div>
    <div
      style={{
        fontSize: '20px',
        fontWeight: 700,
        color: theme.colors.text.primary,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontSize: '11px',
        color: theme.colors.text.muted,
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
);

const SocialButton: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  theme: any;
}> = ({ icon, label, onClick, theme }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 12px',
      background: 'transparent',
      border: 'none',
      color: theme.colors.text.secondary,
      fontSize: '10px',
      cursor: 'pointer',
    }}
    title={label}
  >
    <span style={{ fontSize: '20px' }}>{icon}</span>
    <span>{label}</span>
  </button>
);

// Compact version for sidebar/quick access
export const InviteButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { theme } = useTheme();
  const { stats } = useReferral();

  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px 16px',
        background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
        border: `1px solid ${theme.colors.accent.primary}30`,
        borderRadius: '12px',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ fontSize: '28px' }}>👨‍👧‍👦</div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: theme.colors.text.primary,
          }}
        >
          Invite a Dad
        </div>
        <div
          style={{
            fontSize: '12px',
            color: theme.colors.text.secondary,
          }}
        >
          {stats.successfulReferrals > 0
            ? `${stats.successfulReferrals} joined • ${stats.xpEarned} XP earned`
            : 'Earn 100 XP per invite'}
        </div>
      </div>
      <div
        style={{
          fontSize: '18px',
          color: theme.colors.text.muted,
        }}
      >
        →
      </div>
    </button>
  );
};
