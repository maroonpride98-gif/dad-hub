import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  serverTimestamp,
  Timestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TabType, Message, Discussion, DadJoke, DadEvent, User, Chat, CreateGroupChatParams, Comment } from '../types';
import { defaultJokes } from '../data/dadJokes';
import { useAuth } from './AuthContext';
import { formatTime, formatMessageTime } from '../utils/firebaseHelpers';

interface AppContextType {
  // Navigation
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  activeChat: string | null;
  setActiveChat: (id: string | null) => void;

  // User (from AuthContext)
  user: User;

  // Loading states
  isLoading: boolean;

  // Chats
  chats: Chat[];
  getChatById: (chatId: string) => Chat | undefined;
  createGroupChat: (params: CreateGroupChatParams) => Promise<Chat>;
  createOrGetDM: (friendId: string, friendName: string, friendAvatar: string) => Promise<Chat>;

  // Messages
  messages: Record<string, Message[]>;
  sendMessage: (chatId: string, text: string) => Promise<void>;
  reactToMessage: (chatId: string, messageId: string, emoji: string) => Promise<void>;

  // Inbox / Unread tracking
  totalUnreadDMs: number;
  markChatAsRead: (chatId: string) => Promise<void>;

  // Discussions
  discussions: Discussion[];
  likedPosts: Set<string>;
  toggleLike: (postId: string) => Promise<void>;
  addDiscussion: (discussion: Omit<Discussion, 'id' | 'likes' | 'replies' | 'time' | 'likedBy'>) => Promise<void>;

  // Comments
  comments: Record<string, Comment[]>;
  fetchComments: (discussionId: string) => Promise<void>;
  addComment: (discussionId: string, text: string) => Promise<void>;

  // Events
  events: DadEvent[];
  toggleEventAttendance: (eventId: string) => Promise<void>;
  addEvent: (event: Omit<DadEvent, 'id' | 'attendees' | 'attendeeIds' | 'isAttending'>) => Promise<void>;

  // Jokes
  jokes: DadJoke[];
  jokeIndex: number;
  nextJoke: () => void;
  previousJoke: () => void;
  addJoke: (joke: Omit<DadJoke, 'id'>) => Promise<void>;

