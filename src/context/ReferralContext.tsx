import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  xpEarned: number;
}

interface Referral {
  id: string;
  referredUserId: string;
  referredUserName: string;
  referredUserAvatar: string;
  status: 'pending' | 'completed';
  createdAt: Date;
  completedAt?: Date;
  xpAwarded: number;
}

interface ReferralContextType {
  referralCode: string;
  referralLink: string;
  stats: ReferralStats;
  referrals: Referral[];
  isLoading: boolean;
  generateReferralCode: () => Promise<string>;
  applyReferralCode: (code: string) => Promise<boolean>;
  getReferralLeaderboard: () => Promise<Array<{ userId: string; userName: string; userAvatar: string; count: number }>>;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

export const useReferral = () => {
  const context = useContext(ReferralContext);
  if (!context) {
    throw new Error('useReferral must be used within a ReferralProvider');
  }
  return context;
};

const SITE_URL = 'https://dad-hub-ab086.web.app';
const XP_PER_REFERRAL = 100;
const REFERRAL_STORAGE_KEY = 'dadhub-pending-referral';

interface ReferralProviderProps {
  children: ReactNode;
}

export const ReferralProvider: React.FC<ReferralProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    pendingReferrals: 0,
    xpEarned: 0,
  });
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const referralLink = referralCode ? `${SITE_URL}?ref=${referralCode}` : '';

  // Generate a unique referral code
  const generateCode = (userId: string): string => {
    const prefix = 'DAD';
    const hash = userId.slice(-6).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}${hash}${random}`;
  };

  // Load or create referral code
  const generateReferralCode = useCallback(async (): Promise<string> => {
    if (!user?.uid) return '';

    try {
      const referralRef = doc(db, 'referralCodes', user.uid);
      const referralDoc = await getDoc(referralRef);

      if (referralDoc.exists()) {
        const code = referralDoc.data().code;
        setReferralCode(code);
        return code;
      }

      // Generate new code
      const newCode = generateCode(user.uid);

      await setDoc(referralRef, {
        code: newCode,
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
        createdAt: serverTimestamp(),
        totalReferrals: 0,
        successfulReferrals: 0,
        xpEarned: 0,
      });

      // Also store reverse lookup
      await setDoc(doc(db, 'referralLookup', newCode), {
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
      });

      setReferralCode(newCode);
      return newCode;
    } catch (error) {
      console.error('Error generating referral code:', error);
      return '';
    }
  }, [user]);

  // Apply a referral code (called when new user signs up)
  const applyReferralCode = useCallback(async (code: string): Promise<boolean> => {
    if (!user?.uid || !code) return false;

    try {
      // Look up the referrer
      const lookupRef = doc(db, 'referralLookup', code.toUpperCase());
      const lookupDoc = await getDoc(lookupRef);

      if (!lookupDoc.exists()) {
        showToast('Invalid referral code', 'error');
        return false;
      }

      const referrerId = lookupDoc.data().userId;

      // Can't refer yourself
      if (referrerId === user.uid) {
        showToast("You can't use your own referral code", 'error');
        return false;
      }

      // Check if already referred
      const existingRef = doc(db, 'referrals', `${referrerId}_${user.uid}`);
      const existingDoc = await getDoc(existingRef);

      if (existingDoc.exists()) {
        showToast('Referral already applied', 'info');
        return false;
      }

      // Create referral record
      await setDoc(existingRef, {
        referrerId,
        referredUserId: user.uid,
        referredUserName: user.name,
        referredUserAvatar: user.avatar,
        status: 'completed',
        createdAt: serverTimestamp(),
        completedAt: serverTimestamp(),
        xpAwarded: XP_PER_REFERRAL,
      });

      // Update referrer's stats
      const referrerCodeRef = doc(db, 'referralCodes', referrerId);
      await updateDoc(referrerCodeRef, {
        totalReferrals: increment(1),
        successfulReferrals: increment(1),
        xpEarned: increment(XP_PER_REFERRAL),
      });

      // Award XP to referrer (you'd integrate with GamificationContext here)
      const referrerRef = doc(db, 'users', referrerId);
      await updateDoc(referrerRef, {
        xp: increment(XP_PER_REFERRAL),
      });

      // Mark referred user
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        referredBy: referrerId,
        referralCode: code,
      });

      showToast(`Referral applied! Your friend earned ${XP_PER_REFERRAL} XP`, 'success');

      // Clear stored referral code
      localStorage.removeItem(REFERRAL_STORAGE_KEY);

      return true;
    } catch (error) {
      console.error('Error applying referral code:', error);
      showToast('Failed to apply referral code', 'error');
      return false;
    }
  }, [user, showToast]);

  // Get referral leaderboard
  const getReferralLeaderboard = useCallback(async () => {
    try {
      const codesRef = collection(db, 'referralCodes');
      const q = query(codesRef, where('successfulReferrals', '>', 0));
      const snapshot = await getDocs(q);

      const leaderboard = snapshot.docs
        .map((doc) => ({
          userId: doc.data().userId,
          userName: doc.data().userName,
          userAvatar: doc.data().userAvatar,
          count: doc.data().successfulReferrals,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return leaderboard;
    } catch (error) {
      console.error('Error getting referral leaderboard:', error);
      return [];
    }
  }, []);

  // Load user's referral data
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) {
      setIsLoading(false);
      return;
    }

    const loadReferralData = async () => {
      try {
        // Load or create referral code
        await generateReferralCode();

        // Load stats
        const codeRef = doc(db, 'referralCodes', user.uid);
        const codeDoc = await getDoc(codeRef);

        if (codeDoc.exists()) {
          const data = codeDoc.data();
          setStats({
            totalReferrals: data.totalReferrals || 0,
            successfulReferrals: data.successfulReferrals || 0,
            pendingReferrals: (data.totalReferrals || 0) - (data.successfulReferrals || 0),
            xpEarned: data.xpEarned || 0,
          });
        }

        // Load referral history
        const referralsRef = collection(db, 'referrals');
        const q = query(referralsRef, where('referrerId', '==', user.uid));
        const snapshot = await getDocs(q);

        const referralList: Referral[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          referredUserId: doc.data().referredUserId,
          referredUserName: doc.data().referredUserName,
          referredUserAvatar: doc.data().referredUserAvatar,
          status: doc.data().status,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          completedAt: doc.data().completedAt?.toDate(),
          xpAwarded: doc.data().xpAwarded || 0,
        }));

        setReferrals(referralList);
      } catch (error) {
        console.error('Error loading referral data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReferralData();
  }, [isAuthenticated, user?.uid, generateReferralCode]);

  // Check for pending referral code from URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
      // Store it for after signup
      localStorage.setItem(REFERRAL_STORAGE_KEY, refCode);

      // Clean the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, []);

  // Apply stored referral code after authentication
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    const storedCode = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (storedCode) {
      applyReferralCode(storedCode);
    }
  }, [isAuthenticated, user?.uid, applyReferralCode]);

  return (
    <ReferralContext.Provider
      value={{
        referralCode,
        referralLink,
        stats,
        referrals,
        isLoading,
        generateReferralCode,
        applyReferralCode,
        getReferralLeaderboard,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};
