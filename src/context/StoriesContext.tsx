import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  arrayUnion,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from './AuthContext';
import {
  Story,
  UserStories,
  StoryInput,
  StoryReaction,
  getStoryExpiresAt,
  groupStoriesByUser,
  isStoryExpired,
} from '../types/story';

interface StoriesContextType {
  // Stories data
  allStories: Story[];
  userStoriesGroups: UserStories[];
  myStories: Story[];
  isLoading: boolean;

  // Actions
  fetchStories: () => Promise<void>;
  createStory: (input: StoryInput, imageFile?: File) => Promise<void>;
  viewStory: (storyId: string) => Promise<void>;
  reactToStory: (storyId: string, emoji: string) => Promise<void>;

  // Viewing state
  activeUserStories: UserStories | null;
  activeStoryIndex: number;
  setActiveUserStories: (userStories: UserStories | null) => void;
  nextStory: () => void;
  prevStory: () => void;
  closeStoryViewer: () => void;

  // Create story modal
  showCreateStory: boolean;
  setShowCreateStory: (show: boolean) => void;
}

const StoriesContext = createContext<StoriesContextType | undefined>(undefined);

interface StoriesProviderProps {
  children: ReactNode;
}

export const StoriesProvider: React.FC<StoriesProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const [allStories, setAllStories] = useState<Story[]>([]);
  const [userStoriesGroups, setUserStoriesGroups] = useState<UserStories[]>([]);
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeUserStories, setActiveUserStories] = useState<UserStories | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [showCreateStory, setShowCreateStory] = useState(false);

  // Fetch all stories
  const fetchStories = useCallback(async () => {
    setIsLoading(true);
    try {
      const now = new Date();
      const storiesRef = collection(db, 'stories');
      const q = query(
        storiesRef,
        where('expiresAt', '>', Timestamp.fromDate(now)),
        orderBy('expiresAt', 'asc'),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const stories: Story[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          expiresAt: data.expiresAt?.toDate(),
          hasViewed: user?.uid ? data.viewedBy?.includes(user.uid) : false,
        } as Story;
      }).filter(story => !isStoryExpired(story));

      setAllStories(stories);

      // Group by user
      const grouped = groupStoriesByUser(stories, user?.uid);
      setUserStoriesGroups(grouped);

      // Get my stories
      if (user?.uid) {
        setMyStories(stories.filter(s => s.authorId === user.uid));
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load stories on mount
  useEffect(() => {
    fetchStories();

    // Refresh every minute to handle expiration
    const interval = setInterval(fetchStories, 60000);
    return () => clearInterval(interval);
  }, [fetchStories]);

  // Create a new story
  const createStory = useCallback(async (input: StoryInput, imageFile?: File) => {
    if (!user?.uid) throw new Error('Must be logged in');

    let content = input.content;

    // Upload image if provided
    if (input.type === 'image' && imageFile) {
      const storageRef = ref(storage, `stories/${user.uid}/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      content = await getDownloadURL(storageRef);
    }

    const storyRef = doc(collection(db, 'stories'));
    const storyData = {
      id: storyRef.id,
      authorId: user.uid,
      authorName: user.name,
      authorAvatar: user.avatar,
      type: input.type,
      content,
      backgroundColor: input.backgroundColor,
      textColor: input.textColor,
      fontSize: input.fontSize,
      expiresAt: Timestamp.fromDate(getStoryExpiresAt()),
      createdAt: serverTimestamp(),
      viewedBy: [],
      viewCount: 0,
      reactions: [],
    };

    await setDoc(storyRef, storyData);
    await fetchStories();
  }, [user, fetchStories]);

  // View a story (mark as viewed)
  const viewStory = useCallback(async (storyId: string) => {
    if (!user?.uid) return;

    try {
      const storyRef = doc(db, 'stories', storyId);
      await updateDoc(storyRef, {
        viewedBy: arrayUnion(user.uid),
        viewCount: (allStories.find(s => s.id === storyId)?.viewCount || 0) + 1,
      });

      // Update local state
      setAllStories(prev =>
        prev.map(s =>
          s.id === storyId
            ? { ...s, hasViewed: true, viewedBy: [...s.viewedBy, user.uid], viewCount: s.viewCount + 1 }
            : s
        )
      );
    } catch (error) {
      console.error('Error viewing story:', error);
    }
  }, [user, allStories]);

  // React to a story
  const reactToStory = useCallback(async (storyId: string, emoji: string) => {
    if (!user?.uid) return;

    try {
      const reaction: StoryReaction = {
        emoji,
        userId: user.uid,
        userName: user.name,
        timestamp: new Date(),
      };

      const storyRef = doc(db, 'stories', storyId);
      await updateDoc(storyRef, {
        reactions: arrayUnion(reaction),
      });

      // Update local state
      setAllStories(prev =>
        prev.map(s =>
          s.id === storyId
            ? { ...s, reactions: [...s.reactions, reaction] }
            : s
        )
      );
    } catch (error) {
      console.error('Error reacting to story:', error);
    }
  }, [user]);

  // Navigation
  const nextStory = useCallback(() => {
    if (!activeUserStories) return;

    if (activeStoryIndex < activeUserStories.stories.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      // Move to next user's stories
      const currentUserIndex = userStoriesGroups.findIndex(
        g => g.userId === activeUserStories.userId
      );
      if (currentUserIndex < userStoriesGroups.length - 1) {
        setActiveUserStories(userStoriesGroups[currentUserIndex + 1]);
        setActiveStoryIndex(0);
      } else {
        // End of all stories
        setActiveUserStories(null);
        setActiveStoryIndex(0);
      }
    }
  }, [activeUserStories, activeStoryIndex, userStoriesGroups]);

  const prevStory = useCallback(() => {
    if (!activeUserStories) return;

    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    } else {
      // Move to previous user's stories
      const currentUserIndex = userStoriesGroups.findIndex(
        g => g.userId === activeUserStories.userId
      );
      if (currentUserIndex > 0) {
        const prevUserStories = userStoriesGroups[currentUserIndex - 1];
        setActiveUserStories(prevUserStories);
        setActiveStoryIndex(prevUserStories.stories.length - 1);
      }
    }
  }, [activeUserStories, activeStoryIndex, userStoriesGroups]);

  const closeStoryViewer = useCallback(() => {
    setActiveUserStories(null);
    setActiveStoryIndex(0);
  }, []);

  // When setting active user stories, reset index
  const handleSetActiveUserStories = useCallback((userStories: UserStories | null) => {
    setActiveUserStories(userStories);
    setActiveStoryIndex(0);
  }, []);

  return (
    <StoriesContext.Provider
      value={{
        allStories,
        userStoriesGroups,
        myStories,
        isLoading,

        fetchStories,
        createStory,
        viewStory,
        reactToStory,

        activeUserStories,
        activeStoryIndex,
        setActiveUserStories: handleSetActiveUserStories,
        nextStory,
        prevStory,
        closeStoryViewer,

        showCreateStory,
        setShowCreateStory,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
};

export const useStories = (): StoriesContextType => {
  const context = useContext(StoriesContext);
  if (!context) {
    throw new Error('useStories must be used within a StoriesProvider');
  }
  return context;
};
