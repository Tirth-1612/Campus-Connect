export function buildActivityFeed(announcements = [], events = [], user = {}) {
  const feed = [];

  announcements.forEach((item) => {
    feed.push({
      id: `ann-${item.id}`,
      kind: 'announcement',
      title: item.title || 'New announcement',
      description: item.description || 'A new update has been shared.',
      meta: item.department ? `Department • ${item.department}` : 'Campus update',
      accent: 'info',
      createdAt: item.created_at || new Date().toISOString(),
    });
  });

  events.forEach((item) => {
    feed.push({
      id: `ev-${item.id}`,
      kind: 'event',
      title: item.title || 'New event',
      description: item.description || 'An upcoming campus event is now available.',
      meta: item.category ? `${item.category} • ${item.event_date || 'Upcoming'}` : 'Campus event',
      accent: 'success',
      createdAt: item.created_at || new Date().toISOString(),
    });
  });

  return feed
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map((item, index) => ({
      ...item,
      priority: index === 0 ? 'high' : 'medium',
      userLabel: user?.name || user?.email || 'CampusConnect',
    }));
}
