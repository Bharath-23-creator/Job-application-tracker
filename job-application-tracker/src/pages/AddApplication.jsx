
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import './AddApplication.css'

function AddApplication() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const editId = searchParams.get('edit')

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    jobType: 'Full Time',
    salary: '',
    applicationDate: '',
    jobLink: '',
    notes: '',
    status: 'Applied',
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!editId) return

    fetch(`http://127.0.0.1:8000/api/applications/${editId}/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load application')
        return response.json()
      })
      .then((data) => {
        setFormData({
          company: data.company || '',
          role: data.role || '',
          location: data.location || '',
          jobType: data.job_type || 'Full Time',
          salary: data.salary || '',
          applicationDate: data.application_date || '',
          jobLink: data.job_link || '',
          notes: data.notes || '',
          status: data.status || 'Applied',
        })
      })
      .catch((error) => console.error('Error fetching application:', error))
  }, [editId])

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!formData.company || !formData.role || !formData.applicationDate) {
      alert('Please fill in Company Name, Job Role, and Application Date.')
      return
    }

    setLoading(true)

    const applicationData = {
      company: formData.company,
      role: formData.role,
      location: formData.location,
      job_type: formData.jobType,
      salary: formData.salary,
      application_date: formData.applicationDate,
      job_link: formData.jobLink,
      notes: formData.notes,
      status: formData.status,
    }

    try {
      const url = editId
        ? `http://127.0.0.1:8000/api/applications/${editId}/`
        : 'http://127.0.0.1:8000/api/applications/'

      const response = await fetch(url, {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(applicationData),
      })

      if (response.ok) {
        alert(
          editId
            ? 'Application updated successfully!'
            : 'Application saved successfully!'
        )
        navigate('/applications')
      } else {
        const data = await response.json().catch(() => ({}))
        alert(data.error || 'Failed to save application.')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong. Make sure Django is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="add-application">
      <h1>{editId ? 'Edit Job Application' : 'Add Job Application'}</h1>

      <p>
        {editId
          ? 'Update the details of your job application.'
          : 'Enter the details of the job you applied for.'}
      </p>

      <form className="application-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="company"
            placeholder="e.g. Infosys"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Job Role</label>
          <input
            type="text"
            name="role"
            placeholder="e.g. Software Developer"
            value={formData.role}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Hyderabad"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Job Type</label>
            <select name="jobType" value={formData.jobType} onChange={handleChange}>
              <option>Full Time</option>
              <option>Internship</option>
              <option>Part Time</option>
              <option>Contract</option>
              <option>Freelance</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Salary</label>
            <input
              type="text"
              name="salary"
              placeholder="e.g. 5 LPA"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Application Date</label>
            <input
              type="date"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Applied</option>
            <option>Assessment</option>
            <option>Interview</option>
            <option>Selected</option>
            <option>Rejected</option>
          </select>
        </div>

        <div className="form-group">
          <label>Job Link</label>
          <input
            type="url"
            name="jobLink"
            placeholder="https://..."
            value={formData.jobLink}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            placeholder="Add any notes..."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-button" disabled={loading}>
          {loading
            ? 'Saving...'
            : editId
              ? 'Update Application'
              : 'Save Application'}
        </button>
      </form>
    </main>
  )
}

export default AddApplication
