/**
 * Toast Notification Service
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * Wrapper around react-hot-toast providing consistent toast notifications
 * across the application with proper styling and accessibility.
 */

import toast, { type Toast, type ToastOptions as HotToastOptions } from 'react-hot-toast';

export interface ToastOptions extends Omit<HotToastOptions, 'icon'> {
  duration?: number;
}

/**
 * Default toast options following design system patterns
 */
const DEFAULT_OPTIONS: ToastOptions = {
  duration: 4000, // 4 seconds default
  position: 'top-right',
  style: {
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-4)',
    fontSize: 'var(--text-sm)',
    fontWeight: 'var(--font-medium)',
  },
};

/**
 * Success toast - Green with checkmark icon
 * Auto-dismisses after 3 seconds
 */
export function success(message: string, options?: ToastOptions): string {
  return toast.success(message, {
    ...DEFAULT_OPTIONS,
    duration: 3000,
    style: {
      ...DEFAULT_OPTIONS.style,
      background: 'var(--color-success-50)',
      color: 'var(--color-success-900)',
      border: '1px solid var(--color-success-200)',
    },
    iconTheme: {
      primary: 'var(--color-success-600)',
      secondary: 'var(--color-success-50)',
    },
    ...options,
  });
}

/**
 * Error toast - Red with X icon
 * Persists until manually dismissed (duration: Infinity)
 */
export function error(message: string, options?: ToastOptions): string {
  return toast.error(message, {
    ...DEFAULT_OPTIONS,
    duration: Infinity, // Requires manual dismiss
    style: {
      ...DEFAULT_OPTIONS.style,
      background: 'var(--color-error-50)',
      color: 'var(--color-error-900)',
      border: '1px solid var(--color-error-200)',
    },
    iconTheme: {
      primary: 'var(--color-error-600)',
      secondary: 'var(--color-error-50)',
    },
    ...options,
  });
}

/**
 * Warning toast - Amber with warning icon
 * Auto-dismisses after 5 seconds
 */
export function warning(message: string, options?: ToastOptions): string {
  return toast(message, {
    ...DEFAULT_OPTIONS,
    duration: 5000,
    icon: '⚠️',
    style: {
      ...DEFAULT_OPTIONS.style,
      background: 'var(--color-warning-50)',
      color: 'var(--color-warning-900)',
      border: '1px solid var(--color-warning-200)',
    },
    ...options,
  });
}

/**
 * Info toast - Cyan with info icon
 * Auto-dismisses after 5 seconds
 */
export function info(message: string, options?: ToastOptions): string {
  return toast(message, {
    ...DEFAULT_OPTIONS,
    duration: 5000,
    icon: 'ℹ️',
    style: {
      ...DEFAULT_OPTIONS.style,
      background: 'var(--color-info-50)',
      color: 'var(--color-info-900)',
      border: '1px solid var(--color-info-200)',
    },
    ...options,
  });
}

/**
 * Loading toast - Spinner icon
 * Persists until manually dismissed
 * Returns toast ID for later dismissal
 */
export function loading(message: string, options?: ToastOptions): string {
  return toast.loading(message, {
    ...DEFAULT_OPTIONS,
    duration: Infinity,
    style: {
      ...DEFAULT_OPTIONS.style,
      background: 'var(--color-neutral-50)',
      color: 'var(--color-text-primary)',
      border: '1px solid var(--color-neutral-200)',
    },
    ...options,
  });
}

/**
 * Dismiss a specific toast by ID
 */
export function dismiss(toastId: string): void {
  toast.dismiss(toastId);
}

/**
 * Dismiss all active toasts
 */
export function dismissAll(): void {
  toast.dismiss();
}

/**
 * Promise-based toast - Shows loading, then success or error
 * Automatically handles toast lifecycle
 */
export function promise<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((err: any) => string);
  },
  options?: ToastOptions
): Promise<T> {
  return toast.promise(
    typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn,
    {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    },
    {
      ...DEFAULT_OPTIONS,
      loading: {
        style: {
          ...DEFAULT_OPTIONS.style,
          background: 'var(--color-neutral-50)',
          color: 'var(--color-text-primary)',
          border: '1px solid var(--color-neutral-200)',
        },
      },
      success: {
        duration: 3000,
        style: {
          ...DEFAULT_OPTIONS.style,
          background: 'var(--color-success-50)',
          color: 'var(--color-success-900)',
          border: '1px solid var(--color-success-200)',
        },
        iconTheme: {
          primary: 'var(--color-success-600)',
          secondary: 'var(--color-success-50)',
        },
      },
      error: {
        duration: Infinity,
        style: {
          ...DEFAULT_OPTIONS.style,
          background: 'var(--color-error-50)',
          color: 'var(--color-error-900)',
          border: '1px solid var(--color-error-200)',
        },
        iconTheme: {
          primary: 'var(--color-error-600)',
          secondary: 'var(--color-error-50)',
        },
      },
      ...options,
    }
  );
}

/**
 * Custom toast with full control
 */
export function custom(message: string, options?: ToastOptions): string {
  return toast(message, {
    ...DEFAULT_OPTIONS,
    ...options,
  });
}

// Export the base toast object for advanced usage
export { toast };
