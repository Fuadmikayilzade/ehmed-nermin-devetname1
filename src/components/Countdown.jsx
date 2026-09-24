import React, { useState, useEffect } from 'react'
import './Countdown.css'

export default function Countdown({ weddingDate }) {
  const WEDDING = new Date(weddingDate)
  const calc = () => {
    const diff = WEDDING - new Date()
    if (diff <= 0) return { d:0,h:0,m:0,s:0 }
    return {
      d: Math.floor(diff/86400000),
      h: Math.floor((diff%86400000)/3600000),
      m: Math.floor((diff%3600000)/60000),
      s: Math.floor((diff%60000)/1000),
    }
  }
  const [t, setT] = useState(calc())
  useEffect(() => { const id = setInterval(()=>setT(calc()),1000); return ()=>clearInterval(id) }, [])

  return (
    <div className="cd-wrap">
      <p className="cd-title">Toy günə qədər</p>
      <div className="cd-units">
        {[{v:t.d,l:'Gün'},{v:t.h,l:'Saat'},{v:t.m,l:'Dəq'},{v:t.s,l:'San'}].map(({v,l},i)=>(
          <React.Fragment key={l}>
            <div className="cd-unit">
              <span className="cd-val">{String(v).padStart(2,'0')}</span>
              <span className="cd-lbl">{l}</span>
            </div>
            {i<3 && <span className="cd-colon">:</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}