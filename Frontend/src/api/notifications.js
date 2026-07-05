const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export async function sendWhatsAppNotification({ phone, message, title }) {
  const res = await fetch(`${BASE_URL}/api/notifications/whatsapp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message, title }),
  });

  let data = null;
  try { data = await res.json(); } catch { /* ignore */ }
  return { ok: res.ok, status: res.status, data };
}
