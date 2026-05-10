import { useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import { Sidebar } from '../components/Sidebar'
import { ChatMessage } from '../components/ChatMessage'
import { ChatInput } from '../components/ChatInput'
import { TypingIndicator } from '../components/TypingIndicator'
import { useAutoScroll } from '../hooks/useAutoScroll'
import styles from './Chat.module.css'

export default function Chat() {
  const { activeSession, isTyping, error, newSession, clearError } = useChat()
  const messagesRef = useAutoScroll([activeSession?.messages?.length, isTyping])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.chatTitle}>
              {activeSession ? activeSession.title : 'DevChat'}
            </h1>
            {activeSession && (
              <span className={styles.msgCount}>
                {activeSession.messages.length} messages
              </span>
            )}
          </div>
          <div className={styles.headerRight}>
            <div className={styles.statusDot} />
            <span className={styles.statusText}>llama-3.3-70b</span>
          </div>
        </header>

        {error && (
          <div className={styles.errorBanner}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <div className={styles.welcomeIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </div>
              <h2 className={styles.welcomeTitle}>Welcome to DevChat</h2>
              <p className={styles.welcomeDesc}>
                Your AI assistant built exclusively for developers.<br />
                Debug, explain, review, and build — faster.
              </p>
              <button className={styles.startBtn} onClick={newSession}>
                Start a new chat
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          ) : activeSession.messages.length === 0 ? (
            <div className={styles.emptyChat}>
              <p>Ask anything dev-related to get started</p>
            </div>
          ) : (
            <div className={styles.messageList}>
              {activeSession.messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          )}
        </div>

        <ChatInput />
      </main>
    </div>
  )
}