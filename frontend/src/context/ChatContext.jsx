import { createContext, useContext, useReducer, useCallback } from 'react'
import { sendMessage } from '../utils/groq'

const ChatContext = createContext(null)

const initialState = {
  sessions: JSON.parse(localStorage.getItem('devchat_sessions') || '[]'),
  activeSessionId: null,
  isTyping: false,
  error: null
}

function chatReducer(state, action) {
  switch (action.type) {
    case 'NEW_SESSION': {
      const session = {
        id: crypto.randomUUID(),
        title: 'New Chat',
        createdAt: Date.now(),
        messages: []
      }
      const sessions = [session, ...state.sessions]
      localStorage.setItem('devchat_sessions', JSON.stringify(sessions))
      return { ...state, sessions, activeSessionId: session.id }
    }

    case 'SET_ACTIVE_SESSION':
      return { ...state, activeSessionId: action.payload }

    case 'DELETE_SESSION': {
      const sessions = state.sessions.filter(s => s.id !== action.payload)
      localStorage.setItem('devchat_sessions', JSON.stringify(sessions))
      const activeSessionId = state.activeSessionId === action.payload
        ? (sessions[0]?.id || null)
        : state.activeSessionId
      return { ...state, sessions, activeSessionId }
    }

    case 'ADD_MESSAGE': {
      const sessions = state.sessions.map(s => {
        if (s.id !== state.activeSessionId) return s
        const messages = [...s.messages, action.payload]
        const title = s.messages.length === 0 && action.payload.sender === 'user'
          ? action.payload.content.slice(0, 40) + (action.payload.content.length > 40 ? '...' : '')
          : s.title
        return { ...s, messages, title }
      })
      localStorage.setItem('devchat_sessions', JSON.stringify(sessions))
      return { ...state, sessions }
    }

    case 'SET_TYPING':
      return { ...state, isTyping: action.payload }

    case 'SET_ERROR':
      return { ...state, error: action.payload }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    default:
      return state
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const activeSession = state.sessions.find(s => s.id === state.activeSessionId) || null

  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || state.isTyping) return

    const userMsg = { id: crypto.randomUUID(), sender: 'user', content, timestamp: Date.now() }
    dispatch({ type: 'ADD_MESSAGE', payload: userMsg })
    dispatch({ type: 'SET_TYPING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const currentMessages = activeSession ? [...activeSession.messages, userMsg] : [userMsg]
      const response = await sendMessage(currentMessages)
      const botMsg = { id: crypto.randomUUID(), sender: 'bot', content: response, timestamp: Date.now() }
      dispatch({ type: 'ADD_MESSAGE', payload: botMsg })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false })
    }
  }, [state.isTyping, state.activeSessionId, activeSession])

  const newSession = useCallback(() => dispatch({ type: 'NEW_SESSION' }), [])
  const setActiveSession = useCallback((id) => dispatch({ type: 'SET_ACTIVE_SESSION', payload: id }), [])
  const deleteSession = useCallback((id) => dispatch({ type: 'DELETE_SESSION', payload: id }), [])
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [])

  return (
    <ChatContext.Provider value={{
      sessions: state.sessions,
      activeSession,
      activeSessionId: state.activeSessionId,
      isTyping: state.isTyping,
      error: state.error,
      sendMessage: handleSendMessage,
      newSession,
      setActiveSession,
      deleteSession,
      clearError
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be used within ChatProvider')
  return ctx
}