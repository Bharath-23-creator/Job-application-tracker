
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './JobDetails.css'

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`https://job-application-tracker-api-v7ay.onrender.com/api/applications/${id}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Application not found')
        return response.json()
      })
      .then((data) => setApplication(data))
      .catch((error) => {
        console.error('Error fetching application:', error)
        setApplication(null)
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleDelete() {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this application?'
    )

    if (!confirmDelete) return

    try {
      const response = await fetch(
        `https://job-application-tracker-api-v7ay.onrender.com/api/applications/${id}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
          },
        }
      )

      if (response.ok) {
        alert('Application deleted successfully!')
        navigate('/applications')
      } else {
        alert('Failed to delete application.')
      }
    } catch (error) {
      console.error('Error deleting application:', error)
      alert('Something went wrong.')
    }
  }

  if (loading) return <h2>Loading...</h2>

  if (!application) return <h2>Application not found</h2>

  return (
    <main className="job-details">
      <div className="details-header">
        <div>
          <h1>{application.role}</h1>
          <p>
            {application.company} • {application.location}
          </p>
        </div>

        <span className="status">{application.status}</span>
      </div>

      <div className="details-card">
        <h2>Application Details</h2>

        <div className="details-grid">
          <div>
            <span>Company</span>
            <p>{application.company}</p>
          </div>

          <div>
            <span>Job Type</span>
            <p>{application.job_type}</p>
          </div>

          <div>
            <span>Salary</span>
            <p>{application.salary}</p>
          </div>

          <div>
            <span>Application Date</span>
            <p>{application.application_date}</p>
          </div>

          <div>
            <span>Job Link</span>
            <p>
              {application.job_link ? (
                <a
                  href={application.job_link}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open Job Link
                </a>
              ) : (
                'Not provided'
              )}
            </p>
          </div>

          <div>
            <span>Notes</span>
            <p>{application.notes || 'No notes'}</p>
          </div>
        </div>

        <div className="details-actions">
          <button
            onClick={() =>
              navigate(`/add-application?edit=${application.id}`)
            }
          >
            Edit Application
          </button>

          <button className="delete-button" onClick={handleDelete}>
            Delete Application
          </button>
        </div>
      </div>
    </main>
  )
}

export default JobDetails
