import { supabase } from '../database.js';
import { insertDynamic, selectAll } from '../modules/dbUtil.js';

export async function listEvents(req, res) {
  try {
    const rows = await selectAll('events');
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

//title,role,starttime,category comulsory, description optional
export async function createEvent(req, res) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const role = req.user.role;
    const allowedCreators = ['faculty', 'admin'];
    if (!allowedCreators.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const body = req.body || {};
    console.log(body)
    // Validation
    const required = ['title', 'event_date']; 
    for (const f of required) {
      if (!body[f]) return res.status(400).json({ error: `${f} is required` });
    }
    const allowedCategories = ['Academic', 'Cultural', 'Technical', 'Sports'];
    if (body.category && !allowedCategories.includes(body.category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }
    const data = {
      ...body,
      created_by: req.user.userId,
    };

    const inserted = await insertDynamic('events', data);
    return res.status(201).json(inserted);
  } 
  catch (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

