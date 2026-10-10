
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Auth.css'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed.')
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
        <h1>Create Account</h1>
        <p>Start tracking your job applications.</p>

        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />

        <label>Email</label>
        <input type="email" value={email}
          onChange={e => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password}
          onChange={e => setPassword(e.target.value)} required minLength={8} />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit">Register</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </main>
  )
}

export default Register
