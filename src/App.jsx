import { useEffect, useId, useRef, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import Support from './Support';
import { FadeIn, LightbulbToggle } from './components';
import { useThemePreference } from './theme';

const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'projects', label: 'Projects' },
  { id: 'about-me', label: 'About Me' },
];

const SECTION_IDS = NAV_SECTIONS.map(({ id }) => id);

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jake-thomas-alessi/',
    sparkColor: '#0077b5',
    iconPath:
      'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/jakealessi',
    sparkColor: '#333333',
    iconPath:
      'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
  },
  {
    label: 'View Source',
    href: 'https://github.com/jakealessi/PortfolioWebsite',
    sparkColor: '#6366f1',
    iconPath: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
  },
];

const EXPERIENCE_ITEMS = [
  {
    assetName: 'atlantic-pc-logo.webp',
    assetAlt: 'Atlantic PC',
    title: 'Cybersecurity & IT Intern',
    subtitle: 'Atlantic PC · Great Neck, NY',
    date: 'May 2025 – Dec 2025',
    bullets: [
      'Automated endpoint setup with PowerShell and Bash, reducing manual configuration time and improving deployment consistency across client environments.',
      'Deployed and hardened PCs, servers, and network equipment for business clients, ensuring secure and dependable setups aligned with best practices.',
      'Supported Azure and Microsoft 365 administration, including provisioning, access policies, and issue resolution across client tenants.',
      'Worked with senior IT staff to troubleshoot escalated issues and implement fixes that balanced security, usability, and client requirements.',
      'Internship extended into the fall semester based on performance and the ability to handle increasingly complex technical work independently.',
    ],
  },
];

const COURSEWORK = [
  'CSE 114: Introduction to Object-Oriented Programming',
  'CSE 214: Data Structures',
  'CSE 215: Foundations of Computer Science',
  'CSE 216: Programming Abstractions',
  'CSE 220: Systems Fundamentals I',
  'CSE 303: Theory of Computation',
  'CSE 316: Software Development',
  'CSE 320: Systems Fundamentals II',
  'CSE 351: Introduction to Data Science',
  'CSE 353: Machine Learning',
  'CSE 371: Logic',
  'CSE 373: Analysis of Algorithms',
  'CSE 416: Software Engineering',
  'CSE 312: Legal Issues in Computing',
  'CSE 300: Technical Communications',
  'AMS 210: Applied Linear Algebra',
  'AMS 261: Applied Calculus III',
  'AMS 301: Finite Mathematical Structures',
  'AMS 310: Survey of Probability and Statistics',
  'AMS 315: Data Analysis',
  'AP Credit: Calculus I and Calculus II',
];

