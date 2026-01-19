import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { haptics } from '../../utils/haptics';

interface ShareData {
  title: string;
  text: string;
  url?: string;
  hashtags?: string[];
}

interface ShareButtonProps {
  data: ShareData;
  variant?: 'icon' | 'button' | 'compact';
  onShare?: (platform: string) => void;
}

const SITE_URL = 'https://dad-hub-ab086.web.app';

export const ShareButton: React.FC<ShareButtonProps> = ({
  data,
  variant = 'icon',
  onShare,
}) => {
  const { theme } = useTheme();
  const { showToast } = useToast();
  const [showMenu, setShowMenu] = useState(false);

  const shareUrl = data.url || SITE_URL;
  const hashtags = data.hashtags || ['DadHub', 'DadLife', 'Fatherhood'];
  const hashtagString = hashtags.join(',');

  const shareOptions = [
    {
      id: 'native',
      label: 'Share',
      icon: '📤',
      action: async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: data.title,
              text: data.text,
              url: shareUrl,
            });
            onShare?.('native');
            haptics.success();
          } catch (err) {
            if ((err as Error).name !== 'AbortError') {
              showToast('Failed to share', 'error');
            }
          }
        } else {
          copyToClipboard();
        }
      },
    },
    {
      id: 'twitter',
      label: 'X / Twitter',
      icon: '𝕏',
      action: () => {
        const tweetText = encodeURIComponent(`${data.text}\n\n`);
        const url = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(shareUrl)}&hashtags=${hashtagString}`;
        window.open(url, '_blank', 'width=550,height=420');
        onShare?.('twitter');
      },
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: '📘',
      action: () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(data.text)}`;
        window.open(url, '_blank', 'width=550,height=420');
        onShare?.('facebook');
      },
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: '💬',
      action: () => {
        const text = encodeURIComponent(`${data.title}\n\n${data.text}\n\n${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        onShare?.('whatsapp');
      },
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      icon: '💼',
      action: () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank', 'width=550,height=420');
        onShare?.('linkedin');
      },
    },
    {
      id: 'copy',
      label: 'Copy Link',
      icon: '📋',
      action: copyToClipboard,
    },
  ];

  function copyToClipboard() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('Link copied to clipboard!', 'success');
      haptics.success();
      onShare?.('copy');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
    setShowMenu(false);
  }

  const handleClick = () => {
    haptics.light();
    // On mobile with native share, use it directly
    if (typeof navigator.share === 'function' && variant === 'icon') {
      shareOptions[0].action();
    } else {
      setShowMenu(!showMenu);
    }
  };

  if (variant === 'icon') {
    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={handleClick}
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Share"
        >
          📤
        </button>

        {showMenu && (
          <ShareMenu
            options={shareOptions}
            onClose={() => setShowMenu(false)}
            theme={theme}
          />
        )}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={handleClick}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            background: theme.colors.background.secondary,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: '8px',
            color: theme.colors.text.secondary,
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          <span>📤</span>
          <span>Share</span>
        </button>

        {showMenu && (
          <ShareMenu
            options={shareOptions}
            onClose={() => setShowMenu(false)}
            theme={theme}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleClick}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
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

      {showMenu && (
        <ShareMenu
          options={shareOptions}
          onClose={() => setShowMenu(false)}
          theme={theme}
        />
      )}
    </div>
  );
};

// Share menu dropdown
const ShareMenu: React.FC<{
  options: Array<{ id: string; label: string; icon: string; action: () => void }>;
  onClose: () => void;
  theme: any;
}> = ({ options, onClose, theme }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
        }}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '8px',
          background: theme.colors.card,
          borderRadius: '12px',
          boxShadow: theme.shadows.large,
          border: `1px solid ${theme.colors.border}`,
          overflow: 'hidden',
          zIndex: 1000,
          minWidth: '180px',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              option.action();
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '12px 16px',
              background: 'transparent',
              border: 'none',
              color: theme.colors.text.primary,
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = theme.colors.background.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <span style={{ fontSize: '18px' }}>{option.icon}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </>
  );
};

// Share Achievement Card - generates a shareable image-like card
export const ShareAchievementCard: React.FC<{
  title: string;
  description: string;
  emoji: string;
  userName: string;
  stat?: string;
}> = ({ title, description, emoji, userName, stat }) => {
  const { theme } = useTheme();

  const shareData = {
    title: `${userName} earned "${title}" on Dad Hub!`,
    text: `${emoji} ${title}\n${description}${stat ? `\n${stat}` : ''}\n\nJoin the Brotherhood of Fatherhood!`,
    hashtags: ['DadHub', 'DadLife', 'ProudDad', 'Fatherhood'],
  };

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background.primary}, ${theme.colors.background.secondary})`,
        borderRadius: '16px',
        padding: '24px',
        border: `1px solid ${theme.colors.border}`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '64px',
          marginBottom: '16px',
          animation: 'popIn 0.5s ease-out',
        }}
      >
        {emoji}
      </div>

      <h3
        style={{
          margin: '0 0 8px 0',
          fontSize: '20px',
          fontWeight: 700,
          color: theme.colors.text.primary,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '14px',
          color: theme.colors.text.secondary,
        }}
      >
        {description}
      </p>

      {stat && (
        <div
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            background: `${theme.colors.accent.primary}20`,
            borderRadius: '20px',
            color: theme.colors.accent.primary,
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '16px',
          }}
        >
          {stat}
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <ShareButton data={shareData} variant="button" />
      </div>
    </div>
  );
};

// Quick share for posts
export const PostShareButton: React.FC<{
  postId: string;
  postTitle: string;
  postPreview: string;
  authorName: string;
}> = ({ postId, postTitle, postPreview, authorName }) => {
  const shareData = {
    title: postTitle || `Post by ${authorName} on Dad Hub`,
    text: postPreview.slice(0, 200) + (postPreview.length > 200 ? '...' : ''),
    url: `${SITE_URL}/post/${postId}`,
    hashtags: ['DadHub', 'DadLife'],
  };

  return <ShareButton data={shareData} variant="icon" />;
};

// Share badge unlock
export const BadgeShareButton: React.FC<{
  badgeName: string;
  badgeEmoji: string;
  badgeDescription: string;
  userName: string;
}> = ({ badgeName, badgeEmoji, badgeDescription, userName }) => {
  const shareData = {
    title: `${userName} unlocked the "${badgeName}" badge!`,
    text: `${badgeEmoji} ${badgeName}\n${badgeDescription}\n\nJoin Dad Hub and start earning badges!`,
    hashtags: ['DadHub', 'Achievement', 'ProudDad'],
  };

  return <ShareButton data={shareData} variant="compact" />;
};

// Share level up
export const LevelUpShareButton: React.FC<{
  level: number;
  levelTitle: string;
  userName: string;
}> = ({ level, levelTitle, userName }) => {
  const shareData = {
    title: `${userName} reached Level ${level} on Dad Hub!`,
    text: `🎉 Level Up!\n\nI just reached Level ${level}: ${levelTitle}\n\nJoin the Brotherhood of Fatherhood!`,
    hashtags: ['DadHub', 'LevelUp', 'DadLife'],
  };

  return <ShareButton data={shareData} variant="button" />;
};
