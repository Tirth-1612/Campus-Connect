import { storage, TOKEN_KEY, USER_KEY } from '../utils/storage';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function handleResponse(res) {
  if (res.status === 401 || res.status === 403) {
    storage.remove(TOKEN_KEY);
    storage.remove(USER_KEY);
    try { const body = await res.json(); return { ok:false, status: res.status, error: body?.error || 'Unauthorized' }; } catch { return { ok:false, status: res.status, error: 'Unauthorized' }; }
  }
  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, data };
}

export async function apiGet(path, token) {
  const res = await fetch(`${BASE_URL}${path}`, { method:'GET' , headers: authHeaders(token) });
  return handleResponse(res);
}

export async function apiPost(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) });
  return handleResponse(res);
}

export async function apiPatch(path, body, token) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(body) });
  return handleResponse(res);
}
