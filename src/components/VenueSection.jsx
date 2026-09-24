import React from 'react'
import './VenueSection.css'

const MAP_LINK = 'https://maps.app.goo.gl/8RQHW4PdSAraDkUWA'
const WAZE_LINK = 'https://waze.com/ul?ll=40.3918189%2C49.9660627&navigate=yes'

export default function VenueSection({ venueImg }) {
  const inv = ""
  return (
    <section className="vs-section">
      <p className={`sec-label-v ${inv}`}>Mərasim Yeri</p>
      <div className="vs-img-wrap">
        <img src={venueImg} alt="Leyla Şadlıq Sarayı" className={`vs-img ${inv}`} />
        <div className={`vs-fade ${inv}`} />
      </div>
      <div className={`vs-info ${inv}`}>
        <p className={`vs-name ${inv}`}>Leyla Şadlıq Sarayı</p>
        <p className={`vs-addr ${inv}`}>✿ Bakı şəhəri</p>
        <div className="vs-btns">
          <a href={MAP_LINK} target="_blank" rel="noopener noreferrer" className={`vbtn primary ${inv}`}>🗺 Google Maps</a>
          <a href={WAZE_LINK} target="_blank" rel="noopener noreferrer" className={`vbtn outline ${inv}`}>🧭 Waze</a>
        </div>
      </div>
    </section>
  )
}