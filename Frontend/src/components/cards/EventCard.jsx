import { motion } from 'framer-motion';
import { FiBookmark, FiCalendar, FiMapPin, FiClock } from 'react-icons/fi';

export default function EventCard({ item, onSave, saved, viewMode }){
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div 
      className="event-card card"
      whileHover={{ y: -4, scale: 1.01, boxShadow: 'var(--shadow-lg)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="card-header">
        <div className="card-meta">
          <span className="card-type">
            <FiCalendar />
            {item.category || 'Event'}
          </span>
          {item.location && (
            <span className="card-location">
              <FiMapPin />
              {item.location}
            </span>
          )}
        </div>
        {item.event_date && (
          <span className="card-date">
            <FiCalendar />
            {formatDate(item.event_date)}
          </span>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <p className="card-description">
          {item.description}
        </p>
        {item.start_time && (
          <div className="card-time">
            <FiClock />
            {formatTime(item.start_time)}
          </div>
        )}
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
