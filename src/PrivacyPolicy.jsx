import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn, LightbulbToggle } from './components';

export default function PrivacyPolicy() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      <main className="main" style={{ paddingTop: '4rem', marginLeft: 0, maxWidth: '100%' }}>
        <section id="privacy-policy" className="hero">
          <FadeIn>
            <h1 className="name" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Poker Tracker AI
            </p>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="card">
              <div className="card-content">
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Last updated: February 2025
                </p>
                
                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Introduction</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Poker Tracker AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our iOS application.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Information We Collect</h3>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Session Data</h4>
                <p style={{ marginBottom: '1rem' }}>
                  The app stores your poker session data locally on your device, including:
                </p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Wins, losses, and amounts</li>
                  <li>Session dates and durations</li>
                  <li>Game types, stakes, and venues</li>
                  <li>Tournament details (buy-ins, cash outs, positions)</li>
                  <li>Hand notes and photos</li>
                  <li>Bankroll information</li>
                </ul>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>iCloud Sync</h4>
                <p style={{ marginBottom: '1rem' }}>
                  If you enable iCloud sync, your session data is stored in your personal iCloud account. This data is encrypted and managed by Apple, not by us. We do not have access to your iCloud data.
                </p>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>API Keys</h4>
                <p style={{ marginBottom: '1rem' }}>
                  If you choose to use your own API keys (Gemini or OpenAI), these are stored locally on your device only. We never transmit, store, or have access to your API keys.
                </p>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Usage Analytics</h4>
                <p style={{ marginBottom: '1rem' }}>
                  We do not collect analytics, usage data, or personally identifiable information. The app operates entirely offline except when you use AI features (which require internet connectivity).
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>How We Use Your Information</h3>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>To provide the core functionality of tracking your poker sessions</li>
                  <li>To calculate statistics, charts, and analytics</li>
                  <li>To sync your data across devices via iCloud (if enabled)</li>
                  <li>To process AI session logging requests (when you use AI features)</li>
                </ul>
                <p style={{ marginBottom: '1rem' }}>
                  We do not sell, rent, or share your data with third parties except as necessary to provide AI functionality (when you use your own API keys, requests go directly to the API provider).
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Data Storage and Security</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Your session data is stored locally on your device using Core Data. If you enable iCloud sync, data is also stored in your personal iCloud account, which is encrypted by Apple.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Third-Party Services</h3>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>AI Services</h4>
                <p style={{ marginBottom: '1rem' }}>
                  When you use AI session logging, requests are sent to either:
                </p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li><strong>Google Gemini API</strong> – If you use your own API key, requests go directly to Google. See Google's Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>policies.google.com/privacy</a></li>
                  <li><strong>OpenAI API</strong> – If you use your own API key, requests go directly to OpenAI. See OpenAI's Privacy Policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>openai.com/privacy</a></li>
                </ul>
                <p style={{ marginBottom: '1rem' }}>
                  We do not store or log your AI requests. If you use the free tier (20 uses), we use our own API keys, but your session data is not shared with these services.
                </p>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Apple Services</h4>
                <p style={{ marginBottom: '1rem' }}>
                  The app uses Apple's iCloud service for data synchronization. Your use of iCloud is subject to Apple's Privacy Policy: <a href="https://www.apple.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>apple.com/privacy</a>
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Your Rights</h3>
                <p style={{ marginBottom: '1rem' }}>
                  You have the right to:
                </p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Access your data (export to CSV from within the app)</li>
                  <li>Delete your data (delete individual sessions or uninstall the app)</li>
                  <li>Disable iCloud sync at any time</li>
                  <li>Revoke API key access by removing keys from Settings</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Children's Privacy</h3>
                <p style={{ marginBottom: '1rem' }}>
                  The app is not intended for users under the age of 18. We do not knowingly collect information from children.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Changes to This Policy</h3>
                <p style={{ marginBottom: '1rem' }}>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Contact Us</h3>
                <p style={{ marginBottom: '1rem' }}>
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <a href="mailto:jake.alessi@stonybrook.edu" style={{ color: 'var(--accent)' }}>jake.alessi@stonybrook.edu</a>
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <Link to="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>← Back to Portfolio</Link>
                </p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
