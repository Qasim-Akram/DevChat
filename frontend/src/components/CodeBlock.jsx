import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import styles from './CodeBlock.module.css'

export function CodeBlock({ language, children }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lang = language || 'text'

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.dots}>
          <span /><span /><span />
        </div>
        <span className={styles.lang}>{lang}</span>
        <button onClick={handleCopy} className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}>
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '12.5px',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none'
        }}
        showLineNumbers
        lineNumberStyle={{ color: 'rgba(255,255,255,0.15)', fontSize: '11px', minWidth: '2.2em' }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  )
}