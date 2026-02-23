import { useState, useEffect } from 'react'
import { FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa'
import Login from './components/Login'
import TourList from './components/TourList'
import TourForm from './components/TourForm'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const toursPerPage = 3

  // Verificar si hay usuario guardado en localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  // Cargar tours cuando el usuario está logueado
  useEffect(() => {
    if (user) {
      fetchTours()
    }
  }, [user])

  const fetchTours = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tours`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      const data = await response.json()
      const toursData = data.data?.data || data.tours || data.data || []
      setTours(Array.isArray(toursData) ? toursData : [])
    } catch (error) {
      console.error('Error fetching tours:', error)
      setTours([])
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    setUser(null)
    setShowForm(false)
    setSearchTerm('')
    setCurrentPage(1)
  }

  const handleTourCreated = (newTour) => {
    setTours([...tours, newTour])
    setShowForm(false)
    setCurrentPage(1)
  }

  const handleTourDeleted = (tourId) => {
    setTours(tours.filter(tour => tour.id !== tourId))
    setCurrentPage(1)
  }

  const handleSearchChange = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  const handleLogoClick = () => {
    setSearchTerm('')
    setCurrentPage(1)
    setShowForm(false)
    window.scrollTo(0, 0)
  }

  const filteredTours = tours.filter(tour =>
    tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tour.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Cálculo de paginación
  const totalPages = Math.ceil(filteredTours.length / toursPerPage)
  const startIndex = (currentPage - 1) * toursPerPage
  const endIndex = startIndex + toursPerPage
  const paginatedTours = filteredTours.slice(startIndex, endIndex)

  // Si no hay usuario, mostrar login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  // Si hay usuario, mostrar la app
  return (
    <div className="app">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand" onClick={handleLogoClick}>
            <img src="/logo.png" alt="Agua Blanca Tours" className="nav-logo-img" />
          </div>
          <div className="nav-links">
            <div className="nav-user-info">
              👤 <span>{user.name}</span>
            </div>
            <button 
              className={`nav-btn ${showForm ? 'active' : ''}`}
              onClick={() => setShowForm(!showForm)}
              title="Create new tour"
            >
              {showForm ? '← Back' : '+ New Tour'}
            </button>
            <button 
              className="nav-logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <h1>Discover Costa Rica with Us</h1>
          <p>Experience unforgettable adventures in the most beautiful destinations</p>
          {!showForm && (
            <div className="hero-search">
              <input 
                type="text"
                placeholder="🔍 Search by destination or tour name..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="search-input"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {showForm ? (
          <TourForm 
            onTourCreated={handleTourCreated}
            onCancel={() => setShowForm(false)}
          />
        ) : (
          <>
            <section className="tours-section">
              <div className="section-header">
                <h2>Our Available Tours</h2>
                <p>{filteredTours.length} incredible destinations await you</p>
              </div>

              {loading ? (
                <div className="loading">
                  <div className="spinner"></div>
                  <p>Loading tours...</p>
                </div>
              ) : filteredTours.length === 0 ? (
                <div className="empty-state">
                  {searchTerm ? (
                    <>
                      <p style={{ fontSize: '3em', marginBottom: '20px' }}>🔍</p>
                      <p>No tours found matching "{searchTerm}"</p>
                    </>
                  ) : (
                    <>
                      <p style={{ fontSize: '3em', marginBottom: '20px' }}>✈️</p>
                      <p>No tours available at this time</p>
                    </>
                  )}
                </div>
              ) : (
                <>
                  <TourList 
                    tours={paginatedTours}
                    onTourDeleted={handleTourDeleted}
                    onRefresh={fetchTours}
                  />
                  
                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pagination">
                      <button 
                        className="pagination-btn"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        ← Previous
                      </button>
                      
                      <div className="pagination-info">
                        Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                      </div>
                      
                      <button 
                        className="pagination-btn"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section contact-section">
            <h3>Contact Us</h3>
            <div className="social-links">
              <a 
                href="https://wa.me/+50684894857" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link whatsapp"
                title="Chat with us on WhatsApp"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
              <a 
                href="https://www.instagram.com/aguablancaadventures/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link instagram"
                title="Follow us on Instagram"
              >
                <FaInstagram />
                <span>Instagram</span>
              </a>
              <a 
                href="https://www.youtube.com/@amazingvacationscostarica3868" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link youtube"
                title="Watch our videos on YouTube"
              >
                <FaYoutube />
                <span>YouTube</span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Agua Blanca Tours. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
