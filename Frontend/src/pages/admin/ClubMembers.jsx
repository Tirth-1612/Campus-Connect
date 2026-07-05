import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { listClubs, getMembers } from '../../api/clubs';
import { useAuth } from '../../contexts/AuthContext';

export default function ClubMembers(){
  const { token } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { (async () => { setClubs(await listClubs()); })(); }, []);

  async function loadMembers(id){
    if (!id) return;
    setLoading(true); setError('');
    try {
      const rows = await getMembers(token, id);
      setMembers(rows || []);
    } catch(e){ setError('Failed to load members'); }
    finally { setLoading(false); }
  }

  return (
    <DashboardLayout>
      <h2>Club Members</h2>
      <div className="card stack">
        <label className="field">
          <span className="label-muted">Select Club</span>
          <select className="select" value={clubId} onChange={e=>{ 
            setClubId(e.target.value); 
            loadMembers(e.target.value); }}>
            <option value="">-- Choose --</option>
            {clubs.map(c => <option key={c.id} value={c.id}>{c.title || c.name || `Club #${c.id}`}</option>)}
          </select>
        </label>
        {loading && <div className="loader" />}
        {error && <div className="error">{error}</div>}
        {!loading && members.map(m => (
          <div key={m.user_id} className="card flex-row">
            <div>
              <div className="fw-600">{m.name}</div>
              <div className="muted">{m.email}</div>
            </div>
            <div className="muted">{m.role}</div>
          </div>
        ))}
        {!loading && !members.length && clubId && <div className="muted">No members yet.</div>}
      </div>
    </DashboardLayout>
  );
}
