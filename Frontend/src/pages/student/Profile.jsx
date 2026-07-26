import { useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import TextInput from '../../components/forms/TextInput';
import PasswordInput from '../../components/forms/PasswordInput';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile } from '../../api/auth';

const AVAILABLE_INTERESTS = ['Coding', 'Internships', 'Academics', 'Sports', 'Cultural', 'Art', 'Music', 'Science'];

export default function StudentProfile(){
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    department: user?.department || '', 
    year: user?.year || '', 
    password: '' 
  });
  const [selectedInterests, setSelectedInterests] = useState(user?.interests || []);
  const [msg, setMsg] = useState('');

  const update = (k,v)=> setForm(f=>({ ...f, [k]: v }));

  const toggleInterest = (interest) => {
    setSelectedInterests(prev => 
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  async function onSubmit(e){
    e.preventDefault(); 
    setMsg('');
    const res = await updateProfile(token, { ...form, interests: selectedInterests });
    if (res.ok){ 
      updateUser(res.user);
      setMsg('Profile updated successfully!');
      setForm({
        name: res.user.name || '',
        department: res.user.department || '',
        year: res.user.year || '',
        password: ''
      });
      setSelectedInterests(res.user.interests || []);
    }
  }

  return (
    <DashboardLayout>
      <form onSubmit={onSubmit} className="card" style={{maxWidth: 520, display: 'grid', gap: '1.2rem', padding: '2rem'}}>
        <h2 style={{margin: 0, fontWeight: 800, fontSize: '1.75rem', color: 'var(--text-primary)'}}>Profile Settings</h2>
        {msg && <div style={{color: 'var(--success)', fontWeight: 650, fontSize: '0.95rem'}}>{msg}</div>}
        
        <TextInput label="Name" value={form.name} onChange={e=>update('name', e.target.value)} />
        <PasswordInput label="New Password (leave blank to keep current)" value={form.password} onChange={e=>update('password', e.target.value)} />
        <TextInput label="Department" value={form.department} onChange={e=>update('department', e.target.value)} />
        <TextInput label="Year" type="number" value={form.year} onChange={e=>update('year', e.target.value)} />
        
        <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
          <label style={{fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)'}}>
            AI Recommendation Interests
          </label>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem'}}>
            {AVAILABLE_INTERESTS.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '100px',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                    background: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                  }}
                  className="interest-chip"
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem'}}>
          Email: {user?.email} • Role: {user?.role}
        </div>
        <button className="btn btn-primary" type="submit" style={{marginTop: '0.5rem'}}>
          Save Changes
        </button>
      </form>
    </DashboardLayout>
  );
}
