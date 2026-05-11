import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFormInput } from '../hooks/useFormInput'
import styles from './Auth.module.css'

export default function Signup() {
  const { signup, error, loading, clearError, user } = useAuth()
  const navigate = useNavigate()
  const { values, errors, handleChange, handleBlur, setFieldError } = useFormInput({ username: '', email: '', password: '', confirmPassword: '' })

  useEffect(() => { if (user) navigate('/chat', { replace: true }) }, [user, navigate])
  useEffect(() => { clearError() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (values.password !== values.confirmPassword) { setFieldError('confirmPassword', 'Passwords do not match'); return }
    if (values.password.length < 6) { setFieldError('password', 'Min 6 characters'); return }
    const ok = await signup(values.username, values.email, values.password)
    if (ok) navigate('/chat')
  }

  return (
    <div className={styles.page}>
      <div className={styles.grid} />
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.logoMark}>{'<dev />'}</div>
          <h1 className={styles.title}>Create account</h1>
          <p className={styles.subtitle}>Join DevChat</p>
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
            <label className={styles.label}>Username</label>
            <input className={`${styles.input} ${errors.username ? styles.inputError : ''}`} type="text" name="username" value={values.username} onChange={handleChange} onBlur={handleBlur} placeholder="johndoe" required autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className={`${styles.input} ${errors.email ? styles.inputError : ''}`} type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input className={`${styles.input} ${errors.password ? styles.inputError : ''}`} type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} placeholder="min. 6 characters" required />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Confirm Password</label>
            <input className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ''}`} type="password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur} placeholder="••••••••" required />
            {errors.confirmPassword && <span className={styles.fieldError}>{errors.confirmPassword}</span>}
          </div>
          <button className={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Create Account'}
          </button>
        </form>

        <p className={styles.switchText}>
          Have an account? <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}