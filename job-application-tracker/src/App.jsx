
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './components/Dashboard.jsx'
import AddApplication from './pages/AddApplication.jsx'
import Applications from './pages/Applications.jsx'
import JobDetails from './pages/JobDetails.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import './index.css'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/login"
          element={<PublicRoute><Login /></PublicRoute>}
        />

        <Route
          path="/register"
          element={<PublicRoute><Register /></PublicRoute>}
        />

        <Route
          path="/"
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />

        <Route
          path="/applications"
          element={<ProtectedRoute><Applications /></ProtectedRoute>}
        />

        <Route
          path="/add-application"
          element={<ProtectedRoute><AddApplication /></ProtectedRoute>}
        />

        <Route
          path="/job/:id"
          element={<ProtectedRoute><JobDetails /></ProtectedRoute>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
