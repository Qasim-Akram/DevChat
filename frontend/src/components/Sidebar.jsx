import { useState } from 'react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const { sessions, activeSessionId, newSession, setActiveSession, deleteSession, setApiKey, apiKey } = useChat()
  const { user, logout } = useAuth()
  const [showApiInput, setShowApiInput] = useState(false)
  const [keyInput, setKeyInput] = useState(apiKey)
  const [hoveredId, setHoveredId] = useState(null)

  const handleNewChat = () => {
    newSession()
  }

  const handleSaveKey = () => {
    setApiKey(keyInput.trim())
    setShowApiInput(false)
  }

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deleteSession(id)
  }

  const formatDate = (ts) => {
    const d = new Date(ts)
    const now = new Date()
    const diff = now - d
    if (diff < 86400000) return 'Today'
    if (diff < 172800000) return 'Yesterday'
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const grouped = sessions.reduce((acc, s) => {
    const label = formatDate(s.createdAt)
    if (!acc[label]) acc[label] = []
    acc[label].push(s)
    return acc
  }, {})

  return (
    <aside className={styles.sidebar}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <span className={styles.brandName}>DevChat</span>
          <span className={styles.brandBadge}>beta</span>
        </div>

        <button className={styles.newChatBtn} onClick={handleNewChat}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className={styles.history}>
        {sessions.length === 0 ? (
          <div className={styles.empty}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p>No chats yet</p>
            <span>Start a new chat above</span>
          </div>
        ) : (
          Object.entries(grouped).map(([label, group]) => (
            <div key={label} className={styles.group}>
              <p className={styles.groupLabel}>{label}</p>
              {group.map(s => (
                <button
                  key={s.id}
                  className={`${styles.sessionBtn} ${s.id === activeSessionId ? styles.active : ''}`}
                  onClick={() => setActiveSession(s.id)}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className={styles.sessionTitle}>{s.title}</span>
                  {(hoveredId === s.id || s.id === activeSessionId) && (
                    <span
                      className={styles.deleteBtn}
                      onClick={(e) => handleDelete(e, s.id)}
                      title="Delete chat"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      <div className={styles.bottom}>
        {showApiInput ? (
          <div className={styles.apiForm}>
            <p className={styles.apiLabel}>Groq API Key</p>
            <input
              className={styles.apiInput}
              type="password"
              value={keyInput}
              onChange={e => setKeyInput(e.target.value)}
              placeholder="gsk_..."
              onKeyDown={e => e.key === 'Enter' && handleSaveKey()}
              autoFocus
            />
            <div className={styles.apiBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowApiInput(false)}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSaveKey}>Save</button>
            </div>
          </div>
        ) : (
          <button className={styles.settingsBtn} onClick={() => setShowApiInput(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            {apiKey ? 'API Key ✓' : 'Add API Key'}
          </button>
        )}

        <div className={styles.userRow}>
          <div className={styles.userAvatar}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.username}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}