  // UI State
  showNewPost: boolean;
  setShowNewPost: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    throw new Error('AppProvider requires authenticated user');
  }

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeChat, setActiveChat] = useState<string | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Chats state
  const [chats, setChats] = useState<Chat[]>([]);

  // Messages state
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  // Discussions state
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Comments state
  const [comments, setComments] = useState<Record<string, Comment[]>>({});

  // Events state
  const [events, setEvents] = useState<DadEvent[]>([]);

  // Jokes state (default jokes + user submitted)
  const [jokes, setJokes] = useState<DadJoke[]>(defaultJokes);
  const [jokeIndex, setJokeIndex] = useState(0);

  // UI state
  const [showNewPost, setShowNewPost] = useState(false);

  // Real-time listener for chats
  useEffect(() => {
    if (!user?.uid) return;

    const chatsRef = collection(db, 'chats');
    const q = query(
      chatsRef,
      where('memberIds', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const chatList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const lastMessageAt = data.lastMessageAt as Timestamp | undefined;

          return {
            id: docSnap.id,
            type: data.type,
            name: data.name,
            emoji: data.emoji,
            memberIds: data.memberIds || [],
            members: data.members || 0,
            lastMessage: data.lastMessage || '',
            time: lastMessageAt ? formatTime(lastMessageAt.toDate()) : 'Just now',
            unread: data.unread || 0,
            createdBy: data.createdBy,
            dmPartnerId: data.dmPartnerId,
            dmPartnerName: data.dmPartnerName,
            dmPartnerAvatar: data.dmPartnerAvatar,
            unreadCounts: data.unreadCounts || {},
            lastReadAt: data.lastReadAt || {},
          } as Chat;
        });
        setChats(chatList);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching chats:', error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Real-time listener for messages of active chat
  useEffect(() => {
    if (!activeChat || !user?.uid) return;

    const messagesRef = collection(db, 'chats', activeChat, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messageList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const timestamp = data.timestamp as Timestamp | undefined;

          return {
            id: docSnap.id,
            chatId: activeChat,
            senderId: data.senderId,
            sender: data.senderName || data.sender,
            senderAvatar: data.senderAvatar,
            text: data.text,
            time: timestamp ? formatMessageTime(timestamp.toDate()) : '',
            timestamp: timestamp?.toDate().toISOString(),
            isMe: data.senderId === user.uid,
            reactions: data.reactions || [],
          } as Message;
        });

        setMessages((prev) => ({
          ...prev,
          [activeChat]: messageList,
        }));
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );

    return () => unsubscribe();
  }, [activeChat, user?.uid]);

  // Real-time listener for discussions
  useEffect(() => {
    const discussionsRef = collection(db, 'discussions');
    const q = query(discussionsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const posts = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAt = data.createdAt as Timestamp | undefined;
          const likedBy = data.likedBy || [];

          // Update likedPosts set based on user's likes
          if (user?.uid && likedBy.includes(user.uid)) {
            setLikedPosts((prev) => new Set([...prev, docSnap.id]));
          }

          return {
            id: docSnap.id,
            category: data.category,
            title: data.title,
            preview: data.preview || data.content?.substring(0, 100) || '',
            content: data.content,
            imageUrl: data.imageUrl,
            authorId: data.authorId,
            author: data.author,
            avatar: data.avatar,
            likes: data.likes || 0,
            likedBy: likedBy,
            replies: data.replies || 0,
            time: createdAt ? formatTime(createdAt.toDate()) : 'Just now',
          } as Discussion;
        });
        setDiscussions(posts);
      },
      (error) => {
        console.error('Error fetching discussions:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Real-time listener for events
  useEffect(() => {
    if (!user?.uid) return;

    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('dateTime', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const eventList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const attendeeIds = data.attendeeIds || [];

          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time,
            location: data.location,
            emoji: data.emoji,
            attendees: data.attendees || 0,
            attendeeIds: attendeeIds,
            isAttending: attendeeIds.includes(user.uid),
            createdBy: data.createdBy,
          } as DadEvent;
        });
        setEvents(eventList);
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Real-time listener for user-submitted jokes
  useEffect(() => {
    const jokesRef = collection(db, 'jokes');
    const q = query(jokesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userJokes = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            joke: data.joke,
            punchline: data.punchline,
            author: data.author,
            authorId: data.authorId,
            likes: data.likes || 0,
            isUserSubmitted: true,
          } as DadJoke;
        });

        // Combine default jokes with user-submitted jokes
        setJokes([...defaultJokes, ...userJokes]);
      },
      (error) => {
        console.error('Error fetching jokes:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Calculate total unread DMs
  const totalUnreadDMs = useMemo(() => {
    return chats
      .filter((chat) => chat.type === 'dm')
      .reduce((total, chat) => {
        const userUnread = chat.unreadCounts?.[user.uid] || 0;
        return total + userUnread;
      }, 0);
  }, [chats, user.uid]);

  // Mark chat as read
  const markChatAsRead = useCallback(
    async (chatId: string) => {
      if (!user?.uid) return;

      try {
        const chatRef = doc(db, 'chats', chatId);
        await updateDoc(chatRef, {
          [`unreadCounts.${user.uid}`]: 0,
          [`lastReadAt.${user.uid}`]: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error marking chat as read:', error);
      }
    },
    [user?.uid]
  );

  // Chat functions
  const getChatById = useCallback(
    (chatId: string) => {
      return chats.find((chat) => chat.id === chatId);
    },
    [chats]
  );

  const createGroupChat = useCallback(
    async (params: CreateGroupChatParams): Promise<Chat> => {
      const chatData = {
        type: 'group',
        name: params.name,
        emoji: params.emoji,
        memberIds: [...params.memberIds, user.uid],
        members: params.memberIds.length + 1,
        lastMessage: 'Chat created',
        lastMessageAt: serverTimestamp(),
        unread: 0,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);

      return {
        id: docRef.id,
        type: 'group',
        name: params.name,
        emoji: params.emoji,
        memberIds: [...params.memberIds, user.uid],
        members: params.memberIds.length + 1,
        lastMessage: 'Chat created',
        time: 'Just now',
        unread: 0,
        createdBy: user.uid,
      } as Chat;
    },
    [user.uid]
  );

  const createOrGetDM = useCallback(
    async (friendId: string, friendName: string, friendAvatar: string): Promise<Chat> => {
      // Check if DM already exists
      const existingDM = chats.find(
        (chat) => chat.type === 'dm' && chat.dmPartnerId === friendId
      );
      if (existingDM) {
        return existingDM;
      }

      // Create new DM
      const chatData = {
        type: 'dm',
        name: friendName,
        emoji: friendAvatar,
        memberIds: [user.uid, friendId],
        members: 2,
        lastMessage: 'Start a conversation',
        lastMessageAt: serverTimestamp(),
        unread: 0,
        dmPartnerId: friendId,
        dmPartnerName: friendName,
        dmPartnerAvatar: friendAvatar,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'chats'), chatData);

      return {
        id: docRef.id,
        type: 'dm',
        name: friendName,
        emoji: friendAvatar,
        memberIds: [user.uid, friendId],
        members: 2,
        lastMessage: 'Start a conversation',
        time: 'Just now',
        unread: 0,
        dmPartnerId: friendId,
        dmPartnerName: friendName,
        dmPartnerAvatar: friendAvatar,
      } as Chat;
    },
    [chats, user.uid]
  );

  // Message functions
  const sendMessage = useCallback(
    async (chatId: string, text: string) => {
      if (!text.trim()) return;

      try {
        // Add message to subcollection
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          senderId: user.uid,
          senderName: user.name,
          senderAvatar: user.avatar,
          text,
          timestamp: serverTimestamp(),
          reactions: [],
        });

        // Update chat's last message
        const chatRef = doc(db, 'chats', chatId);
        const chat = getChatById(chatId);

        // For DMs, increment unread count for the recipient
        if (chat?.type === 'dm' && chat.dmPartnerId) {
          await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageAt: serverTimestamp(),
            [`unreadCounts.${chat.dmPartnerId}`]: increment(1),
          });
        } else {
          await updateDoc(chatRef, {
            lastMessage: text,
            lastMessageAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    [user.uid, user.name, user.avatar, getChatById]
  );

  const reactToMessage = useCallback(
    async (chatId: string, messageId: string, emoji: string) => {
      if (!user?.uid) return;

      try {
        const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
        const currentMessages = messages[chatId] || [];
        const message = currentMessages.find((m) => m.id === messageId);

        if (!message) return;

        const currentReactions = message.reactions || [];
        const reactionIndex = currentReactions.findIndex((r) => r.emoji === emoji);

        let newReactions;
        if (reactionIndex >= 0) {
          // Reaction exists
          const reaction = currentReactions[reactionIndex];
          if (reaction.userIds.includes(user.uid)) {
            // User already reacted - remove their reaction
            const newUserIds = reaction.userIds.filter((id) => id !== user.uid);
            if (newUserIds.length === 0) {
              // Remove reaction entirely if no users
              newReactions = currentReactions.filter((_, i) => i !== reactionIndex);
            } else {
              newReactions = currentReactions.map((r, i) =>
                i === reactionIndex ? { ...r, userIds: newUserIds } : r
              );
            }
          } else {
            // Add user to existing reaction
            newReactions = currentReactions.map((r, i) =>
              i === reactionIndex ? { ...r, userIds: [...r.userIds, user.uid] } : r
            );
          }
        } else {
          // New reaction
          newReactions = [...currentReactions, { emoji, userIds: [user.uid] }];
        }

        await updateDoc(messageRef, { reactions: newReactions });
      } catch (error) {
        console.error('Error reacting to message:', error);
      }
    },
    [user?.uid, messages]
  );

  // Discussion functions
  const toggleLike = useCallback(
    async (postId: string) => {
      if (!user?.uid) return;

      try {
        const postRef = doc(db, 'discussions', postId);
        const isLiked = likedPosts.has(postId);

        if (isLiked) {
          await updateDoc(postRef, {
            likes: increment(-1),
            likedBy: arrayRemove(user.uid),
          });
          setLikedPosts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(postId);
            return newSet;
          });
        } else {
          await updateDoc(postRef, {
            likes: increment(1),
            likedBy: arrayUnion(user.uid),
          });
          setLikedPosts((prev) => new Set([...prev, postId]));
        }
      } catch (error) {
        console.error('Error toggling like:', error);
      }
    },
    [user?.uid, likedPosts]
  );

  const addDiscussion = useCallback(
    async (discussion: Omit<Discussion, 'id' | 'likes' | 'replies' | 'time' | 'likedBy'>) => {
      try {
        await addDoc(collection(db, 'discussions'), {
          ...discussion,
          authorId: user.uid,
          author: user.name,
          avatar: user.avatar,
          likes: 0,
          likedBy: [],
          replies: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setShowNewPost(false);
      } catch (error) {
        console.error('Error adding discussion:', error);
        throw error;
      }
    },
    [user.uid, user.name, user.avatar]
  );

  // Comment functions
  const fetchComments = useCallback(
    async (discussionId: string) => {
      try {
        const commentsRef = collection(db, 'discussions', discussionId, 'comments');
        const q = query(commentsRef, orderBy('createdAt', 'asc'));
        const snapshot = await getDocs(q);

        const commentList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          const createdAt = data.createdAt as Timestamp | undefined;

          return {
            id: docSnap.id,
            discussionId,
            authorId: data.authorId,
            author: data.author,
            avatar: data.avatar,
            text: data.text,
            time: createdAt ? formatTime(createdAt.toDate()) : 'Just now',
          } as Comment;
        });

        setComments((prev) => ({
          ...prev,
          [discussionId]: commentList,
        }));
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    },
    []
  );

  const addComment = useCallback(
    async (discussionId: string, text: string) => {
      if (!text.trim()) return;

      try {
        // Add comment to subcollection
        await addDoc(collection(db, 'discussions', discussionId, 'comments'), {
          authorId: user.uid,
          author: user.name,
          avatar: user.avatar,
          text,
          createdAt: serverTimestamp(),
        });

        // Update reply count on the discussion
        await updateDoc(doc(db, 'discussions', discussionId), {
          replies: increment(1),
        });

        // Refresh comments
        await fetchComments(discussionId);
      } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
      }
    },
    [user.uid, user.name, user.avatar, fetchComments]
  );

  // Event functions
  const toggleEventAttendance = useCallback(
    async (eventId: string) => {
      if (!user?.uid) return;

      try {
        const eventRef = doc(db, 'events', eventId);
        const event = events.find((e) => e.id === eventId);

        if (!event) return;

        if (event.isAttending) {
          await updateDoc(eventRef, {
            attendees: increment(-1),
            attendeeIds: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(eventRef, {
            attendees: increment(1),
            attendeeIds: arrayUnion(user.uid),
          });
        }
      } catch (error) {
        console.error('Error toggling event attendance:', error);
      }
    },
    [user?.uid, events]
  );

  const addEvent = useCallback(
    async (event: Omit<DadEvent, 'id' | 'attendees' | 'attendeeIds' | 'isAttending'>) => {
      try {
        // Create a dateTime timestamp for ordering
        const dateTimeStr = `${event.date} ${event.time}`;
        const dateTime = new Date(dateTimeStr);

        await addDoc(collection(db, 'events'), {
          ...event,
          dateTime: Timestamp.fromDate(isNaN(dateTime.getTime()) ? new Date() : dateTime),
          attendees: 1,
          attendeeIds: [user.uid],
          createdBy: user.uid,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error adding event:', error);
        throw error;
      }
    },
    [user.uid]
  );

  // Joke functions
  const nextJoke = useCallback(() => {
    setJokeIndex((prev) => (prev + 1) % jokes.length);
  }, [jokes.length]);

  const previousJoke = useCallback(() => {
    setJokeIndex((prev) => (prev - 1 + jokes.length) % jokes.length);
  }, [jokes.length]);

  const addJoke = useCallback(
    async (joke: Omit<DadJoke, 'id'>) => {
      try {
        await addDoc(collection(db, 'jokes'), {
          joke: joke.joke,
          punchline: joke.punchline,
          author: user.name,
          authorId: user.uid,
          likes: 0,
          likedBy: [],
          isUserSubmitted: true,
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error adding joke:', error);
        throw error;
      }
    },
    [user.uid, user.name]
  );

  // Custom setActiveTab that also clears activeChat
  const handleSetActiveTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setActiveChat(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        activeChat,
        setActiveChat,
        user,
        isLoading,
        chats,
        getChatById,
        createGroupChat,
        createOrGetDM,
        messages,
        sendMessage,
        reactToMessage,
        totalUnreadDMs,
        markChatAsRead,
        discussions,
        likedPosts,
        toggleLike,
        addDiscussion,
        comments,
        fetchComments,
        addComment,
        events,
        toggleEventAttendance,
        addEvent,
        jokes,
        jokeIndex,
        nextJoke,
        previousJoke,
        addJoke,
        showNewPost,
        setShowNewPost,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
