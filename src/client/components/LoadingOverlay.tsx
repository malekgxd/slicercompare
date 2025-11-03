/**
 * Loading Overlay Component
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Full-page or container-level loading overlay with spinner and message
 */

import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

export function LoadingOverlay({
  message = 'Loading...',
  fullPage = false,
  className = '',
}: LoadingOverlayProps) {
  const containerClasses = fullPage
    ? 'fixed inset-0 z-50'
    : 'absolute inset-0 z-10';

  return (
    <div
      className={`
        ${containerClasses}
        flex items-center justify-center
        bg-[var(--color-neutral-900)] bg-opacity-50
        backdrop-blur-sm
        ${className}
      `}
      role="alert"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="bg-white rounded-[var(--radius-xl)] p-8 shadow-[var(--shadow-xl)] max-w-sm">
        <LoadingSpinner size="lg" message={message} />
      </div>
    </div>
  );
}
