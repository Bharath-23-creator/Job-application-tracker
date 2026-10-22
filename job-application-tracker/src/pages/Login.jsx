
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('https://job-application-tracker-api-v7ay.onrender.com/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed.')
        return
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.username)
      navigate('/')
    } catch {
      setError('Cannot connect to the server.')
    }
  }

  return (
    <main className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Login to manage your job applications.</p>

        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />

        <label>Password</label>
        <input type="password" value={password}
          onChange={e => setPassword(e.target.value)} required />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Login</button>
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </main>
  )
}

export default Login
