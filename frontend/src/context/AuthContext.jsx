import { createContext, useContext, useState, useCallback } from 'react'
import { login, signup, logout, getCurrentUser } from '../utils/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getCurrentUser())
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = useCallback(async (email, password) => {
        setLoading(true)
        setError(null)
        try {
            const u = login(email, password)
            setUser(u)
            return true
        } catch (e) {
            setError(e.message)
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    const handleSignup = useCallback(async (username, email, password) => {
        setLoading(true)
        setError(null)
        try {
            const u = signup(username, email, password)
            setUser(u)
            return true
        } catch (e) {
            setError(e.message)
            return false
        } finally {
            setLoading(false)
        }
    }, [])

    const handleLogout = useCallback(() => {
        logout()
        setUser(null)
    }, [])

    const clearError = useCallback(() => setError(null), [])

    return (
        <AuthContext.Provider value={{ user, error, loading, login: handleLogin, signup: handleSignup, logout: handleLogout, clearError }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}