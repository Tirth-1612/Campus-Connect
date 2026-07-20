import { motion } from 'framer-motion';
import { FiBookmark, FiCalendar, FiTag } from 'react-icons/fi';

export default function AnnouncementCard({ item, onSave, saved }){
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div 
      className="announcement-card card"
      whileHover={{ y: -4, scale: 1.01, boxShadow: 'var(--shadow-lg)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="card-header">
        <div className="card-meta">
          <span className="card-type">
            <FiTag />
            {item.type || 'Announcement'}
          </span>
          {item.department && (
            <span className="card-department">{item.department}</span>
          )}
        </div>
        {item.created_at && (
          <span className="card-date">
            <FiCalendar />
            {formatDate(item.created_at)}
          </span>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-description">
          {item.description}
        </p>
      </div>

      <div className="card-footer">
        {onSave && (
          <button 
            className={`btn ${saved ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            onClick={() => onSave(item)}
            style={{ width: '100%' }}
          >
            <FiBookmark />
            {saved ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </motion.div>
  );
}
