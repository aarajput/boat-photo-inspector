import { useState, useEffect } from 'react';
import type { PhotoMetadata, Photo } from '../types';
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <svg
            className="w-24 h-24 mx-auto text-gray-300 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Photos Yet
          </h2>
          <p className="text-gray-600 mb-8">
            Start documenting your boat's condition by capturing your first photo.
          </p>
          <button
            onClick={onAddPhoto}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add First Photo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Boat Inspector
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>
            <button
              onClick={onAddPhoto}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Photo
            </button>
          </div>
        </div>
      </div>

      {/* Photo Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
      className="group relative aspect-square bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
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
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-white text-xs font-medium line-clamp-2">
                {photo.annotation}
              </p>
              <p className="text-white/80 text-xs mt-1">
                {formatDate(photo.timestamp)}
              </p>
            </div>
          </div>
        </>
      )}
    </button>
  );
};

