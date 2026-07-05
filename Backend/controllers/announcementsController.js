import { supabase } from '../database.js';
import { insertDynamic, selectAll } from '../modules/dbUtil.js';

// Public: list announcements with optional filters department, type
async function listAnnouncements(req, res) {
  try {
    const { department, type } = req.query || {};
    const rows = await selectAll('announcements', { department, type });
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Protected: create announcement with role-based rules
//role,type,title is cumpulsory, description is optional
async function createAnnouncement(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const role = req.user.role;
    if (role === 'student') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const body = req.body || {};
    // Basic validation
    const allowedTypes = ['Club', 'Academic', 'Internship', 'Placement'];
    if (!body.type || !allowedTypes.includes(body.type)) {
      return res.status(400).json({ error: 'Invalid or missing type' });
    }
    if (role === 'club' && !body.club_id) {
      return res.status(400).json({ error: 'club_id is required for club announcements' });
    }
    // Enforce type rules
    const type = (body.type || '').trim();

    if (role === 'club') {
      if (type !== 'Club') {
        return res.status(403).json({ error: 'Forbidden' });
      }
      // Verify club membership
      const { data: clubCheck, error: ccErr } = await supabase
        .from('user_clubs')
        .select('user_id')
        .eq('user_id', req.user.userId)
        .eq('club_id', body.club_id)
        .limit(1);
      if (ccErr) return res.status(500).json({ error: ccErr.message });
      if (!clubCheck || !clubCheck.length) {
        return res.status(403).json({ error: 'Forbidden: not a member of the club' });
      }
    }
    if (role === 'faculty') {
      const allowed = ['Academic', 'Internship', 'Placement'];
      if (!allowed.includes(type)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    }
    // admin allowed all

    const data = {
      ...body,
      created_by: req.user.userId,
    };

    const inserted = await insertDynamic('announcements', data);
    return res.status(201).json(inserted);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { listAnnouncements, createAnnouncement };
