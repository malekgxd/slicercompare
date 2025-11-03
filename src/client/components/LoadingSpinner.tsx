/**
 * Loading Spinner Component
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Reusable loading spinner with size and color variants following design system
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'neutral';
  message?: string;
  className?: string;
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-3',
};

const COLOR_CLASSES = {
  primary: 'border-[var(--color-primary-200)] border-t-[var(--color-primary-600)]',
  secondary: 'border-[var(--color-accent-200)] border-t-[var(--color-accent-600)]',
  neutral: 'border-[var(--color-neutral-200)] border-t-[var(--color-neutral-600)]',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  message,
  className = '',
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`
          inline-block animate-spin rounded-full
          ${SIZE_CLASSES[size]}
          ${COLOR_CLASSES[color]}
        `}
        role="status"
        aria-label={message || 'Loading'}
      >
        <span className="sr-only">{message || 'Loading...'}</span>
      </div>
      {message && (
        <p className="text-sm text-[var(--color-text-secondary)] font-medium">
          {message}
        </p>
      )}
    </div>
  );
}
