import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface PhotoCaptureProps {
  onPhotoSelected: (photoData: string) => void;
  onCancel: () => void;
}

export const PhotoCapture = ({ onPhotoSelected, onCancel }: PhotoCaptureProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCameraCapture = async () => {
    try {
      setLoading(true);
      setError(null);

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (photo.base64String) {
        onPhotoSelected(photo.base64String);
      }
    } catch (err: unknown) {
      console.error('Camera error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('User cancelled') || errorMessage.includes('cancel')) {
        // User cancelled, just close
        onCancel();
      } else if (errorMessage.includes('permission')) {
        setError(
          'Camera permission denied. Please enable camera access in Settings > Boat Photo Inspector > Camera.'
        );
      } else {
        setError('Failed to capture photo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGallerySelect = async () => {
    try {
      setLoading(true);
      setError(null);

      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (photo.base64String) {
        onPhotoSelected(photo.base64String);
      }
    } catch (err: unknown) {
      console.error('Gallery error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('User cancelled') || errorMessage.includes('cancel')) {
        // User cancelled, just close
        onCancel();
      } else if (errorMessage.includes('permission')) {
        setError(
          'Photo library permission denied. Please enable photo access in Settings > Boat Photo Inspector > Photos.'
        );
      } else {
        setError('Failed to select photo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Add Photo
        </h2>
        
        <p className="text-gray-600 mb-6">
          Choose how you want to add a photo to your boat inspection.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCameraCapture}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-medium">
              {loading ? 'Opening Camera...' : 'Take Photo'}
            </span>
          </button>

          <button
            onClick={handleGallerySelect}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {loading ? 'Opening Gallery...' : 'Choose from Gallery'}
            </span>
          </button>

          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

