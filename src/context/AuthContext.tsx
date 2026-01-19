import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';
import { User, ProfileSetupData } from '../types';

const ADMIN_EMAIL = 'admin@dadhub.com';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  needsProfileSetup: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  completeProfileSetup: (data: ProfileSetupData) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser(userData);
            setNeedsProfileSetup(false);

            await updateDoc(doc(db, 'users', fbUser.uid), {
              lastLogin: serverTimestamp(),
            });
          } else {
            setNeedsProfileSetup(true);
            setUser(null);
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setNeedsProfileSetup(true);
          setUser(null);
        }
      } else {
        setUser(null);
        setNeedsProfileSetup(false);
      }

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || 'unknown'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || 'unknown'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || 'unknown'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err: unknown) {
      const error = err as { code?: string };
      setError(getErrorMessage(error.code || 'unknown'));
      throw err;
    }
  };

  const completeProfileSetup = async (data: ProfileSetupData) => {
    if (!firebaseUser) {
      throw new Error('No authenticated user');
    }

    try {
      setIsLoading(true);

      const isAdmin = firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

      const newUser: User = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: data.name,
        avatar: data.avatar,
        dadSince: data.dadSince,
        kids: data.kids,
        badges: [],
        points: isAdmin ? 1000 : 0,
        xp: isAdmin ? 1000 : 0,
        level: isAdmin ? 5 : 1,
        totalXpEarned: isAdmin ? 1000 : 0,
        currentStreak: 0,
        longestStreak: 0,
        groupIds: [],
        isAdmin,
        isModerator: isAdmin,
        isBanned: false,
        createdAt: new Date(),
        lastLogin: new Date(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });

      setUser(newUser);
      setNeedsProfileSetup(false);
    } catch (err) {
      setError('Failed to create profile. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!firebaseUser || !user) {
      throw new Error('No authenticated user');
    }

    try {
      await updateDoc(doc(db, 'users', firebaseUser.uid), data);
      setUser({ ...user, ...data });
    } catch (err) {
      setError('Failed to update profile.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        isAuthenticated: !!user,
        error,
        needsProfileSetup,
        login,
        register,
        loginWithGoogle,
        logout,
        clearError,
        completeProfileSetup,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function getErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed.';
    default:
      return 'An error occurred. Please try again.';
  }
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
