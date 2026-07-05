import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBookOpen, FiUsers, FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout';
import TextInput from '../../components/forms/TextInput';
import PasswordInput from '../../components/forms/PasswordInput';
import SelectInput from '../../components/forms/SelectInput';
import { signup as apiSignup } from '../../api/auth';
import logo from '../../components/common/logo.png';

export default function Signup(){
  const [form, setForm] = useState({ 
    name:'', 
    email:'', 
    password:'', 
    role:'student', 
    department:'', 
    year:'' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const nav = useNavigate();

  const update = (k,v)=> setForm(f=>({ ...f, [k]: v }));

  async function onSubmit(e){
    e.preventDefault();   
    setError('');
    setIsLoading(true);
    
    try {
      const res = await apiSignup(form);
      if (!res.ok) { 
        setError(res.error || 'Signup failed'); 
        return; 
      }
      nav('/login');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const departments = [
    { value: 'cs', label: 'Computer Science' },
    { value: 'it', label: 'Information Technology' },
    { value: 'extc', label: 'Electronics & Telecommunication' },
    { value: 'ee', label: 'Electrical Engineering' },
    { value: 'mech', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'prod', label: 'Production Engineering' },
    { value: 'textile', label: 'Textile Engineering' }
  ];

  return (
    <PublicLayout>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="CampusConnect Logo" style={{height:'80px',width:'80px'}} />
            </div>
            <h1 className="auth-title">Join CampusConnect</h1>
            <p className="auth-subtitle">Create your account and get started</p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <FiUser /> Full Name
                </label>
                <TextInput 
                  id="name"
                  placeholder="Enter your full name"
                  value={form.name} 
                  onChange={e=>update('name', e.target.value)} 
                  required 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <FiMail /> Email Address
                </label>
                <TextInput 
                  id="email"
                  type="email" 
                  placeholder="your@email.com"
                  value={form.email} 
                  onChange={e=>update('email', e.target.value)} 
                  required 
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <FiLock /> Password
                </label>
                <PasswordInput 
                  id="password"
                  placeholder="Create a strong password"
                  value={form.password} 
                  onChange={e=>update('password', e.target.value)} 
                  required 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  <FiUsers /> Role
                </label>
                <SelectInput 
                  id="role"
                  value={form.role} 
                  onChange={e=>update('role', e.target.value)}
                  className="form-input"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty</option>
                </SelectInput>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="department" className="form-label">
                  <FiBookOpen /> Department
                </label>
                <SelectInput 
                  id="department"
                  value={form.department} 
                  onChange={e=>update('department', e.target.value)}
                  className="form-input"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </SelectInput>
              </div>

              {form.role === 'student' && (
                <div className="form-group">
                  <label htmlFor="year" className="form-label">
                    Academic Year
                  </label>
                  <SelectInput 
                    id="year"
                    value={form.year} 
                    onChange={e=>update('year', e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                  </SelectInput>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input" required />
                <span className="checkbox-text">
                  I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                </span>
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="submit" 
                className={`btn btn-primary btn-lg btn-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Create Account
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <div className="feature-icon">
              <FiCheckCircle />
            </div>
            <div className="feature-content">
              <h3>Connect with Campus</h3>
              <p>Join a vibrant community of students and faculty</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FiCheckCircle />
            </div>
            <div className="feature-content">
              <h3>Stay Updated</h3>
              <p>Never miss important announcements and events</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FiCheckCircle />
            </div>
            <div className="feature-content">
              <h3>Join Clubs</h3>
              <p>Discover and participate in various campus activities</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
