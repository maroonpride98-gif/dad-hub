import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Group, GroupLocation, getCategoryInfo } from '../../types/group';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface NearbyGroupsProps {
  onGroupSelect: (groupId: string) => void;
}

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

type DistanceFilter = 5 | 10 | 25 | 50 | 100 | 'all';

export const NearbyGroups: React.FC<NearbyGroupsProps> = ({ onGroupSelect }) => {
  const { theme } = useTheme();
  const [groups, setGroups] = useState<(Group & { distance?: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [distanceFilter, setDistanceFilter] = useState<DistanceFilter>(25);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyGroups();
    }
  }, [userLocation, distanceFilter]);

  const getUserLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      loadAllLocalGroups();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to get your location. Showing all local groups.');
        setIsGettingLocation(false);
        loadAllLocalGroups();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const loadAllLocalGroups = async () => {
    try {
      const groupsRef = collection(db, 'groups');
      const q = query(
        groupsRef,
        where('isLocalGroup', '==', true),
        orderBy('memberCount', 'desc'),
        limit(50)
      );
      const snapshot = await getDocs(q);

      const groupData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Group[];

      setGroups(groupData);
    } catch (error) {
      console.error('Error loading local groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNearbyGroups = async () => {
    if (!userLocation) return;

    setIsLoading(true);
    try {
      const groupsRef = collection(db, 'groups');
      const q = query(
        groupsRef,
        where('isLocalGroup', '==', true),
        orderBy('memberCount', 'desc'),
        limit(100)
      );
      const snapshot = await getDocs(q);

      const groupData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const group = {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
        } as Group;

        // Calculate distance if coordinates available
        let distance: number | undefined;
        if (group.location?.latitude && group.location?.longitude) {
          distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            group.location.latitude,
            group.location.longitude
          );
        }

        return { ...group, distance };
      });

      // Filter by distance and sort
      const filteredGroups = groupData
        .filter((g) => {
          if (distanceFilter === 'all') return true;
          if (g.distance === undefined) return true; // Include groups without coordinates
          return g.distance <= distanceFilter;
        })
        .sort((a, b) => {
          if (a.distance === undefined && b.distance === undefined) return 0;
          if (a.distance === undefined) return 1;
          if (b.distance === undefined) return -1;
          return a.distance - b.distance;
        });

      setGroups(filteredGroups);
    } catch (error) {
      console.error('Error loading nearby groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDistance = (distance?: number) => {
    if (distance === undefined) return 'Distance unknown';
    if (distance < 1) return 'Less than 1 mile away';
    return `${Math.round(distance)} mile${distance >= 1.5 ? 's' : ''} away`;
  };

  const formatLocation = (location?: GroupLocation) => {
    if (!location) return 'Location not specified';
    if (location.state) {
      return `${location.city}, ${location.state}`;
    }
    return `${location.city}, ${location.country}`;
  };

  const distanceOptions: { value: DistanceFilter; label: string }[] = [
    { value: 5, label: '5 mi' },
    { value: 10, label: '10 mi' },
    { value: 25, label: '25 mi' },
    { value: 50, label: '50 mi' },
    { value: 100, label: '100 mi' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: `linear-gradient(135deg, ${theme.colors.accent.primary}15, ${theme.colors.accent.secondary}15)`,
          borderRadius: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ fontSize: '32px' }}>📍</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: theme.colors.text.primary }}>
              Local Dad Groups
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: theme.colors.text.secondary }}>
              Connect with dads in your area
            </p>
          </div>
        </div>

        {locationError && (
          <div
            style={{
              padding: '10px 14px',
              background: '#f59e0b20',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#f59e0b' }}>
              ⚠️ {locationError}
            </p>
          </div>
        )}

        {/* Distance Filter */}
        {userLocation && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {distanceOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDistanceFilter(value)}
                style={{
                  padding: '8px 14px',
                  background:
                    distanceFilter === value
                      ? theme.colors.accent.primary
                      : theme.colors.background.secondary,
                  border: 'none',
                  borderRadius: '16px',
                  color: distanceFilter === value ? '#fff' : theme.colors.text.secondary,
                  fontSize: '13px',
                  fontWeight: distanceFilter === value ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {!userLocation && !locationError && (
          <button
            onClick={getUserLocation}
            disabled={isGettingLocation}
            style={{
              padding: '10px 20px',
              background: theme.colors.accent.primary,
              border: 'none',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isGettingLocation ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {isGettingLocation ? (
              <>🔄 Getting location...</>
            ) : (
              <>📍 Enable Location</>
            )}
          </button>
        )}
      </div>

      {/* Groups List */}
      {isLoading ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px', animation: 'float 2s ease-in-out infinite' }}>
            🗺️
          </div>
          <p style={{ color: theme.colors.text.muted }}>Finding nearby groups...</p>
        </div>
      ) : groups.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: theme.colors.text.primary }}>
            No local groups found
          </h3>
          <p style={{ margin: '0 0 16px 0', color: theme.colors.text.muted }}>
            {distanceFilter !== 'all'
              ? `Try expanding your search radius beyond ${distanceFilter} miles`
              : 'Be the first to create a local dad group in your area!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {groups.map((group) => {
            const categoryInfo = getCategoryInfo(group.category);
            return (
              <div
                key={group.id}
                onClick={() => onGroupSelect(group.id)}
                style={{
                  background: theme.colors.card,
                  borderRadius: '16px',
                  padding: '16px',
                  border: `1px solid ${theme.colors.border}`,
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      fontSize: '36px',
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      background: theme.colors.background.secondary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {group.icon || categoryInfo.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: theme.colors.text.primary }}>
                        {group.name}
                      </h4>
                      {group.isLocalGroup && (
                        <span
                          style={{
                            padding: '2px 8px',
                            background: '#22c55e20',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#22c55e',
                          }}
                        >
                          LOCAL
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: theme.colors.text.secondary }}>
                        📍 {formatLocation(group.location)}
                      </span>
                    </div>

                    {group.distance !== undefined && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: theme.colors.accent.primary, fontWeight: 500 }}>
                        🚗 {formatDistance(group.distance)}
                      </p>
                    )}

                    <p
                      style={{
                        margin: '0 0 8px 0',
                        fontSize: '13px',
                        color: theme.colors.text.muted,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {group.description}
                    </p>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: theme.colors.text.muted }}>
                      <span>👥 {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}</span>
                      <span
                        style={{
                          padding: '2px 8px',
                          background: `${categoryInfo.color}20`,
                          borderRadius: '8px',
                          color: categoryInfo.color,
                        }}
                      >
                        {categoryInfo.icon} {group.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NearbyGroups;