const PROJECTS = [
  {
    title: 'Poker Bankroll AI',
    tech: ['Swift', 'SwiftUI', 'TypeScript', 'Cloudflare Workers', 'Gemini', 'OpenAI', 'StoreKit 2', 'iCloud'],
    description:
      'Built and shipped a production iOS app, now live on the App Store, for tracking poker sessions, bankroll performance, and hand analytics across multiple play formats. Implemented SwiftUI flows for AI-assisted logging, manual session editing, analytics dashboards, and an integrated odds calculator, and built a TypeScript Cloudflare Worker that proxies Gemini and OpenAI requests so model keys stay server-side. Added StoreKit 2 subscriptions, iCloud sync/export, and a public codebase with project specifics and implementation details.',
    liveUrl: 'https://apps.apple.com/app/id6759470443',
    liveLabel: 'iOS App Store',
    githubUrl: 'https://github.com/jakealessi/PokerTrackerIOS',
    statusLabel: 'In Progress',
    statusNote:
      "I'm currently focused on the marketing side of the app, including tighter App Store messaging, clearer positioning, and stronger communication of the AI-assisted logging value proposition.",
  },
  {
    title: 'Custom Memory Allocator',
    tech: ['C', 'Memory Management', 'Systems Programming'],
    description: (
      <>
        Implemented a dynamic memory allocator in C that provides <code>malloc</code>, <code>free</code>, and{' '}
        <code>realloc</code> using segregated and quick free lists, block splitting/coalescing, alignment
        guarantees, and heap-growth logic. Built tests and measurement tooling to validate fragmentation and
        utilization under different workloads. The project focused on low-level memory layout, pointer-safe
        systems debugging, and allocation efficiency.
      </>
    ),
  },
  {
    title: 'ThermoRoll Operations Database',
    tech: ['VBA', 'Automation', 'Database Maintenance', 'Legacy Systems'],
    description: (
      <>
        Maintained and modernized a legacy VBA database that supports day-to-day operations at{' '}
        <a href="https://thermoroll.com" target="_blank" rel="noopener noreferrer" className="copy-link">
          ThermoRoll
        </a>
        , a custom window company. Diagnosed defects, preserved uptime for core workflows, improved reliability
        without breaking backward compatibility, and reduced the code footprint by approximately 50% through
        modularization. Also recommended incremental modernization steps the business can adopt without
        disrupting operations.
      </>
    ),
  },
  {
    title: 'Stock Arbitrage Bot',
    tech: ['Python', 'Selenium', 'Automation'],
    description:
      'Built and deployed an automation pipeline for reverse-split arbitrage across 10+ brokerage portals using Selenium and broker-specific integrations. Added structured logging, defensive error handling, and failure-recovery workflows to keep multi-account execution reliable across inconsistent trading interfaces. Generated approximately $600 in annual profit per account from a $10 starting balance.',
  },
  {
    title: 'Playlister',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'JWT'],
    description:
      'Developed a full-stack playlist platform with a React frontend and an Express/Node backend that can run on either MongoDB or PostgreSQL through an abstracted data layer. Delivered end-to-end product functionality including authentication, profile editing, avatar uploads, playlist and song CRUD, search/sort/copy flows, role-based permissions, embedded YouTube playback, and transaction-based undo/redo. Rounded out the backend with systematic Postman API testing.',
  },
  {
    title: 'Categories Game',
    tech: ['React', 'Vite', 'Node.js', 'Express', 'Socket.IO', 'WebSockets'],
    description:
      'Built a real-time multiplayer categories game with synchronized state over Socket.IO and low-latency gameplay across devices. Engineered room-based lobbies, scoring logic, duplicate-answer filtering, reconnect support, and Levenshtein-based fuzzy matching so live rounds feel responsive and fair. The result is a polished multiplayer experience that handles real-time interaction cleanly from lobby to results.',
    liveUrl: 'https://categoriesgame.onrender.com',
    githubUrl: 'https://github.com/jakealessi/CategoriesGame',
  },
  {
    title: 'AcademicCalendar.com',
    tech: ['Python', 'Vanilla JS', 'Playwright', 'pdfplumber', 'ICS', 'HTTP APIs'],
    description:
      'Built a scraper pipeline that turns academic calendars published as HTML pages, full school websites, PDFs, and direct ICS feeds into normalized calendar data. Added Playwright-based extraction, pdfplumber parsing, normalization and export logic for consistent JSON and downloadable ICS files, plus QA, source-help, and ops reports for monitoring source quality across the registry. Also built registry-generation and refresh scripts that batch scrape schools, autotune weak sources, and rebuild the manifests that power AcademicCalendar.com, with the website frontend itself currently still in progress.',
    statusLabel: 'In Progress',
    statusNote:
      "I'm currently building the frontend, with the main focus on search, filtering, school detail pages, and making coverage and data quality easier to understand at a glance.",
  },
  {
    title: 'Super Bowl Box Generator',
    tech: ['JavaScript', 'HTML', 'CSS', 'Local Storage'],
    description:
      'Built a single-page browser app for managing Super Bowl squares pools entirely client-side with no backend. Implemented participant allocation, randomized board generation, payout and vig calculations, validation for consistent pool configuration, and a print-friendly final view. Persisted both configuration and generated boards in localStorage so users can leave and return without losing their setup.',
    liveUrl: 'https://jakealessi.github.io/SuperBowlBoxGenerator/',
    githubUrl: 'https://github.com/jakealessi/SuperBowlBoxGenerator',
  },
];

