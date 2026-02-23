import { useState } from 'react'
import '../styles/login.css'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const translateError = (message) => {
    const translations = {
      'Credenciales inválidas': 'Invalid credentials',
      'Credenciales Inválidas': 'Invalid credentials',
      'Usuario no encontrado': 'User not found',
      'Contraseña incorrecta': 'Incorrect password',
      'Email requerido': 'Email is required',
      'Contraseña requerida': 'Password is required'
    }
    return translations[message] || message
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      })

      const data = await response.json()

      if (data.success) {
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify(data.data))
        localStorage.setItem('token', data.data.token)
        onLoginSuccess(data.data)
      } else {
        const errorMessage = translateError(data.message || 'Login failed')
        setError(errorMessage)
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <img src="/logo.png" alt="Agua Blanca Tours" className="login-logo-img" />
        </div>

        <div className="login-avatar">
          <div className="avatar-circle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="avatar-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>

          {error && <div className="login-error">⚠️ {error}</div>}

          <div className="login-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="login-input"
            />
          </div>

          <div className="login-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="login-input"
            />
          </div>

          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? '⏳ Loading...' : '✓ SIGN IN'}
          </button>
        </form>

      </div>
    </div>
  )
}
