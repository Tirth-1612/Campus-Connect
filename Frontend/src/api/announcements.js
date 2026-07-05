import { apiGet, apiPost } from './client';

export async function listAnnouncements(params={}){
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/api/announcements/list${qs?`?${qs}`:''}`);
  return res.ok ? (res.data || []) : [];
}

export async function createAnnouncement(token, payload){
  const res = await apiPost(`/api/announcements/create`, payload, token);
  return res.ok;
}
