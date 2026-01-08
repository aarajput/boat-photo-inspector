import { useState, useEffect } from 'react';
import type { Photo, PhotoMetadata } from '../types';
import {
  loadPhotosMetadata,
  savePhoto,
  deletePhoto,
  loadPhoto,
} from '../utils/storage';

export const usePhotoStorage = () => {
  const [photos, setPhotos] = useState<PhotoMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load photos on mount
  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedPhotos = await loadPhotosMetadata();
      setPhotos(loadedPhotos.sort((a, b) => b.timestamp - a.timestamp));
    } catch (err) {
      setError('Failed to load photos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addPhoto = async (base64Data: string, annotation: string) => {
    try {
      setError(null);
      await savePhoto(base64Data, annotation);
      // Reload photos to update the list
      await loadPhotos();
    } catch (err) {
      setError('Failed to save photo');
      console.error(err);
      throw err;
    }
  };

  const removePhoto = async (photoId: string) => {
    try {
      setError(null);
      await deletePhoto(photoId);
      // Update local state
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (err) {
      setError('Failed to delete photo');
      console.error(err);
      throw err;
    }
  };

  const getPhotoData = async (photoMeta: PhotoMetadata): Promise<Photo> => {
    try {
      return await loadPhoto(photoMeta);
    } catch (err) {
      console.error('Failed to load photo data:', err);
      throw err;
    }
  };

  return {
    photos,
    loading,
    error,
    addPhoto,
    removePhoto,
    getPhotoData,
    refreshPhotos: loadPhotos,
  };
};

