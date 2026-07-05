import { apiGet } from './client';

export async function getUsersCount(token){
  const res = await apiGet('/api/admin/users/count', token);
  return res.ok ? (res.data?.count ?? 0) : 0;
}
