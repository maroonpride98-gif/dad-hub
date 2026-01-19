import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useFriends } from '../../context/FriendsContext';
import { FriendRequestCard } from './FriendRequestCard';

export const FriendRequestsList: React.FC = () => {
  const { theme } = useTheme();
  const { incomingRequests, outgoingRequests } = useFriends();

  const hasAnyRequests = incomingRequests.length > 0 || outgoingRequests.length > 0;

  if (!hasAnyRequests) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <span style={{ fontSize: '48px' }}>📬</span>
        <h3 style={{ margin: '16px 0 8px', fontWeight: 600 }}>No Requests</h3>
        <p style={{ color: theme.colors.text.muted, margin: 0 }}>
          Friend requests will appear here
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {incomingRequests.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.secondary,
            }}
          >
            Incoming ({incomingRequests.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incomingRequests.map((request) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                type="incoming"
              />
            ))}
          </div>
        </div>
      )}

      {outgoingRequests.length > 0 && (
        <div>
          <h4
            style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: 600,
              color: theme.colors.text.secondary,
            }}
          >
            Sent ({outgoingRequests.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {outgoingRequests.map((request) => (
              <FriendRequestCard
                key={request.id}
                request={request}
                type="outgoing"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
