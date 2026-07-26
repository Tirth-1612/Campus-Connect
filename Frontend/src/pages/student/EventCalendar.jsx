import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiFilter, FiBookmark, FiCheck, FiInfo, FiX, FiClock, FiMapPin, FiUser } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { listEvents } from '../../api/events';
import { listSaved, saveItem } from '../../api/saved';

const CATEGORY_COLORS = {
  academic: { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', marker: '#0284c7' },
  placement: { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca', marker: '#dc2626' },
  cultural: { bg: '#f3e8ff', text: '#6b21a8', border: '#e9d5ff', marker: '#9333ea' },
  sports: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', marker: '#059669' },
  general: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb', marker: '#4b5563' }
};

export default function EventCalendar() {
  const { token } = useAuth();
  
  const [events, setEvents] = useState([]);
  const [savedEvents, setSavedEvents] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Date State
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDept, setSelectedDept] = useState('all');
  
  // Selected Event Detail Modal State
  const [selectedEvent, setSelectedEvent] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [evs, saved] = await Promise.all([
          listEvents(),
          listSaved(token)
        ]);
        
        setEvents(evs || []);
        
        const se = new Set();
        (saved || []).forEach(s => {
          if (s.item_type === 'event') se.add(s.item_id);
        });
        setSavedEvents(se);
      } catch (err) {
        setError('Failed to load events calendar');
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleSaveToggle = async (item) => {
    try {
      const saved = await saveItem(token, item.id, 'event');
      if (saved === true) {
        setSavedEvents(prev => {
          const next = new Set(prev);
          next.add(item.id);
          return next;
        });
      } else if (saved === false) {
        setSavedEvents(prev => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }
    } catch (err) {
      console.error('Error toggling RSVP:', err);
    }
  };

  // Calendar calculations
  const calendarCells = useMemo(() => {
    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Day of the week the month starts on (0 = Sunday, ..., 6 = Saturday)
    const firstDayOfWeek = new Date(year, month, 1).getDay();
    
    const cells = [];
    
    // Previous month cells for padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      cells.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Current month cells
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month cells to complete the grid (usually 42 cells total for 6 rows of 7 days)
    const remainingCells = 42 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return cells;
  }, [year, month]);

  // Unique categories and departments for filter selectors
  const categories = useMemo(() => {
    const list = events.map(e => e.category).filter(Boolean);
    return ['all', ...new Set(list)];
  }, [events]);

  const departments = useMemo(() => {
    const list = events.map(e => e.department).filter(Boolean);
    return ['all', ...new Set(list)];
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(ev => {
      const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
      const matchesDept = selectedDept === 'all' || ev.department === selectedDept;
      return matchesCategory && matchesDept;
    });
  }, [events, selectedCategory, selectedDept]);

  // Map events to date strings (YYYY-MM-DD) for lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach(ev => {
      if (ev.event_date) {
        const dateStr = new Date(ev.event_date).toISOString().split('T')[0];
        if (!map[dateStr]) map[dateStr] = [];
        map[dateStr].push(ev);
      }
    });
    return map;
  }, [filteredEvents]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const setToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 className="page-title">Campus Event Calendar</h1>
          <p className="page-subtitle">
            Explore schedule, filter events by category or department, and register for RSVPs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={setToday} className="btn btn-ghost btn-sm" style={{ fontWeight: 650 }}>
            Today
          </button>
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <button onClick={prevMonth} style={{ padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <FiChevronLeft />
            </button>
            <span style={{ padding: '0 0.5rem', fontWeight: 700, fontSize: '0.95rem', minWidth: '130px', textAlign: 'center' }}>
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} style={{ padding: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1rem 1.5rem', marginBottom: '2rem', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
            <FiFilter /> Filter Calendar:
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="select"
              style={{ padding: '0.35rem 2rem 0.35rem 0.75rem', height: 'auto', fontSize: '0.85rem' }}
            >
              <option value="all">All Categories</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Department</label>
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="select"
              style={{ padding: '0.35rem 2rem 0.35rem 0.75rem', height: 'auto', fontSize: '0.85rem' }}
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border)', borderRadius: '16px' }}>
        {/* Days of week header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)',
          textAlign: 'center',
          fontWeight: 700,
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ padding: '0.75rem 0' }}>{d}</div>
          ))}
        </div>

        {/* Days cells */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridAutoRows: 'minmax(120px, auto)',
          background: 'var(--border)' // creates lines in gaps
          // gap: '1px' // if we want distinct boundaries
        }}>
          {calendarCells.map((cell, idx) => {
            const dateStr = cell.date.toISOString().split('T')[0];
            const dateEvents = eventsByDate[dateStr] || [];
            const isTodayCell = isToday(cell.date);

            return (
              <div
                key={idx}
                style={{
                  background: cell.isCurrentMonth ? 'var(--card-bg)' : 'var(--bg-secondary)',
                  opacity: cell.isCurrentMonth ? 1 : 0.5,
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  borderRight: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                  position: 'relative'
                }}
              >
                {/* Date number */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  fontSize: '0.85rem',
                  fontWeight: isTodayCell ? 800 : 500,
                  background: isTodayCell ? 'var(--primary)' : 'transparent',
                  color: isTodayCell ? '#ffffff' : 'var(--text-primary)',
                  marginBottom: '0.25rem'
                }}>
                  {cell.date.getDate()}
                </div>

                {/* Date events list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto', flex: 1, maxHeight: '90px' }}>
                  {dateEvents.map(ev => {
                    const style = CATEGORY_COLORS[ev.category?.toLowerCase()] || CATEGORY_COLORS.general;
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedEvent(ev)}
                        style={{
                          border: `1px solid ${style.border}`,
                          background: style.bg,
                          color: style.text,
                          padding: '0.15rem 0.35rem',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 650,
                          textAlign: 'left',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: style.marker, flexShrink: 0 }}></span>
                        {ev.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Overlay Sidebar / Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(4px)'
          }}>
            {/* Modal Backdrop click */}
            <div 
              style={{ position: 'absolute', inset: 0 }} 
              onClick={() => setSelectedEvent(null)}
            />

            {/* Event sidebar panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                width: '100%',
                maxWidth: '460px',
                height: '100%',
                background: 'var(--card-bg)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: '1px solid var(--border)'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 'var(--font-size-md)', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  <FiInfo /> Event Details
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem'
                  }}
                >
                  <FiX />
                </button>
              </div>

              {/* Content body */}
              <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '100px',
                    background: CATEGORY_COLORS[selectedEvent.category?.toLowerCase()]?.bg || CATEGORY_COLORS.general.bg,
                    color: CATEGORY_COLORS[selectedEvent.category?.toLowerCase()]?.text || CATEGORY_COLORS.general.text,
                    border: `1px solid ${CATEGORY_COLORS[selectedEvent.category?.toLowerCase()]?.border || CATEGORY_COLORS.general.border}`,
                    display: 'inline-block',
                    marginBottom: '0.75rem'
                  }}>
                    {selectedEvent.category || 'General'}
                  </span>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: '1.6rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>
                    {selectedEvent.title}
                  </h2>
                </div>

                <div style={{ display: 'grid', gap: '0.75rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'var(--font-size-sm)' }}>
                    <FiCalendar style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 650, color: 'var(--text-primary)' }}>Date</div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {new Date(selectedEvent.event_date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'var(--font-size-sm)' }}>
                    <FiClock style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontWeight: 650, color: 'var(--text-primary)' }}>Time</div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        {new Date(selectedEvent.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  {selectedEvent.department && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: 'var(--font-size-sm)' }}>
                      <FiMapPin style={{ color: 'var(--primary)' }} />
                      <div>
                        <div style={{ fontWeight: 650, color: 'var(--text-primary)' }}>Target Department</div>
                        <div style={{ color: 'var(--text-secondary)' }}>{selectedEvent.department}</div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--text-primary)' }}>Description</h4>
                  <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                    {selectedEvent.description || 'No description provided for this campus event.'}
                  </p>
                </div>
              </div>

              {/* Action footer */}
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                display: 'flex',
                justifyContent: 'stretch'
              }}>
                <button
                  onClick={() => handleSaveToggle(selectedEvent)}
                  className={`btn ${savedEvents.has(selectedEvent.id) ? 'btn-success' : 'btn-primary'}`}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: savedEvents.has(selectedEvent.id) ? 'var(--success)' : 'var(--primary)',
                    color: '#ffffff'
                  }}
                >
                  {savedEvents.has(selectedEvent.id) ? (
                    <>
                      <FiCheck /> Registered RSVP
                    </>
                  ) : (
                    <>
                      <FiBookmark /> RSVP / Save Event
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
