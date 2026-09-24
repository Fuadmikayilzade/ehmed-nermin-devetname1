import React, { useState, useEffect, useRef } from 'react'
import { mansionDay, mansionNight, dressCode, venue } from '../assets'
import Countdown from './Countdown'
import RSVPCard from './RSVPCard'
import VenueSection from './VenueSection'
import './InviteScreen.css'

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.1 }
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

export default function InviteScreen() {
  const [dark, setDark] = useState(false)
  const [scratchDone, setScratchDone] = useState(false)
  const [visible, setVisible] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)
  const [showToggleHint, setShowToggleHint] = useState(true)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const lastPos = useRef(null)
  const totalPx = useRef(0)
  const hasScratched = useRef(false)

  useScrollReveal()

  useEffect(() => { setTimeout(() => setVisible(true), 100) }, [])

  useEffect(() => {
    const id = setTimeout(() => setShowToggleHint(false), 3000)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setShowScrollHint(false)
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { willReadFrequently: true })

    const paint = () => {
      if (hasScratched.current) return // never redraw over the user's progress
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      if (w === 0 || h === 0) return
      canvas.width = w
      canvas.height = h
      totalPx.current = w * h

      const g = ctx.createLinearGradient(0, 0, w, h)
      g.addColorStop(0, '#2d5016')
      g.addColorStop(0.5, '#4a7c2f')
      g.addColorStop(1, '#7ab355')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.18)'
      ctx.font = 'italic 15px "Cormorant Garamond", serif'
      ctx.textAlign = 'center'
      ctx.fillText('✿  Cızaraq açın  ✿', w / 2, h / 2)
    }

    paint()

    // Re-paint if the card's size ever changes (image finishing load, rotation, etc.)
    const ro = new ResizeObserver(() => paint())
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect()
    const t = e.touches ? e.touches[0] : e
    return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) }
  }
  const scratch = (e) => {
    e.preventDefault()
    if (!drawing.current) return
    hasScratched.current = true
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const pos = getPos(e, canvas)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    if (lastPos.current) ctx.moveTo(lastPos.current.x, lastPos.current.y)
    else ctx.moveTo(pos.x, pos.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.lineWidth = 52; ctx.lineCap = 'round'; ctx.stroke()
    lastPos.current = pos
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let t = 0
    for (let i = 3; i < d.length; i += 4) if (d[i] < 128) t++
    if (t / totalPx.current > 0.58) setScratchDone(true)
  }
  const startScratch = (e) => { drawing.current = true; lastPos.current = null; scratch(e) }
  const stopScratch = () => { drawing.current = false; lastPos.current = null }

  // Attach touch events with passive:false to allow preventDefault
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const opts = { passive: false }
    canvas.addEventListener('touchstart', startScratch, opts)
    canvas.addEventListener('touchmove', scratch, opts)
    canvas.addEventListener('touchend', stopScratch, opts)
    return () => {
      canvas.removeEventListener('touchstart', startScratch)
      canvas.removeEventListener('touchmove', scratch)
      canvas.removeEventListener('touchend', stopScratch)
    }
  }, [])

  return (
    <div className={`invite ${visible ? 'inv-visible' : ''}`}>

      {/* ── HERO - only image changes with dark/light ── */}
      <section className="hero">
        <div className="hero-img-wrap">
          {/* Images stacked, only opacity changes */}
          <img src={mansionDay}   alt="" className={`hero-img ${!dark ? 'active' : ''}`} />
          <img src={mansionNight} alt="" className={`hero-img night-img ${dark ? 'active' : ''}`} />

          {/* Toggle button - emoji only */}
          <button
            className="toggle-btn"
            onClick={() => { setDark(d => !d); setShowToggleHint(false) }}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          {/* Tap hint — shows for 3s so people notice the toggle exists */}
          <div className={`toggle-hint ${showToggleHint ? '' : 'hidden'}`} aria-hidden="true">
            <span className="toggle-hint-ring" />
            <span className="toggle-hint-finger">👆</span>
          </div>
        </div>

        {/* Hero text - background always light/cream */}
        <div className="hero-text reveal">
          <p className="hero-pre">Toy Dəvətnaməsi</p>
          <h1 className="hero-names">
            <span>Əhməd</span>
            <span className="hero-amp">&amp;</span>
            <span>Nərmin</span>
          </h1>
          <div className="g-divider"><div className="g-diamond" /></div>
          <p className="hero-date">10 Oktyabr 2026 · Şənbə günü, saat 18:00</p>
          <p className="hero-venue">Leyla Şadlıq Sarayı</p>
        </div>
      </section>

      {/* Fixed scroll-down indicator — visible until the user starts scrolling */}
      <div className={`scroll-hint ${showScrollHint ? '' : 'hidden'}`} aria-hidden="true">
        <span className="scroll-hint-label">Sürüşdürün</span>
        <div className="scroll-hint-circle">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none">
            <path d="M12 3v16M12 19l-7-7M12 19l7-7" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* ── COUNTDOWN ── */}
      <div className="section reveal">
        <Countdown weddingDate="2026-10-10T18:00:00+04:00" />
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── INVITATION QUOTE (scratch-reveal) ── */}
      <div className="section reveal">
        <div className="scratch-wrap">
          <div className="scratch-message">
            <span className="scratch-quote">“</span>
            <p className="scratch-text">
              Sizi böyük məmnuniyyət hissi ilə toy mərasimimizin
              sevincini bizimlə bölüşməyə dəvət edirik
            </p>
            <span className="scratch-quote end">”</span>
          </div>
          <canvas
            ref={canvasRef}
            className={`scratch-canvas ${scratchDone ? 'done' : ''}`}
            onMouseDown={startScratch} onMouseMove={scratch}
            onMouseUp={stopScratch} onMouseLeave={stopScratch}
          />
        </div>
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── DRESS CODE ── */}
      <div className="section reveal">
        <p className="sec-label">Geyim Kodu</p>
        <div className="dc-card">
          <img src={dressCode} alt="Dress Code" className="dc-img" />
          <div className="dc-info">
            <p className="dc-theme">Eleqant geyim</p>
            <p className="dc-desc">
              Xanımlar: Klassik və zərif axşam geyimi<br/>
              Cənablar: Eleqant və klassik geyim


            </p>
          </div>
        </div>
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── RSVP ── */}
      <div className="reveal">
        <RSVPCard />
      </div>

      <div className="ornament reveal">✿ ✦ ✿</div>

      {/* ── VENUE ── */}
      <div className="reveal">
        <VenueSection venueImg={venue} />
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer reveal">
        <div className="g-divider"><div className="g-diamond" /></div>
        <p className="footer-names">Əhməd &amp; Nərmin</p>
        <p className="footer-date">10 · X · MMXXVI</p>
        <p className="footer-sub">Sizinlə bu xoşbəxt günü bölüşmək arzusundayıq</p>
        <div className="footer-deco">✿</div>

        <div className="footer-contacts">
          <a className="contact-btn" href="https://wa.me/994104195344" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path d="M17.6 6.3A8.5 8.5 0 003.8 16.4L2.8 21l4.7-1a8.5 8.5 0 0010.1-13.7z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 8.6c.2-.5.5-.5.8-.5h.6c.2 0 .4 0 .6.4.2.5.6 1.5.7 1.6.1.1.1.3 0 .5-.1.2-.2.3-.4.5-.2.2-.4.4-.2.7.2.4 1 1.4 2.1 2.2 1.4 1 1.7.8 2 .8.3-.1.6-.6.8-.9.2-.3.4-.2.6-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3 0 .1 0 .8-.3 1.3-.3.5-1.4 1-2 1-.6 0-1.8-.2-3.5-1.4-2.1-1.5-3.4-3.5-3.6-3.8-.1-.3-1-1.4-1-2.6 0-1.2.6-1.8.8-2z" fill="currentColor" />
            </svg>
          </a>
          <a className="contact-btn" href="https://instagram.com/digiinvite.elite" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}