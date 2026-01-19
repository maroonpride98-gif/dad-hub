import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  collection,
  query,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  orderBy,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import {
  AdminUser,
  AdminAnalytics,
  ContentReport,
  ModerationAction,
  AdminView,
  ReportStatus,
} from '../types';

interface AdminContextType {
  isAdmin: boolean;
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  users: AdminUser[];
  usersLoading: boolean;
  fetchUsers: () => Promise<void>;
  setModeratorStatus: (userId: string, isModerator: boolean) => Promise<void>;
  banUser: (userId: string, reason: string) => Promise<void>;
  unbanUser: (userId: string) => Promise<void>;
  analytics: AdminAnalytics | null;
  analyticsLoading: boolean;
  fetchAnalytics: () => Promise<void>;
  reports: ContentReport[];
  reportsLoading: boolean;
  fetchReports: (status?: ReportStatus) => Promise<void>;
  resolveReport: (reportId: string, resolution: string) => Promise<void>;
  dismissReport: (reportId: string) => Promise<void>;
  deleteContent: (contentId: string, contentType: string) => Promise<void>;
  moderationLog: ModerationAction[];
  fetchModerationLog: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.isAdmin ?? false;

  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [reports, setReports] = useState<ContentReport[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [moderationLog, setModerationLog] = useState<ModerationAction[]>([]);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    setUsersLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const userData = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
        lastLogin: docSnap.data().lastLogin?.toDate() || new Date(),
        status: docSnap.data().isBanned ? 'banned' : 'active',
      })) as AdminUser[];
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setUsersLoading(false);
    }
  }, [isAdmin]);

  const setModeratorStatus = useCallback(
    async (userId: string, isModerator: boolean) => {
      if (!isAdmin || !user) return;
      try {
        await updateDoc(doc(db, 'users', userId), { isModerator });
        await addDoc(collection(db, 'moderationLog'), {
          adminId: user.id,
          adminName: user.name,
          targetUserId: userId,
          actionType: isModerator ? 'set_moderator' : 'remove_moderator',
          reason: isModerator ? 'Granted moderator privileges' : 'Removed moderator privileges',
          createdAt: serverTimestamp(),
        });

        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, isModerator } : u))
        );
      } catch (error) {
        console.error('Error setting moderator status:', error);
        throw error;
      }
    },
    [isAdmin, user]
  );

  const banUser = useCallback(
    async (userId: string, reason: string) => {
      if (!isAdmin || !user) return;
      try {
        await updateDoc(doc(db, 'users', userId), {
          isBanned: true,
          banReason: reason,
          status: 'banned',
        });
        await addDoc(collection(db, 'moderationLog'), {
          adminId: user.id,
          adminName: user.name,
          targetUserId: userId,
          actionType: 'ban',
          reason,
          createdAt: serverTimestamp(),
        });

        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, isBanned: true, banReason: reason, status: 'banned' as const }
              : u
          )
        );
      } catch (error) {
        console.error('Error banning user:', error);
        throw error;
      }
    },
    [isAdmin, user]
  );

  const unbanUser = useCallback(
    async (userId: string) => {
      if (!isAdmin || !user) return;
      try {
        await updateDoc(doc(db, 'users', userId), {
          isBanned: false,
          banReason: null,
          status: 'active',
        });
        await addDoc(collection(db, 'moderationLog'), {
          adminId: user.id,
          adminName: user.name,
          targetUserId: userId,
          actionType: 'unban',
          reason: 'Ban lifted',
          createdAt: serverTimestamp(),
        });

        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, isBanned: false, banReason: undefined, status: 'active' as const }
              : u
          )
        );
      } catch (error) {
        console.error('Error unbanning user:', error);
        throw error;
      }
    },
    [isAdmin, user]
  );

  const fetchAnalytics = useCallback(async () => {
    if (!isAdmin) return;
    setAnalyticsLoading(true);
    try {
      const analyticsRef = collection(db, 'analytics');
      const snapshot = await getDocs(analyticsRef);
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data() as AdminAnalytics;
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  }, [isAdmin]);

  const fetchReports = useCallback(
    async (status?: ReportStatus) => {
      if (!isAdmin) return;
      setReportsLoading(true);
      try {
        const reportsRef = collection(db, 'contentReports');
        let q = query(reportsRef, orderBy('createdAt', 'desc'), limit(50));
        if (status) {
          q = query(
            reportsRef,
            where('status', '==', status),
            orderBy('createdAt', 'desc'),
            limit(50)
          );
        }
        const snapshot = await getDocs(q);
        const reportData = snapshot.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: docSnap.id,
          createdAt: docSnap.data().createdAt?.toDate() || new Date(),
          reviewedAt: docSnap.data().reviewedAt?.toDate(),
        })) as ContentReport[];
        setReports(reportData);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setReportsLoading(false);
      }
    },
    [isAdmin]
  );

  const resolveReport = useCallback(
    async (reportId: string, resolution: string) => {
      if (!isAdmin || !user) return;
      try {
        await updateDoc(doc(db, 'contentReports', reportId), {
          status: 'resolved',
          reviewedBy: user.id,
          reviewedAt: serverTimestamp(),
          resolution,
        });

        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId
              ? { ...r, status: 'resolved' as const, reviewedBy: user.id, resolution }
              : r
          )
        );
      } catch (error) {
        console.error('Error resolving report:', error);
        throw error;
      }
    },
    [isAdmin, user]
  );

  const dismissReport = useCallback(
    async (reportId: string) => {
      if (!isAdmin || !user) return;
      try {
        await updateDoc(doc(db, 'contentReports', reportId), {
          status: 'dismissed',
          reviewedBy: user.id,
          reviewedAt: serverTimestamp(),
        });

        setReports((prev) =>
          prev.map((r) =>
            r.id === reportId
              ? { ...r, status: 'dismissed' as const, reviewedBy: user.id }
              : r
          )
        );
      } catch (error) {
        console.error('Error dismissing report:', error);
        throw error;
      }
    },
    [isAdmin, user]
  );

  const deleteContent = useCallback(
    async (contentId: string, contentType: string) => {
      if (!isAdmin || !user) return;
      try {
        const collectionMap: Record<string, string> = {
          post: 'discussions',
          comment: 'comments',
          joke: 'jokes',
          event: 'events',
          chat: 'chatMessages',
        };
        const collectionName = collectionMap[contentType] || 'content';

        await updateDoc(doc(db, collectionName, contentId), {
          isDeleted: true,
          deletedBy: user.id,
          deletedAt: serverTimestamp(),
        });
        await addDoc(collection(db, 'moderationLog'), {
          adminId: user.id,
          adminName: user.name,
          targetContentId: contentId,
          actionType: 'delete',
          reason: `Deleted ${contentType} content`,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error deleting content:', error);
        throw error;
      }
    },
    [isAdmin, user]
  );

  const fetchModerationLog = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const logRef = collection(db, 'moderationLog');
      const q = query(logRef, orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      const logData = snapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      })) as ModerationAction[];
      setModerationLog(logData);
    } catch (error) {
      console.error('Error fetching moderation log:', error);
    }
  }, [isAdmin]);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        currentView,
        setCurrentView,
        users,
        usersLoading,
        fetchUsers,
        setModeratorStatus,
        banUser,
        unbanUser,
        analytics,
        analyticsLoading,
        fetchAnalytics,
        reports,
        reportsLoading,
        fetchReports,
        resolveReport,
        dismissReport,
        deleteContent,
        moderationLog,
        fetchModerationLog,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
