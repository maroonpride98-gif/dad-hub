import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { haptics } from '../../utils/haptics';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  date: Date;
  album?: string;
  tags?: string[];
  isFavorite?: boolean;
}

interface Album {
  id: string;
  name: string;
  emoji: string;
  coverUrl: string;
  photoCount: number;
}

const SAMPLE_ALBUMS: Album[] = [
  { id: 'all', name: 'All Photos', emoji: '📷', coverUrl: 'https://picsum.photos/seed/family1/300/300', photoCount: 24 },
  { id: 'vacations', name: 'Family Vacations', emoji: '🏖️', coverUrl: 'https://picsum.photos/seed/vacation/300/300', photoCount: 8 },
  { id: 'milestones', name: 'Milestones', emoji: '🎉', coverUrl: 'https://picsum.photos/seed/milestone/300/300', photoCount: 6 },
  { id: 'sports', name: 'Sports & Activities', emoji: '⚽', coverUrl: 'https://picsum.photos/seed/sports/300/300', photoCount: 5 },
  { id: 'holidays', name: 'Holidays', emoji: '🎄', coverUrl: 'https://picsum.photos/seed/holiday/300/300', photoCount: 5 },
];

const SAMPLE_PHOTOS: Photo[] = [
  { id: '1', url: 'https://picsum.photos/seed/dad1/400/400', caption: 'Beach day with the kids', date: new Date(Date.now() - 86400000 * 2), album: 'vacations', isFavorite: true },
  { id: '2', url: 'https://picsum.photos/seed/dad2/400/400', caption: 'First day of school', date: new Date(Date.now() - 86400000 * 30), album: 'milestones' },
  { id: '3', url: 'https://picsum.photos/seed/dad3/400/400', caption: 'Soccer practice', date: new Date(Date.now() - 86400000 * 5), album: 'sports', isFavorite: true },
  { id: '4', url: 'https://picsum.photos/seed/dad4/400/400', caption: 'Christmas morning', date: new Date(Date.now() - 86400000 * 60), album: 'holidays' },
  { id: '5', url: 'https://picsum.photos/seed/dad5/400/400', caption: 'Backyard camping', date: new Date(Date.now() - 86400000 * 10), album: 'vacations' },
  { id: '6', url: 'https://picsum.photos/seed/dad6/400/400', caption: 'Birthday party', date: new Date(Date.now() - 86400000 * 45), album: 'milestones', isFavorite: true },
  { id: '7', url: 'https://picsum.photos/seed/dad7/400/400', caption: 'Baseball game', date: new Date(Date.now() - 86400000 * 15), album: 'sports' },
  { id: '8', url: 'https://picsum.photos/seed/dad8/400/400', caption: 'Thanksgiving dinner', date: new Date(Date.now() - 86400000 * 90), album: 'holidays' },
  { id: '9', url: 'https://picsum.photos/seed/dad9/400/400', caption: 'Park day', date: new Date(Date.now() - 86400000 * 7) },
  { id: '10', url: 'https://picsum.photos/seed/dad10/400/400', caption: 'Movie night', date: new Date(Date.now() - 86400000 * 3) },
  { id: '11', url: 'https://picsum.photos/seed/dad11/400/400', caption: 'Graduation day', date: new Date(Date.now() - 86400000 * 120), album: 'milestones' },
  { id: '12', url: 'https://picsum.photos/seed/dad12/400/400', caption: 'Swimming lessons', date: new Date(Date.now() - 86400000 * 20), album: 'sports' },
];

