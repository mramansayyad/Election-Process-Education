import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-100 rounded-3xl text-center space-y-4 my-8">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-red-800">Something went wrong</h2>
          <p className="text-red-600 text-sm max-w-md mx-auto">
            We encountered an unexpected error while rendering this section. 
            This might be due to an API timeout or a temporary connection issue.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCcw size={18} />
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
