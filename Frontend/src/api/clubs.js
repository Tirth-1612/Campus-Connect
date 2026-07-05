import { apiGet, apiPost, apiPatch } from './client';

export async function listClubs(){
  const res = await apiGet('/api/clubs/list');
  return res.ok ? (res.data || []) : [];
}

export async function listClubsWithStatus(token){
  const res = await apiGet('/api/clubs/list-with-status', token);
  return res.ok ? (res.data || []) : [];
}

export async function joinClub(token, clubId){
  const res = await apiPost(`/api/clubs/${clubId}/join`, {}, token);
  return res.ok;
}

export async function fetchPendingRequests(token, clubId){
  const res = await apiGet(`/api/clubs/${clubId}/pendingrequests`, token);
  return res.ok ? (res.data || []) : [];
}

export async function updateRequestStatus(token, clubId, userId, status){
  const res = await apiPatch(`/api/clubs/${clubId}/users/${userId}`, { status }, token);
  return res.ok;
}

export async function getMembers(token, clubId){
  const res = await apiGet(`/api/clubs/${clubId}/members`, token);
  return res.ok ? (res.data || []) : [];
}

export async function updateMemberStatus(token, clubId, userId, status){
  const res = await apiPatch(`/api/clubs/${clubId}/users/${userId}/status`, { status }, token);
  return res.ok ? res.data : null;
}

export async function createClub(token, body){
  const res = await apiPost('/api/clubs/create', body, token);
  return res.ok;
}
