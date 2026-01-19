import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { Group, GroupPost, GroupMember } from '../types/group';
import { initializeReactions, PostReaction } from '../types/reaction';

interface GroupsContextType {
  // Groups
  groups: Group[];
  myGroups: Group[];
  featuredGroups: Group[];
  isLoadingGroups: boolean;
  fetchGroups: () => Promise<void>;
  searchGroups: (query: string) => Group[];
  getGroupById: (groupId: string) => Group | undefined;

  // Group Actions
  createGroup: (data: Omit<Group, 'id' | 'createdAt' | 'memberCount' | 'postCount'>) => Promise<string>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  updateGroup: (groupId: string, updates: Partial<Group>) => Promise<void>;

  // Group Posts
  groupPosts: GroupPost[];
  isLoadingPosts: boolean;
  fetchGroupPosts: (groupId: string) => Promise<void>;
  createGroupPost: (groupId: string, content: string, imageUrl?: string, mentions?: string[]) => Promise<void>;
  likeGroupPost: (groupId: string, postId: string) => Promise<void>;
  reactToGroupPost: (groupId: string, postId: string, emoji: string) => Promise<void>;

  // Members
  groupMembers: GroupMember[];
  fetchGroupMembers: (groupId: string) => Promise<void>;

  // Active group
  activeGroup: Group | null;
  setActiveGroup: (group: Group | null) => void;
}

const GroupsContext = createContext<GroupsContextType | undefined>(undefined);

interface GroupsProviderProps {
  children: ReactNode;
}

