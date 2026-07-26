import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiMessageSquare, FiSend, FiTrash2, FiArrowLeft, FiPlus, FiMessageCircle, FiClock, FiFileText } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { listClubsWithStatus, getMembers } from '../../api/clubs';
import { listAnnouncements } from '../../api/announcements';
import {
  fetchClubPosts,
  createClubPost,
  deleteClubPost,
  fetchPostComments,
  createPostComment,
  deletePostComment
} from '../../api/clubForum';

export default function ClubHub() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  
  const [club, setClub] = useState(null);
  const [members, setMembers] = useState([]);
  const [clubAnns, setClubAnns] = useState([]);
  const [posts, setPosts] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('discussion'); // 'discussion' | 'announcements' | 'members'
  
  // Post Form state
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  
  // Comments state
  const [expandedComments, setExpandedComments] = useState({}); // { [postId]: commentsArray }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: string }
  const [submittingComment, setSubmittingComment] = useState({}); // { [postId]: boolean }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        // Get clubs list with status to locate this specific club
        const [clubsList, allAnns] = await Promise.all([
          listClubsWithStatus(token),
          listAnnouncements()
        ]);
        
        const currentClub = clubsList.find(c => String(c.id) === String(clubId));
        if (!currentClub) {
          navigate(-1);
          return;
        }
        setClub(currentClub);

        // Fetch club members
        const memList = await getMembers(token, clubId);
        setMembers(memList);

        // Filter club announcements
        const clubSpecificAnns = allAnns.filter(ann => String(ann.club_id) === String(clubId));
        setClubAnns(clubSpecificAnns);

        // Fetch club posts
        const clubPosts = await fetchClubPosts(token, clubId);
        setPosts(clubPosts);
      } catch (err) {
        console.error('Failed to load club details:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [clubId, token, navigate]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    try {
      setSubmittingPost(true);
      const newPost = await createClubPost(token, clubId, postTitle, postContent);
      if (newPost) {
        setPosts(prev => [newPost, ...prev]);
        setPostTitle('');
        setPostContent('');
        setShowPostForm(false);
      }
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const ok = await deleteClubPost(token, clubId, postId);
      if (ok) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        setExpandedComments(prev => {
          const next = { ...prev };
          delete next[postId];
          return next;
        });
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleToggleComments = async (postId) => {
    if (expandedComments[postId]) {
      setExpandedComments(prev => {
        const next = { ...prev };
        delete next[postId];
        return next;
      });
    } else {
      try {
        const comments = await fetchPostComments(token, postId);
        setExpandedComments(prev => ({ ...prev, [postId]: comments }));
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
  };

  const handlePostComment = async (e, postId) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(prev => ({ ...prev, [postId]: true }));
      const newComment = await createPostComment(token, postId, commentText);
      if (newComment) {
        setExpandedComments(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), newComment]
        }));
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Failed to create comment:', err);
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      const ok = await deletePostComment(token, postId, commentId);
      if (ok) {
        setExpandedComments(prev => ({
          ...prev,
          [postId]: (prev[postId] || []).filter(c => c.id !== commentId)
        }));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="skeleton-grid" style={{ padding: '2rem 0' }}>
          <div className="skeleton" style={{ height: '200px', borderRadius: '12px' }}></div>
          <div className="skeleton" style={{ height: '300px', borderRadius: '12px' }}></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!club) return null;

  const isApprovedMember = club.membership_status === 'joined' || club.membership_status === 'approved' || user?.role === 'admin';

  return (
    <DashboardLayout>
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-ghost btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem', padding: '0.4rem' }}
        >
          <FiArrowLeft /> Back to Clubs
        </button>
      </div>

      {/* Club Banner Header */}
      <div className="card" style={{
        padding: '0',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '2rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{
          height: '180px',
          background: club.image_url ? `url(${club.image_url}) center/cover no-repeat` : 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          position: 'relative'
        }}>
          {!club.image_url && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              color: 'rgba(255,255,255,0.85)',
              fontSize: '3.5rem',
              fontWeight: 800
            }}>
              {club.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '2rem', color: 'var(--text-primary)' }}>{club.name}</h1>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)', lineHeight: 1.5, maxWidth: '800px' }}>
                {club.description || 'Welcome to the club page. Join this community to participate in discussion groups, organize meetups, and keep in touch.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-secondary)', padding: '0.5rem 1rem', borderRadius: '100px', border: '1px solid var(--border)' }}>
              <FiUsers style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                {members.length} {members.length === 1 ? 'Member' : 'Members'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border)',
        marginBottom: '2rem',
        gap: '1.5rem'
      }}>
        <button
          onClick={() => setActiveTab('discussion')}
          style={{
            padding: '0.75rem 0.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'discussion' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'discussion' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'discussion' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 'var(--font-size-md)',
            transition: 'all 0.2s ease'
          }}
        >
          Discussion Board
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          style={{
            padding: '0.75rem 0.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'announcements' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'announcements' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'announcements' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 'var(--font-size-md)',
            transition: 'all 0.2s ease'
          }}
        >
          Announcements ({clubAnns.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          style={{
            padding: '0.75rem 0.25rem',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'members' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'members' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'members' ? 700 : 500,
            cursor: 'pointer',
            fontSize: 'var(--font-size-md)',
            transition: 'all 0.2s ease'
          }}
        >
          Members List
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'discussion' && (
          <div>
            {!isApprovedMember ? (
              <div className="empty-state" style={{ padding: '3rem' }}>
                <FiMessageSquare style={{ fontSize: '3rem', color: 'var(--muted)', marginBottom: '1rem' }} />
                <h3 className="empty-state-title">Discussion Board is Private</h3>
                <p className="empty-state-description" style={{ maxWidth: '450px' }}>
                  Only approved members of this club can view the forum posts and participate in discussion threads. Please request to join the club to get access.
                </p>
              </div>
            ) : (
              <div>
                {/* Header Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className="section-title" style={{ margin: 0 }}>Community Posts</h2>
                  <button 
                    onClick={() => setShowPostForm(!showPostForm)} 
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <FiPlus /> {showPostForm ? 'Cancel' : 'New Post'}
                  </button>
                </div>

                {/* Create Post Form */}
                <AnimatePresence>
                  {showPostForm && (
                    <motion.form 
                      onSubmit={handleCreatePost}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="card"
                      style={{ overflow: 'hidden', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gap: '1rem', border: '1px solid var(--primary)' }}
                    >
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Create New Discussion Thread</h3>
                      <div style={{ display: 'grid', gap: '0.4rem' }}>
                        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Title</label>
                        <input
                          type="text"
                          required
                          value={postTitle}
                          onChange={e => setPostTitle(e.target.value)}
                          placeholder="What is on your mind?"
                          className="input"
                        />
                      </div>
                      <div style={{ display: 'grid', gap: '0.4rem' }}>
                        <label style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>Content</label>
                        <textarea
                          required
                          rows={4}
                          value={postContent}
                          onChange={e => setPostContent(e.target.value)}
                          placeholder="Provide details for your discussion..."
                          className="input"
                          style={{ fontFamily: 'inherit', resize: 'vertical' }}
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={submittingPost} 
                        className="btn btn-primary"
                        style={{ justifySelf: 'start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                      >
                        <FiSend /> {submittingPost ? 'Posting...' : 'Publish Post'}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Posts List */}
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {posts.length === 0 ? (
                    <div className="empty-state" style={{ padding: '3rem' }}>
                      <FiMessageCircle style={{ fontSize: '2.5rem', color: 'var(--muted)', marginBottom: '0.75rem' }} />
                      <h3 className="empty-state-title">No threads yet</h3>
                      <p className="empty-state-description">Be the first one to start a conversation in this club!</p>
                    </div>
                  ) : (
                    posts.map(post => {
                      const commentsList = expandedComments[post.id] || [];
                      const isExpanded = !!expandedComments[post.id];
                      const canDelete = post.user_id === user?.id || user?.role === 'admin';

                      return (
                        <div 
                          key={post.id} 
                          className="card"
                          style={{
                            padding: '1.5rem',
                            border: '1px solid var(--border)',
                            borderRadius: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                            <div>
                              <h3 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                                {post.title}
                              </h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--muted)' }}>
                                <span style={{ fontWeight: 650, color: 'var(--text-secondary)' }}>
                                  {post.user?.name || 'Anonymous User'}
                                </span>
                                <span>•</span>
                                <FiClock />
                                <span>{new Date(post.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                              </div>
                            </div>
                            {canDelete && (
                              <button 
                                onClick={() => handleDeletePost(post.id)}
                                className="btn btn-ghost btn-sm" 
                                style={{ color: 'var(--danger)', padding: '0.3rem' }}
                                title="Delete Post"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                          
                          <p style={{ margin: '0 0 1.25rem 0', lineHeight: 1.6, fontSize: '0.95rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                            {post.content}
                          </p>

                          {/* Footer Actions */}
                          <div style={{ display: 'flex', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', gap: '1rem' }}>
                            <button
                              onClick={() => handleToggleComments(post.id)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                border: 'none',
                                background: 'none',
                                color: 'var(--primary)',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              <FiMessageCircle /> {isExpanded ? 'Hide Discussion' : 'Join Discussion'}
                            </button>
                          </div>

                          {/* Expandable Comments Drawer */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                style={{ overflow: 'hidden', marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}
                              >
                                <div style={{ display: 'grid', gap: '0.75rem', marginBottom: '1rem' }}>
                                  {commentsList.map(comm => {
                                    const canDeleteComment = comm.user_id === user?.id || user?.role === 'admin';
                                    return (
                                      <div 
                                        key={comm.id} 
                                        style={{ 
                                          background: 'var(--bg-secondary)', 
                                          padding: '0.75rem 1rem', 
                                          borderRadius: '8px', 
                                          border: '1px solid var(--border)',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'flex-start'
                                        }}
                                      >
                                        <div style={{ flex: 1 }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                                            <span style={{ fontWeight: 650, color: 'var(--text-primary)' }}>
                                              {comm.user?.name || 'User'}
                                            </span>
                                            <span style={{ color: 'var(--muted)' }}>
                                              {new Date(comm.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          </div>
                                          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                                            {comm.content}
                                          </p>
                                        </div>
                                        {canDeleteComment && (
                                          <button 
                                            onClick={() => handleDeleteComment(post.id, comm.id)}
                                            style={{ color: 'var(--danger)', border: 'none', background: 'none', cursor: 'pointer', padding: '0.2rem' }}
                                          >
                                            <FiTrash2 size={13} />
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Comment input form */}
                                <form 
                                  onSubmit={(e) => handlePostComment(e, post.id)} 
                                  style={{ display: 'flex', gap: '0.5rem' }}
                                >
                                  <input
                                    type="text"
                                    required
                                    value={commentInputs[post.id] || ''}
                                    onChange={e => {
                                      const text = e.target.value;
                                      setCommentInputs(prev => ({ ...prev, [post.id]: text }));
                                    }}
                                    placeholder="Write a response..."
                                    className="input"
                                    style={{ flex: 1, height: '36px', fontSize: '0.9rem' }}
                                  />
                                  <button
                                    type="submit"
                                    disabled={submittingComment[post.id]}
                                    className="btn btn-primary"
                                    style={{ padding: '0 0.8rem', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                  >
                                    <FiSend size={14} />
                                  </button>
                                </form>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'announcements' && (
          <div style={{ display: 'grid', gap: '1.2rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Official Club Announcements</h2>
            {clubAnns.length === 0 ? (
              <div className="empty-state" style={{ padding: '3rem' }}>
                <FiFileText style={{ fontSize: '2.5rem', color: 'var(--muted)', marginBottom: '0.75rem' }} />
                <h3 className="empty-state-title">No announcements</h3>
                <p className="empty-state-description">This club hasn't published any official announcements yet.</p>
              </div>
            ) : (
              clubAnns.map(ann => (
                <div key={ann.id} className="card" style={{ padding: '1.25rem', border: '1px solid var(--border)' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    color: 'var(--primary)',
                    letterSpacing: '0.05em',
                    display: 'inline-block',
                    marginBottom: '0.5rem'
                  }}>
                    {ann.type || 'General'}
                  </span>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.1rem' }}>{ann.title}</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {ann.description}
                  </p>
                  <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--muted)' }}>
                    Published on {new Date(ann.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div>
            <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Club Members ({members.length})</h2>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
              {members.map(member => (
                <div 
                  key={member.user_id} 
                  className="card"
                  style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    border: '1px solid var(--border)'
                  }}>
                    {member.name?.charAt(0).toUpperCase() || 'M'}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{member.name}</h4>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      background: member.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: member.role === 'admin' ? 'var(--danger)' : 'var(--success)',
                      display: 'inline-block',
                      marginTop: '0.2rem'
                    }}>
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
