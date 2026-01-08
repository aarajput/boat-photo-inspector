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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-auto pt-safe">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
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
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
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
      <div className="max-w-4xl mx-auto p-4 pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading photo...</p>
            </div>
          </div>
        ) : photoData && photoData.webviewPath ? (
          <div className="space-y-4">
            {/* Photo */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
              <img
                src={photoData.webviewPath}
                alt={photo.annotation}
                className="w-full"
              />
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* Annotation */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Description
                  </h3>
                </div>
                <p className="text-lg text-gray-900 leading-relaxed pl-12">
                  {photo.annotation}
                </p>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Timestamp */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Captured
                  </h3>
                </div>
                <p className="text-lg text-gray-900 pl-12">
                  {formatDateTime(photo.timestamp)}
                </p>
              </div>

              <div className="border-t border-gray-200"></div>

              {/* Photo ID */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Photo ID
                  </h3>
                </div>
                <p className="text-sm text-gray-600 font-mono pl-12 break-all">
                  {photo.id}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <svg
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
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
              <p className="text-gray-600 font-medium">Failed to load photo</p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-red-600"
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Photo?
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  This action cannot be undone. The photo and its annotation will
                  be permanently deleted from your device.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
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
