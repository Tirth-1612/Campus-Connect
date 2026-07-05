export const storage = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  },
  remove(key) { try { localStorage.removeItem(key); } catch {} },
};

export const TOKEN_KEY = 'cc_token';
export const THEME_KEY = 'cc_theme';
export const USER_KEY = 'cc_user';
