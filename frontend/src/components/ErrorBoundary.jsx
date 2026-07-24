import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught an error:", error);
    console.error(errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-green-50 dark:bg-slate-900 px-6">
          <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-10 text-center">
            <div className="text-6xl mb-4">⚠️</div>

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Oops! Something went wrong.
            </h1>

            <p className="mt-4 text-gray-600 dark:text-slate-300">
              An unexpected error occurred while loading this page. Please
              refresh the page and try again.
            </p>

            <button
              onClick={this.handleRefresh}
              className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
