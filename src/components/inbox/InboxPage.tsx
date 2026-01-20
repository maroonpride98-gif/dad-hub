import React from 'react';
import { useApp } from '../../context/AppContext';
import { InboxList } from './InboxList';
import { InboxChatView } from './InboxChatView';

export const InboxPage: React.FC = () => {
  const { activeChat, getChatById } = useApp();

  // Check if we have an active DM chat
  const chat = activeChat ? getChatById(activeChat) : undefined;
  const isActiveDM = chat?.type === 'dm';

  if (activeChat && isActiveDM) {
    return <InboxChatView />;
  }

  return <InboxList />;
};
