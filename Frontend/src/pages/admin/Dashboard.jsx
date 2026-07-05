import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { listClubs } from '../../api/clubs';
import { listAnnouncements } from '../../api/announcements';
import { listEvents } from '../../api/events';
import AnnouncementCard from '../../components/cards/AnnouncementCard';
import EventCard from '../../components/cards/EventCard';
import { getUsersCount } from '../../api/admin';
import { useAuth } from '../../contexts/AuthContext';

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

  return (
    <DashboardLayout>
      <h2>Admin Dashboard</h2>
      {loading && <div className="loader" />}
      {error && <div className="error">{error}</div>}
      <div className="row dashboard-stats">
        <div className="card stat">Total Clubs: {counts.clubs}</div>
        <div className="card stat">Total Users: {counts.users ?? '—'}</div>
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
