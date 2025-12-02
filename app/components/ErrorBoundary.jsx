'use client';

import { Component } from 'react';
import { ErrorState } from './EmptyState';

/**
 * Error Boundary Component
 * Stage 15.10 - Error & Empty States
 *
 * Catches JavaScript errors anywhere in the component tree
 */

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-2xl w-full mx-4">
            <ErrorState
              error="משהו השתבש"
              description={
                process.env.NODE_ENV === 'development'
                  ? this.state.error?.message || 'אירעה שגיאה בלתי צפויה'
                  : 'אירעה שגיאה בלתי צפויה. אנא רענן את הדף או נסה שוב מאוחר יותר.'
              }
              onRetry={this.handleReset}
              onGoBack={() => window.history.back()}
            />

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                  פרטי שגיאה (Development Only)
                </summary>
                <div className="text-sm text-red-700 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 bg-white p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="mt-1 bg-white p-2 rounded overflow-auto text-xs">
                      {this.state.error.stack}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 bg-white p-2 rounded overflow-auto text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional Error Boundary Hook (React 18+)
 * For use with Suspense boundaries
 */
export function useErrorHandler() {
  const [error, setError] = useState(null);

  if (error) {
    throw error;
  }

  return setError;
}
