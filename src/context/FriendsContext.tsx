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
  getDocs,
  serverTimestamp,
  Timestamp,
  or,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Friend, FriendRequest, UserSearchResult } from '../types';
import { useAuth } from './AuthContext';

type FriendsPanelTab = 'friends' | 'requests' | 'search';

interface FriendsContextType {
  friends: Friend[];
  getFriendById: (friendUserId: string) => Friend | undefined;
  incomingRequests: FriendRequest[];
  outgoingRequests: FriendRequest[];
  isLoading: boolean;
  sendFriendRequest: (toUserId: string, toUserName: string, toUserAvatar: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
  cancelFriendRequest: (requestId: string) => Promise<void>;
  searchUsers: (query: string) => Promise<UserSearchResult[]>;
  removeFriend: (friendshipId: string) => Promise<void>;
  showFriendsPanel: boolean;
  setShowFriendsPanel: (show: boolean) => void;
  friendsPanelTab: FriendsPanelTab;
  setFriendsPanelTab: (tab: FriendsPanelTab) => void;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

interface FriendsProviderProps {
  children: ReactNode;
}

export const FriendsProvider: React.FC<FriendsProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFriendsPanel, setShowFriendsPanel] = useState(false);
  const [friendsPanelTab, setFriendsPanelTab] = useState<FriendsPanelTab>('friends');

