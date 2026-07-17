import { motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export default function PublicLayout({ children }){
  return (
    <div className="app-shell">
      <Header />
      <main className="container app-main" style={{ minHeight: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1 }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
