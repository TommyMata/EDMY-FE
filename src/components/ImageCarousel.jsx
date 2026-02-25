import { useState, useEffect } from 'react'
import '../styles/components.css'

export default function ImageCarousel({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filtrar imágenes únicas para evitar duplicados
  const uniqueImages = images && images.length > 0 
    ? images.filter((img, index, arr) => arr.findIndex(i => i.url === img.url) === index)
    : [];

  // Agregar el video como último elemento del carrusel
  const carouselItems = [...uniqueImages];
  const shouldShowControls = carouselItems.length > 1;

  useEffect(() => {
    // Detener autoplay si estamos en el video
    if (shouldShowControls && carouselItems[currentIndex]?.type !== 'video') {
      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          // Si el siguiente es el video, no avanzar más
          if ((prev + 1) === carouselItems.length - 1) {
            return prev + 1;
          }
          return (prev + 1) % carouselItems.length;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [carouselItems, shouldShowControls, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (!images || images.length === 0 || uniqueImages.length === 0) {
    return (
      <div className="modal-image">
        <img 
          src="/sin-imagen.jpg" 
          alt="Sin imagen disponible"
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? carouselItems.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % carouselItems.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleImageError = (e) => {
    e.target.src = '/sin-imagen.jpg';
  };

  return (
    <div className="image-carousel">
      <div className="carousel-container">
        <div className="carousel-main-image">
          {carouselItems[currentIndex]?.type === 'video' ? (
            <video
              controls
              width="100%"
              height="100%"
              style={{
                marginTop: '0px',
                borderRadius: '12px',
                objectFit: 'cover',
                width: '100%',
                height: '100%'
              }}
              muted
              autoPlay
            >
              <source src="/IMG_9040.mp4" type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          ) : (
            <img 
              src={carouselItems[currentIndex]?.url || '/sin-imagen.jpg'} 
              alt={`Tour image ${currentIndex + 1}`}
              onError={handleImageError}
            />
          )}
          {shouldShowControls && carouselItems[currentIndex]?.type !== 'video' && (
            <>
              <button 
                className="carousel-btn carousel-btn-prev"
                onClick={goToPrevious}
                title="Previous image"
              >
                ‹
              </button>
              <button 
                className="carousel-btn carousel-btn-next"
                onClick={goToNext}
                title="Next image"
              >
                ›
              </button>
            </>
          )}
        </div>
        {shouldShowControls && (
          <div className="carousel-indicators">
            {carouselItems.map((item, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                title={item.type === 'video' ? 'Ver video' : `Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
        {shouldShowControls && (
          <div className="carousel-counter">
            {currentIndex + 1} / {carouselItems.length}
          </div>
        )}
      </div>
    </div>
  )
}