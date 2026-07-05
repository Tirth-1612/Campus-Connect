import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createClub as apiCreateClub } from '../../api/clubs';
import DashboardLayout from '../../layouts/DashboardLayout';
import SelectInput from '../../components/forms/SelectInput';
import TextInput from '../../components/forms/TextInput';
import { FiPlus, FiImage, FiCheckCircle, FiAlertCircle, FiUsers, FiTarget, FiCalendar } from 'react-icons/fi';

export default function CreateClub() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image_url: '',
    category: '',
    meeting_day: '',
    meeting_time: '',
    requirements: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  const categories = [
    'Academic', 'Cultural', 'Sports', 'Technical', 'Social', 'Arts', 'Music', 'Drama', 'Literature', 'Other'
  ];

  const meetingDays = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  function onChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = 'Club name is required';
    } else if (form.name.trim().length < 3) {
      newErrors.name = 'Club name must be at least 3 characters';
    }
    
    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (form.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (form.image_url && !isValidUrl(form.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      image_url: form.image_url.trim() || null,
      category: form.category || 'Other',
      meeting_day: form.meeting_day || null,
      meeting_time: form.meeting_time || null,
      requirements: form.requirements.trim() || null,
    };
    
    try {
      const ok = await apiCreateClub(token, payload);
      if (ok) {
        setSuccess('Club created successfully!');
        setForm({ name: '', description: '', image_url: '', category: '', meeting_day: '', meeting_time: '', requirements: '' });
        setTimeout(() => {
          navigate('/dashboard/admin');
        }, 2000);
      } else {
        setError('Failed to create club. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Club</h1>
          <p className="page-subtitle">
            Add a new club to the campus community and help students connect with shared interests
          </p>
        </div>
      </div>

      <div className="content-section">
        <div className="form-container">
          <div className="form-header">
            <div className="form-header-icon">
              <FiPlus />
            </div>
            <div>
              <h2 className="form-title">Club Information</h2>
              <p className="form-subtitle">
                Fill in the details below to create a new campus club
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="modern-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  <FiTarget /> Club Name *
                </label>
                <TextInput
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter club name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  required
                />
                {errors.name && (
                  <div className="form-message error">
                    <FiAlertCircle />
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  <FiUsers /> Category
                </label>
                <SelectInput
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={onChange}
                  className="form-input"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </SelectInput>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={onChange}
                placeholder="Describe the club's purpose, activities, and goals..."
                rows={4}
                className={`form-input ${errors.description ? 'error' : ''}`}
                required
              />
              {errors.description && (
                <div className="form-message error">
                  <FiAlertCircle />
                  {errors.description}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="image_url" className="form-label">
                <FiImage /> Club Image URL
              </label>
              <TextInput
                id="image_url"
                name="image_url"
                value={form.image_url}
                onChange={onChange}
                placeholder="https://example.com/club-image.jpg"
                type="url"
                className={`form-input ${errors.image_url ? 'error' : ''}`}
              />
              {errors.image_url && (
                <div className="form-message error">
                  <FiAlertCircle />
                  {errors.image_url}
                </div>
              )}
              <small className="form-help">
                Optional: Add a URL for the club's logo or representative image
              </small>
            </div>

            {error && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-success">
                <FiCheckCircle />
                <span>{success}</span>
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard/admin')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`btn btn-primary ${submitting ? 'loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="spinner"></div>
                    Creating Club...
                  </>
                ) : (
                  <>
                    <FiPlus />
                    Create Club
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
