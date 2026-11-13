import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemePreference } from './theme';
import archivedActivity from './polymarket-archived-activity.json';
import './polymarket.css';

const FEED = import.meta.env.VITE_POLYMARKET_FEED_URL
  || 'https://polymarket-paper-feed.jake-alessi.chatgpt.site/v1/snapshot';
const POLL_MS = 5000;
const STALE_AFTER = 25;
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const signedMoney = new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD', signDisplay: 'exceptZero',
});
const date = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
});
const shortTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const updateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit',
});

const tradeLabels = {
  bid: 'Bid resting', held: 'Held', ask: 'Sell resting',
  awaiting: 'Awaiting settlement', sold: 'Sold', settled: 'Settled', expired: 'Bid expired',
  canceled: 'Other side filled',
};
const isClosed = (trade) => ['sold', 'settled'].includes(trade.state);
const clock = (seconds) => {
  const left = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
};
const cents = (price) => price == null ? '—' : `${Number((price * 100).toFixed(2))}¢`;
const dateTime = (seconds) => date.format(new Date(seconds * 1000));
const tone = (value) => value > 0 ? 'positive' : value < 0 ? 'negative' : '';
const archivedPnl = archivedActivity.trades.reduce((sum, trade) => sum + trade.pnl, 0);
const archivedSales = archivedActivity.trades.filter((trade) => trade.state === 'sold').length;
const archivedWins = archivedActivity.trades.filter((trade) => trade.pnl > 0).length;
const archivedTimeline = [{ time: archivedActivity.trades.at(-1).start, pnl: 0 }];
for (const trade of [...archivedActivity.trades].sort((a, b) => a.closedAt - b.closedAt)) {
  archivedTimeline.push({ time: trade.closedAt, pnl: archivedTimeline.at(-1).pnl + trade.pnl });
}

function strategyHistory(snapshot) {
  const live = snapshot?.metrics;
  const history = [
    ...archivedTimeline,
    ...(snapshot?.history ?? []).map(({ time, pnl }) => ({ time, pnl: archivedPnl + pnl })),
  ];
  const trades = new Map(archivedActivity.trades.map((trade) => [`${trade.slug}-${trade.side}`, trade]));
  for (const trade of [...(snapshot?.closedTrades ?? []), ...(snapshot?.trades ?? [])]) {
    trades.set(`${trade.slug}-${trade.side}`, trade);
  }
  return {
    history,
    publishedAt: Math.max(snapshot?.publishedAt ?? 0, history.at(-1).time),
    trades: [...trades.values()].sort((a, b) => b.start - a.start),
    realizedPnl: archivedPnl + (live?.realizedPnl ?? 0),
    closedTrades: archivedActivity.trades.length + (live?.closedTrades ?? 0),
    winningTrades: archivedWins + (live?.winningTrades ?? 0),
    available: live ? archivedPnl + live.available : null,
  };
}

function useFeed() {
  const [feed, setFeed] = useState({ snapshot: null, state: 'loading' });
  useEffect(() => {
    let active = true;
    let timer;
    let request;
    async function read() {
      request = new AbortController();
      const timeout = setTimeout(() => request.abort(), 7000);
      try {
        const response = await fetch(FEED, { cache: 'no-store', signal: request.signal });
        if (!response.ok) throw new Error(`Feed returned ${response.status}`);
        const snapshot = response.status === 204 ? null : await response.json();
        if (snapshot && (snapshot.version !== 1 || !Number.isFinite(snapshot.publishedAt)
          || !snapshot.metrics || !Array.isArray(snapshot.history) || !Array.isArray(snapshot.trades))) {
          throw new Error('Unsupported snapshot');
        }
        if (active) setFeed({ snapshot, state: snapshot ? 'received' : 'empty' });
      } catch {
        if (active) setFeed((previous) => ({ ...previous, state: 'unreachable' }));
      } finally {
        clearTimeout(timeout);
        if (active) timer = setTimeout(read, POLL_MS);
      }
    }
    read();
    return () => {
      active = false;
      request?.abort();
      clearTimeout(timer);
    };
  }, []);
  return feed;
}

