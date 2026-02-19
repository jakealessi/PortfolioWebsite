import { useState, useEffect, useRef } from 'react';

// Simple fade in on scroll
export function FadeIn({ children, delay = 0 }) {
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

// Lightbulb theme toggle
export function LightbulbToggle({ isDark, onToggle }) {
  const [isPulling, setIsPulling] = useState(false);
  const [bulbOn, setBulbOn] = useState(!isDark);
  const bulbRef = useRef(null);

  const handleClick = () => {
    setIsPulling(true);

    const turningOn = !bulbOn;
    setBulbOn(turningOn);

    const bulbEl = bulbRef.current;
    const rect = bulbEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const maxDist = Math.sqrt(
      Math.max(cx, window.innerWidth - cx) ** 2 +
      Math.max(cy, window.innerHeight - cy) ** 2
    );

    const overlay = document.createElement('div');
    overlay.className = 'theme-reveal-overlay';
    overlay.style.setProperty('--reveal-cx', `${cx}px`);
    overlay.style.setProperty('--reveal-cy', `${cy}px`);
    overlay.style.setProperty('--reveal-radius', `${maxDist}px`);
    overlay.style.background = turningOn ? '#fafafa' : '#0a0a0a';
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add('expanding');
    });

    setTimeout(() => {
      onToggle();
      overlay.remove();
    }, 300);

    setTimeout(() => {
      setIsPulling(false);
    }, 500);
  };

  const bulbColor = bulbOn ? '#f5b820' : '#d1d5db';
  const filamentColor = bulbOn ? '#78350f' : '#374151';

  return (
    <div className="lightbulb-toggle" onClick={handleClick} title={isDark ? "Turn on the light" : "Turn off the light"}>
      <svg ref={bulbRef} className={`bulb-svg ${bulbOn ? 'on' : ''}`} viewBox="0 0 60 90" width="50" height="75">
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
        <line x1="30" y1="0" x2="30" y2="14" stroke="#9ca3af" strokeWidth="2"/>
        <path
          d="M 18 14 Q 18 11, 22 11 L 38 11 Q 42 11, 42 14 L 42 18 Q 42 22, 40 24 L 20 24 Q 18 22, 18 18 Z"
          fill="#9ca3af"
        />
        <rect x="19" y="24" width="22" height="2" rx="1" fill="#6b7280"/>
        <path
          d="M 20 26 C 20 31, 18 36, 14 42 C 9 50, 7 57, 9 64 C 11 72, 18 79, 30 79 C 42 79, 49 72, 51 64 C 53 57, 51 50, 46 42 C 42 36, 40 31, 40 26 Z"
          fill={bulbColor}
          filter={bulbOn ? "url(#glow)" : "none"}
        />
        <path d="M 26 28 C 25 40, 23 50, 30 63" stroke={filamentColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
        <path d="M 34 28 C 35 40, 37 50, 30 63" stroke={filamentColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
      <div className={`ball-chain ${isPulling ? 'pulling' : ''}`}>
        {[...Array(10)].map((_, i) => (
          <div key={i} className="chain-ball" />
        ))}
        <div className="chain-pull" />
      </div>
    </div>
  );
}
