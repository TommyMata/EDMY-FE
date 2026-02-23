import { useState } from 'react'
import '../styles/components.css'

export default function TourForm({ onTourCreated, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    destination: '',
    price: '',
    duration_days: '',
    max_capacity: '',
    start_date: '',
    end_date: '',
    image_url: '',
    itinerary: ['', '', ''],
    included_services: ['', '', ''],
    is_active: true
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tours`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration_days: parseInt(formData.duration_days),
          max_capacity: parseInt(formData.max_capacity),
          itinerary: formData.itinerary.filter(i => i),
          included_services: formData.included_services.filter(s => s)
        })
      })

      const data = await response.json()

      if (data.success) {
        onTourCreated(data.data)
        setFormData({
          name: '',
          description: '',
          destination: '',
          price: '',
          duration_days: '',
          max_capacity: '',
          start_date: '',
          end_date: '',
          image_url: '',
          itinerary: ['', '', ''],
          included_services: ['', '', ''],
          is_active: true
        })
      } else {
        setError(data.message || 'Error creating tour')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-container">
      <h2>✈️ Create New Tour</h2>
      {error && <div className="error">⚠️ {error}</div>}
      
      <form onSubmit={handleSubmit} className="tour-form">
        {/* Basic Information */}
        <fieldset style={{ gridColumn: '1 / -1', border: 'none', padding: 0, margin: 0 }}>
          <legend style={{ fontSize: '1.2em', fontWeight: 600, color: '#333', marginBottom: '20px' }}>Tour Information</legend>
          
          <div className="form-group">
            <label>Tour Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ex: Romantic Paris Tour"
            />
          </div>

          <div className="form-group">
            <label>Destination *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
              placeholder="Ex: Paris, France"
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the tour in detail..."
              style={{ minHeight: '100px', gridColumn: '1 / -1' }}
            />
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </fieldset>

        {/* Trip Details */}
        <fieldset style={{ gridColumn: '1 / -1', border: 'none', padding: '30px 0 0 0', margin: 0 }}>
          <legend style={{ fontSize: '1.2em', fontWeight: 600, color: '#333', marginBottom: '20px' }}>Trip Details</legend>

          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder="1500.00"
            />
          </div>

          <div className="form-group">
            <label>Duration (days) *</label>
            <input
              type="number"
              name="duration_days"
              value={formData.duration_days}
              onChange={handleChange}
              required
              min="1"
              placeholder="5"
            />
          </div>

          <div className="form-group">
            <label>Maximum Capacity *</label>
            <input
              type="number"
              name="max_capacity"
              value={formData.max_capacity}
              onChange={handleChange}
              required
              min="1"
              placeholder="30"
            />
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="datetime-local"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="datetime-local"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{ marginRight: '10px', cursor: 'pointer', width: '18px', height: '18px' }}
              />
              <span>Active Tour</span>
            </label>
          </div>
        </fieldset>

        {/* Itinerary */}
        <fieldset style={{ gridColumn: '1 / -1', border: 'none', padding: '30px 0 0 0', margin: 0 }}>
          <legend style={{ fontSize: '1.2em', fontWeight: 600, color: '#333', marginBottom: '20px' }}>Itinerary</legend>
          
          {formData.itinerary.map((item, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', gridColumn: '1 / -1', marginBottom: '10px' }}>
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('itinerary', index, e.target.value)}
                placeholder={`Day ${index + 1}: Describe the activity...`}
                style={{ padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1em', fontFamily: 'inherit' }}
              />
              {formData.itinerary.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('itinerary', index)}
                  style={{ padding: '12px 15px', background: '#fee', color: '#c33', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  ❍
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('itinerary')}
            style={{ gridColumn: '1 / -1', padding: '10px 20px', background: '#f0faf6', color: '#2d7a4f', border: '2px dashed #2d7a4f', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            + Add Day
          </button>
        </fieldset>

        {/* Included Services */}
        <fieldset style={{ gridColumn: '1 / -1', border: 'none', padding: '30px 0 0 0', margin: 0 }}>
          <legend style={{ fontSize: '1.2em', fontWeight: 600, color: '#333', marginBottom: '20px' }}>Included Services</legend>
          
          {formData.included_services.map((service, index) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', gridColumn: '1 / -1', marginBottom: '10px' }}>
              <input
                type="text"
                value={service}
                onChange={(e) => handleArrayChange('included_services', index, e.target.value)}
                placeholder="Ex: 5-star hotel, breakfast included..."
                style={{ padding: '12px 15px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '1em', fontFamily: 'inherit' }}
              />
              {formData.included_services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayField('included_services', index)}
                  style={{ padding: '12px 15px', background: '#fee', color: '#c33', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  ❍
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField('included_services')}
            style={{ gridColumn: '1 / -1', padding: '10px 20px', background: '#f0faf6', color: '#2d7a4f', border: '2px dashed #2d7a4f', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            + Add Service
          </button>
        </fieldset>

        {/* Action Buttons */}
        <div className="form-buttons">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⏳ Creating...' : '✓ Create Tour'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            ← Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
