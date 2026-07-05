import { storage, TOKEN_KEY, USER_KEY } from '../utils/storage';
import { apiPost } from './client';

const base = '/api/users';

export async function signup(payload){
  const res = await apiPost(`${base}/signup`, payload);
  if (!res.ok) return { ok:false, error: res.data?.error || 'Signup failed' };
  // backend returns { token, user } or may return 201 with nothing; redirect to login on success
  return { ok:true, token: res.data?.token, user: res.data?.user };
}

export async function login({ email, password }){
  const res = await apiPost(`${base}/login`, { email, password });
  if (!res.ok){ return { ok:false, error: res.data?.error || 'Invalid credentials' }; }
  const token = res.data?.token;
  const user = res.data?.user;
  if (token && user){
    storage.set(TOKEN_KEY, token);
    storage.set(USER_KEY, user);
  }
  return { ok:true, token, user };
}

export async function updateProfile(token, patch){
  // Backend contract: POST /api/users/update
  const res = await apiPost(`${base}/update`, patch, token);
  if (!res.ok) return { ok:false, error: res.data?.error || 'Update failed' };
  return { ok:true, user: res.data?.user };
}
