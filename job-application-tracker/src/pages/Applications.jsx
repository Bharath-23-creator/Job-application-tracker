
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Applications.css'

function Applications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/applications/', {
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

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.company.toLowerCase().includes(search.toLowerCase()) ||
      application.role.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'All Status' ||
      application.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <main className="applications">
      <div className="applications-header">
        <div>
          <h1>Applications</h1>
          <p>View and manage your job applications.</p>
        </div>

        <button
          className="add-button"
          onClick={() => navigate('/add-application')}
        >
          + Add Application
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All Status</option>
          <option>Applied</option>
          <option>Assessment</option>
          <option>Interview</option>
          <option>Selected</option>
          <option>Rejected</option>
        </select>
      </div>

      <div className="applications-table">
        <div className="table-header">
          <span>Company</span>
          <span>Role</span>
          <span>Location</span>
          <span>Status</span>
          <span>Date</span>
        </div>

        <div className="application-rows">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div
                className="application-row"
                key={application.id}
                onClick={() => navigate(`/job/${application.id}`)}
              >
                <span>{application.company}</span>
                <span>{application.role}</span>
                <span>{application.location}</span>
                <span>{application.status}</span>
                <span>{application.application_date}</span>
              </div>
            ))
          ) : (
            <div className="empty-applications">
              <p>No applications found.</p>
              <span>Try changing your search or filter.</span>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Applications
