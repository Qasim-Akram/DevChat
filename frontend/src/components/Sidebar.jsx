import { useState } from 'react'
import { useChat } from '../context/ChatContext'
import { useAuth } from '../context/AuthContext'
import styles from './Sidebar.module.css'
import logo from '../assets/logo.svg'

export function Sidebar({ collapsed }) {
  const { sessions, activeSessionId, newSession, setActiveSession, deleteSession } = useChat()
  const { user, logout } = useAuth()
  const [hoveredId, setHoveredId] = useState(null)

  const handleDelete = (e, id) => {
    e.stopPropagation()
    deleteSession(id)
  }

  const formatDate = (ts) => {
    const diff = Date.now() - ts
    if (diff < 86400000) return 'Today'
    if (diff < 172800000) return 'Yesterday'
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  const grouped = sessions.reduce((acc, s) => {
    const label = formatDate(s.createdAt)
    if (!acc[label]) acc[label] = []
    acc[label].push(s)
    return acc
  }, {})

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <img className={styles.logo} src={logo} alt="logo" />
          <span className={styles.brandName}>DevChat</span>
        </div>
        <button className={styles.newChatBtn} onClick={newSession}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Chat
        </button>
      </div>

      <div className={styles.history}>
        {sessions.length === 0 ? (
          <div className={styles.empty}>
            <p>No chats yet</p>
            <span>Start one above</span>
          </div>
        ) : (
          Object.entries(grouped).map(([label, group]) => (
            <div key={label}>
              <p className={styles.groupLabel}>{label}</p>
              {group.map(s => (
                <button
                  key={s.id}
                  className={`${styles.sessionBtn} ${s.id === activeSessionId ? styles.active : ''}`}
                  onClick={() => setActiveSession(s.id)}
                  onMouseEnter={() => setHoveredId(s.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className={styles.sessionTitle}>{s.title}</span>
                  {hoveredId === s.id && (
                    <span className={styles.deleteBtn} onClick={(e) => handleDelete(e, s.id)}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4h6v2" />
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
        <div className={styles.userRow}>
          <div className={styles.userAvatar}>{user?.username?.charAt(0).toUpperCase()}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user?.username}</p>
          </div>
          <button className={styles.logoutBtn} onClick={logout} title="Logout">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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