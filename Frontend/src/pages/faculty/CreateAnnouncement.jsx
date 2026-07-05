import DashboardLayout from '../../layouts/DashboardLayout';
import TextInput from '../../components/forms/TextInput';
import SelectInput from '../../components/forms/SelectInput';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createAnnouncement } from '../../api/announcements';

export default function CreateAnnouncement(){
  const { token, user } = useAuth();
  const [form, setForm] = useState({ title:'', description:'', type:'Academic', department:'', club_id:'' });
  const [status, setStatus] = useState({ loading:false, error:'', ok:false });

  const update = (k,v)=> setForm(f=>({ ...f, [k]: v }));

  async function onSubmit(e){
    e.preventDefault(); 
    setStatus({ loading:true, error:'', ok:false });
    try{
      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        club_id: form.type === 'Club' ? Number(form.club_id) || undefined : undefined,
      };
      const ok = await createAnnouncement(token, payload);
      setStatus({ loading:false, error: ok ? '' : 'Failed to create announcement', ok });
      if (ok) setForm({ title:'', description:'', type:'Academic', department:'', club_id:'' });
    } catch(err){ setStatus({ loading:false, error:'Failed to create announcement', ok:false }); }
  }
  return (
    <DashboardLayout>
      <form onSubmit={onSubmit} className="card form form-narrow">
        <h2>Create Announcement</h2>
        {status.error && <div className="error">{status.error}</div>}
        {status.ok && <div className="success">Announcement created</div>}
        <TextInput label="Title" value={form.title} onChange={e=>update('title', e.target.value)} required />
        <TextInput label="Description" value={form.description} onChange={e=>update('description', e.target.value)} required />
        <SelectInput label="Type" value={form.type} onChange={e=>update('type', e.target.value)}>
          <option value="Academic">Academic</option>
          <option value="Internship">Internship</option>
          <option value="Placement">Placement</option>
          {user?.role === 'admin' && <option value="Club">Club</option>}
        </SelectInput>
        {form.type === 'Club' && (
          <TextInput label="Club ID" value={form.club_id} onChange={e=>update('club_id', e.target.value)} required />
        )}
        <button className="btn" type="submit" disabled={status.loading}>{status.loading? 'Submitting...' : 'Submit'}</button>
      </form>
    </DashboardLayout>
  );
}
