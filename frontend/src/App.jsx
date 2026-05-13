import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatProvider } from './context/ChatContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={
        <ErrorBoundary fallbackMessage="Login page encountered an error.">
          <Login />
        </ErrorBoundary>
      } />
      <Route path="/signup" element={
        <ErrorBoundary fallbackMessage="Signup page encountered an error.">
          <Signup />
        </ErrorBoundary>
      } />
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatProvider>
              <ErrorBoundary fallbackMessage="The chat page ran into a problem. Try refreshing.">
                <Chat />
              </ErrorBoundary>
            </ChatProvider>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackMessage="A critical error occurred. Please refresh the page.">
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}