import React from 'react';
import { useApp } from '../../context/AppContext';
import { ChatList } from './ChatList';
import { ChatView } from './ChatView';

export const ChatPage: React.FC = () => {
  const { activeChat } = useApp();

  if (activeChat !== null) {
    return <ChatView />;
  }

  return <ChatList />;
};
