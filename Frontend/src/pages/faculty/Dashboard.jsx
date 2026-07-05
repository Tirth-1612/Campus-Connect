import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AnnouncementCard from '../../components/cards/AnnouncementCard';
import EventCard from '../../components/cards/EventCard';
import { listAnnouncements } from '../../api/announcements';
import { listEvents } from '../../api/events';
import { listSaved, saveItem } from '../../api/saved';
import { useAuth } from '../../contexts/AuthContext';
import { getRecommendations } from '../../utils/recommendations';
import { buildActivityFeed } from '../../utils/activityFeed';
import { FiBell, FiClock, FiCpu } from 'react-icons/fi';

export default function FacultyDashboard(){
  const { user, token } = useAuth();
  const [anns, setAnns] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedAnns, setSavedAnns] = useState(new Set());
  const [savedEvents, setSavedEvents] = useState(new Set());

  useEffect(() => {
    (async () => {
      try{
        const [a, e, saved] = await Promise.all([
          listAnnouncements(),
          listEvents(),
          listSaved(token)
        ]);
        setAnns(a); setEvents(e);
        const sa = new Set();
        const se = new Set();
        (saved || []).forEach(s => {
          if (s.item_type === 'announcement') sa.add(s.item_id);
          else if (s.item_type === 'event') se.add(s.item_id);
        });
        setSavedAnns(sa); setSavedEvents(se);
      } catch(err){ setError('Failed to load data'); }
      finally { setLoading(false); }
    })();
  }, [token]);

  async function onSaveAnnouncement(item){
    try{
      const saved = await saveItem(token, item.id, 'announcement');
      if (saved === true) {
        setSavedAnns(prev => { const next = new Set(prev); next.add(item.id); return next; });
      } else if (saved === false) {
        setSavedAnns(prev => { const next = new Set(prev); next.delete(item.id); return next; });
      }
    } catch(err){ console.log(err); }
  }

  async function onSaveEvent(item){
    try{
      const saved = await saveItem(token, item.id, 'event');
      if (saved === true) {
        setSavedEvents(prev => { const next = new Set(prev); next.add(item.id); return next; });
      } else if (saved === false) {
        setSavedEvents(prev => { const next = new Set(prev); next.delete(item.id); return next; });
      }
    } catch(err){ console.log(err); }
  }

  const recommendations = useMemo(() => getRecommendations(user, anns, events, 4), [user, anns, events]);
  const activityFeed = useMemo(() => buildActivityFeed(anns, events, user), [anns, events, user]);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty command center</h1>
          <p className="page-subtitle">Coordinate community updates, outreach, and timely engagement from a single dashboard.</p>
        </div>
      </div>
      {loading && <div className="loader" />}
      {error && <div className="error">{error}</div>}

      <div className="content-section">
        <div className="section-header">
          <div>
            <h2 className="section-title"><FiCpu /> Smart recommendations</h2>
            <p className="section-subtitle">Suggested content tailored to your academic and campus context.</p>
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
            <h2 className="section-title"><FiBell /> Live activity</h2>
            <p className="section-subtitle">Stay on top of campus momentum and engagement signals.</p>
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

      <h3 className="section-title">Announcements</h3>
      <div className="grid grid-cards">
        {anns.map(a => (
          <AnnouncementCard key={a.id} item={a} onSave={onSaveAnnouncement} saved={savedAnns.has(a.id)} />
        ))}
      </div>
      <h3 className="section-title">Events</h3>
      <div className="grid grid-cards">
        {events.map(ev => (
          <EventCard key={ev.id} item={ev} onSave={onSaveEvent} saved={savedEvents.has(ev.id)} />
        ))}
      </div>
    </DashboardLayout>
  );
}
