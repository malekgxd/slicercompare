/**
 * Error Boundary Component
 * Story 2.3: Error Handling & User Feedback Enhancement
 *
 * React Error Boundary following React 19 best practices
 * Catches errors from child components and displays fallback UI
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';
import * as toastService from '../services/toast';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Default fallback UI component
 */
function DefaultFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-neutral-50)] p-4">
      <div className="max-w-md w-full bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] p-8">
        <div className="flex items-start gap-4">
          <svg
            className="h-8 w-8 text-[var(--color-error-600)] flex-shrink-0"
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
            <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-4 text-xs">
                <summary className="cursor-pointer text-[var(--color-error-700)] font-medium mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="bg-[var(--color-neutral-100)] p-3 rounded-[var(--radius-md)] overflow-auto text-[var(--color-error-800)]">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
            <button
              onClick={resetError}
              className="px-4 py-2 bg-[var(--color-primary-600)] text-white rounded-[var(--radius-lg)] hover:bg-[var(--color-primary-700)] shadow-sm hover:shadow-md transition-all font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-500)] focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ErrorBoundary class component
 * Must be class component as error boundaries don't work with hooks yet
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so next render shows fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error with stack trace
    console.error('ErrorBoundary caught error:', error, errorInfo);

    // Show error toast notification
    toastService.error(`Error: ${error.message}`, {
      duration: 10000, // 10 seconds for errors
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultFallback;
      return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}
