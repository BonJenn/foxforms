import React from 'react';
import styles from './ErrorBoundary.module.css'; // Import the CSS module for styling

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details
        console.log('Error caught by Error Boundary:', error);
        console.log('Error Info:', errorInfo);
        this.setState({ error: error, errorInfo: errorInfo });
    }

    render() {
        if (this.state.hasError) {
            // Display more informative error message using styled components
            return (
                <div className={styles.errorBoundaryContainer}>
                    <h1 className={styles.errorMessage}>Fuck! Something went wrong.</h1>
                    <details className={styles.errorDetails}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                    <div className={styles.sadFace}>:(</div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;