import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="text-xl font-bold text-white mb-2">
              Bir Hata Oluştu
            </h1>
            <p className="text-gray-400 mb-4">
              Uygulama beklenmeyen bir hata ile karşılaştı. Lütfen sayfayı yenilemeyi deneyin.
            </p>
            {this.state.error && (
              <details className="text-left mb-4 p-3 bg-gray-800 rounded text-sm">
                <summary className="cursor-pointer text-gray-300 mb-2">
                  Hata Detayları
                </summary>
                <div className="text-red-400">
                  <p><strong>Hata:</strong> {this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="mt-2 text-xs overflow-auto">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-primary"
              >
                Sayfayı Yenile
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="w-full btn-secondary"
              >
                Tekrar Dene
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 