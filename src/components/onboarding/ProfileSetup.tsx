import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { haptics } from '../../utils/haptics';

interface ProfileSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

const DAD_TYPES = [
  { id: 'new', emoji: '👶', label: 'New Dad', description: 'First time dad, learning the ropes' },
  { id: 'experienced', emoji: '👨‍👧‍👦', label: 'Experienced Dad', description: 'Been at this for a while' },
  { id: 'veteran', emoji: '🧔', label: 'Veteran Dad', description: 'Kids are grown, sharing wisdom' },
  { id: 'stepdad', emoji: '💪', label: 'Stepdad', description: 'Stepping up for my family' },
  { id: 'granddad', emoji: '👴', label: 'Granddad', description: 'Double the fun, half the responsibility' },
];

const INTERESTS = [
  { id: 'grilling', emoji: '🔥', label: 'Grilling & BBQ' },
  { id: 'sports', emoji: '⚽', label: 'Sports' },
  { id: 'gaming', emoji: '🎮', label: 'Gaming' },
  { id: 'diy', emoji: '🔧', label: 'DIY Projects' },
  { id: 'outdoors', emoji: '🏕️', label: 'Outdoors' },
  { id: 'tech', emoji: '💻', label: 'Technology' },
  { id: 'cooking', emoji: '🍳', label: 'Cooking' },
  { id: 'music', emoji: '🎸', label: 'Music' },
  { id: 'fitness', emoji: '🏋️', label: 'Fitness' },
  { id: 'cars', emoji: '🚗', label: 'Cars' },
  { id: 'reading', emoji: '📚', label: 'Reading' },
  { id: 'travel', emoji: '✈️', label: 'Travel' },
];

