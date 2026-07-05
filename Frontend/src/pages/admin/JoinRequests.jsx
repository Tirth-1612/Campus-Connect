import DashboardLayout from '../../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import {listClubs,fetchPendingRequests,updateMemberStatus} from '../../api/clubs';
import { useAuth } from '../../contexts/AuthContext';

export default function JoinRequests() {
  const { token } = useAuth();

  const [clubs, setClubs] = useState([]);
  const [clubId, setClubId] = useState('');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null); // stores r.id being updated

  // Load clubs on mount
  useEffect(() => {
    (async () => {
      try {
        const data = await listClubs();
        setClubs(data || []);
      } catch {
        setError('Failed to load clubs');
      }
    })();
  }, []);

  // Load pending requests for selected club
  async function loadRequests(id) {
    if (!id) return;
    setLoading(true);
    setError('');

    try {
      const data = await fetchPendingRequests(token, id);
      setRows(data || []);
    } catch {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  }

  // Approve / Reject handler
  async function onQuickAction(id, nextStatus) {
    setUpdating(id);

    try {
      const updated = await updateMemberStatus(
        token,
        clubId,
        id,
        nextStatus
      );

      if (updated?.status) {
        setRows(prev =>
          prev.map(r =>
            r.id === id ? { ...r, status: updated.status } : r
          )
        );
      }
    } catch (err){
      console.log(err)
      setError('Failed to update request');
    } finally {
      setUpdating(null);
    }
  }

  return (
    <DashboardLayout>
      <h2>Pending Join Requests</h2>

      <div className="card stack">
        <label className="field">
          <span className="label-muted">Select Club</span>
          <select
            className="select"
            value={clubId}
            onChange={e => {
              setClubId(e.target.value);
              loadRequests(e.target.value);
            }}
          >
            <option value="">-- Choose --</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>
                {c.title || c.name || `Club #${c.id}`}
              </option>
            ))}
          </select>
        </label>

        {loading && <div className="loader" />}
        {error && <div className="error">{error}</div>}

        {!loading &&
          rows.map(r => (
            <div key={r.id} className="card flex-row">
              <div>
                <div className="fw-600">{r.name}</div>
                <div className="text-muted">{r.email}</div>
              </div>

              {r.status === 'pending' ? (
                <div className="actions">
                  <button
                    type="button"
                    className="btn"
                    disabled={updating === r.id}
                    onClick={() =>
                      onQuickAction(r.id, 'approved')
                    }
                  >
                    {updating === r.id
                      ? 'Approving…'
                      : 'Accept'}
                  </button>

                  <button
                    type="button"
                    className="btn ghost"
                    disabled={updating === r.id}
                    onClick={() =>
                      onQuickAction(r.id, 'rejected')
                    }
                  >
                    {updating === r.id
                      ? 'Rejecting…'
                      : 'Reject'}
                  </button>
                </div>
              ) : (
                <div
                  className={
                    r.status === 'approved'
                      ? 'success'
                      : 'error'
                  }
                >
                  {r.status}
                </div>
              )}
            </div>
          ))}

        {!loading && !rows.length && clubId && (
          <div className="text-muted">
            No pending requests.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
