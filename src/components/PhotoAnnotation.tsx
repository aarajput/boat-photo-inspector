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
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-50 overflow-auto pt-safe">
      <div className="min-h-full flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-md border-b border-gray-200">
          <div className="px-4 py-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Add Annotation
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Describe what's shown in this photo
            </p>
          </div>
        </div>

        {/* Photo Preview */}
        <div className="bg-white p-4 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={`data:image/jpeg;base64,${photoData}`}
                alt="Captured"
                className="w-full"
              />
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                Preview
              </div>
            </div>
          </div>
        </div>

        {/* Annotation Form */}
        <div className="flex-1 p-4 pb-safe">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <label
                htmlFor="annotation"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Photo Description
              </label>
              <textarea
                id="annotation"
                value={annotation}
                onChange={(e) => setAnnotation(e.target.value)}
                placeholder="e.g., Engine compartment - minor oil seepage visible on port side near fuel pump. No active leaks detected."
                maxLength={MAX_ANNOTATION_LENGTH}
                rows={5}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                  isOverLimit
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-gray-50 focus:bg-white'
                }`}
              />

              {/* Character Counter */}
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">
                  Be specific about location, condition, and any concerns
                </p>
                <div className="flex items-center gap-2">
                  {remainingChars < 50 && (
                    <svg
                      className={`w-4 h-4 ${
                        isOverLimit
                          ? 'text-red-500'
                          : remainingChars < 20
                          ? 'text-yellow-500'
                          : 'text-blue-500'
                      }`}
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
                  )}
                  <p
                    className={`text-sm font-semibold ${
                      isOverLimit
                        ? 'text-red-600'
                        : remainingChars < 20
                        ? 'text-yellow-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {remainingChars} characters
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isOverLimit
                      ? 'bg-red-500'
                      : remainingChars < 20
                      ? 'bg-yellow-500'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (annotation.length / MAX_ANNOTATION_LENGTH) * 100)}%`,
                  }}
                ></div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSave}
                  disabled={
                    isSaving || annotation.trim().length === 0 || isOverLimit
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:shadow-none transform hover:-translate-y-0.5"
                >
                  {isSaving ? (
                    <>
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Save Photo</span>
                    </>
                  )}
                </button>

                <button
                  onClick={onCancel}
                  disabled={isSaving}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
