import { useState } from 'react'
import TourCard from './TourCard'
import '../styles/components.css'

export default function TourList({ tours, onTourDeleted, onRefresh }) {
  const [expandedTours, setExpandedTours] = useState({})

  const toggleExpanded = (tourId) => {
    setExpandedTours(prev => ({
      ...prev,
      [tourId]: !prev[tourId]
    }))
  }

  return (
    <div className="tour-list">
      <h2>Available Tours ({tours.length})</h2>
      
      {tours.length === 0 ? (
        <div className="empty-state">
          <p>No tours available</p>
        </div>
      ) : (
        <div className="tours-grid">
          {tours.map(tour => (
            <TourCard
              key={tour.id}
              tour={tour}
              onDeleted={onTourDeleted}
              onRefresh={onRefresh}
              showDetails={expandedTours[tour.id] || false}
              onToggleDetails={() => toggleExpanded(tour.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
