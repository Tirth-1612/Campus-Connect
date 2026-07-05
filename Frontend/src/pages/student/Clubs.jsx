import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import ClubCard from '../../components/cards/ClubCard';
import { listClubsWithStatus, joinClub } from '../../api/clubs';
import { useAuth } from '../../contexts/AuthContext';
import { FiSearch, FiFilter, FiPlus, FiUsers, FiCalendar, FiBookOpen, FiGrid, FiList } from 'react-icons/fi';

export default function StudentClubs(){
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { token } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        setClubs(await listClubsWithStatus(token));
      } catch (err) {
        console.error('Failed to load clubs:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  async function onJoin(club){
    const ok = await joinClub(token, club.id);
    if (ok) {
      setClubs(prev => prev.map(c => 
        c.id === club.id ? { ...c, membership_status: 'pending' } : c
      ));
    }
  }

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterCategory === 'all' || club.category === filterCategory;
    return matchesSearch && matchesFilter;
  });

  const categories = [...new Set(clubs.map(club => club.category).filter(Boolean))];
  const joinedCount = clubs.filter(c => c.membership_status === 'joined').length;
  const pendingCount = clubs.filter(c => c.membership_status === 'pending').length;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Clubs</h1>
          <p className="page-subtitle">
            Discover and join vibrant campus communities
          </p>
        </div>
        <div className="page-actions">
          <div className="stats-summary">
            <div className="stat-item">
              <FiUsers />
              <span>{joinedCount} Joined</span>
            </div>
            <div className="stat-item">
              <FiCalendar />
              <span>{pendingCount} Pending</span>
            </div>
          </div>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="content-section">
        <div className="search-filters">
          <div className="search-bar">
            <FiSearch />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <div className="filter-dropdown">
            <FiFilter />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="select"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading && (
        <div className="content-section">
          <div className="skeleton-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton skeleton-card"></div>
            ))}
          </div>
        </div>
      )}

      {!loading && (
        <>
          {/* Available Clubs */}
          <div className="content-section">
            <div className="section-header">
              <div>
                <h2 className="section-title">Available Clubs</h2>
                <p className="section-subtitle">
                  {filteredClubs.filter(c => c.membership_status !== 'joined').length} clubs you can join
                </p>
              </div>
            </div>
            
            {filteredClubs.filter(c => c.membership_status !== 'joined').length > 0 ? (
              <div className={`grid ${viewMode === 'list' ? 'grid-list' : 'grid-auto'}`}>
                {filteredClubs
                  .filter(club => club.membership_status !== 'joined')
                  .map(club => (
                    <ClubCard 
                      key={club.id} 
                      club={club} 
                      onJoin={onJoin}
                      viewMode={viewMode}
                    />
                  ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FiUsers />
                </div>
                <h3 className="empty-state-title">No clubs found</h3>
                <p className="empty-state-description">
                  {searchTerm || filterCategory !== 'all' 
                    ? 'Try adjusting your search or filters to find clubs.'
                    : 'No clubs are currently available to join.'}
                </p>
              </div>
            )}
          </div>

          {/* Joined Clubs */}
          {clubs.filter(c => c.membership_status === 'joined').length > 0 && (
            <div className="content-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Your Clubs</h2>
                  <p className="section-subtitle">
                    Clubs you're already a member of
                  </p>
                </div>
              </div>
              <div className={`grid ${viewMode === 'list' ? 'grid-list' : 'grid-auto'}`}>
                {clubs
                  .filter(club => club.membership_status === 'joined')
                  .filter(club => {
                    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     club.description?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesFilter = filterCategory === 'all' || club.category === filterCategory;
                    return matchesSearch && matchesFilter;
                  })
                  .map(club => (
                    <ClubCard 
                      key={club.id} 
                      club={club} 
                      onJoin={onJoin}
                      viewMode={viewMode}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Pending Requests */}
          {clubs.filter(c => c.membership_status === 'pending').length > 0 && (
            <div className="content-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Pending Requests</h2>
                  <p className="section-subtitle">
                    Your club membership requests awaiting approval
                  </p>
                </div>
              </div>
              <div className={`grid ${viewMode === 'list' ? 'grid-list' : 'grid-auto'}`}>
                {clubs
                  .filter(club => club.membership_status === 'pending')
                  .filter(club => {
                    const matchesSearch = club.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     club.description?.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesFilter = filterCategory === 'all' || club.category === filterCategory;
                    return matchesSearch && matchesFilter;
                  })
                  .map(club => (
                    <ClubCard 
                      key={club.id} 
                      club={club} 
                      onJoin={onJoin}
                      viewMode={viewMode}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {filteredClubs.length === 0 && clubs.length > 0 && (
            <div className="content-section">
              <div className="empty-state">
                <div className="empty-state-icon">
                  <FiSearch />
                </div>
                <h3 className="empty-state-title">No matching clubs found</h3>
                <p className="empty-state-description">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
