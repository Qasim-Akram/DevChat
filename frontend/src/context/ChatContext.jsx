import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'
import {
  fetchSessions,
  fetchSession,
  createSession,
  deleteSessionAPI,
  addMessageToSession,
  sendChatMessage
} from '../utils/api'

const ChatContext = createContext(null)

const initialState = {
  sessions: [],          
  activeSessionId: null,
  activeMessages: [],    
  isTyping: false,
  error: null,
  loadingSessions: false,
  loadingMessages: false
}

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING_SESSIONS':
      return { ...state, loadingSessions: action.payload }

    case 'SET_LOADING_MESSAGES':
      return { ...state, loadingMessages: action.payload }

    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload, loadingSessions: false }

    case 'ADD_SESSION': {
      return {
        ...state,
        sessions: [action.payload, ...state.sessions],
        activeSessionId: action.payload.id,
        activeMessages: []
      }
    }

    case 'SET_ACTIVE_SESSION':
      return { ...state, activeSessionId: action.payload, activeMessages: [] }

    case 'SET_ACTIVE_MESSAGES':
      return { ...state, activeMessages: action.payload, loadingMessages: false }

    case 'APPEND_MESSAGE':
      return { ...state, activeMessages: [...state.activeMessages, action.payload] }

    case 'UPDATE_SESSION_TITLE': {
      const sessions = state.sessions.map(s =>
        s.id === action.payload.id ? { ...s, title: action.payload.title } : s
      )
      return { ...state, sessions }
    }

    case 'DELETE_SESSION': {
      const sessions = state.sessions.filter(s => s.id !== action.payload)
      const activeSessionId = state.activeSessionId === action.payload
        ? (sessions[0]?.id || null)
        : state.activeSessionId
      const activeMessages = state.activeSessionId === action.payload ? [] : state.activeMessages
      return { ...state, sessions, activeSessionId, activeMessages }
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
  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      dispatch({ type: 'SET_LOADING_SESSIONS', payload: true })
      try {
        const data = await fetchSessions()
        if (!cancelled) dispatch({ type: 'SET_SESSIONS', payload: data })
      } catch (e) {
        if (!cancelled) {
          dispatch({ type: 'SET_LOADING_SESSIONS', payload: false })
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load sessions' })
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [user])

  
  useEffect(() => {
    if (!state.activeSessionId) return
    let cancelled = false

    async function load() {
      dispatch({ type: 'SET_LOADING_MESSAGES', payload: true })
      try {
        const data = await fetchSession(state.activeSessionId)
        if (!cancelled) dispatch({ type: 'SET_ACTIVE_MESSAGES', payload: data.messages || [] })
      } catch (e) {
        if (!cancelled) {
          dispatch({ type: 'SET_LOADING_MESSAGES', payload: false })
          dispatch({ type: 'SET_ERROR', payload: 'Failed to load messages' })
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [state.activeSessionId])

  const newSession = useCallback(async () => {
    try {
      const session = await createSession()
      dispatch({ type: 'ADD_SESSION', payload: session })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create session' })
    }
  }, [])

  const setActiveSession = useCallback((id) => {
    dispatch({ type: 'SET_ACTIVE_SESSION', payload: id })
  }, [])

  const deleteSession = useCallback(async (id) => {
    try {
      await deleteSessionAPI(id)
      dispatch({ type: 'DELETE_SESSION', payload: id })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete session' })
    }
  }, [])

  const handleSendMessage = useCallback(async (content) => {
    if (!content.trim() || state.isTyping || !state.activeSessionId) return

    const userMsg = {
      id: crypto.randomUUID(),
      sender: 'user',
      content,
      timestamp: Date.now()
    }

    dispatch({ type: 'APPEND_MESSAGE', payload: userMsg })
    dispatch({ type: 'SET_TYPING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      await addMessageToSession(state.activeSessionId, userMsg)
    } catch {
      // Non-fatal — AI response still matters more
    }

    try {
      const currentMessages = [...state.activeMessages, userMsg]
      const { content: aiContent, botMsg, title } = await sendChatMessage(
        currentMessages,
        state.activeSessionId
      )

      dispatch({ type: 'APPEND_MESSAGE', payload: botMsg })

      if (title) {
        dispatch({ type: 'UPDATE_SESSION_TITLE', payload: { id: state.activeSessionId, title } })
      }
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message || 'Failed to get response' })
    } finally {
      dispatch({ type: 'SET_TYPING', payload: false })
    }
  }, [state.isTyping, state.activeSessionId, state.activeMessages])

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [])

  const activeSession = state.sessions.find(s => s.id === state.activeSessionId) || null

  return (
    <ChatContext.Provider value={{
      sessions: state.sessions,
      activeSession,
      activeSessionId: state.activeSessionId,
      activeMessages: state.activeMessages,
      isTyping: state.isTyping,
      error: state.error,
      loadingSessions: state.loadingSessions,
      loadingMessages: state.loadingMessages,
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