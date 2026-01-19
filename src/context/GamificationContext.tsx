import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Badge } from '../types';
import {
  XPReason,
  XP_VALUES,
  LevelDefinition,
  LEVELS,
  getLevelFromXP,
  getXPToNextLevel,
  getLevelProgress,
  LeaderboardType,
  LeaderboardEntryFull,
  StreakData,
  ActivityDay,
} from '../types/gamification';
import { BADGE_DEFINITIONS, getBadgeById } from '../data/badges';

interface GamificationContextType {
  // XP & Levels
  xp: number;
  level: number;
  levelName: string;
  levelIcon: string;
  levelColor: string;
  xpToNextLevel: number;
  levelProgress: number;
  addXP: (reason: XPReason, multiplier?: number) => Promise<void>;

  // Streaks
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  totalActiveDays: number;
  activityHistory: ActivityDay[];
  checkAndUpdateStreak: () => Promise<void>;
  useStreakFreeze: () => Promise<boolean>;

  // Badges
  userBadges: Badge[];
  allBadges: typeof BADGE_DEFINITIONS;
  awardBadge: (badgeId: string) => Promise<void>;
  checkBadgeEligibility: () => Promise<string[]>;
  hasBadge: (badgeId: string) => boolean;

  // Leaderboard
  leaderboardData: LeaderboardEntryFull[];
  leaderboardType: LeaderboardType;
  userRank: number | null;
  isLoadingLeaderboard: boolean;
  fetchLeaderboard: (type: LeaderboardType) => Promise<void>;

  // User Stats for badge calculations
  userStats: {
    postsCount: number;
    commentsCount: number;
    friendsCount: number;
    jokesCount: number;
    eventsCount: number;
    groupsCount: number;
    storiesCount: number;
    reactionsReceived: number;
  };
  updateUserStats: (stats: Partial<GamificationContextType['userStats']>) => void;

  // Loading states
  isLoading: boolean;

  // Level up notification
  showLevelUp: boolean;
  newLevel: LevelDefinition | null;
  dismissLevelUp: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const { user } = useAuth();

  // XP & Level state
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [levelInfo, setLevelInfo] = useState<LevelDefinition>(LEVELS[0]);

  // Streak state
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [streakFreezes, setStreakFreezes] = useState(0);
  const [totalActiveDays, setTotalActiveDays] = useState(0);
  const [activityHistory, setActivityHistory] = useState<ActivityDay[]>([]);

  // Badge state
  const [userBadges, setUserBadges] = useState<Badge[]>([]);

