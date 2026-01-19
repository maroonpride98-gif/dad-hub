import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { WisdomMessage } from '../../types/wisdom';
import { Card, Button, Input } from '../common';

interface WisdomChatProps {
  onClose?: () => void;
}

// Simulated AI responses (in production, this would call an AI API)
const getDadWisdomResponse = async (question: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  const responses: Record<string, string[]> = {
    tantrums: [
      "Ah, the classic public meltdown! Here's the deal: stay calm (I know, easier said than done). Get down to their level, speak softly, and acknowledge their feelings. \"I know you really wanted that toy, and it's hard when we can't get what we want.\" Sometimes the best move is a tactical retreat - remove them from the situation, let them feel their feelings, and try again later. Remember: this too shall pass, and one day you'll miss those little outbursts. (Okay, maybe not miss them, but you'll survive them!)",
    ],
    sleep: [
      "Sleep? What's that? 😴 Just kidding - here's the dad wisdom: consistency is key. Same bedtime routine every night. No screens an hour before bed. Make your bedroom a sleep sanctuary - cool, dark, quiet. And here's the secret: don't try to be superhero dad all night. Split duties with your partner if possible. A well-rested dad is a better dad. Also, embrace the power nap. 20 minutes can feel like 8 hours when you're running on fumes!",
    ],
    workLife: [
      "The eternal struggle! Here's what I've learned: quality over quantity with the kids. When you're home, BE home - phone down, eyes up. Set boundaries at work - leave on time at least a few days a week. Use your commute to transition between \"work mode\" and \"dad mode.\" And don't be too hard on yourself - the fact that you're asking this question shows you care. Your kids won't remember every moment, but they'll remember that you were there for the important ones.",
    ],
    default: [
      "Great question! As a dad, I've learned that most problems don't have perfect solutions - just good-enough ones. Trust your instincts, stay patient, and remember: every dad is figuring it out as they go. The fact that you're asking questions and trying to improve shows you're already doing great. Keep it up, and don't forget to laugh at the chaos. That's the real secret to dad life! 😄",
      "You know what? Being a dad is basically being a professional problem-solver who works on no sleep. My advice: take it one day at a time, celebrate the small wins, and always keep your sense of humor handy. Also, don't compare yourself to other dads - you're doing your own unique job and that's enough. Now, what specifically can I help you think through?",
      "Ah, the mysteries of fatherhood! Here's a dad truth: we're all making it up as we go. The best dads aren't perfect - they're present, patient, and willing to learn. Whatever challenge you're facing, remember that millions of dads have faced it before. You've got this! Want to tell me more about what's on your mind?",
    ],
  };

  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('tantrum') || lowerQuestion.includes('meltdown')) {
    return responses.tantrums[Math.floor(Math.random() * responses.tantrums.length)];
  }
  if (lowerQuestion.includes('sleep') || lowerQuestion.includes('tired')) {
    return responses.sleep[Math.floor(Math.random() * responses.sleep.length)];
  }
  if (lowerQuestion.includes('work') || lowerQuestion.includes('balance') || lowerQuestion.includes('busy')) {
    return responses.workLife[Math.floor(Math.random() * responses.workLife.length)];
  }

  return responses.default[Math.floor(Math.random() * responses.default.length)];
};

export const WisdomChat: React.FC<WisdomChatProps> = ({ onClose }) => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<WisdomMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hey there, fellow dad! 👋 I'm Dad Wisdom AI - your virtual dad friend who's here to help with all things fatherhood. Whether you need parenting advice, work-life balance tips, or just someone to validate that yes, kids ARE that exhausting - I'm here for you. What's on your mind?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: WisdomMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await getDadWisdomResponse(userMessage.content);

      const assistantMessage: WisdomMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage: WisdomMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Oops! My dad brain had a hiccup. Can you try asking that again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '16px',
          borderBottom: `1px solid ${theme.colors.border}`,
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '32px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.colors.accent.primary + '20',
              borderRadius: '50%',
            }}
          >
            🧔
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: '16px',
                fontWeight: 700,
                color: theme.colors.text.primary,
              }}
            >
              Dad Wisdom AI
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: '12px',
                color: theme.colors.success,
              }}
            >
              ● Online
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: theme.colors.text.muted,
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          paddingRight: '8px',
        }}
      >
        {messages.map(message => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '12px 16px',
                borderRadius: message.role === 'user'
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                background: message.role === 'user'
                  ? theme.colors.accent.gradient
                  : theme.colors.background.secondary,
                color: message.role === 'user'
                  ? theme.colors.background.primary
                  : theme.colors.text.primary,
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: '14px',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {message.content}
              </p>
            </div>
            <span
              style={{
                fontSize: '10px',
                color: theme.colors.text.muted,
                marginTop: '4px',
              }}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}

        {isLoading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              background: theme.colors.background.secondary,
              borderRadius: '16px 16px 16px 4px',
              width: 'fit-content',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '4px',
              }}
            >
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: theme.colors.accent.primary,
                    animation: `bounce 1.4s infinite ease-in-out`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
              Thinking...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          paddingTop: '16px',
          borderTop: `1px solid ${theme.colors.border}`,
          marginTop: '16px',
        }}
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          disabled={isLoading}
          style={{ flex: 1 }}
        />
        <Button onClick={handleSend} disabled={isLoading || !inputValue.trim()}>
          Send
        </Button>
      </div>
    </Card>
  );
};
