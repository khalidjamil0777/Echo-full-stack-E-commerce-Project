import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'

export default function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, register, loading } = useApp()

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log('🔍 Form submitted:', { isLogin, email, name, passwordLength: password.length })

    // Validation
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email')
      return
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!isLogin && (!name || name.length < 2)) {
      toast.error('Name must be at least 2 characters')
      return
    }

    console.log('✅ Validation passed, calling API...')

    try {
      let result
      if (isLogin) {
        result = await login(email, password)
      } else {
        result = await register(name, email, password)
      }

      console.log('📦 API response:', result)

      if (result.success) {
        toast.success(result.message)
        onClose()
        // Reset form
        setName('')
        setEmail('')
        setPassword('')
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('❌ Auth error:', error)
      toast.error('Connection failed. Is the backend running?')
    }
  }

  const handleSwitch = () => {
    setIsLogin(!isLogin)
    // Clear form when switching
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="modal-overlay active" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>&times;</button>

        <p className="auth-subtitle" style={{ marginBottom: 0, marginTop: 4, fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {isLogin ? 'Welcome back' : 'Join Echo'}
        </p>
        <h2 className="auth-title">{isLogin ? 'Sign In' : 'Create Account'}</h2>
        <p className="auth-subtitle">
          {isLogin ? 'Access your account and loyalty points' : 'Start earning loyalty rewards today'}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          
          <div className="mb-4">
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
            />
          </div>

          {/* Quick test credentials hint */}
          {isLogin && (
            <div style={{
              background: 'var(--gold-dim)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '8px',
              padding: '10px 12px',
              marginBottom: '14px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-ui)',
              color: 'var(--gold)'
            }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Quick Test:</div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                admin@echo.com / admin123
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Please wait...
              </>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <a href="#" onClick={(e) => { e.preventDefault(); handleSwitch() }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </a>
        </p>

        {/* Debug info - remove after testing */}
        <div style={{
          marginTop: '14px',
          background: 'var(--black-5)',
          border: '1px solid var(--white-10)',
          borderRadius: '6px',
          padding: '8px 10px',
          fontSize: '0.7rem',
          fontFamily: 'monospace',
          color: 'var(--white-30)'
        }}>
          <div>API: {import.meta.env.VITE_API_URL || '❌ Not configured'}</div>
          <div>Backend: Check http://localhost:5000</div>
        </div>
      </div>
    </div>
  )
}
