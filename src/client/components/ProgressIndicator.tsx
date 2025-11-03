/**
 * Progress Indicator Component
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Progress bar showing completion percentage with optional label
 */

interface ProgressIndicatorProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'bar' | 'circle';
  className?: string;
}

export function ProgressIndicator({
  current,
  total,
  label,
  showPercentage = true,
  variant = 'bar',
  className = '',
}: ProgressIndicatorProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
  const safePercentage = Math.min(100, Math.max(0, percentage));

  if (variant === 'circle') {
    // Simple circle variant - can be enhanced later
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div className="relative h-16 w-16">
          <svg className="transform -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--color-neutral-200)"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="var(--color-primary-600)"
              strokeWidth="3"
              strokeDasharray={`${safePercentage}, 100`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-[var(--color-text-primary)]">
              {safePercentage}%
            </span>
          </div>
        </div>
        {label && (
          <p className="text-sm text-[var(--color-text-secondary)] text-center">
            {label}
          </p>
        )}
      </div>
    );
  }

  // Bar variant (default)
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {label}
            </p>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
              {current}/{total} ({safePercentage}%)
            </span>
          )}
        </div>
      )}
      <div
        className="w-full h-[var(--progress-height, 8px)] bg-[var(--progress-bg, var(--color-neutral-200))] rounded-[var(--progress-radius, var(--radius-full))] overflow-hidden"
        role="progressbar"
        aria-valuenow={safePercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `${safePercentage}% complete`}
      >
        <div
          className="h-full bg-[var(--progress-fill, var(--color-primary-600))] transition-all duration-300 ease-out rounded-[var(--progress-radius, var(--radius-full))]"
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  );
}
