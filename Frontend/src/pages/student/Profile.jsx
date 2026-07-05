import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import TextInput from '../../components/forms/TextInput';
import PasswordInput from '../../components/forms/PasswordInput';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../api/auth';

export default function StudentProfile(){
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '', year: user?.year || '', password:'' });
  const [msg, setMsg] = useState('');

  const update = (k,v)=> setForm(f=>({ ...f, [k]: v }));

  async function onSubmit(e){
    e.preventDefault(); 
    setMsg('');
    const res = await updateProfile(token, form);
    if (res.ok){ 
      updateUser(res.user);
      setMsg('Profile updated');
      setForm({
      name: '',
      password: '',
      department: '',
      year: ''
    });
    }
    
  }

  return (
    <DashboardLayout>
      <form onSubmit={onSubmit} className="card" style={{maxWidth:520, display:'grid', gap:'.8rem'}}>
        <h2>Profile</h2>
        {msg && <div style={{color:'limegreen'}}>{msg}</div>}
        <TextInput label="Name" value={form.name} onChange={e=>update('name', e.target.value)} />
        <PasswordInput label="New Password" value={form.password} onChange={e=>update('password', e.target.value)} />
        <TextInput label="Department" value={form.department} onChange={e=>update('department', e.target.value)} />
        <TextInput label="Year" type="number" value={form.year} onChange={e=>update('year', e.target.value)} />
        <div style={{color:'var(--muted)'}}>Email: {user?.email} • Role: {user?.role}</div>
        <button className="btn" type="submit">Save</button>
      </form>
    </DashboardLayout>
  );
}