export const GalleryPage: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [photos, setPhotos] = useState<Photo[]>(SAMPLE_PHOTOS);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<'albums' | 'photos' | 'favorites'>('albums');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload form state
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newAlbum, setNewAlbum] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;

    const photosRef = collection(db, 'galleryPhotos');
    const q = query(photosRef, where('userId', '==', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userPhotos = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date?.toDate() || new Date(),
      })) as Photo[];

      setPhotos([...SAMPLE_PHOTOS, ...userPhotos]);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const handleUploadPhoto = async () => {
    if (!newPhotoUrl.trim() || !user?.uid || isSubmitting) return;

    setIsSubmitting(true);
    haptics.light();

    try {
      await addDoc(collection(db, 'galleryPhotos'), {
        userId: user.uid,
        url: newPhotoUrl.trim(),
        caption: newCaption.trim() || null,
        album: newAlbum || null,
        date: new Date(),
        isFavorite: false,
        createdAt: serverTimestamp(),
      });

      haptics.success();
      setShowUploadModal(false);
      setNewPhotoUrl('');
      setNewCaption('');
      setNewAlbum('');
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPhotos = viewMode === 'favorites'
    ? photos.filter(p => p.isFavorite)
    : selectedAlbum && selectedAlbum !== 'all'
    ? photos.filter(p => p.album === selectedAlbum)
    : photos;

  const handleAlbumClick = (albumId: string) => {
    setSelectedAlbum(albumId);
    setViewMode('photos');
    haptics.light();
  };

  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    haptics.medium();
  };

  const handleBack = () => {
    if (selectedPhoto) {
      setSelectedPhoto(null);
    } else {
      setSelectedAlbum(null);
      setViewMode('albums');
    }
    haptics.light();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background.primary,
        paddingBottom: '100px',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          {(selectedAlbum || viewMode !== 'albums') && (
            <button
              onClick={handleBack}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ←
            </button>
          )}
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#fff' }}>
            {viewMode === 'favorites' ? '❤️ Favorites' : selectedAlbum ? SAMPLE_ALBUMS.find(a => a.id === selectedAlbum)?.name : '📸 Family Gallery'}
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
          {viewMode === 'favorites' ? 'Your favorite memories' : selectedAlbum ? `${filteredPhotos.length} photos` : 'Capture and cherish family moments'}
        </p>
      </div>

      {/* View Toggle */}
      {!selectedAlbum && (
        <div style={{ padding: '16px 20px', display: 'flex', gap: '8px' }}>
          {(['albums', 'photos', 'favorites'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setViewMode(mode);
                haptics.light();
              }}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '10px',
                border: 'none',
                background: viewMode === mode ? theme.colors.accent.primary : theme.colors.background.secondary,
                color: viewMode === mode ? '#fff' : theme.colors.text.secondary,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {mode === 'favorites' ? '❤️' : mode === 'albums' ? '📁' : '🖼️'} {mode}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: '0 20px 20px' }}>
        {/* Albums View */}
        {viewMode === 'albums' && !selectedAlbum && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
            }}
          >
            {SAMPLE_ALBUMS.map((album) => (
              <button
                key={album.id}
                onClick={() => handleAlbumClick(album.id)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: '16px',
                  border: 'none',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    right: '12px',
                    textAlign: 'left',
                  }}
                >
                  <p style={{ margin: '0 0 2px 0', fontSize: '20px' }}>{album.emoji}</p>
                  <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#fff' }}>
                    {album.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                    {album.photoCount} photos
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Photos Grid View */}
        {(viewMode === 'photos' || viewMode === 'favorites' || selectedAlbum) && (
          <>
            {filteredPhotos.length === 0 ? (
              <div
                style={{
                  padding: '60px 20px',
                  textAlign: 'center',
                  background: theme.colors.card,
                  borderRadius: '16px',
                  border: `1px solid ${theme.colors.border}`,
                }}
              >
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>📷</p>
                <p style={{ margin: 0, color: theme.colors.text.muted }}>
                  No photos yet. Start capturing memories!
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '4px',
                }}
              >
                {filteredPhotos.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => handlePhotoClick(photo)}
                    style={{
                      position: 'relative',
                      aspectRatio: '1',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      borderRadius: '4px',
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {photo.isFavorite && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          fontSize: '14px',
                        }}
                      >
                        ❤️
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Upload Button */}
        <button
          onClick={() => setShowUploadModal(true)}
          style={{
            width: '100%',
            padding: '14px',
            marginTop: '20px',
            borderRadius: '14px',
            border: 'none',
            background: theme.colors.accent.gradient,
            color: '#fff',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          📤 Upload Photos
        </button>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              background: theme.colors.background.primary,
              borderRadius: '20px',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: 700, color: theme.colors.text.primary }}>
              Add Photo
            </h3>

            {/* Photo URL */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Photo URL *
              </label>
              <input
                type="url"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
              {newPhotoUrl && (
                <div style={{ marginTop: '10px', borderRadius: '12px', overflow: 'hidden' }}>
                  <img
                    src={newPhotoUrl}
                    alt="Preview"
                    style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {/* Caption */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Caption (optional)
              </label>
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="What's in this photo?"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              />
            </div>

            {/* Album */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 600, color: theme.colors.text.primary }}>
                Album (optional)
              </label>
              <select
                value={newAlbum}
                onChange={(e) => setNewAlbum(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: theme.colors.background.secondary,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: '10px',
                  color: theme.colors.text.primary,
                  fontSize: '15px',
                }}
              >
                <option value="">No Album</option>
                {SAMPLE_ALBUMS.filter(a => a.id !== 'all').map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.emoji} {album.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.border}`,
                  background: 'transparent',
                  color: theme.colors.text.secondary,
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUploadPhoto}
                disabled={!newPhotoUrl.trim() || isSubmitting}
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: !newPhotoUrl.trim() ? theme.colors.background.secondary : theme.colors.accent.gradient,
                  color: !newPhotoUrl.trim() ? theme.colors.text.muted : '#fff',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: !newPhotoUrl.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'Adding...' : 'Add Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Modal Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {selectedPhoto.isFavorite ? '❤️' : '🤍'}
              </button>
              <button
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                ↗️
              </button>
            </div>
          </div>

          {/* Photo */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.caption}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
          </div>

          {/* Photo Info */}
          <div
            style={{
              padding: '20px',
              background: 'rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600, color: '#fff' }}>
              {selectedPhoto.caption}
            </p>
            <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
              {selectedPhoto.date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
