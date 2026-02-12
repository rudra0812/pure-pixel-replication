import React, { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorCount: number;
}

/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 * Prevents entire app from crashing
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);

    this.setState(prev => ({
      errorInfo,
      errorCount: prev.errorCount + 1,
    }));

    // You could also send error to logging service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center max-w-md"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {/* Error Icon */}
            <div className="mb-6 flex justify-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="h-16 w-16 text-red-500" />
              </motion.div>
            </div>

            {/* Error Message */}
            <h1 className="mb-2 text-2xl font-bold text-red-900">
              Oops, something went wrong
            </h1>
            
            <p className="mb-6 text-red-700">
              We encountered an unexpected error. Don't worry, you can try again.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.div
                className="mb-6 rounded-lg bg-red-900/10 p-4 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="mb-2 font-mono text-sm font-semibold text-red-800">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo?.componentStack && (
                  <pre className="overflow-auto text-xs text-red-700 whitespace-pre-wrap break-words">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-6 py-3 font-medium text-white transition-all hover:bg-red-600 active:scale-95"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </motion.button>

            {/* Error Count (for monitoring) */}
            {this.state.errorCount > 3 && (
              <motion.p
                className="mt-6 text-sm text-red-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Multiple errors detected. Please refresh the page if this persists.
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}
