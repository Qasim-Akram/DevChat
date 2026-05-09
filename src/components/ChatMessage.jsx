import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import styles from './ChatMessage.module.css'

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessage({ message }) {
  const isUser = message.sender === 'user'

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.bot}`}>
      {!isUser && (
        <div className={styles.avatar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
      )}

      <div className={styles.messageGroup}>
        <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
          {isUser ? (
            <p className={styles.plainText}>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const lang = match ? match[1] : ''
                  return !inline ? (
                    <CodeBlock language={lang}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  ) : (
                    <code className={styles.inlineCode} {...props}>{children}</code>
                  )
                },
                p: ({ children }) => <p className={styles.paragraph}>{children}</p>,
                ul: ({ children }) => <ul className={styles.list}>{children}</ul>,
                ol: ({ children }) => <ol className={styles.list}>{children}</ol>,
                li: ({ children }) => <li className={styles.listItem}>{children}</li>,
                strong: ({ children }) => <strong className={styles.strong}>{children}</strong>,
                h1: ({ children }) => <h1 className={styles.heading}>{children}</h1>,
                h2: ({ children }) => <h2 className={styles.heading}>{children}</h2>,
                h3: ({ children }) => <h3 className={styles.headingSm}>{children}</h3>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>
        <span className={styles.timestamp}>{formatTime(message.timestamp)}</span>
      </div>

      {isUser && (
        <div className={`${styles.avatar} ${styles.userAvatar}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  )
}