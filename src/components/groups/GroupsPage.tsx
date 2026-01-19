import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useGroups } from '../../context/GroupsContext';
import { GroupCard } from './GroupCard';
import { GroupDetailPage } from './GroupDetailPage';
import { CreateGroupModal } from './CreateGroupModal';
import { Card, Button, Input } from '../common';
import { GROUP_CATEGORIES, GroupCategory } from '../../types/group';

export const GroupsPage: React.FC = () => {
  const { theme } = useTheme();
  const {
    groups,
    myGroups,
    featuredGroups,
    isLoadingGroups,
    searchGroups,
    joinGroup,
    leaveGroup,
  } = useGroups();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GroupCategory | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [view, setView] = useState<'browse' | 'my-groups'>('browse');

  // If viewing a specific group, show the detail page
  if (activeGroupId) {
    return (
      <GroupDetailPage
        groupId={activeGroupId}
        onBack={() => setActiveGroupId(null)}
      />
    );
  }

  // Filter groups
  const filteredGroups = searchQuery
    ? searchGroups(searchQuery)
    : selectedCategory === 'all'
    ? groups
    : groups.filter(g => g.category === selectedCategory);

  const displayGroups = view === 'my-groups' ? myGroups : filteredGroups;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              color: theme.colors.text.primary,
            }}
          >
            Dad Groups
          </h2>
          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: '14px',
              color: theme.colors.text.secondary,
            }}
          >
            Connect with dads who share your interests
          </p>
        </div>

        <Button onClick={() => setShowCreateModal(true)} icon="➕">
          Create Group
        </Button>
      </div>

      {/* View Toggle */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          background: theme.colors.background.secondary,
          borderRadius: '12px',
          width: 'fit-content',
        }}
      >
        {[
          { value: 'browse' as const, label: 'Browse', icon: '🔍' },
          { value: 'my-groups' as const, label: 'My Groups', icon: '⭐' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setView(tab.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: view === tab.value
                ? theme.colors.accent.gradient
                : 'transparent',
              color: view === tab.value
                ? theme.colors.background.primary
                : theme.colors.text.secondary,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {tab.value === 'my-groups' && (
              <span
                style={{
                  padding: '2px 6px',
                  background: view === tab.value
                    ? 'rgba(255,255,255,0.3)'
                    : theme.colors.accent.primary + '30',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              >
                {myGroups.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filters (only in browse view) */}
      {view === 'browse' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
          />

          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 600,
                background: selectedCategory === 'all'
                  ? theme.colors.accent.gradient
                  : theme.colors.card,
                color: selectedCategory === 'all'
                  ? theme.colors.background.primary
                  : theme.colors.text.secondary,
                border: `1px solid ${selectedCategory === 'all' ? 'transparent' : theme.colors.border}`,
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              All
            </button>
            {GROUP_CATEGORIES.slice(0, 8).map(cat => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: selectedCategory === cat.category
                    ? `${cat.color}30`
                    : theme.colors.card,
                  color: selectedCategory === cat.category
                    ? cat.color
                    : theme.colors.text.secondary,
                  border: `1px solid ${selectedCategory === cat.category ? cat.color : theme.colors.border}`,
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.category.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Groups (only in browse view, when no search) */}
      {view === 'browse' && !searchQuery && selectedCategory === 'all' && featuredGroups.length > 0 && (
        <div>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.text.secondary,
            }}
          >
            🔥 Featured Groups
          </h3>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              overflowX: 'auto',
              paddingBottom: '8px',
            }}
          >
            {featuredGroups.map(group => (
              <div key={group.id} style={{ minWidth: '280px' }}>
                <GroupCard
                  group={group}
                  onClick={() => setActiveGroupId(group.id)}
                  onJoin={() => joinGroup(group.id)}
                  onLeave={() => leaveGroup(group.id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Groups List */}
      <div>
        {view === 'browse' && (
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: theme.colors.text.secondary,
            }}
          >
            {searchQuery
              ? `Search Results (${displayGroups.length})`
              : selectedCategory !== 'all'
              ? `${selectedCategory} Groups`
              : 'All Groups'}
          </h3>
        )}

        {isLoadingGroups ? (
          <Card>
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: theme.colors.text.muted,
              }}
            >
              Loading groups...
            </div>
          </Card>
        ) : displayGroups.length === 0 ? (
          <Card>
            <div
              style={{
                textAlign: 'center',
                padding: '48px',
                color: theme.colors.text.muted,
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                {view === 'my-groups' ? '🏘️' : '🔍'}
              </div>
              <h3
                style={{
                  margin: '0 0 8px 0',
                  color: theme.colors.text.primary,
                }}
              >
                {view === 'my-groups'
                  ? "You haven't joined any groups yet"
                  : 'No groups found'}
              </h3>
              <p style={{ margin: 0 }}>
                {view === 'my-groups'
                  ? 'Browse and join groups to connect with fellow dads!'
                  : 'Try a different search or create a new group'}
              </p>
              {view === 'my-groups' && (
                <Button
                  style={{ marginTop: '16px' }}
                  onClick={() => setView('browse')}
                >
                  Browse Groups
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {displayGroups.map(group => (
              <GroupCard
                key={group.id}
                group={group}
                onClick={() => setActiveGroupId(group.id)}
                onJoin={() => joinGroup(group.id)}
                onLeave={() => leaveGroup(group.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(groupId) => setActiveGroupId(groupId)}
        />
      )}
    </div>
  );
};
