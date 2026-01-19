import React, { useState } from 'react';
import { Button, Card } from '../common';
import { copyToClipboard } from '../../utils/helpers';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';

interface JokeActionsProps {
  onNext: () => void;
  onSubmitNew: () => void;
  showSubmitForm: boolean;
}

export const JokeActions: React.FC<JokeActionsProps> = ({ onNext, onSubmitNew, showSubmitForm }) => {
  const { jokes, jokeIndex, chats, sendMessage, setActiveTab, setActiveChat } = useApp();
  const { theme, mode } = useTheme();
  const [copied, setCopied] = useState(false);
  const [showChatPicker, setShowChatPicker] = useState(false);

  const currentJoke = jokes[jokeIndex];
  const jokeText = `${currentJoke.joke}\n\n${currentJoke.punchline} 😂`;

  const handleCopy = async () => {
    const success = await copyToClipboard(jokeText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleText = () => {
    const encodedText = encodeURIComponent(jokeText);
    window.open(`sms:?body=${encodedText}`, '_blank');
  };

  const handleShareToChat = async (chatId: string) => {
    try {
      await sendMessage(chatId, jokeText);
      setShowChatPicker(false);
      setActiveChat(chatId);
      setActiveTab('chat');
    } catch (error) {
      console.error('Failed to share joke:', error);
      alert('Failed to share joke. Please try again.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button size="large" onClick={onNext} icon="🎲">
          Another One!
        </Button>
        <Button
          variant={showSubmitForm ? 'secondary' : 'ghost'}
          size="large"
          onClick={onSubmitNew}
          icon="✏️"
        >
          Submit Joke
        </Button>
      </div>

      <Card style={{ width: '100%', maxWidth: '400px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 700 }}>
          📤 Share the Laughs
        </h4>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Button variant="secondary" size="small" onClick={handleCopy}>
            {copied ? '✓ Copied!' : '📋 Copy'}
          </Button>
          <Button variant="secondary" size="small" onClick={() => setShowChatPicker(!showChatPicker)}>
            💬 Chat
          </Button>
          <Button variant="secondary" size="small" onClick={handleText}>
            📱 Text
          </Button>
        </div>

        {showChatPicker && (
          <div style={{ marginTop: '16px', borderTop: `1px solid ${theme.colors.border}`, paddingTop: '16px' }}>
            <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: theme.colors.text.secondary }}>
              Select a chat to share:
            </p>
            {chats.length === 0 ? (
              <p style={{ color: theme.colors.text.muted, fontSize: '13px', textAlign: 'center' }}>
                No chats yet. Start a chat first!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleShareToChat(chat.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px',
                      background: mode === 'dark' ? 'rgba(28, 25, 23, 0.5)' : 'rgba(231, 229, 228, 0.5)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: theme.colors.text.primary,
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{chat.emoji}</span>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{chat.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </>
  );
};
