import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, Dumbbell, Menu, MoveUpRight, X } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const programs = [
  { number: '01', title: 'STRENGTH & CONDITIONING', detail: 'Build real-world strength and a body that keeps up.', meta: '8 WEEKS / 3 DAYS A WEEK', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1100&q=85' },
  { number: '02', title: 'FAT LOSS, NO SHORTCUTS', detail: 'Sustainable habits. A plan that fits your actual life.', meta: '12 WEEKS / 1:1 COACHING', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1100&q=85' },
  { number: '03', title: 'ATHLETIC PERFORMANCE', detail: 'Move faster, recover smarter, show up stronger.', meta: 'CUSTOM PLAN / ALL LEVELS', image: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&w=1100&q=85' },
]

const testimonials = [
  { quote: 'I stopped starting over. For the first time, training feels like part of my life, not a punishment.', name: 'Maya R.', detail: 'CLIENT FOR 7 MONTHS', stat: '−18 KG' },
  { quote: 'My strength has doubled and my confidence is in a completely different place. The plan actually fits my schedule.', name: 'Jordan K.', detail: 'CLIENT FOR 5 MONTHS', stat: '+42% STRENGTH' },
  { quote: 'The accountability changed everything. I feel stronger at 38 than I did at 25.', name: 'Sam T.', detail: 'CLIENT FOR 11 MONTHS', stat: 'FIRST 10K' },
]

function App() {
  const [slider, setSlider] = useState(52)
  const [weight, setWeight] = useState('72')
  const [height, setHeight] = useState('175')
  const [bmi, setBmi] = useState(null)
  const [activeQuote, setActiveQuote] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [bookingState, setBookingState] = useState('idle')
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo('.hero-word', { yPercent: 115, rotate: 2 }, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.12, ease: 'power4.out', delay: 0.18 })
      gsap.fromTo('.intro-title .split-word', { yPercent: 110 }, {
        yPercent: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.intro-title', start: 'top 88%', once: true },
      })
      gsap.utils.toArray('.reveal, .program-card').forEach((element, index) => {
        gsap.fromTo(element, { y: 36, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: 0.8, delay: element.classList.contains('program-card') ? index * 0.1 : 0, ease: 'power3.out',
          scrollTrigger: { trigger: element, start: 'top 88%', once: true },
        })
      })
    })
    const setProgress = gsap.quickSetter('.reading-progress', 'scaleX')
    const updateProgress = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight
      setProgress(distance > 0 ? window.scrollY / distance : 0)
    }
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => { context.revert(); window.removeEventListener('scroll', updateProgress) }
  }, [])

  const calculateBmi = (event) => {
    event.preventDefault()
    const metres = Number(height) / 100
    if (Number(weight) > 0 && metres > 0) setBmi((Number(weight) / (metres * metres)).toFixed(1))
  }

  const submitBooking = async (event) => {
    event.preventDefault()
    setBookingState('submitting')
    setBookingMessage('')
    const form = event.currentTarget
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form).entries())),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Something went wrong. Please try again.')
      setBookingState('success')
      setBookingMessage('You’re on the list. We’ll be in touch within one business day.')
      form.reset()
    } catch (error) {
      setBookingState('error')
      setBookingMessage(error.message === 'Failed to fetch' ? 'Could not reach the booking service. Check the API and MongoDB connection.' : error.message)
    }
  }

  const quote = testimonials[activeQuote]

  return (
    <>
      <div className="reading-progress" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="PulseFit home"><span className="wordmark-icon"><Dumbbell size={18} strokeWidth={2.5} /></span>PULSE<span>FIT</span></a>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#method" onClick={() => setMenuOpen(false)}>The method</a><a href="#results" onClick={() => setMenuOpen(false)}>Results</a><a href="#programs" onClick={() => setMenuOpen(false)}>Programs</a><a href="#stories" onClick={() => setMenuOpen(false)}>Stories</a>
          <a className="mobile-book" href="#book" onClick={() => setMenuOpen(false)}>LET’S TALK <ArrowUpRight size={14} /></a>
        </nav>
        <a className="header-cta" href="#book">LET’S TALK <ArrowUpRight size={14} /></a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </header>

      <main>
        <section className="hero" id="top">
          <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=90" aria-label="Athlete training in a gym"><source src="https://videos.pexels.com/video-files/3195394/3195394-hd_1920_1080_25fps.mp4" type="video/mp4" /></video>
          <div className="hero-shade" />
          <div className="hero-content"><div className="eyebrow hero-eyebrow"><span className="live-dot" /> PERSONAL TRAINING / EST. 2018</div>
            <h1 className="hero-title"><span className="hero-line"><span className="hero-word">BUILT</span></span><span className="hero-line hero-line-last"><span className="hero-word lime-word">BY YOU<span className="hero-period">.</span></span></span></h1>
            <div className="hero-bottom"><p className="hero-copy">Coaching that meets you where you are.<br />And takes you somewhere new.</p><a className="button-primary button-pulse" href="#book">START YOUR RESET <ArrowUpRight size={17} /></a></div>
          </div>
          <div className="hero-index"><span>01 / 04</span><span>SCROLL TO EXPLORE <ArrowDown size={13} /></span></div>
        </section>

        <div className="ticker" aria-label="Stronger every day. One rep at a time."><div className="ticker-track" aria-hidden="true">{Array.from({ length: 4 }, (_, index) => <span key={index}>STRONGER EVERY DAY <b>✳</b> ONE REP AT A TIME <b>✳</b></span>)}</div></div>

        <section className="intro section-pad" id="method">
          <div className="section-label reveal"><span>01 — THE METHOD</span><span>NO QUICK FIXES. REAL CHANGE.</span></div>
          <div className="intro-grid"><h2 className="intro-title reveal" aria-label="YOUR LIFE ISN’T A BEFORE PHOTO."><span className="split-line" aria-hidden="true"><span className="split-mask"><span className="split-word">YOUR</span></span> <span className="split-mask"><span className="split-word">LIFE</span></span> <span className="split-mask"><span className="split-word">ISN’T</span></span> <span className="split-mask"><span className="split-word">A</span></span></span><span className="split-line" aria-hidden="true"><span className="split-mask"><span className="split-word">BEFORE</span></span> <span className="split-mask"><span className="split-word">PHOTO.</span></span></span></h2><div className="intro-aside reveal"><p>Forget all-or-nothing. PulseFit is personal training built around you: your goals, your schedule, your real life. We’ll make a plan that sticks, then show up for it together.</p><a className="text-link" href="#programs">MEET YOUR NEXT CHAPTER <ArrowRight size={16} /></a></div></div>
          <div className="principles reveal"><div><span>01</span><strong>Coaching, not copying</strong></div><div><span>02</span><strong>Progress over perfection</strong></div><div><span>03</span><strong>Built to last</strong></div></div>
        </section>

        <section className="results section-pad" id="results">
          <div className="section-label reveal"><span>02 — THE WORK, WORKING</span><span>REAL PEOPLE. REAL PROGRESS.</span></div>
          <div className="results-heading reveal"><h2>THE SHIFT<br /><span>IS YOURS.</span></h2><p>Every body has a story.<br />This one’s still being written.</p></div>
          <div className="transformation reveal" style={{ '--slider-position': `${slider}%` }}>
            <img className="transformation-after" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1500&q=85" alt="PulseFit client after her training transformation" />
            <div className="transformation-before" style={{ clipPath: `inset(0 ${100 - slider}% 0 0)` }}><img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1500&q=85" alt="PulseFit client at the start of her training journey" /></div>
            <span className="compare-label before-label">DAY ONE</span><span className="compare-label after-label">DAY 180</span><div className="slider-divider" aria-hidden="true"><span><ChevronLeft size={15} /><ChevronRight size={15} /></span></div>
            <input className="compare-range" type="range" min="0" max="100" value={slider} onChange={(event) => setSlider(Number(event.target.value))} aria-label="Compare transformation photos" />
          </div>
          <div className="results-caption"><span>CLIENT STORY / 6 MONTHS OF CONSISTENT WORK</span><span>‹ DRAG TO COMPARE ›</span></div>
        </section>

        <section className="programs section-pad" id="programs">
          <div className="section-label reveal"><span>03 — PICK YOUR PACE</span><span>YOUR GOAL. YOUR GAME PLAN.</span></div>
          <div className="programs-heading reveal"><h2>YOUR NEXT<br /><span>MOVE.</span></h2><a className="text-link desktop-link" href="#book">NOT SURE? LET’S FIGURE IT OUT <ArrowRight size={16} /></a></div>
          <div className="program-grid">{programs.map((program) => <article className="program-card" key={program.number}><div className="program-image-wrap"><img src={program.image} alt="" className="program-image" loading="lazy" /><span className="program-number">{program.number}</span><a className="program-arrow" href="#book" aria-label={`Ask about ${program.title}`}><MoveUpRight size={19} /></a></div><div className="program-info"><span className="program-meta">{program.meta}</span><h3>{program.title}</h3><p>{program.detail}</p></div></article>)}</div>
          <a className="text-link mobile-link" href="#book">NOT SURE? LET’S FIGURE IT OUT <ArrowRight size={16} /></a>
        </section>

        <section className="bmi-band"><div className="bmi-copy reveal"><span className="eyebrow">A LITTLE DATA. ZERO JUDGMENT.</span><h2>LET’S GET<br />A BASELINE.</h2><p>BMI is one small data point, not the whole story. Use it as a starting line, not a finish line.</p></div>
          <form className="bmi-form reveal" onSubmit={calculateBmi}><label>WEIGHT <span>KG</span><input type="number" inputMode="decimal" min="1" max="500" step="0.1" value={weight} onChange={(event) => setWeight(event.target.value)} required /></label><label>HEIGHT <span>CM</span><input type="number" inputMode="decimal" min="50" max="280" step="0.1" value={height} onChange={(event) => setHeight(event.target.value)} required /></label><button className="button-primary bmi-button" type="submit">CALCULATE BMI <ArrowRight size={17} /></button><div className="bmi-result" aria-live="polite"><span>YOUR BMI</span><strong>{bmi ?? '— —'}</strong>{bmi && <small>{Number(bmi) < 18.5 ? 'Below standard range' : Number(bmi) < 25 ? 'Within standard range' : Number(bmi) < 30 ? 'Above standard range' : 'Higher standard range'}</small>}</div></form>
        </section>

        <section className="testimonials section-pad" id="stories"><div className="section-label reveal"><span>04 — WORD GETS AROUND</span><span>BETTER THAN A STAR RATING.</span></div><div className="testimonial-content reveal"><div className="quote-mark">“</div><blockquote key={activeQuote}>{quote.quote}</blockquote><div className="quote-bottom"><div><strong>{quote.name}</strong><span>{quote.detail}</span></div><span className="quote-stat">{quote.stat}</span></div></div><div className="testimonial-controls"><div className="quote-dots" role="tablist" aria-label="Choose a client story">{testimonials.map((item, index) => <button type="button" key={item.name} className={activeQuote === index ? 'quote-dot active' : 'quote-dot'} onClick={() => setActiveQuote(index)} aria-label={`Show story from ${item.name}`} aria-selected={activeQuote === index} role="tab" />)}</div><div className="quote-arrows"><button type="button" onClick={() => setActiveQuote((activeQuote + testimonials.length - 1) % testimonials.length)} aria-label="Previous testimonial"><ChevronLeft size={19} /></button><button type="button" onClick={() => setActiveQuote((activeQuote + 1) % testimonials.length)} aria-label="Next testimonial"><ChevronRight size={19} /></button></div></div></section>

        <section className="booking section-pad" id="book"><div className="section-label reveal"><span>05 — YOUR MOVE</span><span>NO PRESSURE. JUST A CONVERSATION.</span></div><div className="booking-grid"><div className="booking-copy reveal"><h2>READY WHEN<br /><span>YOU ARE.</span></h2><p>Tell us a little about you. We’ll find a time for a free 20-minute call and figure out what’s next, together.</p><div className="booking-note"><span className="live-dot" /><span>REPLY WITHIN ONE BUSINESS DAY</span></div></div>
          <form className="booking-form reveal" onSubmit={submitBooking}><div className="form-row"><label>YOUR NAME<input name="name" type="text" autoComplete="name" placeholder="Alex Morgan" minLength="2" maxLength="80" required /></label><label>EMAIL ADDRESS<input name="email" type="email" autoComplete="email" placeholder="alex@email.com" maxLength="254" required /></label></div><div className="form-row"><label>PHONE <span>OPTIONAL</span><input name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" maxLength="30" /></label><label>I’M INTERESTED IN<select name="program" defaultValue="" required><option value="" disabled>Choose your focus</option><option>Strength & conditioning</option><option>Fat loss coaching</option><option>Athletic performance</option><option>Not sure yet</option></select></label></div><label>WHAT DOES YOUR NEXT CHAPTER LOOK LIKE?<textarea name="goal" placeholder="A few words about what you’re working toward…" rows="3" maxLength="1000" /></label><div className="form-submit"><button className="button-primary button-pulse" type="submit" disabled={bookingState === 'submitting'}>{bookingState === 'submitting' ? 'SENDING…' : 'BOOK MY FREE CALL'} <ArrowUpRight size={17} /></button><span>ZERO PRESSURE. ZERO COMMITMENT.</span></div>{bookingMessage && <p className={`form-message ${bookingState}`} role="status">{bookingState === 'success' && <Check size={16} />}{bookingMessage}</p>}</form>
        </div></section>
      </main>
      <footer className="site-footer"><a className="wordmark" href="#top"><span className="wordmark-icon"><Dumbbell size={18} strokeWidth={2.5} /></span>PULSE<span>FIT</span></a><span>TRAIN WITH INTENTION. LIVE WITH ENERGY.</span><a href="#top">BACK TO TOP ↑</a><span>© PULSEFIT 2026</span></footer>
    </>
  )
}

export default App
