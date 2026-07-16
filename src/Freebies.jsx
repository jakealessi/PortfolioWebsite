import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FadeIn, LightbulbToggle } from './components';
import { useThemePreference } from './theme';

/**
 * Public, read-only browser for the Shopify freebie catalog produced by the
 * FreebiesBot scanner.
 *
 * Two data modes, chosen at build time:
 *   - If VITE_FREEBIES_API_BASE is set, it queries that read API with
 *     server-side search + pagination (for large catalogs).
 *   - Otherwise it fetches a static `freebies.json` from the site root and
 *     searches client-side (for small catalogs).
 */

const PAGE_SIZE = 60;
const API_BASE = String(import.meta.env.VITE_FREEBIES_API_BASE || '').replace(/\/+$/, '');
const STATIC_URL = `${import.meta.env.BASE_URL}freebies.json`;

function safeHttpUrl(value) {
  try {
    const url = new URL(String(value || ''));
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function itemTitle(item) {
  const variant = String(item.variantTitle || '').trim();
  const title = String(item.productTitle || '').trim();

  if (!variant || /^default title$/i.test(variant)) {
    return title || 'Untitled product';
  }

  return `${title} - ${variant}`;
}

function searchBlob(item) {
  return [item.store, item.productTitle, item.variantTitle, item.promoSignal]
    .join(' ')
    .toLowerCase();
}

/** Comma-separated clauses are OR'd; within a clause, space-separated tokens are AND'd. */
function matchesQuery(blob, query) {
  const clauses = String(query || '')
    .toLowerCase()
    .split(',')
    .map((clause) => clause.trim())
    .filter(Boolean);

  if (clauses.length === 0) {
    return true;
  }

  return clauses.some((clause) =>
    clause.split(/\s+/).filter(Boolean).every((token) => blob.includes(token))
  );
}

/** Rewrite the `variantId:qty` portion of a Shopify cart URL to the chosen quantity. */
function quantityUrl(cartUrl, variantId, quantity) {
  const cleanQuantity = Math.max(1, Math.min(999, Math.floor(Number(quantity) || 1)));
  const id = String(variantId || '').trim();

  try {
    const url = new URL(cartUrl);

    if (id) {
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(${escaped}:)\\d+`);

      if (pattern.test(url.pathname)) {
        url.pathname = url.pathname.replace(pattern, `$1${cleanQuantity}`);
        return url.toString();
      }
    }

    url.pathname = url.pathname.replace(/(:)\d+(?=,|$)/, `$1${cleanQuantity}`);
    return url.toString();
  } catch {
    return String(cartUrl || '');
  }
}

function formatDate(value) {
  if (!value) {
    return 'unknown';
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'unknown'
    : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function FreebieCard({ item }) {
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const claimUrl = safeHttpUrl(quantityUrl(item.cartUrl, item.variantId, quantity));
  const productUrl = safeHttpUrl(item.productUrl);

  async function copyClaim() {
    try {
      await navigator.clipboard.writeText(claimUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 900);
    } catch {
      /* clipboard may be blocked; ignore */
    }
  }

  return (
    <li className="freebie-card">
      <h3 className="freebie-title" title={itemTitle(item)}>{itemTitle(item)}</h3>
      <p className="freebie-meta">{item.store} · {item.price || 'free'}</p>

      <div className="freebie-tags">
        <span className="freebie-tag">Score {item.qualityScore}</span>
        <span className="freebie-tag">Seen {formatDate(item.lastSeenAt)}</span>
        {item.promoSignal ? <span className="freebie-tag">{item.promoSignal}</span> : null}
        {(item.cautionIndicators || []).map((caution) => (
          <span className="freebie-tag freebie-tag-caution" key={caution}>{caution}</span>
        ))}
      </div>

      <div className="freebie-actions">
        <label className="freebie-qty">
          Qty
          <input
            type="number"
            min="1"
            max="999"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>
        {claimUrl ? (
          <a className="freebie-btn" href={claimUrl} target="_blank" rel="noreferrer noopener">Add to cart</a>
        ) : null}
        {productUrl ? (
          <a className="freebie-btn" href={productUrl} target="_blank" rel="noreferrer noopener">Product</a>
        ) : null}
        {claimUrl ? (
          <button type="button" className="freebie-btn" onClick={copyClaim}>{copied ? 'Copied' : 'Copy'}</button>
        ) : null}
      </div>
    </li>
  );
}

export default function Freebies() {
  const [isDark, setIsDark] = useThemePreference();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState('loading');
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE); // static-mode paging
  const allItemsRef = useRef([]); // static-mode full dataset
  const requestRef = useRef(0); // guards against out-of-order API responses

  // Debounce the search box.
  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 300);
    return () => window.clearTimeout(id);
  }, [query]);

  // --- Static mode: load the whole file once, filter/paginate in the browser. ---
  const loadStatic = useCallback(() => {
    setStatus('loading');
    fetch(STATIC_URL)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((payload) => {
        allItemsRef.current = Array.isArray(payload?.freebies) ? payload.freebies : [];
        setGeneratedAt(payload?.generatedAt || null);
        setStatus('ready');
      })
      .catch(() => {
        allItemsRef.current = [];
        setStatus('empty');
      });
  }, []);

  // --- API mode: query the read API with server-side search + pagination. ---
  const loadApi = useCallback(async (search, offset) => {
    const requestId = ++requestRef.current;
    setStatus(offset > 0 ? 'loading-more' : 'loading');

    try {
      const params = new URLSearchParams({ q: search, limit: String(PAGE_SIZE), offset: String(offset) });
      const response = await fetch(`${API_BASE}/freebies?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();

      if (requestId !== requestRef.current) {
        return; // a newer request superseded this one
      }

      const batch = Array.isArray(payload?.items) ? payload.items : [];
      setTotal(Number(payload?.total) || 0);
      setGeneratedAt(payload?.generatedAt || null);
      setItems((current) => (offset > 0 ? [...current, ...batch] : batch));
      setStatus('ready');
    } catch {
      if (requestId === requestRef.current) {
        setStatus('error');
      }
    }
  }, []);

  // Initial load.
  useEffect(() => {
    if (API_BASE) {
      loadApi('', 0);
    } else {
      loadStatic();
    }
  }, [loadApi, loadStatic]);

  // React to search changes.
  useEffect(() => {
    if (API_BASE) {
      loadApi(debouncedQuery, 0);
    } else {
      setVisible(PAGE_SIZE);
    }
  }, [debouncedQuery, loadApi]);

  // Static mode derives the visible slice from the in-memory dataset.
  const staticFiltered = useMemo(() => {
    if (API_BASE) {
      return [];
    }
    if (!debouncedQuery.trim()) {
      return allItemsRef.current;
    }
    return allItemsRef.current.filter((item) => matchesQuery(searchBlob(item), debouncedQuery));
  }, [debouncedQuery, status]);

  const shown = API_BASE ? items : staticFiltered.slice(0, visible);
  const shownTotal = API_BASE ? total : staticFiltered.length;
  const hasMore = API_BASE ? items.length < total : visible < staticFiltered.length;
  const isLoading = status === 'loading';

  function loadMore() {
    if (API_BASE) {
      loadApi(debouncedQuery, items.length);
    } else {
      setVisible((current) => current + PAGE_SIZE);
    }
  }

  return (
    <div className="app">
      <LightbulbToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
      <main className="main document-main">
        <section className="hero document-page">
          <style>{FREEBIES_CSS}</style>

          <FadeIn>
            <h1 className="name document-title">Shopify Freebies</h1>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="card">
              <div className="card-content">
                <p className="freebie-disclaimer">
                  A cached list of <strong>$0.00</strong> variants found in public Shopify product feeds.
                  This is a personal project and is <strong>not affiliated</strong> with any of these stores.
                  Listings can be stale or misfires — always review a product before checkout. Nothing here
                  is purchased or submitted for you; the links just open the store.
                </p>

                <div className="freebie-controls">
                  <input
                    className="freebie-search"
                    type="search"
                    placeholder="Search (e.g. candle, sticker) — comma = OR, space = AND"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    aria-label="Search freebies"
                  />
                  <span className="freebie-count">
                    {status === 'ready' || status === 'loading-more'
                      ? `${shownTotal.toLocaleString()} freebies`
                      : ' '}
                    {generatedAt && (status === 'ready' || status === 'loading-more')
                      ? ` · updated ${formatDate(generatedAt)}`
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            {isLoading ? <p className="freebie-note">Loading freebies…</p> : null}
            {status === 'error' ? <p className="freebie-note">Could not load the freebie list. Try again later.</p> : null}
            {status === 'empty' ? <p className="freebie-note">The freebie list hasn’t been published yet — check back soon.</p> : null}
            {(status === 'ready' || status === 'loading-more') && shown.length === 0 ? (
              <p className="freebie-note">No freebies match that search.</p>
            ) : null}

            <ul className="freebie-grid">
              {shown.map((item) => (
                <FreebieCard item={item} key={item.itemKey} />
              ))}
            </ul>

            {hasMore ? (
              <button type="button" className="btn btn-primary freebie-more" onClick={loadMore}>
                {status === 'loading-more' ? 'Loading…' : 'Load more'}
              </button>
            ) : null}

            <p className="document-back-row">
              <Link to="/" className="document-link">← Back to Portfolio</Link>
            </p>
          </FadeIn>
        </section>
      </main>
    </div>
  );
}

// Freebie-specific layout only. Colors come from the site's theme variables so
// it adapts to light/dark automatically.
const FREEBIES_CSS = `
.freebie-disclaimer { color: var(--text-secondary); line-height: 1.6; margin: 0 0 1rem; }
.freebie-controls { display: flex; flex-wrap: wrap; gap: .75rem; align-items: center; }
.freebie-search { flex: 1 1 300px; padding: .6rem .8rem; font: inherit; color: var(--text);
  background: var(--bg); border: 1px solid var(--border); border-radius: 8px; }
.freebie-count { color: var(--text-muted); font-size: .9rem; }
.freebie-note { color: var(--text-secondary); padding: 1rem 0; }
.freebie-grid { list-style: none; margin: 1.25rem 0 0; padding: 0; display: grid; gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); }
.freebie-card { border: 1px solid var(--border); border-radius: 10px; padding: 1rem;
  background: var(--bg-elevated); display: flex; flex-direction: column; gap: .55rem; }
.freebie-title { margin: 0; font-size: 1rem; line-height: 1.35; color: var(--text);
  overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.freebie-meta { margin: 0; color: var(--text-muted); font-size: .85rem; }
.freebie-tags { display: flex; flex-wrap: wrap; gap: .35rem; }
.freebie-tag { font-size: .72rem; padding: .15rem .5rem; border-radius: 999px;
  background: var(--tech-tag-bg); color: var(--text-secondary); }
.freebie-tag-caution { background: rgba(234, 179, 8, 0.15); color: #b8860b; }
.freebie-actions { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; margin-top: auto; }
.freebie-qty { display: inline-flex; align-items: center; gap: .35rem; font-size: .8rem; color: var(--text-muted); }
.freebie-qty input { width: 4rem; padding: .3rem .4rem; font: inherit; color: var(--text);
  background: var(--bg); border: 1px solid var(--border); border-radius: 6px; }
.freebie-btn { font: inherit; font-size: .82rem; padding: .4rem .7rem; border: 1px solid var(--border);
  border-radius: 6px; background: var(--bg); color: var(--text); cursor: pointer; text-decoration: none; }
.freebie-btn:hover { border-color: var(--accent); color: var(--accent); }
.freebie-more { display: block; margin: 1.5rem auto 0; }
`;