function pnlPoints(history, range, publishedAt) {
  if (!history.length) return [];
  const firstTime = history[0].time;
  const cutoff = range === '24h' ? Math.max(firstTime, publishedAt - 86400) : firstTime;
  const prior = history.filter((point) => point.time < cutoff).at(-1);
  const base = prior?.pnl ?? history[0].pnl;
  const points = history.filter((point) => point.time >= cutoff)
    .map(({ time, pnl }) => ({ time, pnl: range === '24h' ? pnl - base : pnl }));
  if (!points.length || points[0].time > cutoff) {
    points.unshift({ time: cutoff, pnl: range === '24h' ? 0 : base });
  }
  const end = points.at(-1);
  if (publishedAt > end.time) points.push({ ...end, time: publishedAt });
  return points;
}

function PnlChart({ strategy, isDark }) {
  const [range, setRange] = useState('all');
  const canvas = useRef(null);
  const points = useMemo(
    () => pnlPoints(strategy.history, range, strategy.publishedAt),
    [strategy, range],
  );
  const meaningful = points.length > 1;
  useEffect(() => {
    const node = canvas.current;
    if (!node || !meaningful) return;

    function draw() {
      const width = node.clientWidth;
      const height = node.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      node.width = width * ratio;
      node.height = height * ratio;
      const context = node.getContext('2d');
      context.scale(ratio, ratio);

      const palette = getComputedStyle(node);
      const border = palette.getPropertyValue('--border');
      const secondary = palette.getPropertyValue('--text-secondary');
      const profit = palette.getPropertyValue('--pm-up').trim();
      const loss = palette.getPropertyValue('--pm-down').trim();
      const left = width < 430 ? 53 : 65;
      const right = width - 12;
      const top = 16;
      const bottom = height - 30;
      const values = points.map(({ pnl }) => pnl);
      const max = Math.max(0, ...values);
      const min = Math.min(0, ...values);
      const padding = Math.max((max - min) * 0.18, 0.1);
      const upper = max + padding;
      const lower = min - padding;
      const begin = points[0].time;
      const duration = Math.max(points.at(-1).time - begin, 1);
      const x = (time) => left + (time - begin) / duration * (right - left);
      const y = (value) => top + (upper - value) / (upper - lower) * (bottom - top);

      context.font = '11px Instrument Sans, sans-serif';
      context.textBaseline = 'middle';
      for (const level of [upper, (upper + lower) / 2, lower]) {
        const row = y(level);
        context.beginPath();
        context.strokeStyle = border;
        context.moveTo(left, row);
        context.lineTo(right, row);
        context.stroke();
        context.fillStyle = secondary;
        context.fillText(money.format(level), 0, row);
      }
      context.beginPath();
      context.strokeStyle = secondary;
      context.globalAlpha = 0.4;
      context.setLineDash([3, 5]);
      context.moveTo(left, y(0));
      context.lineTo(right, y(0));
      context.stroke();
      context.setLineDash([]);
      context.globalAlpha = 1;

      const last = points.at(-1);
      const color = last.pnl >= 0 ? profit : loss;
      const line = new Path2D();
      line.moveTo(x(begin), y(points[0].pnl));
      for (let index = 1; index < points.length; index += 1) {
        const point = points[index];
        line.lineTo(x(point.time), y(points[index - 1].pnl));
        line.lineTo(x(point.time), y(point.pnl));
      }
      const fill = new Path2D(line);
      fill.lineTo(x(last.time), bottom);
      fill.lineTo(x(begin), bottom);
      fill.closePath();
      const gradient = context.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, `${color}35`);
      gradient.addColorStop(1, `${color}03`);
      context.fillStyle = gradient;
      context.fill(fill);
      context.lineWidth = 2;
      context.strokeStyle = color;
      context.stroke(line);
      context.beginPath();
      context.arc(x(last.time), y(last.pnl), 3, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();

      const format = duration > 86400 ? dateTime : (time) => shortTime.format(new Date(time * 1000));
      context.fillStyle = secondary;
      context.fillText(format(begin), left, height - 9);
      context.textAlign = 'right';
      context.fillText(format(last.time), right, height - 9);
    }
    const observer = new ResizeObserver(draw);
    observer.observe(node);
    draw();
    return () => observer.disconnect();
  }, [points, isDark, meaningful]);

  return (
    <section className="pm-panel pm-performance" aria-labelledby="pm-performance-title">
      <div className="pm-panel-heading">
        <div>
          <h2 id="pm-performance-title">30¢ strategy P&amp;L</h2>
          <p>Historical estimates and recorded paper trades</p>
        </div>
        <div className="pm-tabs" aria-label="Chart period">
          {[['24h', '24H'], ['all', 'All']].map(([value, label]) => (
            <button type="button" key={value} onClick={() => setRange(value)}
              aria-pressed={range === value}>{label}</button>
          ))}
        </div>
      </div>
      {meaningful ? (
        <canvas ref={canvas} className="pm-chart" role="img"
          aria-label={`30¢ strategy profit and loss for ${range === '24h' ? 'the last 24 hours' : 'all time'} ends at ${signedMoney.format(points.at(-1).pnl)}.`} />
      ) : (
        <div className="pm-chart pm-chart-empty">
          <p>No P&L points in this period.</p>
        </div>
      )}
    </section>
  );
}

