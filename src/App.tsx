import { useState } from 'react';
import type { PhotoMetadata } from './types';
import { usePhotoStorage } from './hooks/usePhotoStorage';
import { PhotoGallery } from './components/PhotoGallery';
import { PhotoCapture } from './components/PhotoCapture';
import { PhotoAnnotation } from './components/PhotoAnnotation';
import { PhotoDetail } from './components/PhotoDetail';

type AppView = 'gallery' | 'capture' | 'annotate' | 'detail';

function App() {
  const { photos, loading, error, addPhoto, removePhoto } = usePhotoStorage();
  
  const [currentView, setCurrentView] = useState<AppView>('gallery');
  const [capturedPhotoData, setCapturedPhotoData] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMetadata | null>(null);

  // Handle photo capture flow
  const handleStartCapture = () => {
    setCurrentView('capture');
  };

  const handlePhotoSelected = (photoData: string) => {
    setCapturedPhotoData(photoData);
    setCurrentView('annotate');
  };

  const handleCancelCapture = () => {
    setCapturedPhotoData(null);
    setCurrentView('gallery');
  };

  // Handle annotation flow
  const handleSaveAnnotation = async (annotation: string) => {
    if (!capturedPhotoData) return;

    try {
      await addPhoto(capturedPhotoData, annotation);
      // Reset and return to gallery
      setCapturedPhotoData(null);
      setCurrentView('gallery');
    } catch (error) {
      console.error('Failed to save photo:', error);
      throw error;
    }
  };

  const handleCancelAnnotation = () => {
    setCapturedPhotoData(null);
    setCurrentView('gallery');
  };

  // Handle photo detail view
  const handlePhotoClick = (photo: PhotoMetadata) => {
    setSelectedPhoto(photo);
    setCurrentView('detail');
  };

  const handleBackFromDetail = () => {
    setSelectedPhoto(null);
    setCurrentView('gallery');
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await removePhoto(photoId);
      setSelectedPhoto(null);
      setCurrentView('gallery');
    } catch (error) {
      console.error('Failed to delete photo:', error);
      throw error;
    }
  };

  // Global error display
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  // Render based on current view
  return (
    <>
      {currentView === 'gallery' && (
        <PhotoGallery
          photos={photos}
          onPhotoClick={handlePhotoClick}
          onAddPhoto={handleStartCapture}
          loading={loading}
        />
      )}

      {currentView === 'capture' && (
        <PhotoCapture
          onPhotoSelected={handlePhotoSelected}
          onCancel={handleCancelCapture}
        />
      )}

      {currentView === 'annotate' && capturedPhotoData && (
        <PhotoAnnotation
          photoData={capturedPhotoData}
          onSave={handleSaveAnnotation}
          onCancel={handleCancelAnnotation}
        />
      )}

      {currentView === 'detail' && selectedPhoto && (
        <PhotoDetail
          photo={selectedPhoto}
          onBack={handleBackFromDetail}
          onDelete={handleDeletePhoto}
        />
      )}
    </>
  );
}

export default App;
