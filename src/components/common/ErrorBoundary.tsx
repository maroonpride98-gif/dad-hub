import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // In production, you'd send this to an error tracking service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: 'linear-gradient(180deg, #1c1917 0%, #292524 100%)',
            color: '#fafaf9',
            fontFamily: "'Outfit', system-ui, sans-serif",
          }}
        >
          <div
            style={{
              fontSize: '80px',
              marginBottom: '24px',
              animation: 'float 3s ease-in-out infinite',
            }}
          >
            😅
          </div>

          <h1
            style={{
              margin: '0 0 8px 0',
              fontSize: '24px',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            Oops! Something went wrong
          </h1>

          <p
            style={{
              margin: '0 0 24px 0',
              fontSize: '14px',
              color: '#a8a29e',
              textAlign: 'center',
              maxWidth: '300px',
            }}
          >
            Don't worry, even the best dads have off days. Let's get you back on track.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: '#d97706',
                border: '2px solid #d97706',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Try Again
            </button>

            <button
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #d97706, #f59e0b)',
                color: '#1c1917',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              Go Home
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              style={{
                marginTop: '32px',
                padding: '16px',
                background: '#292524',
                borderRadius: '12px',
                width: '100%',
                maxWidth: '500px',
              }}
            >
              <summary
                style={{
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                Error Details (Dev Only)
              </summary>
              <pre
                style={{
                  marginTop: '12px',
                  fontSize: '11px',
                  color: '#a8a29e',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