export const GroupsProvider: React.FC<GroupsProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [featuredGroups, setFeaturedGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);

  const [groupPosts, setGroupPosts] = useState<GroupPost[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([]);
  const [activeGroup, setActiveGroup] = useState<Group | null>(null);

  // Fetch all public groups
  const fetchGroups = useCallback(async () => {
    setIsLoadingGroups(true);
    try {
      const groupsRef = collection(db, 'groups');
      const q = query(groupsRef, where('isPublic', '==', true), orderBy('memberCount', 'desc'));
      const snapshot = await getDocs(q);

      const groupList: Group[] = snapshot.docs.map(doc => {
        const data = doc.data();
        const isMember = user?.groupIds?.includes(doc.id) || false;

        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          isMember,
        } as Group;
      });

      setGroups(groupList);
      setFeaturedGroups(groupList.slice(0, 5));

      // Filter my groups
      if (user?.groupIds) {
        setMyGroups(groupList.filter(g => user.groupIds?.includes(g.id)));
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoadingGroups(false);
    }
  }, [user]);

  // Load groups on mount
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Search groups
  const searchGroups = useCallback((query: string): Group[] => {
    const lowerQuery = query.toLowerCase();
    return groups.filter(
      g =>
        g.name.toLowerCase().includes(lowerQuery) ||
        g.description.toLowerCase().includes(lowerQuery) ||
        g.category.toLowerCase().includes(lowerQuery)
    );
  }, [groups]);

  // Get group by ID
  const getGroupById = useCallback((groupId: string): Group | undefined => {
    return groups.find(g => g.id === groupId);
  }, [groups]);

  // Create a new group
  const createGroup = useCallback(async (
    data: Omit<Group, 'id' | 'createdAt' | 'memberCount' | 'postCount'>
  ): Promise<string> => {
    if (!user?.uid) throw new Error('Must be logged in');

    const groupRef = doc(collection(db, 'groups'));
    const groupData = {
      ...data,
      id: groupRef.id,
      createdBy: user.uid,
      createdByName: user.name,
      memberCount: 1,
      postCount: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(groupRef, groupData);

    // Add creator as owner member
    await setDoc(doc(db, 'groups', groupRef.id, 'members', user.uid), {
      userId: user.uid,
      userName: user.name,
      userAvatar: user.avatar,
      role: 'owner',
      joinedAt: serverTimestamp(),
    });

    // Update user's groupIds
    await updateDoc(doc(db, 'users', user.uid), {
      groupIds: arrayUnion(groupRef.id),
    });

    await fetchGroups();
    return groupRef.id;
  }, [user, fetchGroups]);

  // Join a group
  const joinGroup = useCallback(async (groupId: string) => {
    if (!user?.uid) return;

    try {
      // Add user to group members
      await setDoc(doc(db, 'groups', groupId, 'members', user.uid), {
        userId: user.uid,
        userName: user.name,
        userAvatar: user.avatar,
        role: 'member',
        joinedAt: serverTimestamp(),
      });

      // Increment member count
      await updateDoc(doc(db, 'groups', groupId), {
        memberCount: increment(1),
      });

      // Update user's groupIds
      await updateDoc(doc(db, 'users', user.uid), {
        groupIds: arrayUnion(groupId),
      });

      await fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  }, [user, fetchGroups]);

  // Leave a group
  const leaveGroup = useCallback(async (groupId: string) => {
    if (!user?.uid) return;

    try {
      // Remove user from group members
      await deleteDoc(doc(db, 'groups', groupId, 'members', user.uid));

      // Decrement member count
      await updateDoc(doc(db, 'groups', groupId), {
        memberCount: increment(-1),
      });

      // Update user's groupIds
      await updateDoc(doc(db, 'users', user.uid), {
        groupIds: arrayRemove(groupId),
      });

      await fetchGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      throw error;
    }
  }, [user, fetchGroups]);

  // Update group
  const updateGroup = useCallback(async (groupId: string, updates: Partial<Group>) => {
    if (!user?.uid) return;

    try {
      await updateDoc(doc(db, 'groups', groupId), updates);
      await fetchGroups();
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  }, [user, fetchGroups]);

  // Fetch group posts
  const fetchGroupPosts = useCallback(async (groupId: string) => {
    setIsLoadingPosts(true);
    try {
      const postsRef = collection(db, 'groups', groupId, 'posts');
      const q = query(postsRef, orderBy('createdAt', 'desc'), limit(50));
      const snapshot = await getDocs(q);

      const posts: GroupPost[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          groupId,
          ...data,
          createdAt: data.createdAt?.toDate(),
          reactions: data.reactions || initializeReactions(),
        } as GroupPost;
      });

      setGroupPosts(posts);
    } catch (error) {
      console.error('Error fetching group posts:', error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, []);

  // Create group post
  const createGroupPost = useCallback(async (
    groupId: string,
    content: string,
    imageUrl?: string,
    mentions?: string[]
  ) => {
    if (!user?.uid) return;

    try {
      const postRef = doc(collection(db, 'groups', groupId, 'posts'));
      await setDoc(postRef, {
        id: postRef.id,
        groupId,
        authorId: user.uid,
        author: user.name,
        avatar: user.avatar,
        content,
        imageUrl: imageUrl || null,
        likes: 0,
        likedBy: [],
        reactions: initializeReactions(),
        commentCount: 0,
        mentions: mentions || [],
        createdAt: serverTimestamp(),
      });

      // Increment post count
      await updateDoc(doc(db, 'groups', groupId), {
        postCount: increment(1),
      });

      await fetchGroupPosts(groupId);
    } catch (error) {
      console.error('Error creating group post:', error);
      throw error;
    }
  }, [user, fetchGroupPosts]);

  // Like group post
  const likeGroupPost = useCallback(async (groupId: string, postId: string) => {
    if (!user?.uid) return;

    try {
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) return;

      const data = postDoc.data();
      const likedBy = data.likedBy || [];
      const hasLiked = likedBy.includes(user.uid);

      await updateDoc(postRef, {
        likes: increment(hasLiked ? -1 : 1),
        likedBy: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });

      await fetchGroupPosts(groupId);
    } catch (error) {
      console.error('Error liking group post:', error);
    }
  }, [user, fetchGroupPosts]);

  // React to group post
  const reactToGroupPost = useCallback(async (groupId: string, postId: string, emoji: string) => {
    if (!user?.uid) return;

    try {
      const postRef = doc(db, 'groups', groupId, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (!postDoc.exists()) return;

      const data = postDoc.data();
      const reactions: PostReaction[] = data.reactions || initializeReactions();

      // Update reactions
      const updatedReactions = reactions.map(r => {
        if (r.emoji === emoji) {
          const hasReacted = r.userIds.includes(user.uid);
          return {
            ...r,
            userIds: hasReacted
              ? r.userIds.filter(id => id !== user.uid)
              : [...r.userIds, user.uid],
          };
        }
        // Remove user from other reactions
        return {
          ...r,
          userIds: r.userIds.filter(id => id !== user.uid),
        };
      });

      await updateDoc(postRef, { reactions: updatedReactions });
      await fetchGroupPosts(groupId);
    } catch (error) {
      console.error('Error reacting to group post:', error);
    }
  }, [user, fetchGroupPosts]);

  // Fetch group members
  const fetchGroupMembers = useCallback(async (groupId: string) => {
    try {
      const membersRef = collection(db, 'groups', groupId, 'members');
      const q = query(membersRef, orderBy('joinedAt', 'desc'));
      const snapshot = await getDocs(q);

      const members: GroupMember[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          joinedAt: data.joinedAt?.toDate(),
        } as GroupMember;
      });

      setGroupMembers(members);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  }, []);

  return (
    <GroupsContext.Provider
      value={{
        groups,
        myGroups,
        featuredGroups,
        isLoadingGroups,
        fetchGroups,
        searchGroups,
        getGroupById,

        createGroup,
        joinGroup,
        leaveGroup,
        updateGroup,

        groupPosts,
        isLoadingPosts,
        fetchGroupPosts,
        createGroupPost,
        likeGroupPost,
        reactToGroupPost,

        groupMembers,
        fetchGroupMembers,

        activeGroup,
        setActiveGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

export const useGroups = (): GroupsContextType => {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider');
  }
  return context;
};
