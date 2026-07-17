import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from '../../layouts/PublicLayout';
import MegaphoneIcon from '../../components/icons/MegaphoneIcon';
import EventsIcon from '../../components/icons/EventsIcon';
import ClubsIcon from '../../components/icons/ClubsIcon';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

export default function Landing(){
  return (
    <PublicLayout>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1rem' }}>
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}
        >
          {/* Tagline Badge */}
          <motion.div 
            variants={itemVariants}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 1rem',
              borderRadius: '999px',
              background: 'var(--primary-50)',
              border: '1px solid var(--primary-100)',
              color: 'var(--primary)',
              fontSize: 'var(--font-size-xs)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <span>✨ Introducing CampusConnect v2.0</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            style={{
              fontSize: 'calc(1.8rem + 2vw)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0.5rem 0',
              fontFamily: 'var(--font-sans)',
              background: 'linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Your entire campus life,<br />connected in one place.
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            style={{
              fontSize: 'var(--font-size-lg)',
              color: 'var(--text-secondary)',
              maxWidth: '600px',
              margin: '0 auto 1.5rem auto',
              lineHeight: 1.6
            }}
          >
            A high-performance engagement hub designed to sync students, faculty, and administrators through announcements, events, and clubs.
          </motion.p>

          {/* Call to Actions */}
          <motion.div 
            variants={itemVariants}
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginBottom: '4rem'
            }}
          >
            <Link to="/signup" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Create Account <FiArrowRight />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            variants={itemVariants}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              width: '100%',
              textAlign: 'left'
            }}
          >
            <motion.div 
              className="card"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--primary-50)',
                color: 'var(--primary)',
                display: 'grid',
                placeItems: 'center'
              }}>
                <MegaphoneIcon width={24} height={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, margin: 0 }}>Smart Announcements</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                Filter notifications by department or relevance. Reach the entire campus instantly or target specific student years.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--accent-50)',
                color: 'var(--accent)',
                display: 'grid',
                placeItems: 'center'
              }}>
                <EventsIcon width={24} height={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, margin: 0 }}>Campus Events</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                Discover lectures, technical workshops, and social meetups. Save events directly to your personal dashboard feed.
              </p>
            </motion.div>

            <motion.div 
              className="card"
              style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'var(--success-50)',
                color: 'var(--success)',
                display: 'grid',
                placeItems: 'center'
              }}>
                <ClubsIcon width={24} height={24} />
              </div>
              <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, margin: 0 }}>Vibrant Clubs</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 'var(--font-size-sm)', lineHeight: 1.5 }}>
                Find student chapters and interest circles. Send membership requests and stay synced with group announcements.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </PublicLayout>
  );
}
