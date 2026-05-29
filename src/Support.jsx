import { Link } from 'react-router-dom';
import { FadeIn, LightbulbToggle } from './components';
import { useThemePreference } from './theme';

export default function Support() {
  const [isDark, setIsDark] = useThemePreference();

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
      <main className="main document-main">
        <section id="support" className="hero document-page">
          <FadeIn>
            <h1 className="name document-title">
              Poker Tracker AI Support
            </h1>
            <a
              href="mailto:jake.alessi@stonybrook.edu?subject=Poker%20Tracker%20AI%20-%20Support%20Request"
              className="btn btn-primary document-button-top"
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
                <h3>Getting Started</h3>
                <p>
                  Welcome to Poker Tracker AI! This guide will help you get started tracking your poker sessions.
                </p>
                
                <h4 className="document-subheading-offset">Logging Your First Session</h4>
                <p>
                  You can log sessions in two ways:
                </p>
                <ul>
                  <li><strong>AI Chat:</strong> Type natural language like "Won $200 at 1/2 NLH" or "Lost $50 in a tournament"</li>
                  <li><strong>Manual Form:</strong> Tap the + button for the full session form with all fields</li>
                </ul>
                
                <h4 className="document-subheading-offset">Setting Your Bankroll</h4>
                <p>
                  Go to Settings → Bankroll to set your starting bankroll. Your live bankroll will automatically update as you log sessions.
                </p>
                
                <h4 className="document-subheading-offset">AI Session Logging</h4>
                <p>
                  You get 20 free AI uses to try the natural language session logging. After that, upgrade to Premium for unlimited AI uses.
                </p>
                <p>
                  You can use your own API keys (Gemini or OpenAI) in Settings for more powerful models. Your keys stay on your device and are never shared.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="card">
              <div className="card-content">
                <h3>Features</h3>
                
                <h4>Session Tracking</h4>
                <ul>
                  <li>Record wins/losses with amount, date, and game type</li>
                  <li>Track hours played for hourly rate calculation</li>
                  <li>Record stakes (e.g., $1/$2) and venue with one-tap presets</li>
                  <li>Tournament details: buy-in, cash out, position, rebuys</li>
                  <li>Add hand notes and photos to sessions</li>
                  <li>Support for Cash, Tournament, Sit & Go, Home Game, and Online</li>
                </ul>
                
                <h4>Analytics & Stats</h4>
                <ul>
                  <li>Live bankroll tracking (starting + total P/L)</li>
                  <li>Profit over time chart (Premium)</li>
                  <li>Monthly profit chart (Premium)</li>
                  <li>Win/loss breakdown donut chart (Premium)</li>
                  <li>Sessions and profit by game variant (Premium)</li>
                  <li>Key metrics: win rate, average session, best streak, hourly rate, tournament ROI</li>
                </ul>
                
                <h4>Organization</h4>
                <ul>
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
                <h3>Premium Subscription</h3>
                <p>
                  Premium unlocks unlimited AI uses and full access to all charts and analytics.
                </p>
                <ul>
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
                <h3>iCloud Sync</h3>
                <p>
                  Your data automatically syncs across all your devices when signed in with the same Apple ID. Make sure iCloud is enabled in Settings.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="card">
              <div className="card-content">
                <h3>Troubleshooting</h3>
                
                <h4>AI Not Working</h4>
                <ul>
                  <li>Check if you've used your 20 free AI uses (upgrade to Premium for unlimited)</li>
                  <li>If using your own API key, verify it's correct in Settings</li>
                  <li>Make sure you have an internet connection</li>
                </ul>
                
                <h4>iCloud Sync Issues</h4>
                <ul>
                  <li>Ensure you're signed in with the same Apple ID on all devices</li>
                  <li>Check that iCloud is enabled in iOS Settings</li>
                  <li>Wait a few moments for sync to complete</li>
                </ul>
                
                <h4>Export Issues</h4>
                <p>
                  If CSV export isn't working, make sure you have at least one session logged. The export includes all your session data.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="card">
              <div className="card-content">
                <h3>Still Need Help?</h3>
                <p>
                  Can't find what you're looking for? Email me directly and I'll get back to you as soon as possible.
                </p>
                <a
                  href="mailto:jake.alessi@stonybrook.edu?subject=Poker%20Tracker%20AI%20-%20Support%20Request"
                  className="btn btn-primary document-button-bottom"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  Email Support
                </a>
                <p className="document-back-row">
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
