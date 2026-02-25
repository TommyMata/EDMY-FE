import React from 'react';
import '../styles/components.css';

export default function AboutUsModal({ open, onClose }) {
  if (!open) return null;
  return (
    <>
      <div className="details-overlay" onClick={onClose}></div>
      <div className="about-modal-large">
        <div className="sidebar-header">
          <h2>About Us</h2>
          <button className="close-btn" onClick={onClose} title="Close">✕</button>
        </div>
        <div className="sidebar-content">
          <p className="about-us-text">
            Welcome to Agua Blanca Adventures!<br />
            We are passionate about creating unforgettable experiences in Costa Rica.<br />
            Our team is dedicated to providing safe, fun, and unique tours so you can discover the beauty and adventure this country has to offer.
          </p>
          <p className="about-us-subtext">
            This is a default text. Here you can add more information about your company, your mission, and what makes you special.
          </p>
        </div>
      </div>
    </>
  );
}
