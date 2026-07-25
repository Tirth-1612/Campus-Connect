import { apiGet, apiPost, apiDelete } from './client';

export async function fetchClubPosts(token, clubId) {
  const res = await apiGet(`/api/clubs/forum/${clubId}/posts`, token);
  return res.ok ? (res.data || []) : [];
}

export async function createClubPost(token, clubId, title, content) {
  const res = await apiPost(`/api/clubs/forum/${clubId}/posts`, { title, content }, token);
  return res.ok ? res.data : null;
}

export async function deleteClubPost(token, clubId, postId) {
  const res = await apiDelete(`/api/clubs/forum/${clubId}/posts/${postId}`, token);
  return res.ok;
}

export async function fetchPostComments(token, postId) {
  const res = await apiGet(`/api/clubs/forum/posts/${postId}/comments`, token);
  return res.ok ? (res.data || []) : [];
}

export async function createPostComment(token, postId, content) {
  const res = await apiPost(`/api/clubs/forum/posts/${postId}/comments`, { content }, token);
  return res.ok ? res.data : null;
}

export async function deletePostComment(token, postId, commentId) {
  const res = await apiDelete(`/api/clubs/forum/posts/${postId}/comments/${commentId}`, token);
  return res.ok;
}
