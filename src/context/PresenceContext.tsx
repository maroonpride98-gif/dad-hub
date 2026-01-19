import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';

interface PresenceData {
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
}

interface PresenceContextType {
  onlineUsers: Map<string, PresenceData>;
  isUserOnline: (userId: string) => boolean;
  getLastSeen: (userId: string) => Date | null;
  getUserStatus: (userId: string) => 'online' | 'away' | 'offline';
  updateMyPresence: (status: 'online' | 'away' | 'offline') => void;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

export const usePresence = () => {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error('usePresence must be used within a PresenceProvider');
  }
  return context;
};

interface PresenceProviderProps {
  children: ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<Map<string, PresenceData>>(new Map());

  // Update current user's presence
  const updateMyPresence = useCallback(
    async (status: 'online' | 'away' | 'offline') => {
      if (!user?.uid) return;

      try {
        await setDoc(
          doc(db, 'presence', user.uid),
          {
            status,
            lastSeen: serverTimestamp(),
            userId: user.uid,
            userName: user.name,
            userAvatar: user.avatar,
          },
          { merge: true }
        );
      } catch (error) {
        console.error('Error updating presence:', error);
      }
    },
    [user]
  );

  // Set online when component mounts, offline on unmount
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    // Set online
    updateMyPresence('online');

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateMyPresence('online');
      } else {
        updateMyPresence('away');
      }
    };

    // Handle before unload
    const handleBeforeUnload = () => {
      updateMyPresence('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Heartbeat to keep presence alive
    const heartbeat = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateMyPresence('online');
      }
    }, 60000); // Every minute

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(heartbeat);
      updateMyPresence('offline');
    };
  }, [isAuthenticated, user?.uid, updateMyPresence]);

  // Listen to presence of friends/relevant users
  useEffect(() => {
    if (!isAuthenticated || !user?.uid) return;

    // Subscribe to presence collection
    const presenceRef = collection(db, 'presence');
    const q = query(presenceRef, where('status', 'in', ['online', 'away']));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newOnlineUsers = new Map<string, PresenceData>();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          newOnlineUsers.set(doc.id, {
            status: data.status,
            lastSeen: data.lastSeen?.toDate() || new Date(),
          });
        });

        setOnlineUsers(newOnlineUsers);
      },
      (error) => {
        console.error('Error listening to presence:', error);
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, user?.uid]);

  const isUserOnline = useCallback(
    (userId: string): boolean => {
      const presence = onlineUsers.get(userId);
      return presence?.status === 'online';
    },
    [onlineUsers]
  );

  const getLastSeen = useCallback(
    (userId: string): Date | null => {
      const presence = onlineUsers.get(userId);
      return presence?.lastSeen || null;
    },
    [onlineUsers]
  );

  const getUserStatus = useCallback(
    (userId: string): 'online' | 'away' | 'offline' => {
      const presence = onlineUsers.get(userId);
      return presence?.status || 'offline';
    },
    [onlineUsers]
  );

  return (
    <PresenceContext.Provider
      value={{
        onlineUsers,
        isUserOnline,
        getLastSeen,
        getUserStatus,
        updateMyPresence,
      }}
    >
      {children}
    </PresenceContext.Provider>
  );
};
