import { useState, useEffect } from 'react'
import { FaWhatsapp, FaInstagram, FaYoutube } from 'react-icons/fa'
import Login from './components/Login'
import AboutUsModal from './components/AboutUsModal'
import TourList from './components/TourList'
import TourForm from './components/TourForm'
import './App.css'

function App() {
  // Hero background carousel state
  const heroImages = [
    '/start1.jpeg',
    '/start2.jpeg',
    '/start3.jpeg',
  ];
  const [heroBgIndex, setHeroBgIndex] = useState(0);
  const [aboutModalOpen, setAboutModalOpen] = useState(false)
    // Hero background carousel effect
    useEffect(() => {
      const interval = setInterval(() => {
        setHeroBgIndex((prev) => (prev + 1) % heroImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);
  const [user, setUser] = useState(null)
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const toursPerPage = 4

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
  // MODO INFORMATIVO: Cargamos tours automáticamente sin login
  useEffect(() => {
    // if (user) {
      fetchTours()
    // }
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
  // MODO INFORMATIVO: Login deshabilitado temporalmente
  // if (!user) {
  //   return <Login onLoginSuccess={handleLoginSuccess} />
  // }

  // Si hay usuario, mostrar la app
  return (
    <div className="app">
      <AboutUsModal open={aboutModalOpen} onClose={()=>setAboutModalOpen(false)} />
      {/* Navigation Header */}
      <div className="navbar-bg">
        <nav className="navbar custom-navbar">
          <div className="custom-navbar-content">
            <div className="custom-navbar-logo" onClick={handleLogoClick}>
              <img src="/logo.png" alt="Agua Blanca Adventures" className="custom-navbar-logo-img" />
            </div>
            <ul className="custom-navbar-menu">
              <li><a href="#tours-section" style={{textDecoration:'none', color:'inherit'}}>Tours <span style={{fontSize:'1.1em'}}>▼</span></a></li>
              <li><a href="#contact-us" style={{textDecoration:'none', color:'inherit'}}>Contact Us</a></li>
              <li><button style={{background:'none',border:'none',padding:0,margin:0,font:'inherit',color:'inherit',cursor:'pointer'}} onClick={()=>setAboutModalOpen(true)}>About Us</button></li>
              <li>
                <a 
                  href="https://wa.me/+50684894857?text=Hello%2C%20I%20would%20like%20to%20book%20a%20tour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'5px', justifyContent:'center', marginLeft:'12px', padding:'10px 28px', fontWeight:'700', fontSize:'1em', borderRadius:'8px'}}
                >
                  <FaWhatsapp /> Book Now
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <header
        className="hero"
        style={{
          backgroundImage: `url(${heroImages[heroBgIndex]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transition: 'background-image 0.7s ease-in-out',
        }}
      >
        <div className="hero-content">
          <h1>Discover Costa Rica with Us</h1>
          <p>Experience unforgettable adventures in the most beautiful destinations</p>
          {/* ¡Search oculto temporalmente!
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
          */}
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
            <section className="tours-section" id="tours-section">
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
          <div className="footer-section contact-section" id="contact-us">
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
            </div>
          </div>
          <div className="footer-section social-section">
            <h3>Social Media</h3>
            <div className="social-links">
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
            </div>
          </div>
          {/* YouTube link hidden temporarily */}
          {false && (
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
          )}
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Agua Blanca Tours. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
