import { useState, useEffect, useRef } from 'react';

// ============================================
// ReactBits-style Animations (tasteful selection)
// ============================================

// Blur text reveal - used once for the name
function BlurText({ text, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const words = text.split(' ');

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? 'blur(0px)' : 'blur(8px)',
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + i * 0.08}s`,
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

// Subtle magnetic effect - used on buttons
function Magnet({ children, strength = 0.15 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * strength;
    const y = (e.clientY - rect.top - rect.height / 2) * strength;
    setPos({ x, y });
  };

  const handleMouseLeave = () => setPos({ x: 0, y: 0 });

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'inline-block',
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: pos.x === 0 ? 'transform 0.4s ease' : 'transform 0.1s ease',
      }}
    >
      {children}
    </span>
  );
}

// Simple fade in on scroll
function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// Click spark effect - ReactBits style
function ClickSpark({ children, sparkColor = '#3b82f6', sparkCount = 6 }) {
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);

  const createSpark = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newSparks = [];
    for (let i = 0; i < sparkCount; i++) {
      const angle = (360 / sparkCount) * i;
      const velocity = 30 + Math.random() * 30;
      newSparks.push({
        id: Date.now() + i,
        x,
        y,
        angle,
        velocity,
      });
    }
    
    setSparks(prev => [...prev, ...newSparks]);
    
    setTimeout(() => {
      setSparks(prev => prev.filter(s => !newSparks.includes(s)));
    }, 500);
  };

  return (
    <span
      ref={containerRef}
      onClick={createSpark}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {sparks.map(spark => (
        <span
          key={spark.id}
          style={{
            position: 'absolute',
            left: spark.x,
            top: spark.y,
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: sparkColor,
            boxShadow: `0 0 6px ${sparkColor}`,
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)',
            animation: `sparkMove-${spark.angle} 0.5s ease-out forwards`,
          }}
        />
      ))}
      <style>{`
        ${sparks.map(spark => `
          @keyframes sparkMove-${spark.angle} {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(
                calc(-50% + ${Math.cos(spark.angle * Math.PI / 180) * spark.velocity}px),
                calc(-50% + ${Math.sin(spark.angle * Math.PI / 180) * spark.velocity}px)
              ) scale(0);
              opacity: 0;
            }
          }
        `).join('')}
      `}</style>
    </span>
  );
}

// Lightbulb theme toggle
function LightbulbToggle({ isDark, onToggle }) {
  const [isPulling, setIsPulling] = useState(false);
  const [bulbOn, setBulbOn] = useState(!isDark);
  const bulbRef = useRef(null);

  const handleClick = () => {
    setIsPulling(true);

    // Switch bulb visuals immediately
    const turningOn = !bulbOn;
    setBulbOn(turningOn);

    // Get the bulb's position for the radial reveal
    const bulbEl = bulbRef.current;
    const rect = bulbEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Calculate radius needed to cover the entire viewport
    const maxDist = Math.sqrt(
      Math.max(cx, window.innerWidth - cx) ** 2 +
      Math.max(cy, window.innerHeight - cy) ** 2
    );

    // Create overlay with the NEW/target color expanding from the bulb
    const overlay = document.createElement('div');
    overlay.className = 'theme-reveal-overlay';
    overlay.style.setProperty('--reveal-cx', `${cx}px`);
    overlay.style.setProperty('--reveal-cy', `${cy}px`);
    overlay.style.setProperty('--reveal-radius', `${maxDist}px`);
    overlay.style.background = turningOn ? '#fafafa' : '#0a0a0a';
    document.body.appendChild(overlay);

    // Start expanding circle from bulb
    requestAnimationFrame(() => {
      overlay.classList.add('expanding');
    });

    // Switch actual theme once overlay covers the screen, then remove it
    setTimeout(() => {
      onToggle();
      overlay.remove();
    }, 300);

    setTimeout(() => {
      setIsPulling(false);
    }, 500);
  };

  const bulbColor = bulbOn ? '#f5b820' : '#d1d5db';
  const bulbColorLight = bulbOn ? '#fcd34d' : '#e5e7eb';
  const filamentColor = bulbOn ? '#78350f' : '#374151';

  return (
    <div className="lightbulb-toggle" onClick={handleClick} title={isDark ? "Turn on the light" : "Turn off the light"}>

      {/* Bulb - SVG for precise shape */}
      <svg ref={bulbRef} className={`bulb-svg ${bulbOn ? 'on' : ''}`} viewBox="0 0 60 90" width="50" height="75">
        {/* Glow effect when on */}
        {bulbOn && (
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        )}
        
        {/* Wire to ceiling */}
        <line x1="30" y1="0" x2="30" y2="14" stroke="#9ca3af" strokeWidth="2"/>
        
        {/* Screw cap - dome/trapezoid shape */}
        <path 
          d="M 18 14 
             Q 18 11, 22 11 
             L 38 11 
             Q 42 11, 42 14 
             L 42 18 
             Q 42 22, 40 24 
             L 20 24 
             Q 18 22, 18 18 
             Z"
          fill="#9ca3af"
        />
        {/* Cap bottom rim */}
        <rect x="19" y="24" width="22" height="2" rx="1" fill="#6b7280"/>
        
        {/* Glass bulb - classic rounded pear shape, wider neck */}
        <path 
          d="M 20 26 
             C 20 31, 18 36, 14 42 
             C 9 50, 7 57, 9 64 
             C 11 72, 18 79, 30 79 
             C 42 79, 49 72, 51 64 
             C 53 57, 51 50, 46 42 
             C 42 36, 40 31, 40 26 
             Z"
          fill={bulbColor}
          filter={bulbOn ? "url(#glow)" : "none"}
        />
        
        {/* Filament wires - two curves meeting at bottom */}
        <path d="M 26 28 C 25 40, 23 50, 30 63" stroke={filamentColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M 34 28 C 35 40, 37 50, 30 63" stroke={filamentColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
      
      {/* Ball chain - extra balls hidden above viewport, revealed on pull */}
      <div className={`ball-chain ${isPulling ? 'pulling' : ''}`}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="chain-ball" />
        ))}
        <div className="chain-pull" />
      </div>
    </div>
  );
}

// ============================================
// Main App
// ============================================

function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'education', 'projects', 'about-me'];
      const scrollPos = window.scrollY + 200;

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={toggleTheme} />
      <aside className="sidebar">
        <div className="logo">Jake Alessi</div>
        <nav className="nav">
          {['about', 'experience', 'education', 'projects', 'about-me'].map((id) => (
            <div
              key={id}
              className={`nav-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {id === 'about-me' ? 'About Me' : id.charAt(0).toUpperCase() + id.slice(1)}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main">
        {/* About */}
        <section id="about" className="hero">
          <h1 className="name">
            <BlurText text="Jake" delay={0} />
            <span><BlurText text="Alessi" delay={0.15} /></span>
          </h1>
          <FadeIn delay={0.4}>
            <p className="tagline">
                Computer Science & Applied Mathematics Double Major interested in automation, exploiting loopholes, arbitrage, and optimizing processes.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="contact">
              Massapequa, NY · (516) 743-0920 · <a href="mailto:jake.alessi@stonybrook.edu">jake.alessi@stonybrook.edu</a>
            </p>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className="links">
              <Magnet>
                <ClickSpark sparkColor="#0077b5">
                  <a href="https://www.linkedin.com/in/jake-thomas-alessi/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                    LinkedIn
                  </a>
                </ClickSpark>
              </Magnet>
              <Magnet>
                <ClickSpark sparkColor="#333">
                  <a href="https://github.com/jakealessi" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                </ClickSpark>
              </Magnet>
            </div>
          </FadeIn>
        </section>

        {/* Experience */}
        <section id="experience">
          <FadeIn>
            <h2 className="section-title">Experience</h2>
          </FadeIn>
          
          <FadeIn delay={0.05}>
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    minWidth: 'fit-content'
                  }}>
                    <img src={`${import.meta.env.BASE_URL}atlantic-pc-logo.webp`} alt="Atlantic PC" style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 className="card-title">Cybersecurity & IT Intern</h3>
                    <p className="card-subtitle">Atlantic PC · Great Neck, NY</p>
                  </div>
                </div>
                <span className="card-date">May 2025 – Dec 2025</span>
              </div>
              <div className="card-content">
                <ul>
                  <li>Develop and implement automation scripts in PowerShell and Bash to streamline system administration tasks, reducing manual configuration time and improving operational efficiency across client environments</li>
                  <li>Configure and deploy PCs, servers, and network equipment for business clients, ensuring proper setup, security hardening, and network connectivity according to industry best practices</li>
                  <li>Manage and maintain cloud infrastructure through Azure and Microsoft 365, including user provisioning, security policies, and resource allocation for enterprise clients</li>
                  <li>Collaborate with senior IT staff to troubleshoot technical issues and implement solutions that meet client business requirements and security standards</li>
                  <li>Internship extended into fall semester due to strong performance and demonstrated ability to handle complex technical challenges independently</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    minWidth: 'fit-content'
                  }}>
                    <img src={`${import.meta.env.BASE_URL}thermoroll-logo.png`} alt="ThermoRoll" style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 className="card-title">Consultant</h3>
                    <p className="card-subtitle">ThermoRoll · Freeport, NY</p>
                  </div>
                </div>
                <span className="card-date">Apr 2025 – Present</span>
              </div>
              <div className="card-content">
                <ul>
                  <li>Maintain and enhance legacy VBA database critical to company operations, ensuring data integrity and system stability while supporting daily business processes</li>
                  <li>Identify, diagnose, and apply bug fixes and optimizations to improve system reliability, performance, and user experience while maintaining backward compatibility</li>
                  <li>Analyze system architecture and workflows to recommend technical improvements, modern solutions, and best practices that align with business objectives and future scalability needs</li>
                  <li>Work closely with management to translate technical requirements into actionable business strategies and provide expert guidance on technology decisions</li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Education */}
        <section id="education">
          <FadeIn>
            <h2 className="section-title">Education</h2>
          </FadeIn>
          
          <FadeIn delay={0.05}>
            <div className="card">
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    padding: '0.5rem', 
                    border: '1px solid var(--border)', 
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#ffffff',
                    minWidth: 'fit-content'
                  }}>
                    <img src={`${import.meta.env.BASE_URL}stony-brook-logo.svg`} alt="Stony Brook University" style={{ height: '32px', width: 'auto', display: 'block', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <h3 className="card-title">Stony Brook University</h3>
                    <p className="card-subtitle">B.S. Computer Science · B.S. Applied Mathematics</p>
                  </div>
                </div>
                <span className="card-date">Aug 2023 – May 2027</span>
              </div>
              <div className="card-content">
              <p style={{ marginBottom: '0.5rem' }}><strong>Coursework</strong></p>
<p>
  CSE 114: Introduction to Object-Oriented Programming<br />
  CSE 214: Data Structures<br />
  CSE 215: Foundations of Computer Science<br />
  CSE 216: Programming Abstractions<br />
  CSE 220: Systems Fundamentals I<br />
  CSE 303: Theory of Computation<br />
  CSE 316: Software Development<br />
  CSE 416: Software Engineering<br />
  CSE 320: Systems Fundamentals II<br />
  CSE 351: Introduction to Data Science<br />
  CSE 353: Machine Learning<br />
  CSE 371: Logic<br />
  CSE 373: Analysis of Algorithms<br />
  CSE 312: Legal Issues in Computing<br />
  CSE 300: Technical Communications<br />
  AMS 210: Applied Linear Algebra<br />
  AMS 261: Applied Calculus III<br />
  AMS 301: Finite Mathematical Structures<br />
  AMS 310: Survey of Probability and Statistics<br />
  AMS 315: Data Analysis<br />

  via AP Credits: Calculus I and Calculus II<br />
</p>
<strong>3.70/4.0 GPA</strong>
<p style={{ marginTop: '0.5rem' }}>
  Member of the Algorithms and Computational Geometry groups.
</p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* Projects */}
        <section id="projects">
          <FadeIn>
            <h2 className="section-title">Projects</h2>
          </FadeIn>

          {[
            {
              title: 'Stock Arbitrage Bot',
              tech: ['Python', 'Selenium'],
              desc: 'Developed an automation tool to execute trades for reverse split arbitrage opportunities via 10+ brokerage web portals. The bot uses Selenium or existing APIs to navigate and interact with trading interfaces, typically buying stocks that are going through a reverse split. Implemented robust error handling and logging to ensure reliable execution across multiple accounts. Achieved exceptional returns of approximately $600 per account annually from an initial balance of just $10, representing a 60x return on investment.',
            },
            {
              title: 'Custom Memory Allocator',
              tech: ['C'],
              desc: 'Built a dynamic memory allocation system from scratch using segregated free lists and quick lists for efficient memory management. Implemented the core functions malloc, free, and realloc with advanced features including block splitting for optimal space utilization, coalescing of adjacent free blocks to reduce fragmentation, and proper alignment support for different data types. Developed comprehensive testing and measurement tools to analyze fragmentation and utilization metrics, verifying the allocator\'s efficiency and performance characteristics.',
            },
            {
              title: 'Playlister',
              tech: ['MongoDB','PostgreSQL', 'Express', 'React', 'Node.js', 'YouTube API'],
              desc: 'Built a full-stack web application for creating and playing YouTube music video playlists, with a flexible backend supporting both MongoDB and PostgreSQL databases. Implemented user authentication with account creation, login, and profile editing including custom avatar uploads. Registered users can create, edit, copy, and delete playlists while guests can browse and play existing playlists. Features include a searchable songs catalog where users can add songs to the system, playlist discovery with multiple search criteria (playlist name, user, song title, artist, year), and sorting options for both playlists and songs. Integrated the YouTube API for seamless video playback with player controls and repeat functionality. Implemented undo/redo capabilities using a transaction stack during playlist editing. Designed modals for playlist editing, playback, and delete confirmations with foolproof UI that hides unavailable actions from unauthorized users. Conducted extensive API testing through Postman to ensure reliability and proper endpoint behavior.',
            },
            {
              title: 'Academic Calendar Scraper',
              tech: ['Python', 'Playwright'],
              desc: 'Developed a web scraping solution to convert HTML-based university academic calendars into structured, machine-readable formats. Used Playwright with headless Chromium to navigate and extract calendar data from university websites, handling dynamic content and various HTML structures. Implemented Python parsing logic to clean and structure the extracted data into clean JSON format. The system then converts these JSON events into standard iCalendar (.ics) files, making it easy for students to import academic schedules directly into Google Calendar, Outlook, or any calendar application that supports the iCal format.',
            },
          ].map((project, i) => (
            <FadeIn key={project.title} delay={0.05 * (i + 1)}>
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">{project.title}</h3>
                </div>
                <div className="card-content">
                  <p>{project.desc}</p>
                  <div className="project-tech">
                    {project.tech.map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </section>

        {/* About Me */}
        <section id="about-me">
          <FadeIn>
            <h2 className="section-title">About Me</h2>
          </FadeIn>
          
          <FadeIn delay={0.05}>
            <div className="card">
              <div className="card-content">
<p>
  When I’m not coding or working on school projects, I spend my time on a mix of hobbies that help me
  wind down and stay engaged.
</p>

<p style={{ marginTop: '1rem' }}>
  I like to keep up with pop culture by watching movies, listening to music, and reading books.
  Music is easily my favorite out of the three. I have an ever-expanding vinyl collection and try
  to listen to at least one new album every week. My current favorite album is <i>Vices</i> by Weiland.
</p>

<p style={{ marginTop: '1rem' }}>
  I’m also a very competitive person, so I like to keep myself occupied with different games.
  I play a lot of strategy games like Scrabble, Risk, chess, and poker, as well as competitive
  video games like Rocket League and Marvel Rivals. When it comes to sports, I mostly play pickup
  basketball and soccer.
</p>

<p style={{ marginTop: '1rem' }}>
  I also like to hustle on the side whenever I get the chance. One of my favorite ways to do that is
  reselling. Amazon and other big retailers frequently misprice items that I can scoop up and then resell for a large profit.
  I remember Doordash had an error where you could essentially get $50 worth of items for free. I was able to place 10+ orders and only had to pay tip.
  Capitalizing on these glitches is not only fun but also incredibly lucrative!
</p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}

export default App;

