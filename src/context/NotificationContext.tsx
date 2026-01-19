import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Notification } from '../types';
import { formatTime } from '../utils/firebaseHelpers';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  showPanel: boolean;
  isLoading: boolean;
  setShowPanel: (show: boolean) => void;
  togglePanel: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'time'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Real-time listener for notifications
  useEffect(() => {
    if (!user?.uid) {
      setNotifications([]);
      setIsLoading(false);
      return;
    }

    const notificationsRef = collection(db, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt as Timestamp | undefined;
          return {
            id: doc.id,
            type: data.type,
            title: data.title,
            message: data.message,
            read: data.read || false,
            avatar: data.avatar,
            time: createdAt ? formatTime(createdAt.toDate()) : 'Just now',
            relatedUserId: data.relatedUserId,
            relatedChatId: data.relatedChatId,
            relatedRequestId: data.relatedRequestId,
          } as Notification;
        });
        setNotifications(notifs);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching notifications:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const togglePanel = useCallback(() => {
    setShowPanel((prev) => !prev);
  }, []);

  const addNotification = useCallback(
    async (notification: Omit<Notification, 'id' | 'time'>) => {
      if (!user?.uid) return;

      try {
        await addDoc(collection(db, 'notifications'), {
          ...notification,
          userId: user.uid,
          read: false,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error adding notification:', error);
      }
    },
    [user?.uid]
  );

  const markAsRead = useCallback(async (id: string) => {
    try {
      const notifRef = doc(db, 'notifications', id);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const batch = writeBatch(db);
      const unreadNotifs = notifications.filter((n) => !n.read);

      unreadNotifs.forEach((notif) => {
        const notifRef = doc(db, 'notifications', notif.id);
        batch.update(notifRef, { read: true });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [user?.uid, notifications]);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notifications', id));
    } catch (error) {
      console.error('Error removing notification:', error);
    }
  }, []);

  const clearAll = useCallback(async () => {
    if (!user?.uid) return;

    try {
      const batch = writeBatch(db);

      notifications.forEach((notif) => {
        const notifRef = doc(db, 'notifications', notif.id);
        batch.delete(notifRef);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }, [user?.uid, notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        showPanel,
        isLoading,
        setShowPanel,
        togglePanel,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
