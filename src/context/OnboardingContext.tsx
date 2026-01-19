import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface OnboardingContextType {
  hasCompletedTour: boolean;
  currentTourStep: number;
  isTourActive: boolean;
  startTour: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  hasSeenFeature: (featureId: string) => boolean;
  markFeatureSeen: (featureId: string) => void;
  tourSteps: TourStep[];
}

export interface TourStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  emoji: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const defaultTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DadHub!',
    description: 'The Brotherhood of Fatherhood awaits. Let us show you around!',
    emoji: '👨‍👧‍👦',
  },
  {
    id: 'home',
    title: 'Your Home Feed',
    description: 'See posts from other dads, share your moments, and stay connected.',
    emoji: '🏠',
  },
  {
    id: 'stories',
    title: 'Dad Stories',
    description: 'Share quick moments that disappear in 24 hours. Perfect for those small dad wins!',
    emoji: '📖',
  },
  {
    id: 'chat',
    title: 'Connect & Chat',
    description: 'Message other dads, join group chats, and build your dad network.',
    emoji: '💬',
  },
  {
    id: 'groups',
    title: 'Dad Groups',
    description: 'Join groups like Grill Masters, Coach Dads, or Tech Dads to find your tribe.',
    emoji: '👥',
  },
  {
    id: 'wisdom',
    title: 'Dad Wisdom AI',
    description: 'Need advice? Our AI dad friend is here to help with parenting questions.',
    emoji: '🧔',
  },
  {
    id: 'gamification',
    title: 'Level Up!',
    description: 'Earn XP, unlock badges, and climb the leaderboard. May the best dad win!',
    emoji: '🏆',
  },
  {
    id: 'complete',
    title: "You're All Set!",
    description: "Welcome to the Brotherhood. Now go be the awesome dad you are!",
    emoji: '🎉',
  },
];

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

const STORAGE_KEY = 'dadhub-onboarding';
const FEATURES_KEY = 'dadhub-seen-features';

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [hasCompletedTour, setHasCompletedTour] = useState(true);
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [seenFeatures, setSeenFeatures] = useState<Set<string>>(new Set());

  // Load onboarding state from localStorage
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    const stored = localStorage.getItem(`${STORAGE_KEY}-${user.uid}`);
    if (stored) {
      const data = JSON.parse(stored);
      setHasCompletedTour(data.hasCompletedTour ?? false);
    } else {
      // New user - show tour
      setHasCompletedTour(false);
    }

    const featuresStored = localStorage.getItem(`${FEATURES_KEY}-${user.uid}`);
    if (featuresStored) {
      setSeenFeatures(new Set(JSON.parse(featuresStored)));
    }
  }, [isAuthenticated, user?.uid]);

  // Save state to localStorage
  const saveState = useCallback(
    (completed: boolean) => {
      if (!user?.uid) return;
      localStorage.setItem(
        `${STORAGE_KEY}-${user.uid}`,
        JSON.stringify({ hasCompletedTour: completed })
      );
    },
    [user?.uid]
  );

  const saveSeenFeatures = useCallback(
    (features: Set<string>) => {
      if (!user?.uid) return;
      localStorage.setItem(`${FEATURES_KEY}-${user.uid}`, JSON.stringify([...features]));
    },
    [user?.uid]
  );

  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentTourStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentTourStep < defaultTourSteps.length - 1) {
      setCurrentTourStep((prev) => prev + 1);
    } else {
      completeTour();
    }
  }, [currentTourStep]);

  const prevStep = useCallback(() => {
    if (currentTourStep > 0) {
      setCurrentTourStep((prev) => prev - 1);
    }
  }, [currentTourStep]);

  const skipTour = useCallback(() => {
    setIsTourActive(false);
    setHasCompletedTour(true);
    saveState(true);
  }, [saveState]);

  const completeTour = useCallback(() => {
    setIsTourActive(false);
    setHasCompletedTour(true);
    saveState(true);
  }, [saveState]);

  const hasSeenFeature = useCallback(
    (featureId: string): boolean => {
      return seenFeatures.has(featureId);
    },
    [seenFeatures]
  );

  const markFeatureSeen = useCallback(
    (featureId: string) => {
      setSeenFeatures((prev) => {
        const newSet = new Set(prev);
        newSet.add(featureId);
        saveSeenFeatures(newSet);
        return newSet;
      });
    },
    [saveSeenFeatures]
  );

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedTour,
        currentTourStep,
        isTourActive,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        completeTour,
        hasSeenFeature,
        markFeatureSeen,
        tourSteps: defaultTourSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};
