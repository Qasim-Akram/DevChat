import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFormInput } from '../hooks/useFormInput'
import styles from './Auth.module.css'
import logo from '../assets/logo.svg'

export default function Login() {
  const { login, error, loading, clearError, user } = useAuth()
  const navigate = useNavigate()
  const { values, handleChange, handleBlur } = useFormInput({ email: '', password: '' })

  useEffect(() => { if (user) navigate('/chat', { replace: true }) }, [user, navigate])
  useEffect(() => { clearError() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(values.email, values.password)
    if (ok) navigate('/chat')
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <img className={styles.logo} src={logo} alt="logo" />
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to DevChat</p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={styles.input} type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" required autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={styles.input} type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" required />
          </div>
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Sign In'}
          </button>
        </form>

        <p className={styles.switchText}>
          No account? <Link to="/signup" className={styles.switchLink}>Create one</Link>
        </p>
      </div>
    </div>
  )
}