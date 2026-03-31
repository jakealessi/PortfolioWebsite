import { Link } from 'react-router-dom';
import { FadeIn, LightbulbToggle } from './components';
import { useThemePreference } from './theme';

export default function Support() {
  const [isDark, setIsDark] = useThemePreference();

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
      <main className="main" style={{ paddingTop: '4rem', marginLeft: 0, maxWidth: '100%' }}>
        <section id="support" className="hero">
          <FadeIn>
            <h1 className="name" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              Poker Tracker AI Support
            </h1>
            <a
              href="mailto:jake.alessi@stonybrook.edu?subject=Poker%20Tracker%20AI%20-%20Support%20Request"
              className="btn btn-primary"
              style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              Email Support
            </a>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Getting Started</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Welcome to Poker Tracker AI! This guide will help you get started tracking your poker sessions.
                </p>
                
                <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Logging Your First Session</h4>
                <p style={{ marginBottom: '1rem' }}>
                  You can log sessions in two ways:
                </p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li><strong>AI Chat:</strong> Type natural language like "Won $200 at 1/2 NLH" or "Lost $50 in a tournament"</li>
                  <li><strong>Manual Form:</strong> Tap the + button for the full session form with all fields</li>
                </ul>
                
                <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Setting Your Bankroll</h4>
                <p style={{ marginBottom: '1rem' }}>
                  Go to Settings → Bankroll to set your starting bankroll. Your live bankroll will automatically update as you log sessions.
                </p>
                
                <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>AI Session Logging</h4>
                <p style={{ marginBottom: '1rem' }}>
                  You get 20 free AI uses to try the natural language session logging. After that, upgrade to Premium for unlimited AI uses.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  You can use your own API keys (Gemini or OpenAI) in Settings for more powerful models. Your keys stay on your device and are never shared.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Features</h3>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Session Tracking</h4>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Record wins/losses with amount, date, and game type</li>
                  <li>Track hours played for hourly rate calculation</li>
                  <li>Record stakes (e.g., $1/$2) and venue with one-tap presets</li>
                  <li>Tournament details: buy-in, cash out, position, rebuys</li>
                  <li>Add hand notes and photos to sessions</li>
                  <li>Support for Cash, Tournament, Sit & Go, Home Game, and Online</li>
                </ul>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Analytics & Stats</h4>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Live bankroll tracking (starting + total P/L)</li>
                  <li>Profit over time chart (Premium)</li>
                  <li>Monthly profit chart (Premium)</li>
                  <li>Win/loss breakdown donut chart (Premium)</li>
                  <li>Sessions and profit by game variant (Premium)</li>
                  <li>Key metrics: win rate, average session, best streak, hourly rate, tournament ROI</li>
                </ul>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Organization</h4>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Search sessions by notes, venue, stakes, or variant</li>
                  <li>Filter by game type and date range</li>
                  <li>Calendar view with daily profit</li>
                  <li>Swipe to edit or delete sessions</li>
                  <li>Share session summaries</li>
                  <li>Export to CSV for backup or analysis</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Premium Subscription</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Premium unlocks unlimited AI uses and full access to all charts and analytics.
                </p>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li><strong>Unlimited AI uses</strong> – No cap on AI session crafting</li>
                  <li><strong>All charts</strong> – Full access to stats and analytics</li>
                  <li><strong>$2.99/month</strong> – 1 month free trial</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>iCloud Sync</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Your data automatically syncs across all your devices when signed in with the same Apple ID. Make sure iCloud is enabled in Settings.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Troubleshooting</h3>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>AI Not Working</h4>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Check if you've used your 20 free AI uses (upgrade to Premium for unlimited)</li>
                  <li>If using your own API key, verify it's correct in Settings</li>
                  <li>Make sure you have an internet connection</li>
                </ul>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>iCloud Sync Issues</h4>
                <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                  <li>Ensure you're signed in with the same Apple ID on all devices</li>
                  <li>Check that iCloud is enabled in iOS Settings</li>
                  <li>Wait a few moments for sync to complete</li>
                </ul>
                
                <h4 style={{ marginTop: '1rem', marginBottom: '0.75rem', fontSize: '1rem', fontWeight: 600 }}>Export Issues</h4>
                <p style={{ marginBottom: '1rem' }}>
                  If CSV export isn't working, make sure you have at least one session logged. The export includes all your session data.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="card">
              <div className="card-content">
                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 600 }}>Still Need Help?</h3>
                <p style={{ marginBottom: '1rem' }}>
                  Can't find what you're looking for? Email me directly and I'll get back to you as soon as possible.
                </p>
                <a
                  href="mailto:jake.alessi@stonybrook.edu?subject=Poker%20Tracker%20AI%20-%20Support%20Request"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email Support
                </a>
                <p style={{ marginBottom: '0', marginTop: '1rem' }}>
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
