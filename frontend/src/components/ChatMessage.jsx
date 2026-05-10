import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './CodeBlock'
import { useChat } from '../context/ChatContext'
import styles from './ChatMessage.module.css'

const QUICK_PROMPTS = [
  { label: '🐛 Debug this', text: 'Debug this code: ' },
  { label: '📖 Explain', text: 'Explain this in simple terms: ' },
  { label: '⚡ Optimize', text: 'How can I optimize this: ' },
]

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function ChatMessage({ message, isLast }) {
  const isUser = message.sender === 'user'
  const { sendMessage } = useChat()

  return (
    <div className={`${styles.wrapper} ${isUser ? styles.user : styles.bot}`}>
      {!isUser && (
        <div className={`${styles.avatar} ${styles.botAvatar}`}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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
                code({ inline, className, children }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline ? (
                    <CodeBlock language={match ? match[1] : ''}>
                      {String(children).replace(/\n$/, '')}
                    </CodeBlock>
                  ) : (
                    <code className={styles.inlineCode}>{children}</code>
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

        {!isUser && isLast && (
          <div className={styles.quickPrompts}>
            {QUICK_PROMPTS.map(p => (
              <button
                key={p.label}
                className={styles.promptChip}
                onClick={() => sendMessage(p.text)}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className={styles.avatar}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </div>
  )
}