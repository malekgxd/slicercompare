import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as toast from '../services/toast';
import { LoadingSpinner } from './LoadingSpinner';

interface UploadedFile {
  id: string;
  filename: string;
  filePath: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

interface FileUploadProps {
  onUploadSuccess?: (file: UploadedFile) => void;
  onUploadError?: (error: Error) => void;
}

export default function FileUpload({ onUploadSuccess, onUploadError }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset state
    setError(null);
    setUploadedFile(null);

    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];

    // Client-side validation
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      const errorMsg = `File size exceeds 100MB limit. Current file: ${Math.round(file.size / 1024 / 1024)}MB.`;
      setError(errorMsg);
      toast.error(errorMsg);
      if (onUploadError) {
        onUploadError(new Error(errorMsg));
      }
      return;
    }

    // Check file extension
    const allowedExtensions = ['.stl', '.3mf'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      const errorMsg = 'File format not supported. Please upload STL or 3MF files only.';
      setError(errorMsg);
      toast.error(errorMsg);
      if (onUploadError) {
        onUploadError(new Error(errorMsg));
      }
      return;
    }

    // Upload file with promise toast
    setIsUploading(true);

    try {
      await toast.promise(
        (async () => {
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
          }

          const data: UploadedFile = await response.json();
          setUploadedFile(data);

          if (onUploadSuccess) {
            onUploadSuccess(data);
          }

          return data;
        })(),
        {
          loading: 'Uploading file...',
          success: 'File uploaded successfully!',
          error: (err) => `Upload failed: ${err.message}`,
        }
      );
    } catch (err: any) {
      const errorMsg = err.message || 'Upload failed. Please try again.';
      setError(errorMsg);
      if (onUploadError) {
        onUploadError(err);
      }
    } finally {
      setIsUploading(false);
    }
  }, [onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'model/stl': ['.stl'],
      'application/vnd.ms-package.3dmanufacturing-3dmodel+xml': ['.3mf'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: false,
  });

  return (
    <div className="w-full">
      {/* Upload Zone - Compact & High Contrast */}
      {!uploadedFile && (
        <div
          {...getRootProps()}
          role="button"
          aria-label="Upload 3D model file. Drag and drop or click to browse."
          tabIndex={0}
          className={`
            border-2 border-dashed rounded-lg p-3 cursor-pointer
            transition-all duration-200
            ${!isDragActive && !error ? 'hover:scale-[1.005]' : ''}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          style={{
            borderColor: isDragActive ? '#3b82f6' : error ? '#ef4444' : '#475569',
            borderStyle: isDragActive ? 'solid' : 'dashed',
            backgroundColor: isDragActive
              ? 'rgba(59, 130, 246, 0.15)'
              : error
                ? 'rgba(239, 68, 68, 0.15)'
                : '#1e293b'  /* card background for visual consistency */
          }}
        >
          <input {...getInputProps()} disabled={isUploading} />

          <div className="flex items-center gap-2">
            {/* Icon - Tiny */}
            <svg
              className="h-4 w-4 flex-shrink-0"
              style={{
                color: isDragActive ? '#60a5fa' : error ? '#fca5a5' : '#94a3b8'
              }}
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {/* Text - Very Compact */}
            <div className="flex-1 min-w-0">
              {isDragActive ? (
                <p className="text-xs font-medium" style={{ color: '#60a5fa' }}>
                  Drop file here...
                </p>
              ) : isUploading ? (
                <p className="text-xs font-medium" style={{ color: '#e2e8f0' }}>
                  Uploading...
                </p>
              ) : (
                <p className="text-xs font-medium" style={{ color: '#e2e8f0' }}>
                  Drag STL or 3MF file here, or click to browse <span style={{ color: '#94a3b8' }}>(max 100MB)</span>
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isUploading && (
        <div className="mt-4">
          <LoadingSpinner size="md" message="Uploading file..." />
        </div>
      )}

      {/* Error Message - High Contrast */}
      {error && !isUploading && (
        <div
          role="alert"
          className="mt-4 p-4 rounded-lg"
          style={{
            backgroundColor: 'var(--color-error-bg)',
            border: '1px solid var(--color-error-border)'
          }}
        >
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0"
              style={{ color: 'var(--color-error-text)' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--color-error-text)' }}>
                Upload Failed
              </p>
              <p className="text-sm mt-1" style={{ color: '#e2e8f0' }}>
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-sm mt-2 underline"
                style={{ color: 'var(--color-error-text)' }}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message - High Contrast */}
      {uploadedFile && !isUploading && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 p-4 rounded-lg flex items-center justify-between gap-4"
          style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)'
          }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <svg
              className="h-6 w-6 flex-shrink-0"
              style={{ color: 'var(--color-success-text)' }}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: '#f1f5f9' }}>
                {uploadedFile.filename}
              </p>
              <p className="text-sm" style={{ color: '#cbd5e1' }}>
                {(uploadedFile.fileSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => setUploadedFile(null)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0"
            style={{
              backgroundColor: '#22c55e',
              color: '#ffffff'
            }}
          >
            Upload Another
          </button>
        </div>
      )}
    </div>
  );
}
