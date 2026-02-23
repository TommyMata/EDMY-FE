import { useState } from 'react'
import '../styles/components.css'

export default function TourCard({ tour, onDeleted, onRefresh, showDetails, onToggleDetails }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Delete tour "${tour.name}"?`)) return

    setLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tours/${tour.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      
      if (data.success) {
        onDeleted(tour.id)
      } else {
        alert('Error deleting tour')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error deleting tour')
    } finally {
      setLoading(false)
    }
  }

  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary : (tour.itinerary ? JSON.parse(tour.itinerary) : [])
  const services = Array.isArray(tour.included_services) ? tour.included_services : (tour.included_services ? JSON.parse(tour.included_services) : [])

  const handleImageError = (e) => {
    e.target.src = '/beach-default.jpeg'
  }

  return (
    <>
      <div className="tour-card">
        <div className="tour-image">
          <img 
            src={tour.image_url || '/beach-default.jpeg'} 
            alt={tour.name}
            onError={handleImageError}
          />
          <span className="badge">${parseFloat(tour.price || 0).toFixed(2)}</span>
        </div>

        <div className="tour-content">
          <h3>{tour.name}</h3>
          <p className="destination">
            <span style={{ marginRight: '5px' }}>🌿</span>
            {tour.destination}
          </p>

          <div className="tour-info">
            <span title="Trip duration">
              <strong>⏱</strong> {parseInt(tour.duration_days) || 0} day{(parseInt(tour.duration_days) || 0) !== 1 ? 's' : ''}
            </span>
            <span title="Group capacity">
              <strong>👥</strong> {parseInt(tour.max_capacity) || 0} people
            </span>
          </div>

          <div className="tour-actions">
            <button 
              className="btn btn-secondary"
              onClick={onToggleDetails}
              title={showDetails ? 'Hide details' : 'View more information'}
            >
              {showDetails ? '▼ Show Less' : '▶ Details'}
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
              title="Delete this tour"
            >
              {loading ? '⏳ Deleting...' : '🗑 Delete'}
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="details-overlay" onClick={onToggleDetails}></div>
          <div className="tour-sidebar">
            <div className="sidebar-header">
              <h2>{tour.name}</h2>
              <button 
                className="close-btn"
                onClick={onToggleDetails}
                title="Close details"
              >
                ✕
              </button>
            </div>

            <div className="sidebar-content">
              <div className="modal-image">
                <img 
                  src={tour.image_url || '/beach-default.jpeg'} 
                  alt={tour.name}
                  onError={handleImageError}
                />
              </div>

              <div className="details-section">
                <h4>Description</h4>
                <p>{tour.description}</p>
              </div>

              <div className="details-section">
                <h4>Overview</h4>
                <ul>
                  <li><strong>Duration:</strong> {parseInt(tour.duration_days) || 0} day{(parseInt(tour.duration_days) || 0) !== 1 ? 's' : ''}</li>
                  <li><strong>Group Size:</strong> Up to {parseInt(tour.max_capacity) || 0} people</li>
                  <li><strong>Price per Person:</strong> ${parseFloat(tour.price || 0).toFixed(2)}</li>
                </ul>
              </div>

              {itinerary.length > 0 && (
                <div className="details-section">
                  <h4>Trip Itinerary</h4>
                  <ul>
                    {itinerary.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {services.length > 0 && (
                <div className="details-section">
                  <h4>Included Services</h4>
                  <ul>
                    {services.map((service, idx) => (
                      <li key={idx}>{service}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
