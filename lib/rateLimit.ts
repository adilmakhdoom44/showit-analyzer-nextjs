/**
 * Rate limiting — 5 checks per URL per 24 hours, stored in localStorage.
 * Per URL, per device. Zero server cost.
 */

const STORAGE_KEY = 'sac_rate_limits';
const MAX_CHECKS = 5;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

interface UrlLimit {
  count: number;
  firstCheck: number; // timestamp of first check in current window
  resetAt: number;    // timestamp when window resets
}

type LimitStore = Record<string, UrlLimit>;

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.startsWith('http') ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return url.toLowerCase().trim();
  }
}

function loadStore(): LimitStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStore(store: LimitStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {}
}

function getEntry(url: string): UrlLimit | null {
  const store = loadStore();
  const key = normalizeUrl(url);
  const entry = store[key];
  if (!entry) return null;

  // If window has expired, treat as fresh
  if (Date.now() >= entry.resetAt) {
    const newStore = { ...store };
    delete newStore[key];
    saveStore(newStore);
    return null;
  }
  return entry;
}

/** Returns how many checks remain for this URL (0 = blocked) */
export function getChecksRemaining(url: string): number {
  const entry = getEntry(url);
  if (!entry) return MAX_CHECKS;
  return Math.max(0, MAX_CHECKS - entry.count);
}

/** Returns ms until the rate limit resets (0 if not limited) */
export function getResetMs(url: string): number {
  const entry = getEntry(url);
  if (!entry || entry.count < MAX_CHECKS) return 0;
  return Math.max(0, entry.resetAt - Date.now());
}

/** Call this BEFORE analyzing. Returns true if allowed, false if blocked. */
export function checkAndRecord(url: string): boolean {
  const store = loadStore();
  const key = normalizeUrl(url);
  const now = Date.now();
  const existing = store[key];

  // No entry or expired window — start fresh
  if (!existing || now >= existing.resetAt) {
    store[key] = { count: 1, firstCheck: now, resetAt: now + WINDOW_MS };
    saveStore(store);
    return true;
  }

  // Within window — check count
  if (existing.count >= MAX_CHECKS) return false;

  store[key] = { ...existing, count: existing.count + 1 };
  saveStore(store);
  return true;
}

/** Format ms into "Xh Ym" countdown string */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export { MAX_CHECKS };
