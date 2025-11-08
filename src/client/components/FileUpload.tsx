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
      {/* Upload Card */}
      {!uploadedFile && (
        <div
          className="rounded-lg p-6 shadow-sm"
          style={{ backgroundColor: 'var(--color-background-secondary)' }}
        >
          {/* Card Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: 'var(--color-text-inverse)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Upload 3D Model
              </h3>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                STL or 3MF file (max 100MB)
              </p>
            </div>
          </div>

          {/* Dropzone Area */}
          <div
            {...getRootProps()}
            role="button"
            aria-label="Upload 3D model file. Drag and drop or click to browse."
            tabIndex={0}
            className={`
              border-2 border-dashed rounded-lg p-8 cursor-pointer
              transition-all duration-200
              ${!isDragActive && !error ? 'hover:scale-[1.01]' : ''}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{
              borderColor: isDragActive
                ? 'var(--color-primary-400)'
                : error
                  ? 'var(--color-error-400)'
                  : 'var(--color-border)',
              borderStyle: isDragActive ? 'solid' : 'dashed',
              backgroundColor: isDragActive
                ? 'var(--dropzone-bg-active)'
                : error
                  ? 'var(--color-error-50)'
                  : 'var(--dropzone-bg-default)',
            }}
          >
            <input {...getInputProps()} disabled={isUploading} />

            <div className="flex flex-col items-center justify-center text-center">
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  backgroundColor: isDragActive
                    ? 'var(--color-primary-100)'
                    : error
                      ? 'var(--color-error-100)'
                      : 'var(--color-neutral-700)',
                }}
              >
                <svg
                  className="w-8 h-8"
                  style={{
                    color: isDragActive
                      ? 'var(--color-primary-600)'
                      : error
                        ? 'var(--color-error-600)'
                        : 'var(--color-text-tertiary)',
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
              </div>

              {/* Text */}
              {isDragActive ? (
                <div>
                  <p
                    className="text-base font-semibold mb-1"
                    style={{ color: 'var(--color-primary-600)' }}
                  >
                    Drop file here
                  </p>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    Release to upload
                  </p>
                </div>
              ) : isUploading ? (
                <div>
                  <LoadingSpinner size="md" />
                  <p
                    className="text-base font-semibold mt-3"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Uploading file...
                  </p>
                </div>
              ) : (
                <div>
                  <p
                    className="text-base font-semibold mb-1"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    Drag & drop your 3D model here
                  </p>
                  <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    or click to browse files
                  </p>
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: 'var(--color-primary-600)',
                      color: 'var(--color-text-inverse)',
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Choose File
                  </div>
                  <p className="text-xs mt-3" style={{ color: 'var(--color-text-tertiary)' }}>
                    Supported formats: STL, 3MF (max 100MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && !isUploading && (
            <div
              role="alert"
              className="mt-4 p-4 rounded-lg"
              style={{
                backgroundColor: 'var(--color-error-50)',
                border: '1px solid var(--color-error-200)',
              }}
            >
              <div className="flex items-start gap-3">
                <svg
                  className="h-5 w-5 flex-shrink-0"
                  style={{ color: 'var(--color-error-600)' }}
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
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-error-700)' }}
                  >
                    Upload Failed
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--color-error-700)' }}>
                    {error}
                  </p>
                  <button
                    onClick={() => setError(null)}
                    className="text-sm mt-2 font-medium underline hover:no-underline"
                    style={{ color: 'var(--color-error-600)' }}
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Success Card */}
      {uploadedFile && !isUploading && (
        <div
          className="rounded-lg p-6 shadow-sm"
          style={{
            backgroundColor: 'var(--color-success-50)',
            border: '2px solid var(--color-success-300)',
          }}
        >
          <div className="flex items-start gap-4">
            {/* Success Icon */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--color-success-500)' }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: 'var(--color-text-inverse)' }}
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
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <h4
                className="text-base font-semibold mb-1"
                style={{ color: 'var(--color-success-900)' }}
              >
                File Uploaded Successfully
              </h4>
              <p
                className="text-base font-medium truncate mb-1"
                style={{ color: 'var(--color-success-800)' }}
              >
                {uploadedFile.filename}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-success-700)' }}>
                {(uploadedFile.fileSize / 1024 / 1024).toFixed(2)} MB • {uploadedFile.mimeType}
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--color-success-600)' }}>
                Uploaded {new Date(uploadedFile.uploadedAt).toLocaleString()}
              </p>
            </div>

            {/* Upload Another Button */}
            <button
              onClick={() => setUploadedFile(null)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors flex-shrink-0 hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-success-600)',
                color: 'var(--color-text-inverse)',
              }}
            >
              Upload Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
