import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiAlertCircle, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import PublicLayout from '../../layouts/PublicLayout';
import { login as apiLogin } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import TextInput from '../../components/forms/TextInput';
import PasswordInput from '../../components/forms/PasswordInput';
import logo from '../../components/common/logo.png';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nav = useNavigate();
  const { login } = useAuth();

  async function onSubmit(e){
    e.preventDefault();
    setError('');
    const submittedEmail = (emailRef.current?.value || '').trim();
    const submittedPassword = passwordRef.current?.value || '';
    setEmail(submittedEmail);
    setPassword(submittedPassword);

    if (!submittedEmail || !submittedPassword) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiLogin({ email: submittedEmail, password: submittedPassword });
      if (!res.ok) {
        setError(res.error || 'Login failed');
        return;
      }
      login(res.token, res.user);
      const role = res.user?.role;
      if (role === 'faculty') nav('/dashboard/faculty');
      else if (role === 'admin') nav('/dashboard/admin');
      else nav('/dashboard/student');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PublicLayout>
      <div className="auth-container" style={{ minHeight: 'calc(100vh - 160px)', alignItems: 'center' }}>
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="auth-header">
            <div className="auth-logo">
              <img src={logo} alt="CampusConnect Logo" style={{height:'64px',width:'64px',objectFit:'contain'}} />
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your CampusConnect account</p>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            {error && (
              <div className="auth-error">
                <FiAlertCircle />
                <span>{error}</span>
              </div>
            )}

            <TextInput
              ref={emailRef}
              id="email"
              type="email"
              label={<><FiMail /> Email Address</>}
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />

            <PasswordInput
              ref={passwordRef}
              id="password"
              label={<><FiLock /> Password</>}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <div className="form-actions" style={{ marginTop: '2rem' }}>
              <button 
                type="submit" 
                className={`btn btn-primary btn-lg btn-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                {isLoading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <FiCheckCircle />
                    Sign In
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>

            <div className="auth-footer" style={{ borderTop: '1px solid var(--border)', marginTop: '2rem' }}>
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Sign up for free
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

        <motion.div 
          className="auth-features"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '0 var(--radius-xl) var(--radius-xl) 0' }}
        >
          <div className="feature-item">
            <div className="feature-icon">
              <FiCheckCircle size={20} />
            </div>
            <div className="feature-content">
              <h3>Secure Authentication</h3>
              <p>Your data is protected with industry-standard encryption</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FiCheckCircle size={20} />
            </div>
            <div className="feature-content">
              <h3>Role-Based Access</h3>
              <p>Tailored experience for students, faculty, and administrators</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <FiCheckCircle size={20} />
            </div>
            <div className="feature-content">
              <h3>Quick Access</h3>
              <p>Instant access to campus resources and announcements</p>
            </div>
          </div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
