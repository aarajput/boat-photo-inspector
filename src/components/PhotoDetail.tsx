import { useState, useEffect } from 'react';
import type { PhotoMetadata, Photo } from '../types';
import { loadPhoto } from '../utils/storage';

interface PhotoDetailProps {
  photo: PhotoMetadata;
  onBack: () => void;
  onDelete: (photoId: string) => void;
}

export const PhotoDetail = ({ photo, onBack, onDelete }: PhotoDetailProps) => {
  const [photoData, setPhotoData] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadPhotoData = async () => {
      try {
        setLoading(true);
        const data = await loadPhoto(photo);
        setPhotoData(data);
      } catch (err) {
        console.error('Failed to load photo:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPhotoData();
  }, [photo]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(photo.id);
      onBack();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete photo. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span className="font-medium">Delete</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading photo...</p>
            </div>
          </div>
        ) : photoData && photoData.webviewPath ? (
          <div className="space-y-6">
            {/* Photo */}
            <div className="bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={photoData.webviewPath}
                alt={photo.annotation}
                className="w-full"
              />
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Annotation
                </h3>
                <p className="text-lg text-gray-900">{photo.annotation}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Captured
                </h3>
                <p className="text-gray-900">{formatDateTime(photo.timestamp)}</p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-1">
                  Photo ID
                </h3>
                <p className="text-sm text-gray-600 font-mono">{photo.id}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
              <p className="text-gray-600">Failed to load photo</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Photo?
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  This action cannot be undone. The photo and its annotation will
                  be permanently deleted from your device.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