const AVATARS = ['👨', '🧔', '👴', '🧑', '👦', '🧑‍🦱', '👨‍🦰', '👨‍🦳', '🧑‍🦲', '🤵', '👷', '🧙‍♂️'];

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, onSkip }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [dadType, setDadType] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '👨');
  const [dadName, setDadName] = useState(user?.name || '');

  const totalSteps = 4;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      haptics.light();
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      haptics.light();
    }
  };

  const handleComplete = () => {
    haptics.success();
    // Save profile data (would be saved to backend in real app)
    const profileData = {
      dadType,
      interests: selectedInterests,
      avatar: selectedAvatar,
      name: dadName,
    };
    localStorage.setItem(`dadhub-profile-setup-${user?.uid}`, JSON.stringify(profileData));
    onComplete();
  };

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev =>
      prev.includes(interestId)
        ? prev.filter(i => i !== interestId)
        : [...prev, interestId]
    );
    haptics.light();
  };

  const canProceed = () => {
    switch (step) {
      case 0: return dadName.trim().length > 0;
      case 1: return dadType !== null;
      case 2: return selectedInterests.length >= 3;
      case 3: return true;
      default: return true;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.9)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: theme.colors.background.primary,
          borderRadius: '24px',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s ease-out',
        }}
      >
        {/* Progress Bar */}
        <div style={{ height: '4px', background: theme.colors.background.tertiary }}>
          <div
            style={{
              height: '100%',
              width: `${progress}%`,
              background: theme.colors.accent.gradient,
              transition: 'width 0.3s',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: '32px 24px' }}>
          {/* Step 0: Name & Avatar */}
          {step === 0 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: theme.colors.text.primary }}>
                  Welcome, Dad! 👋
                </h2>
                <p style={{ margin: 0, color: theme.colors.text.secondary }}>
                  Let's set up your profile
                </p>
              </div>

              {/* Avatar Selection */}
              <div style={{ marginBottom: '24px' }}>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.secondary }}>
                  Choose your avatar
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                  {AVATARS.map(avatar => (
                    <button
                      key={avatar}
                      onClick={() => { setSelectedAvatar(avatar); haptics.light(); }}
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        border: selectedAvatar === avatar ? `3px solid ${theme.colors.accent.primary}` : `2px solid ${theme.colors.border}`,
                        background: selectedAvatar === avatar ? `${theme.colors.accent.primary}20` : theme.colors.background.secondary,
                        fontSize: '28px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {avatar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Input */}
              <div>
                <p style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: theme.colors.text.secondary }}>
                  What should we call you?
                </p>
                <input
                  type="text"
                  value={dadName}
                  onChange={(e) => setDadName(e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${theme.colors.border}`,
                    background: theme.colors.background.secondary,
                    color: theme.colors.text.primary,
                    fontSize: '16px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 1: Dad Type */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: theme.colors.text.primary }}>
                  What kind of dad are you?
                </h2>
                <p style={{ margin: 0, color: theme.colors.text.secondary }}>
                  Help us personalize your experience
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {DAD_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => { setDadType(type.id); haptics.medium(); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px',
                      borderRadius: '14px',
                      border: dadType === type.id ? `2px solid ${theme.colors.accent.primary}` : `2px solid ${theme.colors.border}`,
                      background: dadType === type.id ? `${theme.colors.accent.primary}15` : theme.colors.background.secondary,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>{type.emoji}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>{type.label}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: theme.colors.text.muted }}>{type.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Interests */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: theme.colors.text.primary }}>
                  What are you into?
                </h2>
                <p style={{ margin: 0, color: theme.colors.text.secondary }}>
                  Select at least 3 interests
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {INTERESTS.map(interest => {
                  const isSelected = selectedInterests.includes(interest.id);
                  return (
                    <button
                      key={interest.id}
                      onClick={() => toggleInterest(interest.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 16px',
                        borderRadius: '20px',
                        border: isSelected ? `2px solid ${theme.colors.accent.primary}` : `2px solid ${theme.colors.border}`,
                        background: isSelected ? `${theme.colors.accent.primary}20` : theme.colors.background.secondary,
                        color: isSelected ? theme.colors.accent.primary : theme.colors.text.primary,
                        fontSize: '14px',
                        fontWeight: isSelected ? 600 : 400,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span>{interest.emoji}</span>
                      {interest.label}
                    </button>
                  );
                })}
              </div>

              <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: theme.colors.text.muted }}>
                {selectedInterests.length} of 3+ selected
              </p>
            </div>
          )}

          {/* Step 3: Ready! */}
          {step === 3 && (
            <div style={{ animation: 'fadeIn 0.3s ease-out', textAlign: 'center' }}>
              <div style={{ fontSize: '80px', marginBottom: '16px' }}>🎉</div>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: 700, color: theme.colors.text.primary }}>
                You're all set, {dadName}!
              </h2>
              <p style={{ margin: '0 0 24px 0', color: theme.colors.text.secondary, lineHeight: 1.6 }}>
                Welcome to the Brotherhood of Fatherhood. You're about to join thousands of dads sharing laughs, advice, and support.
              </p>

              {/* Summary */}
              <div
                style={{
                  padding: '16px',
                  background: theme.colors.background.secondary,
                  borderRadius: '14px',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '40px' }}>{selectedAvatar}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: theme.colors.text.primary }}>{dadName}</p>
                    <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.muted }}>
                      {DAD_TYPES.find(t => t.id === dadType)?.label}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {selectedInterests.slice(0, 5).map(id => {
                    const interest = INTERESTS.find(i => i.id === id);
                    return (
                      <span
                        key={id}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: `${theme.colors.accent.primary}20`,
                          color: theme.colors.accent.primary,
                          fontSize: '12px',
                        }}
                      >
                        {interest?.emoji} {interest?.label}
                      </span>
                    );
                  })}
                  {selectedInterests.length > 5 && (
                    <span style={{ fontSize: '12px', color: theme.colors.text.muted }}>
                      +{selectedInterests.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            {step > 0 && (
              <button
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: `2px solid ${theme.colors.border}`,
                  background: 'transparent',
                  color: theme.colors.text.secondary,
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              style={{
                flex: step === 0 ? 1 : 2,
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: canProceed() ? theme.colors.accent.gradient : theme.colors.border,
                color: canProceed() ? '#fff' : theme.colors.text.muted,
                fontSize: '16px',
                fontWeight: 600,
                cursor: canProceed() ? 'pointer' : 'default',
              }}
            >
              {step === totalSteps - 1 ? "Let's Go!" : 'Continue'}
            </button>
          </div>

          {step === 0 && (
            <button
              onClick={onSkip}
              style={{
                width: '100%',
                marginTop: '12px',
                padding: '10px',
                background: 'transparent',
                border: 'none',
                color: theme.colors.text.muted,
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Skip for now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
