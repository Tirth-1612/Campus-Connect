import { supabase } from '../database.js';

// GET /api/clubs/:clubId/posts
async function getClubPosts(req, res) {
  try {
    const clubId = req.params.clubId;
    if (!clubId) return res.status(400).json({ error: 'clubId is required' });

    // Verify user is a member of this club or is platform admin
    if (req.user.role !== 'admin') {
      const { data: member, error: memErr } = await supabase
        .from('user_clubs')
        .select('status')
        .eq('user_id', req.user.userId)
        .eq('club_id', clubId)
        .single();

      if (memErr || !member || member.status !== 'approved') {
        // Safe fallback in case user hasn't completed SQL setup yet
        return res.json([]);
      }
    }

    const { data: posts, error: postErr } = await supabase
      .from('club_posts')
      .select('*, user:users(name, email)')
      .eq('club_id', clubId)
      .order('created_at', { ascending: false });

    if (postErr) {
      console.error('Error fetching club posts:', postErr);
      return res.json([]); // return empty array on missing table/error for graceful fallback
    }

    return res.json(posts || []);
  } catch (err) {
    console.error('getClubPosts exception:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /api/clubs/:clubId/posts
async function createClubPost(req, res) {
  try {
    const clubId = req.params.clubId;
    const { title, content } = req.body || {};

    if (!title || !content) {
      return res.status(400).json({ error: 'title and content are required' });
    }

    // Verify user is approved member or admin
    if (req.user.role !== 'admin') {
      const { data: member, error: memErr } = await supabase
        .from('user_clubs')
        .select('status')
        .eq('user_id', req.user.userId)
        .eq('club_id', clubId)
        .single();

      if (memErr || !member || member.status !== 'approved') {
        return res.status(403).json({ error: 'Forbidden: You must be an approved member of this club' });
      }
    }

    const { data, error } = await supabase
      .from('club_posts')
      .insert([{
        club_id: clubId,
        user_id: req.user.userId,
        title: title.trim(),
        content: content.trim(),
        created_at: new Date().toISOString()
      }])
      .select('*, user:users(name, email)')
      .single();

    if (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('createClubPost exception:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE /api/clubs/:clubId/posts/:postId
async function deleteClubPost(req, res) {
  try {
    const { clubId, postId } = req.params;

    // Fetch the post to verify author
    const { data: post, error: fetchErr } = await supabase
      .from('club_posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (fetchErr || !post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    let isAuthorized = false;

    // Check if current user is the author
    if (post.user_id === req.user.userId) {
      isAuthorized = true;
    } else {
      // Check if current user is club admin or platform admin
      if (req.user.role === 'admin') {
        isAuthorized = true;
      } else {
        const { data: member, error: memErr } = await supabase
          .from('user_clubs')
          .select('role')
          .eq('user_id', req.user.userId)
          .eq('club_id', clubId)
          .single();

        if (!memErr && member && member.role === 'admin') {
          isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error: delErr } = await supabase
      .from('club_posts')
      .delete()
      .eq('id', postId);

    if (delErr) {
      return res.status(500).json({ error: delErr.message });
    }

    return res.json({ ok: true, message: 'Post deleted successfully' });
  } catch (err) {
    console.error('deleteClubPost exception:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// GET /api/clubs/posts/:postId/comments
async function getPostComments(req, res) {
  try {
    const postId = req.params.postId;

    const { data: comments, error: commErr } = await supabase
      .from('club_comments')
      .select('*, user:users(name, email)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (commErr) {
      console.error('Error fetching comments:', commErr);
      return res.json([]);
    }

    return res.json(comments || []);
  } catch (err) {
    console.error('getPostComments exception:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// POST /api/clubs/posts/:postId/comments
async function createPostComment(req, res) {
  try {
    const postId = req.params.postId;
    const { content } = req.body || {};

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }

    const { data, error } = await supabase
      .from('club_comments')
      .insert([{
        post_id: postId,
        user_id: req.user.userId,
        content: content.trim(),
        created_at: new Date().toISOString()
      }])
      .select('*, user:users(name, email)')
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('createPostComment exception:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// DELETE /api/clubs/posts/:postId/comments/:commentId
async function deletePostComment(req, res) {
  try {
    const { commentId } = req.params;

    const { data: comment, error: fetchErr } = await supabase
      .from('club_comments')
      .select('user_id')
      .eq('id', commentId)
      .single();

    if (fetchErr || !comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Only creator of comment or platform admin can delete comment
    if (comment.user_id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error: delErr } = await supabase
      .from('club_comments')
      .delete()
      .eq('id', commentId);

    if (delErr) {
      return res.status(500).json({ error: delErr.message });
    }

    return res.json({ ok: true, message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('deletePostComment exception:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export {
  getClubPosts,
  createClubPost,
  deleteClubPost,
  getPostComments,
  createPostComment,
  deletePostComment
};
