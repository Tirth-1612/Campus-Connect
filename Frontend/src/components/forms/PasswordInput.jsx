import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function PasswordInput({ label, ...props }){
  const [show, setShow] = useState(false);
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <div className="password-input-wrapper" style={{ position: 'relative', width: '100%' }}>
        <input 
          type={show ? 'text' : 'password'} 
          className="form-input" 
          {...props} 
          style={{ paddingRight: '2.75rem' }} 
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0
          }}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      </div>
    </div>
  );
}
