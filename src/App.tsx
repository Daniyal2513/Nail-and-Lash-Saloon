import { FormEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";

const images = {
  hero: "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=2200&q=90",
  salon: "https://images.unsplash.com/photo-1633681926035-ec1ac984418a?auto=format&fit=crop&w=1400&q=85",
  nailSoft: "https://images.unsplash.com/photo-1610992015762-45dca7fa3a85?auto=format&fit=crop&w=1200&q=85",
  nailDark: "https://images.unsplash.com/photo-1754799670312-8e7da8e40ad7?auto=format&fit=crop&w=1200&q=85",
  nailHands: "https://images.unsplash.com/photo-1659391542239-9648f307c0b1?auto=format&fit=crop&w=1400&q=85",
  nailWhite: "https://images.unsplash.com/photo-1652990337162-fa84a588d843?auto=format&fit=crop&w=1200&q=85",
  lashBlue: "https://images.unsplash.com/photo-1612864271882-5107e9e3b0ce?auto=format&fit=crop&w=1200&q=85",
  lashPortrait: "https://images.unsplash.com/photo-1581065124660-6fb43ed9e329?auto=format&fit=crop&w=1200&q=85",
  lashEye: "https://images.unsplash.com/photo-1574287045107-0d72f30b6246?auto=format&fit=crop&w=1200&q=85",
  lashProfile: "https://images.unsplash.com/photo-1551830685-046f8d48e66c?auto=format&fit=crop&w=1400&q=85",
};

type IconName = "arrow" | "calendar" | "clock" | "instagram" | "menu" | "close" | "check" | "chevron";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    menu: <><path d="M4 8h16M4 16h16" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const services = [
  { name: "The Signature Manicure", type: "Nail ritual", price: "From £48", duration: "60 min", image: images.nailSoft },
  { name: "Sculpted Extensions", type: "Nail architecture", price: "From £72", duration: "90 min", image: images.nailDark },
  { name: "Classic Lash Set", type: "Lash artistry", price: "From £95", duration: "105 min", image: images.lashPortrait },
  { name: "Velvet Volume Lashes", type: "Lash artistry", price: "From £125", duration: "120 min", image: images.lashBlue },
];

const portfolio = [
  { title: "Milky minimal", category: "BIAB", image: images.nailSoft, tall: true },
  { title: "Velvet volume", category: "Volume Lashes", image: images.lashBlue, tall: false },
  { title: "Sculpted noir", category: "Acrylic Nails", image: images.nailDark, tall: false },
  { title: "Soft definition", category: "Classic Lashes", image: images.lashPortrait, tall: true },
  { title: "Pearl finish", category: "BIAB", image: images.nailWhite, tall: false },
  { title: "Editorial almond", category: "Acrylic Nails", image: images.nailHands, tall: true },
  { title: "Signature classic", category: "Classic Lashes", image: images.lashEye, tall: false },
  { title: "Weightless volume", category: "Volume Lashes", image: images.lashProfile, tall: true },
];

const testimonials = [
  { quote: "Every detail feels considered. My nails have never looked so refined, and the hour itself felt like a true escape.", name: "Amelia R.", service: "Signature BIAB" },
  { quote: "The lightest, most beautiful lashes I have ever worn. The team understood understated luxury perfectly.", name: "Sofia M.", service: "Velvet Volume" },
  { quote: "Immaculate, calm, and exceptionally skilled. I left feeling polished in every sense of the word.", name: "Isabelle T.", service: "Sculpted Extensions" },
];

const technicians = [
  { name: "Sofia", role: "Senior Nail Artist", specialty: "BIAB & fine art", initials: "SL" },
  { name: "Maya", role: "Master Lash Artist", specialty: "Classic & volume", initials: "MK" },
  { name: "Elena", role: "Beauty Artisan", specialty: "Sculpting & bridal", initials: "EV" },
];

const dates = [
  { day: "Mon", date: "14" }, { day: "Tue", date: "15" }, { day: "Wed", date: "16" },
  { day: "Thu", date: "17" }, { day: "Fri", date: "18" }, { day: "Sat", date: "19" },
];

function SectionTitle({ eyebrow, title, light = false }: { eyebrow: string; title: string; light?: boolean }) {
  return (
    <div className={`section-heading reveal ${light ? "section-heading--light" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("All work");
  const [lightbox, setLightbox] = useState<(typeof portfolio)[number] | null>(null);
  const [testimonial, setTestimonial] = useState(0);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setTestimonial((current) => (current + 1) % testimonials.length), 6500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightbox || mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox, mobileOpen]);

  const filteredPortfolio = useMemo(
    () => filter === "All work" ? portfolio : portfolio.filter((item) => item.category === filter),
    [filter],
  );

  const slide = (direction: number) => setTestimonial((testimonial + direction + testimonials.length) % testimonials.length);
  const onDragEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragStart.current === null) return;
    const distance = event.clientX - dragStart.current;
    if (Math.abs(distance) > 50) slide(distance > 0 ? -1 : 1);
    dragStart.current = null;
  };

  return (
    <main>
      <header className="site-header">
        <a href="#home" className="wordmark" aria-label="Maison Muse home">
          <span>MAISON</span><strong>MUSE</strong>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {["About", "Services", "Portfolio", "Contact"].map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}
        </nav>
        <a href="#booking" className="nav-book">Book a session <Icon name="arrow" size={17} /></a>
        <button className="menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle navigation">
          <Icon name={mobileOpen ? "close" : "menu"} size={25} />
        </button>
      </header>

      {mobileOpen && (
        <div className="mobile-nav">
          {["About", "Services", "Portfolio", "Booking", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)}>{item}</a>
          ))}
        </div>
      )}

      <section className="hero" id="home">
        <div className="hero-image" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow light hero-kicker">Nail & lash atelier · London</p>
          <h1><span>Beauty,</span><br />beautifully <em>considered.</em></h1>
          <p className="hero-copy">A private beauty atelier devoted to precision, quiet luxury, and the art of feeling entirely yourself.</p>
          <a className="primary-button" href="#booking">Book your session <Icon name="arrow" /></a>
        </div>
        <div className="hero-foot">
          <span>Mayfair · London</span>
          <span className="scroll-line" />
          <span>Scroll to discover</span>
        </div>
      </section>

      <section className="intro" id="about">
        <div className="intro-statement reveal">
          <p className="eyebrow">Our philosophy</p>
          <h2>Quiet luxury,<br /><em>mastered by hand.</em></h2>
        </div>
        <div className="intro-copy reveal">
          <p>Maison Muse is a modern beauty atelier where unhurried rituals meet exceptional technique. Each appointment is considered, personal, and designed around you.</p>
          <a href="#services" className="text-link">Discover our approach <Icon name="arrow" size={18} /></a>
        </div>
        <div className="editorial-image reveal">
          <img src={images.salon} alt="Warm and refined Maison Muse salon interior" />
          <div className="floating-note">
            <span>01</span>
            <p>Beauty is in<br />the details.</p>
          </div>
        </div>
        <div className="values">
          {[
            ["Precision", "Every line, layer, and placement is executed with an artist’s eye."],
            ["Care", "A private, unrushed experience centered entirely around your comfort."],
            ["Integrity", "Impeccable hygiene and premium, considered products—always."],
          ].map(([title, copy], index) => (
            <div className="value reveal" key={title}>
              <span>0{index + 1}</span><h3>{title}</h3><p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="services-section" id="services">
        <div className="section-shell">
          <SectionTitle eyebrow="The treatment edit" title="Our signatures" />
          <p className="section-intro reveal">Elevated essentials, perfected. Each treatment combines meticulous technique with a serene, sensory experience.</p>
          <div className="services-grid">
            {services.map((service, index) => (
              <article className="service-card reveal" key={service.name} style={{ transitionDelay: `${index * 80}ms` }}>
                <div className="service-image"><img src={service.image} alt={service.name} /><span>0{index + 1}</span></div>
                <div className="service-content">
                  <p>{service.type}</p><h3>{service.name}</h3>
                  <div className="service-details"><strong>{service.price}</strong><span><Icon name="clock" size={16} /> {service.duration}</span></div>
                </div>
              </article>
            ))}
          </div>
          <a href="#booking" className="outline-button reveal">View treatment menu <Icon name="arrow" /></a>
        </div>
      </section>

      <section className="portfolio-section" id="portfolio">
        <div className="section-shell">
          <SectionTitle eyebrow="Selected work" title="The portfolio" />
          <div className="filter-bar" role="group" aria-label="Filter portfolio">
            {["All work", "Classic Lashes", "Volume Lashes", "Acrylic Nails", "BIAB"].map((item) => (
              <button key={item} className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
          <div className="masonry-grid">
            {filteredPortfolio.map((item) => (
              <button className={`portfolio-item ${item.tall ? "tall" : ""}`} key={item.title} onClick={() => setLightbox(item)}>
                <img src={item.image} alt={item.title} />
                <span className="portfolio-label"><small>{item.category}</small><strong>{item.title}</strong></span>
                <span className="zoom">+</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials"
        onPointerDown={(event) => { dragStart.current = event.clientX; }}
        onPointerUp={onDragEnd}
        onPointerCancel={() => { dragStart.current = null; }}
      >
        <div className="testimonial-mark">“</div>
        <div className="testimonial-content" key={testimonial}>
          <p className="eyebrow light">Client notes</p>
          <blockquote>“{testimonials[testimonial].quote}”</blockquote>
          <div className="client"><strong>{testimonials[testimonial].name}</strong><span>{testimonials[testimonial].service}</span></div>
        </div>
        <div className="slider-controls">
          <button onClick={() => slide(-1)} aria-label="Previous testimonial"><Icon name="chevron" /></button>
          <div>{testimonials.map((_, index) => <button key={index} onClick={() => setTestimonial(index)} className={testimonial === index ? "active" : ""} aria-label={`View testimonial ${index + 1}`} />)}</div>
          <button onClick={() => slide(1)} aria-label="Next testimonial"><Icon name="chevron" /></button>
        </div>
      </section>

      <Booking />

      <section className="contact-section" id="contact">
        <div className="map-panel">
          <iframe title="Maison Muse location in Mayfair" loading="lazy" src="https://www.google.com/maps?q=Mayfair%2C%20London&z=15&output=embed" />
          <div className="map-card"><span>Maison Muse</span><strong>18 Mount Street<br />Mayfair, London W1K</strong><a href="https://maps.google.com/?q=Mayfair+London" target="_blank" rel="noreferrer">Get directions <Icon name="arrow" size={16} /></a></div>
        </div>
        <div className="contact-content">
          <p className="eyebrow">Visit the atelier</p><h2>Come and stay<br /><em>awhile.</em></h2>
          <div className="contact-details">
            <div><span>Appointments</span><a href="tel:+442079460280">+44 (0)20 7946 0280</a><a href="mailto:hello@maisonmuse.co.uk">hello@maisonmuse.co.uk</a></div>
            <div><span>Opening hours</span><p>Mon–Fri &nbsp; 9:00–20:00<br />Saturday &nbsp; 9:00–18:00<br />Sunday &nbsp; By request</p></div>
          </div>
          <ContactForm />
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <div><a href="#home" className="footer-mark">M<span>M</span></a><p>Modern rituals.<br />Timeless beauty.</p></div>
          <div className="footer-links"><span>Explore</span>{["About", "Services", "Portfolio", "Booking"].map((item) => <a href={`#${item.toLowerCase()}`} key={item}>{item}</a>)}</div>
          <div className="footer-links"><span>Follow</span><a href="#">Instagram</a><a href="#">Pinterest</a></div>
          <Newsletter />
        </div>
        <div className="footer-bottom"><span>© 2026 Maison Muse</span><span>Privacy · Terms</span><span>London, United Kingdom</span></div>
      </footer>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} aria-label="Close image"><Icon name="close" size={28} /></button>
          <img src={lightbox.image} alt={lightbox.title} onClick={(event) => event.stopPropagation()} />
          <div><span>{lightbox.category}</span><strong>{lightbox.title}</strong></div>
        </div>
      )}
    </main>
  );
}

