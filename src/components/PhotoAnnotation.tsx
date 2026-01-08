import { useState } from 'react';

interface PhotoAnnotationProps {
  photoData: string;
  onSave: (annotation: string) => void;
  onCancel: () => void;
}

const MAX_ANNOTATION_LENGTH = 200;

export const PhotoAnnotation = ({
  photoData,
  onSave,
  onCancel,
}: PhotoAnnotationProps) => {
  const [annotation, setAnnotation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (annotation.trim().length === 0) {
      alert('Please add an annotation before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(annotation.trim());
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save photo. Please try again.');
      setIsSaving(false);
    }
  };

  const remainingChars = MAX_ANNOTATION_LENGTH - annotation.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="min-h-full flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-4 py-4 shadow-md">
          <h2 className="text-xl font-bold">Add Annotation</h2>
          <p className="text-sm text-blue-100 mt-1">
            Describe this photo for your boat inspection
          </p>
        </div>

        {/* Photo Preview */}
        <div className="bg-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <img
              src={`data:image/jpeg;base64,${photoData}`}
              alt="Captured"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Annotation Form */}
        <div className="flex-1 p-4">
          <div className="max-w-2xl mx-auto">
            <label
              htmlFor="annotation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Annotation
            </label>
            <textarea
              id="annotation"
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder="e.g., Engine compartment - oil leak visible near port side..."
              maxLength={MAX_ANNOTATION_LENGTH}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                isOverLimit ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            
            {/* Character Counter */}
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                Describe what's shown in the photo
              </p>
              <p
                className={`text-sm font-medium ${
                  isOverLimit
                    ? 'text-red-600'
                    : remainingChars < 20
                    ? 'text-yellow-600'
                    : 'text-gray-600'
                }`}
              >
                {remainingChars} characters remaining
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={
                  isSaving || annotation.trim().length === 0 || isOverLimit
                }
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Photo'
                )}
              </button>

              <button
                onClick={onCancel}
                disabled={isSaving}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

