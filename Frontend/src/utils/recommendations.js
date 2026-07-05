const normalizeText = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const buildKeywords = (user = {}) => {
  const department = normalizeText(user?.department || user?.dept || '');
  const role = normalizeText(user?.role || 'student');
  const year = normalizeText(user?.year || '');

  return [department, role, year].filter(Boolean);
};

const scoreItem = (item, user = {}) => {
  const text = normalizeText(`${item?.title || ''} ${item?.description || ''} ${item?.type || ''} ${item?.category || ''} ${item?.department || ''}`);
  const keywords = buildKeywords(user);

  let score = 0;
  if (!text) return score;

  if (keywords.length) {
    keywords.forEach((keyword) => {
      if (text.includes(keyword)) score += 18;
    });
  }

  const roleBoost = normalizeText(user?.role || 'student');
  if (roleBoost === 'student') {
    if (text.includes('placement') || text.includes('internship')) score += 20;
    if (text.includes('academic')) score += 12;
    if (text.includes('club')) score += 8;
  }

  if (roleBoost === 'faculty') {
    if (text.includes('academic')) score += 20;
    if (text.includes('internship') || text.includes('placement')) score += 10;
  }

  if (text.includes('technical')) score += 8;
  if (text.includes('cultural')) score += 6;
  if (text.includes('sports')) score += 6;

  return score;
};

export function getRecommendations(user = {}, announcements = [], events = [], limit = 4) {
  const combined = [
    ...announcements.map((item) => ({ ...item, kind: 'announcement' })),
    ...events.map((item) => ({ ...item, kind: 'event' })),
  ];

  const scored = combined
    .map((item) => ({
      ...item,
      score: scoreItem(item, user),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map((item) => {
    const label = item.kind === 'announcement' ? 'Announcement' : 'Event';
    const reason = item.score >= 30
      ? 'Strong match for your profile and interests'
      : 'Relevant to your current campus context';

    return {
      ...item,
      label,
      reason,
    };
  });
}
