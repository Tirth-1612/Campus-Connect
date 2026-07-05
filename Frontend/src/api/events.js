import { apiGet, apiPost } from './client';

export async function listEvents(){
  const res = await apiGet(`/api/events/list`);
  return res.ok ? (res.data || []) : [];
}

export async function createEvent(token, payload){
  const res = await apiPost(`/api/events/create`, payload, token);
  return res.ok;
}