function Booking() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState("");
  const [tech, setTech] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState(false);

  const next = () => {
    const invalid = (step === 1 && !service) || (step === 2 && !tech) || (step === 3 && (!date || !time));
    if (invalid) {
      setErrors({ selection: step === 3 ? "Please choose both a date and time." : "Please make a selection to continue." });
      return;
    }
    setErrors({});
    setStep(step + 1);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    ["name", "email", "phone"].forEach((field) => { if (!String(data.get(field) || "").trim()) nextErrors[field] = "Required"; });
    if (String(data.get("email") || "") && !/^\S+@\S+\.\S+$/.test(String(data.get("email")))) nextErrors.email = "Enter a valid email";
    setErrors(nextErrors);
    if (!Object.keys(nextErrors).length) setConfirmed(true);
  };

  const choices = step === 1 ? services : [];
  return (
    <section className="booking-section" id="booking">
      <div className="booking-heading">
        <SectionTitle light eyebrow="Reserve your ritual" title="Your time, beautifully spent." />
        <p>Choose your treatment and preferred time. We’ll take care of every detail from there.</p>
      </div>
      <div className="booking-card">
        <div className="stepper">
          {["Treatment", "Artist", "Date & time", "Your details"].map((label, index) => (
            <button key={label} className={step === index + 1 ? "active" : step > index + 1 ? "complete" : ""} onClick={() => index + 1 < step && setStep(index + 1)}>
              <span>{step > index + 1 ? <Icon name="check" size={14} /> : index + 1}</span><small>{label}</small>
            </button>
          ))}
        </div>
        {confirmed ? (
          <div className="booking-success"><span><Icon name="check" size={28} /></span><p className="eyebrow">Request received</p><h3>Your ritual awaits.</h3><p>We’ll confirm your appointment by email shortly. We look forward to welcoming you to Maison Muse.</p><button onClick={() => { setConfirmed(false); setStep(1); }}>Make another booking</button></div>
        ) : (
          <div className="booking-body">
            <div className="booking-question">
              <span>0{step}</span>
              <div>
                <p>{step === 1 ? "Select your treatment" : step === 2 ? "Choose your artist" : step === 3 ? "Find your time" : "Complete your request"}</p>
                <h3>{step === 1 ? "What may we do for you?" : step === 2 ? "Who would you like to see?" : step === 3 ? "When shall we expect you?" : "A few final details."}</h3>
              </div>
            </div>
            {step === 1 && <div className="booking-options">{choices.map((item) => <button className={service === item.name ? "selected" : ""} onClick={() => setService(item.name)} key={item.name}><span><strong>{item.name}</strong><small>{item.type}</small></span><span><strong>{item.price.replace("From ", "")}</strong><small>{item.duration}</small></span></button>)}</div>}
            {step === 2 && <div className="tech-options">{technicians.map((item) => <button className={tech === item.name ? "selected" : ""} onClick={() => setTech(item.name)} key={item.name}><span className="avatar">{item.initials}</span><strong>{item.name}</strong><small>{item.role}</small><em>{item.specialty}</em></button>)}</div>}
            {step === 3 && <div className="date-time"><div className="date-row">{dates.map((item) => <button className={date === item.date ? "selected" : ""} onClick={() => setDate(item.date)} key={item.date}><small>{item.day}</small><strong>{item.date}</strong></button>)}</div><p>Available appointments</p><div className="time-row">{["09:30", "11:00", "13:30", "15:00", "17:30"].map((item) => <button className={time === item ? "selected" : ""} onClick={() => setTime(item)} key={item}>{item}</button>)}</div></div>}
            {step === 4 && <form id="booking-form" className="details-form" onSubmit={submit} noValidate><label>Your name<input name="name" className={errors.name ? "invalid" : ""} placeholder="Full name" /><small>{errors.name}</small></label><label>Email address<input name="email" type="email" className={errors.email ? "invalid" : ""} placeholder="you@example.com" /><small>{errors.email}</small></label><label>Phone number<input name="phone" className={errors.phone ? "invalid" : ""} placeholder="+44" /><small>{errors.phone}</small></label><label>Anything we should know?<textarea name="notes" placeholder="Preferences, sensitivities or occasion" /></label></form>}
            {errors.selection && <p className="selection-error">{errors.selection}</p>}
            <div className="booking-actions">
              {step > 1 && <button className="back-button" onClick={() => { setStep(step - 1); setErrors({}); }}>Back</button>}
              {step < 4 ? <button className="continue-button" onClick={next}>Continue <Icon name="arrow" size={18} /></button> : <button className="continue-button" type="submit" form="booking-form">Request appointment <Icon name="arrow" size={18} /></button>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);
  return sent ? <div className="form-success"><Icon name="check" /><span>Thank you. We’ll be in touch shortly.</span></div> : (
    <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
      <input required aria-label="Name" placeholder="Your name" />
      <input required type="email" aria-label="Email" placeholder="Email address" />
      <textarea required aria-label="Message" placeholder="How can we help?" />
      <button type="submit">Send enquiry <Icon name="arrow" size={18} /></button>
    </form>
  );
}

function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  return <div className="newsletter"><span>Notes from the atelier</span><p>Seasonal edits, quiet inspiration, and appointment releases.</p>{subscribed ? <strong>Welcome to our private list.</strong> : <form onSubmit={(event) => { event.preventDefault(); setSubscribed(true); }}><input required type="email" aria-label="Newsletter email" placeholder="Email address" /><button aria-label="Subscribe"><Icon name="arrow" /></button></form>}</div>;
}

export default App;
