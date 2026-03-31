import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import Support from './Support';
import PrivacyPolicy from './PrivacyPolicy';
import { FadeIn, LightbulbToggle } from './components';

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

// ============================================
// Portfolio Component (main content)
// ============================================

function Portfolio() {
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
              <Magnet>
                <ClickSpark sparkColor="#6366f1">
                  <a href="https://github.com/jakealessi/PortfolioWebsite" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/></svg>
                    View Source
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
              title: 'Poker Bankroll AI',
              tech: ['Swift', 'SwiftUI', 'TypeScript', 'Cloudflare Workers', 'Gemini', 'OpenAI', 'StoreKit 2', 'iCloud'],
              desc: 'Built and shipped a production iOS app for tracking poker sessions, bankroll, and performance across cash games, tournaments, sit & gos, home games, and online play. On the client side I implemented SwiftUI flows for AI-assisted logging, manual session entry and editing, analytics dashboards, and a built-in odds calculator; on the backend side I added a TypeScript Cloudflare Worker that proxies Gemini and OpenAI requests so provider keys stay server-side. The app also includes StoreKit 2 subscriptions, iCloud sync/export, and the repository contains the project specifics and implementation details.',
              liveUrl: 'https://apps.apple.com/app/id6759470443',
              liveLabel: 'iOS App Store',
              githubUrl: 'https://github.com/jakealessi/PokerTrackerIOS',
            },
            {
              title: 'Custom Memory Allocator',
              tech: ['C', 'Memory Management', 'Systems Programming'],
              desc: 'Implemented a dynamic memory allocator in C with custom versions of `malloc`, `free`, and `realloc` using segregated free lists and quick lists to balance throughput and fragmentation. Added block splitting, coalescing, alignment handling, and heap-growth logic, then built tests and measurement tools to analyze utilization and fragmentation under different workloads. The project centered on low-level memory layout, pointer safety, and systems-style debugging.',
            },
            {
              title: 'ThermoRoll Operations Database',
              tech: ['VBA', 'Automation', 'Database Maintenance', 'Legacy Systems'],
              desc: 'Maintain and extend a legacy VBA database that supports ThermoRoll\'s day-to-day operations. The work involves debugging brittle workflows, improving performance and reliability without disrupting existing business processes, and adding small automation and quality-of-life improvements around data entry and reporting. I also analyze the broader system design and recommend modernization steps that management can adopt incrementally.',
            },
            {
              title: 'Stock Arbitrage Bot',
              tech: ['Python', 'Selenium', 'Automation'],
              desc: 'Built a Python automation system for reverse-split arbitrage across 10+ brokerage portals. Used Selenium and broker-specific flows to authenticate, navigate inconsistent trading interfaces, place orders, and recover cleanly from failures with logging and retry logic. The main challenge was standardizing execution across heterogeneous sites that offered very different web UIs and levels of API support.',
            },
            {
              title: 'Playlister',
              tech: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'JWT'],
              desc: 'Built a full-stack playlist application with a React frontend and Express/Node backend that can run against either MongoDB or PostgreSQL through an abstracted data layer. Implemented JWT-based authentication, profile editing with avatars, playlist CRUD/copy/search flows, a shared song catalog, and embedded YouTube playback. On the frontend I added transaction-based undo/redo for playlist edits and UI guards that hide unavailable actions from unauthorized users instead of failing late.',
            },
            {
              title: 'Categories Game',
              tech: ['React', 'Vite', 'Node.js', 'Express', 'Socket.IO', 'WebSockets'],
              desc: 'Built a real-time multiplayer party game with a React/Vite client and Node/Express server using Socket.IO for synchronized game state. The server manages room creation, countdown timers, scoring, answer claims, and reconnect flows, while fuzzy matching based on Levenshtein distance helps accept typo-tolerant answers and aliases. Deployed the app on Render so players can share a room code and play from separate devices.',
              liveUrl: 'https://categoriesgame.onrender.com',
              githubUrl: 'https://github.com/jakealessi/CategoriesGame',
            },
            {
              title: 'Academic Calendar Scraper',
              tech: ['Python', 'Playwright', 'pdfplumber', 'JSON'],
              desc: 'Built a Python scraping pipeline that turns university academic calendars into structured JSON, even when schools publish them as irregular HTML tables, dynamic pages, or PDFs. Used Playwright and headless Chromium for page rendering, `pdfplumber` for PDF extraction, and custom parsing heuristics to normalize dates, terms, and event text across different source formats. The scraper powers AcademicCalendar.com by writing per-school, per-year calendar data from a shared registry.',
            },
            {
              title: 'Super Bowl Box Generator',
              tech: ['JavaScript', 'HTML', 'CSS', 'Local Storage'],
              desc: 'Built a single-page browser app for running 10x10 Super Bowl squares pools without a backend. Implemented participant and box allocation, randomized grid generation, payout and vig calculations, custom split validation, and a clean print mode for sharing finalized boards. The app persists both configuration and generated grids in localStorage so users can refresh and return without losing their setup.',
              liveUrl: 'https://jakealessi.github.io/SuperBowlBoxGenerator/',
              githubUrl: 'https://github.com/jakealessi/SuperBowlBoxGenerator',
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
                  {(project.liveUrl || project.githubUrl) && (
                    <div className="project-links">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                          </svg>
                          {project.liveLabel || 'Live Demo'}
                        </a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          View Code
                        </a>
                      )}
                    </div>
                  )}
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

// ============================================
// Main App with Routing
// ============================================

function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/support" element={<Support />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    </Routes>
  );
}

export default App;
