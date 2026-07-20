import { motion } from 'framer-motion';
import { FiUsers, FiCheck, FiClock, FiXCircle } from 'react-icons/fi';

export default function ClubCard({ club, onJoin, viewMode }){
  const status = club.membership_status || club.status || club.joinState || null;

  let btnLabel = 'Join Club';
  let btnVariant = 'btn-primary';
  let disabled = false;
  let btnIcon = <FiUsers />;

  if (status === 'pending') {
    btnLabel = 'Pending Approval';
    btnVariant = 'btn-secondary';
    disabled = true;
    btnIcon = <FiClock className="animate-pulse" />;
  } else if (status === 'approved' || status === 'joined') {
    btnLabel = 'Joined';
    btnVariant = 'btn-success';
    disabled = true;
    btnIcon = <FiCheck />;
  } else if (status === 'rejected') {
    btnLabel = 'Rejected';
    btnVariant = 'btn-danger';
    disabled = true;
    btnIcon = <FiXCircle />;
  }

  function handleJoin(e){
    e.preventDefault();
    if (disabled) return;
    onJoin && onJoin(club);
  }

  const isList = viewMode === 'list';

  return (
    <motion.div 
      className={`card ${isList ? 'flex-row' : 'stack'}`}
      style={{ 
        padding: '0', 
        display: 'flex', 
        flexDirection: isList ? 'row' : 'column',
        alignItems: 'stretch',
        overflow: 'hidden'
      }}
      whileHover={{ y: -4, scale: 1.01, boxShadow: 'var(--shadow-lg)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Banner Image or Gradient */}
      <div style={{
        height: isList ? 'auto' : '140px',
        width: isList ? '180px' : '100%',
        background: club.image_url ? `url(${club.image_url}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        flexShrink: 0,
        position: 'relative'
      }}>
        {!club.image_url && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: 'rgba(255,255,255,0.85)',
            fontSize: '2rem',
            fontWeight: 800
          }}>
            {club.name ? club.name.charAt(0).toUpperCase() : 'C'}
          </div>
        )}
      </div>

      <div style={{ 
        padding: '1.25rem', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        flex: 1
      }}>
        <div>
          <h3 style={{ 
            fontSize: 'var(--font-size-lg)', 
            fontWeight: '700', 
            color: 'var(--text-primary)',
            margin: '0 0 0.5rem 0'
          }}>
            {club.name}
          </h3>
          <p style={{ 
            fontSize: 'var(--font-size-sm)', 
            color: 'var(--text-secondary)',
            margin: '0 0 1.25rem 0',
            lineHeight: '1.5',
            display: '-webkit-box',
            WebkitLineClamp: isList ? 2 : 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {club.description || 'Welcome to CampusConnect clubs. Join this community to participate in discussion groups, organize meetups, and keep in touch.'}
          </p>
        </div>

        {onJoin && (
          <button 
            className={`btn ${btnVariant} btn-sm`} 
            disabled={disabled} 
            onClick={handleJoin}
            style={{ 
              width: isList ? 'auto' : '100%', 
              alignSelf: isList ? 'flex-start' : 'stretch',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              background: status === 'approved' || status === 'joined' ? 'var(--success)' : undefined,
              borderColor: status === 'approved' || status === 'joined' ? 'var(--success)' : undefined,
              color: status === 'approved' || status === 'joined' ? '#fff' : undefined,
              opacity: disabled && status !== 'approved' && status !== 'joined' ? 0.7 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
            {btnIcon}
            {btnLabel}
          </button>
        )}
      </div>
    </motion.div>
  );
}
