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

// ============================================
// Main App
// ============================================

function App() {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'education', 'projects', 'skills'];
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
      <aside className="sidebar">
        <div className="logo">Jake Alessi</div>
        <nav className="nav">
          {['about', 'experience', 'education', 'projects', 'skills'].map((id) => (
            <div
              key={id}
              className={`nav-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
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
              Computer Science & Applied Mathematics student building automation tools, 
              efficient systems, and creative solutions to complex problems.
            </p>
          </FadeIn>
          <FadeIn delay={0.5}>
            <p className="contact">
              Stony Brook, NY · (516) 743-0920 · <a href="mailto:jake.alessi@stonybrook.edu">jake.alessi@stonybrook.edu</a>
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
                <ClickSpark sparkColor="#fafafa">
                  <a href="#" className="btn btn-primary">Résumé</a>
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
                <div>
                  <h3 className="card-title">Cybersecurity & IT Intern</h3>
                  <p className="card-subtitle">Atlantic PC · Great Neck, NY</p>
                </div>
                <span className="card-date">May 2025 – Present</span>
              </div>
              <div className="card-content">
                <ul>
                  <li>Develop automation scripts in PowerShell and Bash for system administration</li>
                  <li>Configure PCs, servers, and network equipment for business clients</li>
                  <li>Manage cloud infrastructure via Azure and Microsoft 365</li>
                  <li>Internship extended into fall semester due to strong performance</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="card-title">Consultant</h3>
                  <p className="card-subtitle">ThermoRoll · Freeport, NY</p>
                </div>
                <span className="card-date">Apr 2025 – Present</span>
              </div>
              <div className="card-content">
                <ul>
                  <li>Maintain legacy VBA database critical to company operations</li>
                  <li>Apply bug fixes and optimizations for improved reliability</li>
                  <li>Advise management on technical improvements and best practices</li>
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
                <div>
                  <h3 className="card-title">Stony Brook University</h3>
                  <p className="card-subtitle">B.S. Computer Science · B.S. Applied Mathematics</p>
                </div>
                <span className="card-date">Aug 2023 – May 2027</span>
              </div>
              <div className="card-content">
                <p style={{ marginBottom: '0.5rem' }}><strong>GPA:</strong> 3.8/4.0</p>
                <p>Data Structures, Algorithms, Systems Fundamentals, Theory of Computation, Linear Algebra, Probability & Statistics, Graph Theory</p>
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
              desc: 'Automation tool for reverse split arbitrage trades. Achieved 60x ROI ($10 → $600 annually per account).',
            },
            {
              title: 'Custom Memory Allocator',
              tech: ['C'],
              desc: 'Dynamic allocation system using segregated free lists. Implemented malloc, free, and realloc with coalescing.',
            },
            {
              title: 'Video Playlist App',
              tech: ['React', 'Node.js'],
              desc: 'Single-page app for building video playlists with full undo/redo support.',
            },
            {
              title: 'Academic Calendar Scraper',
              tech: ['Python', 'Playwright'],
              desc: 'Converts university calendars to iCalendar format for Google/Outlook import.',
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

        {/* Skills */}
        <section id="skills">
          <FadeIn>
            <h2 className="section-title">Skills</h2>
          </FadeIn>
          
          <FadeIn delay={0.05}>
            <div className="skills-list">
              {[
                'Python', 'JavaScript', 'Java', 'C', 'React', 'Node.js',
                'Playwright', 'Selenium', 'Git', 'Linux', 'Azure', 
                'PowerShell', 'Bash', 'pandas', 'NumPy'
              ].map((skill) => (
                <span key={skill} className="skill">{skill}</span>
              ))}
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}

export default App;

