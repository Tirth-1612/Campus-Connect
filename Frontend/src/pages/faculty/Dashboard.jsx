import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import AnnouncementCard from '../../components/cards/AnnouncementCard';
import EventCard from '../../components/cards/EventCard';
import { listAnnouncements } from '../../api/announcements';
import { listEvents } from '../../api/events';
import { listSaved, saveItem } from '../../api/saved';
import { useAuth } from '../../contexts/AuthContext';

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

  return (
    <DashboardLayout>
      <h2>Faculty Dashboard</h2>
      {loading && <div className="loader" />}
      {error && <div className="error">{error}</div>}
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