function CurrentMarket({ market, now, fresh }) {
  const left = market ? market.end - now : 0;
  const entryOpen = fresh && market?.accepting && now <= market.entryDeadline && left > 0;
  const state = !market ? 'Waiting for a market' : left <= 0 ? 'Window ended'
    : !fresh ? 'Last observed window' : entryOpen ? 'Entry open' : 'Entry closed';
  return (
    <section className="pm-panel pm-market" aria-labelledby="pm-market-title">
      <div className="pm-panel-heading">
        <div>
          <h2 id="pm-market-title">Current window</h2>
          <p>{market ? dateTime(market.start) : 'BTC Up / Down'}</p>
        </div>
        {market && (
          <a className="pm-outbound" href={`https://polymarket.com/event/${encodeURIComponent(market.slug)}`}
            target="_blank" rel="noreferrer" aria-label="Open current market on Polymarket">↗</a>
        )}
      </div>
      <div className="pm-market-timer">
        <strong>{market ? clock(left) : '—:—'}</strong>
        <span className={entryOpen ? 'positive' : ''}>{state}</span>
      </div>
      <div className="pm-timeline" aria-hidden="true">
        <span className="pm-timeline-entry" />
        <span className="pm-timeline-marker" style={{ left: `${market ? Math.min(100, Math.max(0, (now - market.start) / (market.end - market.start) * 100)) : 0}%` }} />
      </div>
      <div className="pm-timeline-labels"><span>Open</span><span>3:45 cutoff</span><span>Close</span></div>
      <div className="pm-quotes">
        {['Up', 'Down'].map((side) => {
          const quote = market?.books?.[side];
          return (
            <div key={side} className="pm-quote">
              <span className={side === 'Up' ? 'positive' : 'negative'}>{side}</span>
              <strong>{cents(quote?.bid)} <span>/</span> {cents(quote?.ask)}</strong>
              <small>Bid / ask</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function TradeActivity({ trades }) {
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);
  const visible = trades.filter((trade) => {
    if (filter === 'pre-reset') return Boolean(trade.source);
    if (filter === 'closed') return isClosed(trade);
    if (filter === 'open') return ['bid', 'held', 'ask', 'awaiting'].includes(trade.state);
    return true;
  });
  const rows = expanded ? visible : visible.slice(0, 16);
  return (
    <section className="pm-panel pm-activity" aria-labelledby="pm-activity-title">
      <div className="pm-panel-heading">
        <div>
          <h2 id="pm-activity-title">Trade activity</h2>
          <p>30¢ backtest and recorded paper trades</p>
        </div>
        <div className="pm-tabs" aria-label="Filter activity">
          {[['all', 'All'], ['open', 'Open'], ['closed', 'Closed'], ['pre-reset', 'Pre-reset']].map(([value, label]) => (
            <button key={value} type="button" onClick={() => {
              setFilter(value);
              setExpanded(value === 'pre-reset');
            }}
              aria-pressed={filter === value}>{label}</button>
          ))}
        </div>
      </div>
      <details className="pm-activity-method">
        <summary>Pre-reset at 30¢ · {archivedSales} of {archivedActivity.trades.length} sold · {signedMoney.format(archivedPnl)}</summary>
        <p>
          The archive covers {archivedActivity.windows} quoted windows, including{' '}
          {archivedActivity.windows - archivedActivity.trades.length} without a filled entry.
          The backtest uses recorded entries and counts a 30¢ sale if a buy of at least five
          shares printed above 30¢ on that side after entry and before close. Public trades cannot confirm a
          maker fill. The archived 30¢ sale came from the paper ledger.{' '}
          <a href="https://docs.polymarket.com/api-reference/feeds/list-trades" target="_blank" rel="noreferrer">
            Polymarket trade feed ↗
          </a>
        </p>
      </details>
      {visible.length ? (
        <div className="pm-table-scroll">
          <table aria-label="30¢ strategy trading activity">
            <thead><tr>
              <th scope="col">Market window</th><th scope="col">Side</th><th scope="col">Shares</th>
              <th scope="col">Entry</th><th scope="col">Exit / payout</th><th scope="col">Status</th><th scope="col">P&amp;L</th>
            </tr></thead>
            <tbody>{rows.map((trade) => (
              <tr key={`${trade.source ?? 'current'}-${trade.slug}-${trade.side}`}>
                <td><a href={`https://polymarket.com/event/${encodeURIComponent(trade.slug)}`}
                  target="_blank" rel="noreferrer">{dateTime(trade.start)} <span aria-hidden="true">↗</span></a></td>
                <td className={trade.side === 'Up' ? 'positive' : 'negative'}>{trade.side}</td>
                <td>{trade.shares}</td><td>{cents(trade.entry)}</td>
                <td>
                  {trade.state === 'settled' ? <>{cents(trade.settlement)} <small>payout</small></>
                    : trade.state === 'sold' ? <>{cents(trade.exit)} <small>sale</small></>
                      : trade.state === 'ask' ? <>{cents(trade.exit)} <small>ask</small></> : '—'}
                </td>
                <td>
                  <span className="pm-trade-state">
                    {trade.source === 'backtest'
                      ? (trade.state === 'sold' ? 'Estimated sale' : 'Held to settlement')
                      : tradeLabels[trade.state]}
                  </span>
                  {trade.source && <small className="pm-unfilled">
                    {trade.source === 'backtest' ? 'Backtest' : 'Pre-reset paper run'}
                  </small>}
                  {trade.state === 'settled' && trade.exit != null && trade.source !== 'backtest' && (
                    <small className="pm-unfilled">{cents(trade.exit)} sell unfilled</small>
                  )}
                </td>
                <td className={tone(trade.pnl)}>{trade.pnl == null ? '—' : signedMoney.format(trade.pnl)}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="pm-activity-empty">No orders match this filter.</div>
      )}
      {visible.length > 16 && (
        <button className="pm-theme pm-activity-more" type="button" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show fewer rows' : `Show all ${visible.length} rows`}
        </button>
      )}
    </section>
  );
}

export default function Polymarket() {
  const [isDark, setIsDark] = useThemePreference();
  const { snapshot, state } = useFeed();
  const strategy = useMemo(() => strategyHistory(snapshot), [snapshot]);
  const [now, setNow] = useState(() => Date.now() / 1000);
  useEffect(() => {
    const previous = document.title;
    document.title = 'Polymarket Paper Trader · Jake Alessi';
    const timer = setInterval(() => setNow(Date.now() / 1000), 1000);
    return () => {
      clearInterval(timer);
      document.title = previous;
    };
  }, []);

  const fresh = snapshot && state === 'received' && now - snapshot.publishedAt <= STALE_AFTER;
  const statuses = { running: 'Bot running', waiting: 'Waiting for market', degraded: 'Market feed delayed', stopped: 'Bot stopped' };
  const sample = import.meta.env.DEV && snapshot?.sample === true;
  const status = sample ? 'Sample data' : state === 'loading' ? 'Connecting'
    : state === 'unreachable' ? 'Feed unavailable' : !snapshot ? 'Awaiting bot'
    : snapshot.status === 'stopped' ? 'Bot stopped' : !fresh ? 'Feed stale' : statuses[snapshot.status];
  const running = fresh && snapshot.status === 'running';
  const metrics = snapshot?.metrics;

  return (
    <main className="pm-page">
      <nav className="pm-nav" aria-label="Page navigation">
        <Link to="/">← Jake Alessi</Link>
        <button type="button" className="pm-theme" onClick={() => setIsDark(!isDark)}>
          {isDark ? 'Light mode' : 'Dark mode'}
        </button>
      </nav>
      <header className="pm-hero">
        <div>
          <p className="pm-mode"><span aria-hidden="true">₿</span> Polymarket · Paper trading</p>
          <h1>Bitcoin paper trader</h1>
          <p className="pm-lead">BTC Up / Down · Five-minute markets</p>
        </div>
        <div className="pm-feed-status">
          <span className={running && !sample ? 'pm-status pm-status-live' : 'pm-status'} role="status">
            <i aria-hidden="true" />{status}
          </span>
          {snapshot && <p>Updated {updateTime.format(new Date(snapshot.publishedAt * 1000))}</p>}
        </div>
      </header>

      <div className="pm-rule-strip" aria-label="Strategy">
        <span>Opening bids <strong>20¢ Up / Down</strong></span>
        <span>Entry cutoff <strong>3:45 left</strong></span>
        <span>Maker exit <strong>30¢</strong></span>
      </div>

      <section className="pm-metrics" aria-label="Paper trading metrics">
        <div className="pm-metric"><span>30¢ strategy P&amp;L</span>
          <strong className={tone(strategy.realizedPnl)}>{signedMoney.format(strategy.realizedPnl)}</strong>
          <small>{metrics ? 'Backtest and recorded results' : 'Pre-reset results · Awaiting feed'}</small></div>
        <div className="pm-metric"><span>Modeled available cash</span>
          <strong>{strategy.available === null ? '—' : money.format(strategy.available)}</strong>
          <small>{metrics ? `Current ledger ${money.format(metrics.available)} available` : 'Awaiting paper ledger'}</small></div>
        <div className="pm-metric"><span>Open positions</span>
          <strong>{metrics?.openPositions ?? '—'}</strong>
          <small>{metrics ? `${metrics.restingBids} resting ${metrics.restingBids === 1 ? 'bid' : 'bids'}` : 'Including unsettled positions'}</small></div>
        <div className="pm-metric"><span>Closed trades</span>
          <strong>{strategy.closedTrades}</strong>
          <small>{strategy.winningTrades} profitable · {Math.round(strategy.winningTrades / strategy.closedTrades * 100)}%</small></div>
      </section>

      <div className="pm-overview">
        <PnlChart strategy={strategy} isDark={isDark} />
        <CurrentMarket market={snapshot?.market} now={now} fresh={running} />
      </div>
      <TradeActivity trades={strategy.trades} />
      <p className="pm-footnote">Paper fills require enough displayed size through the order price. Market quotes and settlement payouts come from Polymarket.</p>
    </main>
  );
}