  // Leaderboard state
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntryFull[]>([]);
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>('weekly');
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);

  // User stats for badge calculations
  const [userStats, setUserStats] = useState({
    postsCount: 0,
    commentsCount: 0,
    friendsCount: 0,
    jokesCount: 0,
    eventsCount: 0,
    groupsCount: 0,
    storiesCount: 0,
    reactionsReceived: 0,
  });

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Level up notification
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState<LevelDefinition | null>(null);

  // Load user gamification data
  useEffect(() => {
    const loadGamificationData = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }

      try {
        // Load XP data from user document
        const userXP = user.xp || 0;
        const userLevel = getLevelFromXP(userXP);
        setXP(userXP);
        setLevel(userLevel.level);
        setLevelInfo(userLevel);

        // Load badges
        setUserBadges(user.badges || []);

        // Load streak data
        const streakDoc = await getDoc(doc(db, 'streaks', user.uid));
        if (streakDoc.exists()) {
          const streakData = streakDoc.data() as StreakData;
          setCurrentStreak(streakData.currentStreak || 0);
          setLongestStreak(streakData.longestStreak || 0);
          setStreakFreezes(streakData.streakFreezes || 0);
          setTotalActiveDays(streakData.totalActiveDays || 0);
          setActivityHistory(streakData.activityHistory || []);
        }

        // Load user stats
        const statsDoc = await getDoc(doc(db, 'userStats', user.uid));
        if (statsDoc.exists()) {
          const stats = statsDoc.data();
          setUserStats({
            postsCount: stats.postsCount || 0,
            commentsCount: stats.commentsCount || 0,
            friendsCount: stats.friendsCount || 0,
            jokesCount: stats.jokesCount || 0,
            eventsCount: stats.eventsCount || 0,
            groupsCount: stats.groupsCount || 0,
            storiesCount: stats.storiesCount || 0,
            reactionsReceived: stats.reactionsReceived || 0,
          });
        }
      } catch (error) {
        console.error('Error loading gamification data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGamificationData();
  }, [user]);

  // Add XP
  const addXP = useCallback(async (reason: XPReason, multiplier: number = 1) => {
    if (!user?.uid) return;

    const xpAmount = Math.round(XP_VALUES[reason] * multiplier);
    const newXP = xp + xpAmount;
    const currentLevel = getLevelFromXP(xp);
    const newLevelInfo = getLevelFromXP(newXP);

    try {
      // Update user document
      await updateDoc(doc(db, 'users', user.uid), {
        xp: increment(xpAmount),
        totalXpEarned: increment(xpAmount),
        level: newLevelInfo.level,
      });

      // Log XP event
      await setDoc(doc(collection(db, 'xpEvents')), {
        userId: user.uid,
        amount: xpAmount,
        reason,
        timestamp: serverTimestamp(),
      });

      // Update local state
      setXP(newXP);
      setLevel(newLevelInfo.level);
      setLevelInfo(newLevelInfo);

      // Check for level up
      if (newLevelInfo.level > currentLevel.level) {
        setNewLevel(newLevelInfo);
        setShowLevelUp(true);
      }

      // Check for badge eligibility after XP gain
      await checkBadgeEligibility();
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  }, [user, xp]);

  // Check and update streak
  const checkAndUpdateStreak = useCallback(async () => {
    if (!user?.uid) return;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    try {
      const streakRef = doc(db, 'streaks', user.uid);
      const streakDoc = await getDoc(streakRef);

      if (streakDoc.exists()) {
        const data = streakDoc.data();
        // Handle both Firestore Timestamp and regular Date
        const lastActiveRaw = data.lastActiveDate;
        const lastActiveDate = lastActiveRaw && typeof lastActiveRaw.toDate === 'function'
          ? lastActiveRaw.toDate()
          : lastActiveRaw instanceof Date
          ? lastActiveRaw
          : null;
        const lastActive = lastActiveDate ? lastActiveDate.toISOString().split('T')[0] : null;

        if (lastActive === today) {
          // Already logged in today, no streak update needed
          return;
        }

        let newStreak = data.currentStreak;
        let newLongest = data.longestStreak;

        if (lastActive === yesterday) {
          // Consecutive day - increment streak
          newStreak = data.currentStreak + 1;
          newLongest = Math.max(newLongest, newStreak);
        } else if (lastActive !== today) {
          // Streak broken - reset to 1
          newStreak = 1;
        }

        const newHistory = [...(data.activityHistory || [])];
        if (!newHistory.find(d => d.date === today)) {
          newHistory.push({ date: today, active: true, xpEarned: 0 });
          // Keep only last 90 days
          if (newHistory.length > 90) {
            newHistory.shift();
          }
        }

        await updateDoc(streakRef, {
          currentStreak: newStreak,
          longestStreak: newLongest,
          lastActiveDate: serverTimestamp(),
          totalActiveDays: increment(1),
          activityHistory: newHistory,
        });

        setCurrentStreak(newStreak);
        setLongestStreak(newLongest);
        setTotalActiveDays(prev => prev + 1);
        setActivityHistory(newHistory);

        // Award streak XP bonus
        const streakMultiplier = Math.min(newStreak, 10) / 10;
        await addXP('daily_login', 1);
        if (newStreak > 1) {
          await addXP('streak_bonus', streakMultiplier);
        }

        // Check for streak badges
        await checkBadgeEligibility();
      } else {
        // First time - create streak document
        const newStreakData: StreakData = {
          currentStreak: 1,
          longestStreak: 1,
          lastActiveDate: new Date(),
          streakFreezes: 0,
          totalActiveDays: 1,
          activityHistory: [{ date: today, active: true, xpEarned: XP_VALUES.daily_login }],
        };

        await setDoc(streakRef, {
          ...newStreakData,
          lastActiveDate: serverTimestamp(),
        });

        setCurrentStreak(1);
        setLongestStreak(1);
        setTotalActiveDays(1);
        setActivityHistory(newStreakData.activityHistory);

        await addXP('daily_login', 1);
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [user, addXP]);

  // Use streak freeze
  const useStreakFreeze = useCallback(async (): Promise<boolean> => {
    if (!user?.uid || streakFreezes <= 0) return false;

    try {
      await updateDoc(doc(db, 'streaks', user.uid), {
        streakFreezes: increment(-1),
      });
      setStreakFreezes(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error using streak freeze:', error);
      return false;
    }
  }, [user, streakFreezes]);

  // Award badge
  const awardBadge = useCallback(async (badgeId: string) => {
    if (!user?.uid) return;

    const badgeDef = getBadgeById(badgeId);
    if (!badgeDef) return;

    // Check if already has badge
    if (userBadges.some(b => b.id === badgeId)) return;

    const newBadge: Badge = {
      id: badgeDef.id,
      name: badgeDef.name,
      icon: badgeDef.icon,
      description: badgeDef.description,
      rarity: badgeDef.rarity,
      unlockedAt: new Date(),
    };

    try {
      const updatedBadges = [...userBadges, newBadge];
      await updateDoc(doc(db, 'users', user.uid), {
        badges: updatedBadges,
      });

      // Log badge unlock
      await setDoc(doc(collection(db, 'userBadges')), {
        userId: user.uid,
        badgeId,
        unlockedAt: serverTimestamp(),
      });

      setUserBadges(updatedBadges);

      // Award XP for badge
      await addXP('badge_earned', 1);
    } catch (error) {
      console.error('Error awarding badge:', error);
    }
  }, [user, userBadges, addXP]);

  // Check badge eligibility
  const checkBadgeEligibility = useCallback(async (): Promise<string[]> => {
    if (!user?.uid) return [];

    const newlyUnlockedBadges: string[] = [];

    for (const badge of BADGE_DEFINITIONS) {
      if (userBadges.some(b => b.id === badge.id)) continue;

      let threshold = badge.requirement.threshold;
      let currentValue = 0;

      switch (badge.requirement.type) {
        case 'posts':
          currentValue = userStats.postsCount;
          break;
        case 'comments':
          currentValue = userStats.commentsCount;
          break;
        case 'friends':
          currentValue = userStats.friendsCount;
          break;
        case 'jokes':
          currentValue = userStats.jokesCount;
          break;
        case 'events':
          currentValue = userStats.eventsCount;
          break;
        case 'groups':
          currentValue = userStats.groupsCount;
          break;
        case 'stories':
          currentValue = userStats.storiesCount;
          break;
        case 'reactions':
          currentValue = userStats.reactionsReceived;
          break;
        case 'streaks':
          currentValue = longestStreak;
          break;
        case 'xp':
          currentValue = xp;
          break;
        case 'level':
          currentValue = level;
          break;
      }

      if (currentValue >= threshold) {
        await awardBadge(badge.id);
        newlyUnlockedBadges.push(badge.id);
      }
    }

    return newlyUnlockedBadges;
  }, [user, userBadges, userStats, longestStreak, xp, level, awardBadge]);

  // Check if user has badge
  const hasBadge = useCallback((badgeId: string): boolean => {
    return userBadges.some(b => b.id === badgeId);
  }, [userBadges]);

  // Fetch leaderboard
  const fetchLeaderboard = useCallback(async (type: LeaderboardType) => {
    setIsLoadingLeaderboard(true);
    setLeaderboardType(type);

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('xp', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const entries: LeaderboardEntryFull[] = [];
      let rank = 1;
      let foundUser = false;

      snapshot.forEach(doc => {
        const data = doc.data();
        const levelInfo = getLevelFromXP(data.xp || 0);
        const isCurrentUser = user?.uid === doc.id;

        if (isCurrentUser) {
          setUserRank(rank);
          foundUser = true;
        }

        entries.push({
          rank,
          userId: doc.id,
          name: data.name,
          avatar: data.avatar,
          xp: data.xp || 0,
          level: levelInfo.level,
          levelIcon: levelInfo.icon,
          isYou: isCurrentUser,
        });
        rank++;
      });

      if (!foundUser && user?.uid) {
        setUserRank(null);
      }

      setLeaderboardData(entries);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  }, [user]);

  // Update user stats
  const updateUserStats = useCallback((stats: Partial<typeof userStats>) => {
    setUserStats(prev => {
      const updated = { ...prev, ...stats };

      // Persist to Firestore
      if (user?.uid) {
        setDoc(doc(db, 'userStats', user.uid), updated, { merge: true }).catch(console.error);
      }

      return updated;
    });
  }, [user]);

  // Dismiss level up notification
  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
    setNewLevel(null);
  }, []);

  return (
    <GamificationContext.Provider
      value={{
        // XP & Levels
        xp,
        level,
        levelName: levelInfo.name,
        levelIcon: levelInfo.icon,
        levelColor: levelInfo.color,
        xpToNextLevel: getXPToNextLevel(xp),
        levelProgress: getLevelProgress(xp),
        addXP,

        // Streaks
        currentStreak,
        longestStreak,
        streakFreezes,
        totalActiveDays,
        activityHistory,
        checkAndUpdateStreak,
        useStreakFreeze,

        // Badges
        userBadges,
        allBadges: BADGE_DEFINITIONS,
        awardBadge,
        checkBadgeEligibility,
        hasBadge,

        // Leaderboard
        leaderboardData,
        leaderboardType,
        userRank,
        isLoadingLeaderboard,
        fetchLeaderboard,

        // User Stats
        userStats,
        updateUserStats,

        // Loading
        isLoading,

        // Level up notification
        showLevelUp,
        newLevel,
        dismissLevelUp,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
