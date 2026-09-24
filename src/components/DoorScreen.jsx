import React, { useState, useRef, useEffect } from 'react'
import './DoorScreen.css'

export default function DoorScreen({ onOpen }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [hint, setHint] = useState(true)
  const [loaded, setLoaded] = useState(false)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
    const onReady = () => setLoaded(true)
    video.addEventListener('canplaythrough', onReady)
    video.addEventListener('loadeddata', onReady)
    return () => {
      video.removeEventListener('canplaythrough', onReady)
      video.removeEventListener('loadeddata', onReady)
    }
  }, [])

  const handleTap = () => {
    if (exiting || playing) return
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
    setPlaying(true)
    setHint(false)
  }

  const handleEnded = () => {
    setExiting(true)
    setTimeout(() => onOpen(), 700)
  }

  return (
    <div
      className={`door-screen ${exiting ? 'exit' : ''}`}
      onClick={handleTap}
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        playsInline
        muted
        preload="auto"
        webkit-playsinline="true"
        className="door-video"
        onEnded={handleEnded}
      />
      {!loaded && <div className="door-spinner-wrap"><div className="door-spinner" /></div>}
      {hint && (
        <div className="door-hint">
          <span className="door-leaf">✿</span>
          <span>{loaded ? 'Qapıya Toxunun' : 'Yüklənir...'}</span>
          <span className="door-leaf">✿</span>
        </div>
      )}
    </div>
  )
}