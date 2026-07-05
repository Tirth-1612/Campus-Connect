import DashboardLayout from '../../layouts/DashboardLayout';
import TextInput from '../../components/forms/TextInput';
import SelectInput from '../../components/forms/SelectInput';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createEvent } from '../../api/events';

export default function CreateEvent(){
  const { token, user } = useAuth();
  const [form, setForm] = useState({ title:'', description:'', category:'Academic', department:'', event_date:'', club_id:'' });
  const [status, setStatus] = useState({ loading:false, error:'', ok:false });

  const update = (k,v)=> setForm(f=>({ ...f, [k]: v }));

  async function onSubmit(e){
    e.preventDefault(); setStatus({ loading:true, error:'', ok:false });
    try{
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        department: form.department || user?.department || undefined,
        event_date: form.event_date ? new Date(form.event_date).toISOString() : undefined,
        club_id: form.club_id ? Number(form.club_id) : undefined,
      };
      const ok = await createEvent(token, payload);
      
      setStatus({ loading:false, error: ok ? '' : 'Failed to create event', ok });
      if (ok) setForm({ title:'', description:'', category:'Academic', department:'', event_date:'', club_id:'' });
    } catch(err){ 
      setStatus({ loading:false, error:'Failed to create event a', ok:false }); 
    }
  }

  return (
    <DashboardLayout>
      <form className="card form form-narrow" onSubmit={onSubmit}>
        <h2>Create Event</h2>
        {status.error && <div className="error">{status.error}</div>}
        {status.ok && <div className="success">Event created</div>}
        <TextInput label="Title" value={form.title} onChange={e=>update('title', e.target.value)} required />
        <TextInput label="Description" value={form.description} onChange={e=>update('description', e.target.value)} required />
        <SelectInput label="Category" value={form.category} onChange={e=>update('category', e.target.value)}>
          <option>Academic</option>
          <option>Cultural</option>
          <option>Technical</option>
          <option>Sports</option>
        </SelectInput>
        <TextInput label="Department" value={form.department} onChange={e=>update('department', e.target.value)} placeholder={user?.department || ''} />
        <TextInput label="Event Date" type="datetime-local" value={form.event_date} onChange={e=>update('event_date', e.target.value)} required />
        {user?.role === 'admin' && <TextInput label="Club ID " value={form.club_id} onChange={e=>update('club_id', e.target.value)} />}
        <button className="btn" type="submit" disabled={status.loading}>{status.loading? 'Submitting...' : 'Submit'}</button>
      </form>
    </DashboardLayout>
  );
}