  // Real-time listener for friendships
  useEffect(() => {
    if (!user?.uid) {
      setFriends([]);
      setIsLoading(false);
      return;
    }

    const friendshipsRef = collection(db, 'friendships');
    const q = query(
      friendshipsRef,
      or(
        where('userId1', '==', user.uid),
        where('userId2', '==', user.uid)
      )
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const friendsList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const isUser1 = data.userId1 === user.uid;
          const createdAt = data.createdAt as Timestamp | undefined;

          return {
            id: docSnap.id,
            friendId: isUser1 ? data.userId2 : data.userId1,
            friendName: isUser1 ? data.user2Name : data.user1Name,
            friendAvatar: isUser1 ? data.user2Avatar : data.user1Avatar,
            friendDadSince: isUser1 ? data.user2DadSince : data.user1DadSince,
            addedAt: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
          } as Friend;
        });
        setFriends(friendsList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching friendships:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Real-time listener for incoming friend requests
  useEffect(() => {
    if (!user?.uid) {
      setIncomingRequests([]);
      return;
    }

    const requestsRef = collection(db, 'friendRequests');
    const q = query(
      requestsRef,
      where('toUserId', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAt = data.createdAt as Timestamp | undefined;
          const updatedAt = data.updatedAt as Timestamp | undefined;

          return {
            id: docSnap.id,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserAvatar: data.fromUserAvatar,
            toUserId: data.toUserId,
            toUserName: data.toUserName,
            toUserAvatar: data.toUserAvatar,
            status: data.status,
            createdAt: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
            updatedAt: updatedAt ? updatedAt.toDate().toISOString() : new Date().toISOString(),
          } as FriendRequest;
        });
        setIncomingRequests(requests);
      },
      (error) => {
        console.error('Error fetching incoming requests:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Real-time listener for outgoing friend requests
  useEffect(() => {
    if (!user?.uid) {
      setOutgoingRequests([]);
      return;
    }

    const requestsRef = collection(db, 'friendRequests');
    const q = query(
      requestsRef,
      where('fromUserId', '==', user.uid),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requests = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAt = data.createdAt as Timestamp | undefined;
          const updatedAt = data.updatedAt as Timestamp | undefined;

          return {
            id: docSnap.id,
            fromUserId: data.fromUserId,
            fromUserName: data.fromUserName,
            fromUserAvatar: data.fromUserAvatar,
            toUserId: data.toUserId,
            toUserName: data.toUserName,
            toUserAvatar: data.toUserAvatar,
            status: data.status,
            createdAt: createdAt ? createdAt.toDate().toISOString() : new Date().toISOString(),
            updatedAt: updatedAt ? updatedAt.toDate().toISOString() : new Date().toISOString(),
          } as FriendRequest;
        });
        setOutgoingRequests(requests);
      },
      (error) => {
        console.error('Error fetching outgoing requests:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const getFriendById = useCallback(
    (friendUserId: string) => {
      return friends.find((f) => f.friendId === friendUserId);
    },
    [friends]
  );

  const sendFriendRequest = useCallback(
    async (toUserId: string, toUserName: string, toUserAvatar: string) => {
      if (!user) return;

      try {
        await addDoc(collection(db, 'friendRequests'), {
          fromUserId: user.uid,
          fromUserName: user.name,
          fromUserAvatar: user.avatar,
          toUserId,
          toUserName,
          toUserAvatar,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Create notification for the recipient
        await addDoc(collection(db, 'notifications'), {
          userId: toUserId,
          type: 'friend_request',
          title: 'Friend Request',
          message: `${user.name} wants to be your friend`,
          avatar: user.avatar,
          read: false,
          relatedUserId: user.uid,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error sending friend request:', error);
        throw error;
      }
    },
    [user]
  );

  const acceptFriendRequest = useCallback(
    async (requestId: string) => {
      if (!user) return;

      const request = incomingRequests.find((r) => r.id === requestId);
      if (!request) return;

      try {
        const batch = writeBatch(db);

        // Update request status
        const requestRef = doc(db, 'friendRequests', requestId);
        batch.update(requestRef, {
          status: 'accepted',
          updatedAt: serverTimestamp(),
        });

        // Create friendship document
        const friendshipRef = doc(collection(db, 'friendships'));
        batch.set(friendshipRef, {
          userId1: request.fromUserId,
          userId2: user.uid,
          user1Name: request.fromUserName,
          user1Avatar: request.fromUserAvatar,
          user1DadSince: '', // Will be updated from user profile if needed
          user2Name: user.name,
          user2Avatar: user.avatar,
          user2DadSince: user.dadSince || '',
          createdAt: serverTimestamp(),
        });

        await batch.commit();

        // Create notification for the sender
        await addDoc(collection(db, 'notifications'), {
          userId: request.fromUserId,
          type: 'friend_accepted',
          title: 'Friend Request Accepted',
          message: `${user.name} accepted your friend request`,
          avatar: user.avatar,
          read: false,
          relatedUserId: user.uid,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error accepting friend request:', error);
        throw error;
      }
    },
    [user, incomingRequests]
  );

  const rejectFriendRequest = useCallback(async (requestId: string) => {
    try {
      const requestRef = doc(db, 'friendRequests', requestId);
      await updateDoc(requestRef, {
        status: 'rejected',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      throw error;
    }
  }, []);

  const cancelFriendRequest = useCallback(async (requestId: string) => {
    try {
      await deleteDoc(doc(db, 'friendRequests', requestId));
    } catch (error) {
      console.error('Error canceling friend request:', error);
      throw error;
    }
  }, []);

  const searchUsers = useCallback(
    async (searchQuery: string): Promise<UserSearchResult[]> => {
      if (!searchQuery.trim() || !user) return [];

      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        const lowerQuery = searchQuery.toLowerCase();
        const friendIds = new Set(friends.map((f) => f.friendId));
        const allPendingRequests = [...incomingRequests, ...outgoingRequests];

        const results: UserSearchResult[] = [];

        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          const uid = docSnap.id;

          // Skip current user
          if (uid === user.uid) return;

          // Check if name matches
          const name = data.name || '';
          if (!name.toLowerCase().includes(lowerQuery)) return;

          const pendingRequest = allPendingRequests.find(
            (r) =>
              r.status === 'pending' &&
              ((r.fromUserId === user.uid && r.toUserId === uid) ||
                (r.toUserId === user.uid && r.fromUserId === uid))
          );

          results.push({
            id: uid,
            uid: uid,
            name: data.name,
            avatar: data.avatar || '👨',
            dadSince: data.dadSince || '',
            isFriend: friendIds.has(uid),
            hasPendingRequest: !!pendingRequest,
            requestDirection: pendingRequest
              ? pendingRequest.fromUserId === user.uid
                ? 'sent'
                : 'received'
              : undefined,
          });
        });

        return results.slice(0, 10);
      } catch (error) {
        console.error('Error searching users:', error);
        return [];
      }
    },
    [friends, incomingRequests, outgoingRequests, user]
  );

  const removeFriend = useCallback(async (friendshipId: string) => {
    try {
      await deleteDoc(doc(db, 'friendships', friendshipId));
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }, []);

  return (
    <FriendsContext.Provider
      value={{
        friends,
        getFriendById,
        incomingRequests,
        outgoingRequests,
        isLoading,
        sendFriendRequest,
        acceptFriendRequest,
        rejectFriendRequest,
        cancelFriendRequest,
        searchUsers,
        removeFriend,
        showFriendsPanel,
        setShowFriendsPanel,
        friendsPanelTab,
        setFriendsPanelTab,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = (): FriendsContextType => {
  const context = useContext(FriendsContext);
  if (!context) {
    throw new Error('useFriends must be used within a FriendsProvider');
  }
  return context;
};
