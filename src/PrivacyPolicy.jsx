import { Link } from 'react-router-dom';
import { FadeIn, LightbulbToggle } from './components';
import { useThemePreference } from './theme';

export default function PrivacyPolicy() {
  const [isDark, setIsDark] = useThemePreference();

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
      <main className="main document-main">
        <section id="privacy-policy" className="hero document-page">
          <FadeIn>
            <h1 className="name document-title">
              Privacy Policy
            </h1>
            <p className="document-subtitle">
              Poker Tracker AI
            </p>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="card">
              <div className="card-content">
                <p className="document-updated">
                  Last updated: February 2025
                </p>
                
                <h3 className="document-heading-offset">Introduction</h3>
                <p>
                  Poker Tracker AI ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our iOS application.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="card">
              <div className="card-content">
                <h3>Information We Collect</h3>
                
                <h4>Session Data</h4>
                <p>
                  The app stores your poker session data locally on your device, including:
                </p>
                <ul>
                  <li>Wins, losses, and amounts</li>
                  <li>Session dates and durations</li>
                  <li>Game types, stakes, and venues</li>
                  <li>Tournament details (buy-ins, cash outs, positions)</li>
                  <li>Hand notes and photos</li>
                  <li>Bankroll information</li>
                </ul>
                
                <h4>iCloud Sync</h4>
                <p>
                  If you enable iCloud sync, your session data is stored in your personal iCloud account. This data is encrypted and managed by Apple, not by us. We do not have access to your iCloud data.
                </p>
                
                <h4>API Keys</h4>
                <p>
                  If you choose to use your own API keys (Gemini or OpenAI), these are stored locally on your device only. We never transmit, store, or have access to your API keys.
                </p>
                
                <h4>Usage Analytics</h4>
                <p>
                  We do not collect analytics, usage data, or personally identifiable information. The app operates entirely offline except when you use AI features (which require internet connectivity).
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="card">
              <div className="card-content">
                <h3>How We Use Your Information</h3>
                <ul>
                  <li>To provide the core functionality of tracking your poker sessions</li>
                  <li>To calculate statistics, charts, and analytics</li>
                  <li>To sync your data across devices via iCloud (if enabled)</li>
                  <li>To process AI session logging requests (when you use AI features)</li>
                </ul>
                <p>
                  We do not sell, rent, or share your data with third parties except as necessary to provide AI functionality (when you use your own API keys, requests go directly to the API provider).
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="card">
              <div className="card-content">
                <h3>Data Storage and Security</h3>
                <p>
                  Your session data is stored locally on your device using Core Data. If you enable iCloud sync, data is also stored in your personal iCloud account, which is encrypted by Apple.
                </p>
                <p>
                  We implement industry-standard security measures to protect your data. However, no method of transmission or storage is 100% secure.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="card">
              <div className="card-content">
                <h3>Third-Party Services</h3>
                
                <h4>AI Services</h4>
                <p>
                  When you use AI session logging, requests are sent to either:
                </p>
                <ul>
                  <li><strong>Google Gemini API</strong> – If you use your own API key, requests go directly to Google. See Google's Privacy Policy: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="document-link">policies.google.com/privacy</a></li>
                  <li><strong>OpenAI API</strong> – If you use your own API key, requests go directly to OpenAI. See OpenAI's Privacy Policy: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="document-link">openai.com/privacy</a></li>
                </ul>
                <p>
                  We do not store or log your AI requests. If you use the free tier (20 uses), we use our own API keys, but your session data is not shared with these services.
                </p>
                
                <h4>Apple Services</h4>
                <p>
                  The app uses Apple's iCloud service for data synchronization. Your use of iCloud is subject to Apple's Privacy Policy: <a href="https://www.apple.com/privacy" target="_blank" rel="noopener noreferrer" className="document-link">apple.com/privacy</a>
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="card">
              <div className="card-content">
                <h3>Your Rights</h3>
                <p>
                  You have the right to:
                </p>
                <ul>
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
                <h3>Children's Privacy</h3>
                <p>
                  The app is not intended for users under the age of 18. We do not knowingly collect information from children.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="card">
              <div className="card-content">
                <h3>Changes to This Policy</h3>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="card">
              <div className="card-content">
                <h3>Contact Us</h3>
                <p>
                  If you have questions about this Privacy Policy, please contact us at:
                </p>
                <p>
                  <a href="mailto:jake.alessi@stonybrook.edu" className="document-link">jake.alessi@stonybrook.edu</a>
                </p>
                <p>
                  <Link to="/" className="document-link">← Back to Portfolio</Link>
                </p>
              </div>
            </div>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}
