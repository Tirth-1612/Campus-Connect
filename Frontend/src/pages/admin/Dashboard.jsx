import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useMemo, useState } from 'react';
import { listClubs } from '../../api/clubs';
import { listAnnouncements } from '../../api/announcements';
import { listEvents } from '../../api/events';
import AnnouncementCard from '../../components/cards/AnnouncementCard';
import EventCard from '../../components/cards/EventCard';
import { getUsersCount } from '../../api/admin';
import { useAuth } from '../../contexts/AuthContext';
import { getRecommendations } from '../../utils/recommendations';
import { buildActivityFeed } from '../../utils/activityFeed';
import { FiBell, FiClock, FiCpu } from 'react-icons/fi';

export default function AdminDashboard(){
  const [counts, setCounts] = useState({ clubs: 0, users: null });
  const [anns, setAnns] = useState([]);
  const [events, setEvents] = useState([]);
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try{
        const [clubs, usersCount, annsData, eventsData] = await Promise.all([
          listClubs(),
          getUsersCount(token),
          listAnnouncements(),
          listEvents()
        ]);
        setCounts(c => ({ ...c, clubs: clubs.length, users: usersCount }));
        setAnns(annsData);
        setEvents(eventsData);
      } catch(err){ setError('Failed to load dashboard'); }
      finally { setLoading(false); }
    })();
  }, []);

  const recommendations = useMemo(() => getRecommendations(user, anns, events, 4), [user, anns, events]);
  const activityFeed = useMemo(() => buildActivityFeed(anns, events, user), [anns, events, user]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin control center</h1>
          <p className="page-subtitle">Monitor engagement, oversee campus activity, and keep operations running smoothly.</p>
        </div>
      </div>
      {loading && <div className="loader" />}
      {error && <div className="error">{error}</div>}
      <div className="row dashboard-stats">
        <div className="card stat">Total Clubs: {counts.clubs}</div>
        <div className="card stat">Total Users: {counts.users ?? '—'}</div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div>
            <h2 className="section-title"><FiCpu /> Smart recommendations</h2>
            <p className="section-subtitle">Spotlight the most relevant opportunities to publish or prioritize.</p>
          </div>
        </div>
        <div className="grid grid-auto">
          {recommendations.map((item) => (
            <div key={`${item.kind}-${item.id}`} className="card" style={{ padding: '1rem' }}>
              <div className="stat-label">{item.label}</div>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>{item.title}</h3>
              <p className="section-subtitle">{item.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="content-section">
        <div className="section-header">
          <div>
            <h2 className="section-title"><FiBell /> Live activity feed</h2>
            <p className="section-subtitle">A high-level pulse of announcements and events currently moving through the platform.</p>
          </div>
        </div>
        <div className="grid grid-auto">
          {activityFeed.map((item) => (
            <div key={item.id} className="card" style={{ padding: '1rem' }}>
              <div className="stat-label">{item.priority}</div>
              <h3 className="section-title" style={{ fontSize: '1rem' }}>{item.title}</h3>
              <p className="section-subtitle">{item.description}</p>
              <div className="empty-state-description"><FiClock /> {item.meta}</div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="section-title">Latest Announcements</h3>
      <div className="grid grid-cards">
        {anns.map(a => <AnnouncementCard key={a.id} item={a} />)}
      </div>
      <h3 className="section-title">Latest Events</h3>
      <div className="grid grid-cards">
        {events.map(e => <EventCard key={e.id} item={e} />)}
      </div>
    </DashboardLayout>
  );
}
