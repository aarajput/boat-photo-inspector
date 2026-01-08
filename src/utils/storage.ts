import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import type { Photo, PhotoMetadata } from '../types';

const PHOTOS_METADATA_KEY = 'boat_photos_metadata';

/**
 * Save a photo to the filesystem and update metadata
 */
export const savePhoto = async (
  base64Data: string,
  annotation: string
): Promise<Photo> => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const filename = `photo_${timestamp}.jpeg`;
    
    // Save photo to filesystem
    const savedFile = await Filesystem.writeFile({
      path: filename,
      data: base64Data,
      directory: Directory.Documents,
    });

    // Create photo object
    const photo: Photo = {
      id: `photo_${timestamp}`,
      filepath: savedFile.uri,
      annotation,
      timestamp,
    };

    // Update metadata
    await addPhotoMetadata(photo);

    return photo;
  } catch (error) {
    console.error('Error saving photo:', error);
    throw new Error('Failed to save photo. Please try again.');
  }
};

/**
 * Get the web-accessible path for displaying the photo
 */
export const getPhotoWebPath = (filepath: string): string => {
  // Capacitor will handle converting the file URI to a web-viewable path
  return filepath;
};

/**
 * Load all photo metadata from storage
 */
export const loadPhotosMetadata = async (): Promise<PhotoMetadata[]> => {
  try {
    const { value } = await Preferences.get({ key: PHOTOS_METADATA_KEY });
    
    if (!value) {
      return [];
    }

    return JSON.parse(value) as PhotoMetadata[];
  } catch (error) {
    console.error('Error loading photos metadata:', error);
    return [];
  }
};

/**
 * Add photo metadata to storage
 */
const addPhotoMetadata = async (photo: Photo): Promise<void> => {
  try {
    const metadata = await loadPhotosMetadata();
    
    const newMetadata: PhotoMetadata = {
      id: photo.id,
      filename: photo.filepath.split('/').pop() || '',
      annotation: photo.annotation,
      timestamp: photo.timestamp,
    };

    metadata.push(newMetadata);
    
    await Preferences.set({
      key: PHOTOS_METADATA_KEY,
      value: JSON.stringify(metadata),
    });
  } catch (error) {
    console.error('Error saving metadata:', error);
    throw error;
  }
};

/**
 * Delete a photo and its metadata
 */
export const deletePhoto = async (photoId: string): Promise<void> => {
  try {
    // Load metadata
    const metadata = await loadPhotosMetadata();
    const photoMeta = metadata.find((p) => p.id === photoId);

    if (!photoMeta) {
      throw new Error('Photo not found');
    }

    // Delete file from filesystem
    try {
      await Filesystem.deleteFile({
        path: photoMeta.filename,
        directory: Directory.Documents,
      });
    } catch (fileError) {
      console.warn('File may already be deleted:', fileError);
    }

    // Remove from metadata
    const updatedMetadata = metadata.filter((p) => p.id !== photoId);
    
    await Preferences.set({
      key: PHOTOS_METADATA_KEY,
      value: JSON.stringify(updatedMetadata),
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw new Error('Failed to delete photo. Please try again.');
  }
};

/**
 * Load a specific photo's full data
 */
export const loadPhoto = async (photoMeta: PhotoMetadata): Promise<Photo> => {
  try {
    const file = await Filesystem.readFile({
      path: photoMeta.filename,
      directory: Directory.Documents,
    });

    // Construct web path for display
    const uri = await Filesystem.getUri({
      path: photoMeta.filename,
      directory: Directory.Documents,
    });

    return {
      id: photoMeta.id,
      filepath: uri.uri,
      webviewPath: `data:image/jpeg;base64,${file.data}`,
      annotation: photoMeta.annotation,
      timestamp: photoMeta.timestamp,
    };
  } catch (error) {
    console.error('Error loading photo:', error);
    throw new Error('Failed to load photo');
  }
};

/**
 * Update photo annotation
 */
export const updatePhotoAnnotation = async (
  photoId: string,
  newAnnotation: string
): Promise<void> => {
  try {
    const metadata = await loadPhotosMetadata();
    const photoIndex = metadata.findIndex((p) => p.id === photoId);

    if (photoIndex === -1) {
      throw new Error('Photo not found');
    }

    metadata[photoIndex].annotation = newAnnotation;

    await Preferences.set({
      key: PHOTOS_METADATA_KEY,
      value: JSON.stringify(metadata),
    });
  } catch (error) {
    console.error('Error updating annotation:', error);
    throw new Error('Failed to update annotation');
  }
};