const ABOUT_ME_PARAGRAPHS = [
  'When I am not coding or working on school projects, I usually gravitate toward things that are strategic, competitive, or just a little off the beaten path.',
  'I keep up with pop culture through movies, books, and especially music. My vinyl collection keeps growing, and I try to listen to at least one new album every week. Right now, my favorite is Vices by Weiland.',
  'I am also very competitive, so a lot of my free time ends up around games. I play strategy games like Scrabble, Risk, chess, and poker, along with competitive games like Rocket League and Marvel Rivals. On the sports side, I mostly play pickup basketball and soccer.',
  'I also genuinely enjoy spotting edge cases in the real world, not just in software. That often shows up as reselling, noticing pricing mistakes, or taking advantage of short-lived marketplace quirks. It scratches the same itch as coding: noticing inefficiencies early and moving quickly before everyone else catches on.',
];

function BlurText({ text, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={className}>
      {text.split(' ').map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{
            display: 'inline-block',
            opacity: isVisible ? 1 : 0,
            filter: isVisible ? 'blur(0px)' : 'blur(8px)',
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${delay + index * 0.08}s`,
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

function Magnet({ children, strength = 0.15 }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    if (!ref.current) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * strength;
    const y = (event.clientY - rect.top - rect.height / 2) * strength;

    setPos({ x, y });
  };

  return (
    <span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
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

function ClickSpark({ children, sparkColor = '#3b82f6', sparkCount = 6 }) {
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);
  const timeoutIdsRef = useRef([]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIdsRef.current = [];
    };
  }, []);

  const createSpark = (event) => {
    if (!containerRef.current) {
      return;
    }

    if (event.detail === 0) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newSparks = Array.from({ length: sparkCount }, (_, index) => {
      const angle = (360 / sparkCount) * index;
      const velocity = 30 + Math.random() * 30;
      const radians = (angle * Math.PI) / 180;

      return {
        id: `${Date.now()}-${index}`,
        x,
        y,
        offsetX: `${Math.cos(radians) * velocity}px`,
        offsetY: `${Math.sin(radians) * velocity}px`,
      };
    });

    setSparks((prev) => [...prev, ...newSparks]);

    const sparkIds = new Set(newSparks.map(({ id }) => id));
    const timeoutId = window.setTimeout(() => {
      setSparks((prev) => prev.filter(({ id }) => !sparkIds.has(id)));
      timeoutIdsRef.current = timeoutIdsRef.current.filter((id) => id !== timeoutId);
    }, 500);
    timeoutIdsRef.current.push(timeoutId);
  };

  return (
    <span
      ref={containerRef}
      onClick={createSpark}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          className="click-spark"
          style={{
            left: spark.x,
            top: spark.y,
            background: sparkColor,
            boxShadow: `0 0 6px ${sparkColor}`,
            '--spark-x': spark.offsetX,
            '--spark-y': spark.offsetY,
          }}
        />
      ))}
    </span>
  );
}

function SectionHeader({ title, lead, delay = 0.02 }) {
  return (
    <div className="section-header">
      <FadeIn>
        <h2 className="section-title">{title}</h2>
      </FadeIn>
      {lead ? (
        <FadeIn delay={delay}>
          <p className="section-lead">{lead}</p>
        </FadeIn>
      ) : null}
    </div>
  );
}

function LogoLockup({ assetName, assetAlt, title, subtitle }) {
  return (
    <div className="identity-block">
      <div className="logo-badge">
        <img src={`${import.meta.env.BASE_URL}${assetName}`} alt={assetAlt} />
      </div>
      <div>
        <h3 className="card-title">{title}</h3>
        <p className="card-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

function ProjectStatusFlag({ label, note }) {
  const tooltipId = useId();

  return (
    <span className="status-flag-wrapper">
      <button type="button" className="status-flag" aria-describedby={tooltipId}>
        {label}
      </button>
      <span className="status-hint" aria-hidden="true">
        Hover for details
      </span>
      <span id={tooltipId} role="tooltip" className="status-tooltip">
        {note}
      </span>
    </span>
  );
}

function ProjectCard({ project, delay }) {
  return (
    <FadeIn delay={delay}>
      <div className="card">
        <div className="card-header">
          <div className="project-title-row">
            <h3 className="card-title">{project.title}</h3>
            {project.statusNote ? (
              <ProjectStatusFlag label={project.statusLabel || 'In Progress'} note={project.statusNote} />
            ) : null}
          </div>
        </div>
        <div className="card-content copy-stack">
          <p>{project.description}</p>
          <div className="project-tech">
            {project.tech.map((tag) => (
              <span key={tag} className="tech-tag">
                {tag}
              </span>
            ))}
          </div>
          {project.liveUrl || project.githubUrl ? (
            <div className="project-links">
              {project.liveUrl ? (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  {project.liveLabel || 'Live Demo'}
                </a>
              ) : null}
              {project.githubUrl ? (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View Code
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </FadeIn>
  );
}

function Portfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const [isDark, setIsDark] = useThemePreference();

  useEffect(() => {
    let frameId = null;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 200;
      let nextSection = SECTION_IDS[0];

      for (const id of SECTION_IDS) {
        const element = document.getElementById(id);
        if (!element) {
          continue;
        }

        if (scrollPosition >= element.offsetTop) {
          nextSection = id;
        } else {
          break;
        }
      }

      setActiveSection(nextSection);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('load', scheduleUpdate);
    };
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />

      <aside className="sidebar">
        <div className="logo">Jake Alessi</div>
        <nav className="nav">
          {NAV_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`nav-link ${activeSection === id ? 'active' : ''}`}
              onClick={() => scrollTo(id)}
              aria-current={activeSection === id ? 'true' : undefined}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <section id="about" className="hero">
          <h1 className="name">
            <BlurText text="Jake" delay={0} />
            <span>
              <BlurText text="Alessi" delay={0.15} />
            </span>
          </h1>

          <FadeIn delay={0.4}>
            <p className="tagline">
              Computer Science and Applied Mathematics double major interested in automation, arbitrage,
              edge cases, and optimizing messy processes.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="contact">
              Massapequa, NY · (516) 743-0920 ·{' '}
              <a href="mailto:jake.alessi@stonybrook.edu">jake.alessi@stonybrook.edu</a>
            </p>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="links">
              {SOCIAL_LINKS.map((link) => (
                <Magnet key={link.label}>
                  <ClickSpark sparkColor={link.sparkColor}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d={link.iconPath} />
                      </svg>
                      {link.label}
                    </a>
                  </ClickSpark>
                </Magnet>
              ))}
            </div>
          </FadeIn>
        </section>

        <section id="experience">
          <SectionHeader title="Experience" />

          {EXPERIENCE_ITEMS.map((experience, index) => (
            <FadeIn key={experience.title} delay={0.05 * (index + 1)}>
              <div className="card">
                <div className="card-header">
                  <LogoLockup
                    assetName={experience.assetName}
                    assetAlt={experience.assetAlt}
                    title={experience.title}
                    subtitle={experience.subtitle}
                  />
                  <span className="card-date">{experience.date}</span>
                </div>
                <div className="card-content">
                  <ul>
                    {experience.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          ))}
        </section>

        <section id="education">
          <SectionHeader title="Education" />

          <FadeIn delay={0.05}>
            <div className="card">
              <div className="card-header">
                <LogoLockup
                  assetName="stony-brook-logo.svg"
                  assetAlt="Stony Brook University"
                  title="Stony Brook University"
                  subtitle="B.S. Computer Science · B.S. Applied Mathematics and Statistics"
                />
                <span className="card-date">Aug 2023 – May 2027</span>
              </div>
              <div className="card-content copy-stack">
                <p>
                  <strong>GPA:</strong> 3.70/4.0
                </p>
                <p>
                  <strong>Coursework:</strong>
                </p>
                <div className="coursework-list">
                  {COURSEWORK.map((course) => (
                    <span key={course}>{course}</span>
                  ))}
                </div>
                <p>Member of the Algorithms and Computational Geometry groups.</p>
              </div>
            </div>
          </FadeIn>
        </section>

        <section id="projects">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} delay={0.05 * (index + 1)} />
          ))}
        </section>

        <section id="about-me">
          <SectionHeader title="About Me" />

          <FadeIn delay={0.05}>
            <div className="card">
              <div className="card-content copy-stack">
                {ABOUT_ME_PARAGRAPHS.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}

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
