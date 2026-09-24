import React, { useState, useRef, useEffect } from 'react'
import DoorScreen from './components/DoorScreen'
import InviteScreen from './components/InviteScreen'
import './styles/App.css'

export default function App() {
  const [screen, setScreen] = useState('door')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)
  const scrollY = useRef(0)

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3')
    audioRef.current.loop = true
    audioRef.current.volume = 0.45
    return () => audioRef.current?.pause()
  }, [])

  const toggleMusic = () => {
    if (musicPlaying) { audioRef.current.pause() }
    else { audioRef.current.play().catch(() => {}) }
    setMusicPlaying(p => !p)
  }

  const handleOpen = () => {
    audioRef.current.play().catch(() => {})
    setMusicPlaying(true)
    setScreen('invite')
  }

  return (
    <>
      {screen === 'door' && <DoorScreen onOpen={handleOpen} />}
      {screen === 'invite' && (
        <>
          <InviteScreen />
          <button className="app-music-btn" onClick={toggleMusic} aria-label="Musiqi">
            <span>{musicPlaying ? '♪' : '♩'}</span>
          </button>
        </>
      )}
    </>
  )
}