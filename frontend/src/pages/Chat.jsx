import { useEffect, useState } from 'react'
import { useChat } from '../context/ChatContext'
import { Sidebar } from '../components/Sidebar'
import { ChatMessage } from '../components/ChatMessage'
import { ChatInput } from '../components/ChatInput'
import { TypingIndicator } from '../components/TypingIndicator'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { useAutoScroll } from '../hooks/useAutoScroll'
import styles from './Chat.module.css'
import logo from '../assets/logo.svg'

function LoadingSpinner({ label }) {
  return (
    <div className={styles.loadingWrap}>
      <div className={styles.spinner} />
      {label && <span className={styles.loadingLabel}>{label}</span>}
    </div>
  )
}

export default function Chat() {
  const {
    activeSession,
    activeMessages,
    isTyping,
    error,
    loadingSessions,
    loadingMessages,
    newSession,
    clearError
  } = useChat()

  const messagesRef = useAutoScroll([activeMessages.length, isTyping])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (error) {
      const t = setTimeout(clearError, 5000)
      return () => clearTimeout(t)
    }
  }, [error, clearError])

  return (
    <div className={styles.layout}>
      <ErrorBoundary fallbackMessage="The sidebar ran into a problem.">
        <Sidebar collapsed={sidebarCollapsed} loadingSessions={loadingSessions} />
      </ErrorBoundary>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.toggleBtn} onClick={() => setSidebarCollapsed(p => !p)} title="Toggle sidebar">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <h1 className={styles.chatTitle}>
              {activeSession ? activeSession.title : 'DevChat'}
            </h1>
          </div>
          <div className={styles.headerRight}>
            <a className={styles.gitbtn} href="https://github.com/Qasim-Akram" target="_blank" rel="noopener noreferrer">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <div className={styles.statusDot} />
            <span className={styles.modelTag}>llama-3.3-70b</span>
          </div>
        </header>

        {error && (
          <div className={styles.errorBanner}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <div className={styles.messages} ref={messagesRef}>
          {!activeSession ? (
            <div className={styles.welcome}>
              <img src={logo} alt="logo" className={styles.logo} />
              <h2 className={styles.welcomeTitle}>DevChat</h2>
              <p className={styles.welcomeDesc}>
                AI assistant built for developers.<br />Debug, explain, and build faster.
              </p>
              <button className={styles.startBtn} onClick={newSession}>
                New chat
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          ) : loadingMessages ? (
            <LoadingSpinner label="Loading messages..." />
          ) : activeMessages.length === 0 ? (
            <div className={styles.emptyChat}>Ask anything dev-related</div>
          ) : (
            <ErrorBoundary fallbackMessage="Failed to render messages.">
              <div className={styles.messageList}>
                {activeMessages.map((msg, i) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    isLast={i === activeMessages.length - 1}
                  />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            </ErrorBoundary>
          )}
        </div>

        <ChatInput />
      </main>
    </div>
  )
}