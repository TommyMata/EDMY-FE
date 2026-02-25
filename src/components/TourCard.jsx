import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import ImageCarousel from './ImageCarousel'
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
  
  // Obtener la primera imagen para mostrar en el card
  const firstImage = tour.images && tour.images.length > 0 ? tour.images[0].url : (tour.image_url || '/beach-default.jpeg')

  const handleImageError = (e) => {
    e.target.src = '/beach-default.jpeg'
  }

  return (
    <>
      <div className="tour-card">
        <div className="tour-image">
          <img 
            src={firstImage} 
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
            <a
              href={`https://wa.me/+50684894857?text=Hello%2C%20I%20would%20like%20to%20book%20${encodeURIComponent(tour.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px', justifyContent:'center'}}
              title="Book this tour on WhatsApp"
            >
              <FaWhatsapp /> Book Now
            </a>
            {/* MODO INFORMATIVO: Botón de eliminar oculto temporalmente */}
            {false && (
              <button 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
                title="Delete this tour"
              >
                {loading ? '⏳ Deleting...' : '🗑 Delete'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showDetails && (
        <>
          <div className="details-overlay" onClick={onToggleDetails}></div>
          <div className="tour-sidebar">
            <a 
              href="https://wa.me/+50684894857"
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-booking-btn"
              title="Book this Tour"
            >
              <FaWhatsapp />
              <span>Book this Tour Now</span>
            </a>
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
              {/* Image Carousel */}
              <ImageCarousel images={tour.images} />

              {/* Video de Instagram - Deshabilitado temporalmente */}
              {/* {tour.instagram_url && (
                <div className="details-section instagram-embed-section">
                  <h4>🎥 Video Tour</h4>
                  <iframe 
                    src={`${tour.instagram_url}embed/`}
                    width="100%"
                    height="600"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency="true"
                    allow="encrypted-media"
                    style={{
                      maxWidth: '540px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                  ></iframe>
                </div>
              )} */}

              <div className="details-section description-section">
                <h4>Description</h4>
                <p>{tour.description}</p>
              </div>

              <div className="details-section overview-section">
                <h4>Overview</h4>
                <div className="overview-grid">
                  <div className="overview-card">
                    <div className="overview-icon">⏱</div>
                    <div className="overview-label">Duration</div>
                    <div className="overview-value">{parseInt(tour.duration_days) || 0} day{(parseInt(tour.duration_days) || 0) !== 1 ? 's' : ''}</div>
                  </div>
                  <div className="overview-card">
                    <div className="overview-icon">👥</div>
                    <div className="overview-label">Group Size</div>
                    <div className="overview-value">Up to {parseInt(tour.max_capacity) || 0} people</div>
                  </div>
                  <div className="overview-card">
                    <div className="overview-icon">💵</div>
                    <div className="overview-label">Price per Person</div>
                    <div className="overview-value">${parseFloat(tour.price || 0).toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {itinerary.length > 0 && (
                <div className="details-section itinerary-section">
                  <h4>Trip Itinerary</h4>
                  <ul className="itinerary-list">
                    {itinerary.map((item, idx) => (
                      <li key={idx}>
                        <span className="itinerary-bullet">●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {services.length > 0 && (
                <div className="details-section included-services-section">
                  <h4>Included Services</h4>
                  <ul className="included-services-list">
                    {services.map((service, idx) => (
                      <li key={idx}>
                        <span className="check-icon">✔</span>
                        {service}
                      </li>
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
