import { useEffect, useState } from 'react'
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (error) {
      const t = setTimeout(clearError, 5000)
      return () => clearTimeout(t)
    }
  }, [error, clearError])

  return (
    <div className={styles.layout}>
      <Sidebar collapsed={sidebarCollapsed} />

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
              <div className={styles.welcomeMark}>{'<dev />'}</div>
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
          ) : activeSession.messages.length === 0 ? (
            <div className={styles.emptyChat}>Ask anything dev-related</div>
          ) : (
            <div className={styles.messageList}>
              {activeSession.messages.map((msg, i) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  isLast={i === activeSession.messages.length - 1}
                />
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