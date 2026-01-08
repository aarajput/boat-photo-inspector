import { useEffect, useState } from 'react';
import type { Photo, PhotoMetadata } from '../types';
import { loadPhoto } from '../utils/storage';

interface PhotoGalleryProps {
  photos: PhotoMetadata[];
  onPhotoClick: (photo: PhotoMetadata) => void;
  onAddPhoto: () => void;
  loading: boolean;
}

export const PhotoGallery = ({
  photos,
  onPhotoClick,
  onAddPhoto,
  loading,
}: PhotoGalleryProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Boat Inspector
            </h1>
            <p className="text-gray-600 mt-1 text-sm">Document your vessel's condition</p>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              No Photos Yet
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Tap the plus button to start documenting your boat's condition
            </p>
          </div>
        </div>

        {/* Floating Plus Button */}
        <button
          onClick={onAddPhoto}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-95 z-50"
          style={{ 
            bottom: 'max(2rem, calc(2rem + env(safe-area-inset-bottom)))',
            right: 'max(2rem, calc(2rem + env(safe-area-inset-right)))'
          }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200 pt-safe">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Boat Inspector
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'} documented
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <PhotoThumbnail
              key={photo.id}
              photo={photo}
              onClick={() => onPhotoClick(photo)}
            />
          ))}
        </div>
      </div>

      {/* Floating Plus Button */}
      <button
        onClick={onAddPhoto}
      >Pick Image</button>
    </div>
  );
};

interface PhotoThumbnailProps {
  photo: PhotoMetadata;
  onClick: () => void;
}

const PhotoThumbnail = ({ photo, onClick }: PhotoThumbnailProps) => {
  const [photoData, setPhotoData] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadPhotoData = async () => {
      try {
        setLoading(true);
        const data = await loadPhoto(photo);
        setPhotoData(data);
        setError(false);
      } catch (err) {
        console.error('Failed to load photo:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoData();
  }, [photo]);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <button
      onClick={onClick}
      className="group relative aspect-square bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 transform hover:-translate-y-1"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}

      {photoData && photoData.webviewPath && (
        <>
          <img
            src={photoData.webviewPath}
            alt={photo.annotation}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                {photo.annotation}
              </p>
              <p className="text-white/80 text-xs">
                {formatDate(photo.timestamp)}
              </p>
            </div>
          </div>
          {/* Corner Badge */}
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            View
          </div>
        </>
      )}
    </button>
  );
};
