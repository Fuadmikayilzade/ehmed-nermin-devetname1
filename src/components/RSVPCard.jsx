import React, { useState } from 'react'
import './RSVPCard.css'

const WP = '994773301860'

export default function RSVPCard() {
  const [form, setForm] = useState({ name:'', guests:'1', attending:'yes', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [nameErr, setNameErr] = useState(false)
  const inv = ""

  const set = (f,v) => { setForm(p=>({...p,[f]:v})); if(f==='name') setNameErr(false) }

  const submit = () => {
    if (!form.name.trim()) { setNameErr(true); return }
    const msg = encodeURIComponent(
      `🌿 TOY RSVP — Əhməd & Nərmin\n\nAd: ${form.name}\nNəfər: ${form.guests}\n` +
      `İştirak: ${form.attending==='yes'?'Bəli ✓':'Xeyr ✗'}\n` +
      `Mesaj: ${form.message||'—'}`
    )
    window.open(`https://wa.me/${WP}?text=${msg}`, '_blank')
    setSubmitted(true)
  }

  if (submitted) return (
    <section className="rsvp-section">
      <div className={`ty-card ${inv}`}>
        <div className="ty-body">
          <span className="ty-star">✿</span>
          <h2 className={`ty-title ${inv}`}>Təşəkkür edirik!</h2>
          <div className="g-divider"><div className="g-diamond" /></div>
          <p className={`ty-text ${inv}`}>Cavabınız göndərildi.<br/>Sizi görməyi səbirsizliklə gözləyirik.</p>
          <p className={`ty-names ${inv}`}>Əhməd &amp; Nərmin</p>
          <p className={`ty-date ${inv}`}>10 Oktyabr 2026</p>
        </div>
      </div>
    </section>
  )

  return (
    <section className="rsvp-section">
      <p className={`sec-label-r ${inv}`}>İştirak Blankı</p>
      <div className={`rsvp-card ${inv}`}>
        <p className={`rsvp-note ${inv}`}>Zəhmət olmasa əvvəlcədən cavab verin</p>

        <div className="rsvp-field">
          <label className={`rsvp-lbl ${inv}`}>Ad Soyad *</label>
          <input className={`rsvp-inp ${inv} ${nameErr?'err':''}`} type="text"
            placeholder="Adınızı daxil edin" value={form.name}
            onChange={e=>set('name',e.target.value)} />
          {nameErr && <span className="rsvp-err">Ad mütləqdir</span>}
        </div>

        <div className="rsvp-field">
          <label className={`rsvp-lbl ${inv}`}>Nəfər sayı</label>
          <div className="stepper">
            <button className={`step-btn ${inv}`} onClick={()=>set('guests',String(Math.max(1,+form.guests-1)))}>−</button>
            <span className={`step-val ${inv}`}>{form.guests}</span>
            <button className={`step-btn ${inv}`} onClick={()=>set('guests',String(Math.min(10,+form.guests+1)))}>+</button>
          </div>
        </div>

        <div className="rsvp-field">
          <label className={`rsvp-lbl ${inv}`}>İştirak</label>
          <div className="radio-row">
            <button className={`radio-btn ${inv} ${form.attending==='yes'?'sel':''}`} onClick={()=>set('attending','yes')}>✓ Bəli, iştirak edəcəm</button>
            <button className={`radio-btn ${inv} ${form.attending==='no'?'sel':''}`} onClick={()=>set('attending','no')}>✗ Təəssüf, edə bilmərəm</button>
          </div>
        </div>

        <div className="rsvp-field">
          <label className={`rsvp-lbl ${inv}`}>Mesaj (istəyə görə)</label>
          <textarea className={`rsvp-ta ${inv}`} rows={3} placeholder="Gəlin-bəyə xoş arzularınız..."
            value={form.message} onChange={e=>set('message',e.target.value)} />
        </div>

        <button className={`rsvp-submit ${inv}`} onClick={submit}>Göndər</button>
      </div>
    </section>
  )
}
