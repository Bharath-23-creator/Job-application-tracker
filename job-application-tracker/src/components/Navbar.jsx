
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const username = localStorage.getItem('username')

  async function handleLogout() {
    try {
      await fetch('https://job-application-tracker-api-v7ay.onrender.com/api/logout/', {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
        },
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      navigate('/login')
      window.location.reload()
    }
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        Job Tracker
      </Link>

      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/add-application">Add Application</Link>
            <span>{username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
