
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])

  useEffect(() => {
    fetch('https://job-application-tracker-api-v7ay.onrender.com/api/applications/', {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch applications')
        return response.json()
      })
      .then((data) => setApplications(data))
      .catch((error) => console.error('Error fetching applications:', error))
  }, [])

  const totalApplications = applications.length

  const appliedCount = applications.filter(
    (application) => application.status === 'Applied'
  ).length

  const interviewCount = applications.filter(
    (application) => application.status === 'Interview'
  ).length

  const selectedCount = applications.filter(
    (application) => application.status === 'Selected'
  ).length

  return (
    <main className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Track and manage your job applications.</p>
        </div>

        <button
          className="add-button"
          onClick={() => navigate('/add-application')}
        >
          + Add Application
        </button>
      </div>

      <div className="summary-cards">
        <div className="card">
          <h3>Total Applications</h3>
          <p>{totalApplications}</p>
        </div>

        <div className="card">
          <h3>Applied</h3>
          <p>{appliedCount}</p>
        </div>

        <div className="card">
          <h3>Interviews</h3>
          <p>{interviewCount}</p>
        </div>

        <div className="card">
          <h3>Selected</h3>
          <p>{selectedCount}</p>
        </div>
      </div>

      <div className="recent-applications">
        <h2>Recent Applications</h2>

        {applications.length === 0 ? (
          <div className="empty-message">No applications yet.</div>
        ) : (
          applications.map((application) => (
            <div
              key={application.id}
              className="recent-application"
              onClick={() => navigate(`/job/${application.id}`)}
            >
              <div>
                <strong>{application.company}</strong>
                <p>{application.role}</p>
              </div>

              <span>{application.status}</span>
            </div>
          ))
        )}
      </div>
    </main>
  )
}

export default Dashboard
