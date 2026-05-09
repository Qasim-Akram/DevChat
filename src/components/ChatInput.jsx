import { useState, useRef, useEffect } from 'react'
import { useChat } from '../context/ChatContext'
import styles from './ChatInput.module.css'

const QUICK_PROMPTS = [
  { label: '🐛 Debug', text: 'Help me debug this code: ' },
  { label: '📖 Explain', text: 'Explain this concept: ' },
  { label: '👁️ Review', text: 'Review this code for best practices: ' },
  { label: '⚡ Optimize', text: 'How can I optimize this: ' }
]

export function ChatInput() {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)
  const { sendMessage, isTyping, activeSession } = useChat()

  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
  }, [text])

  const handleSend = () => {
    if (!text.trim() || isTyping) return
    sendMessage(text.trim())
    setText('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (promptText) => {
    setText(promptText)
    textareaRef.current?.focus()
  }

  const disabled = !activeSession

  return (
    <div className={styles.container}>
      <div className={styles.quickPrompts}>
        {QUICK_PROMPTS.map(p => (
          <button
            key={p.label}
            className={styles.quickBtn}
            onClick={() => handleQuickPrompt(p.text)}
            disabled={disabled}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={`${styles.inputRow} ${disabled ? styles.disabled : ''}`}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Start a new chat →' : 'Ask anything about dev... (Enter to send, Shift+Enter for newline)'}
          rows={1}
          disabled={disabled || isTyping}
        />
        <button
          className={`${styles.sendBtn} ${text.trim() && !isTyping ? styles.active : ''}`}
          onClick={handleSend}
          disabled={!text.trim() || isTyping || disabled}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <p className={styles.hint}>
        <span className={styles.model}>llama-3.3-70b</span>
        &nbsp;·&nbsp; DevChat only answers developer questions
      </p>
    </div>
  )
}