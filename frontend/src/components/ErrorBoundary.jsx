import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={styles.wrapper}>
                    <div className={styles.card}>
                        <div className={styles.icon}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                        </div>
                        <h2 className={styles.title}>Something went wrong</h2>
                        <p className={styles.message}>
                            {this.props.fallbackMessage || 'This part of the app ran into a problem.'}
                        </p>
                        <button className={styles.btn} onClick={this.handleReset}>
                            Try again
                        </button>
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}