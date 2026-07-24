import { supabase } from '../database.js';
import { hashPassword, comparePassword, signToken } from '../modules/auth.js';

//req : name,email,password,role,department,year
async function signup(req, res) {
  try {
    console.log('signup start', req.body?.email);
    const {name,department,year, email, password, role } = req.body || {};
    if (!email || !password || !role) {
      console.log('signup missing fields');
      return res.status(400).json({ error: 'email, password, and role are required' });
    }
    const allowedRoles = ['student', 'faculty'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'invalid role' });
    }
    console.log('signup before existence check');
    const { data: existing, error: existErr } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .limit(1);
    console.log('signup after existence check', { existing, existErr });
    if (existErr) {
      console.error(existErr);
      return res.status(500).json({ error: existErr.message || 'Database query failed' });
    }
    if (existing && existing.length) {
      return res.status(400).json({ error: 'email already in use' });
    }
    console.log('signup before hash');
    const password_hash = await hashPassword(password);
    console.log('signup after hash');
    const { data: inserted, error: insErr } = await supabase
      .from('users')
      .insert([{ name, email, password_hash, role, department, year, interests: [] }])
      .select('id, name, email, role, department, year, interests')
      .single();
    console.log('signup after insert', { inserted, insErr });
    if (insErr) {
      console.error(insErr);
      return res.status(500).json({ error: insErr.message || 'Unable to create account' });
    }
    const user = inserted;
    const token = signToken({ userId: user.id, role: user.role });
    return res.status(201).json({ token, user });
  } 
  catch (err) {
    console.error('Error in signup:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

//req : email,password,role
async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, role, department, year, interests, password_hash')
      .eq('email', email)
      .limit(1);
    if (error) {
      console.error(error);
      return res.status(500).json({ error: error.message || 'Database query failed' });
    }
    if (!users || !users.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const ok = await comparePassword(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ userId: user.id, role: user.role });
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name,
        email: user.email, 
        role: user.role,
        department: user.department,
        year: user.year,
        interests: user.interests || []
      } 
    });
  } 
  
  catch (err) {
    console.error('Error in login:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}

//can update dept,name, year, and interests
async function update(req,res){
  try{
    if(!req.user || !req.user.userId){
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = req.user.userId;
    const { name, department, year, password, interests } = req.body || {};

    const patch = {};
    if (typeof name === 'string' && name.trim().length) patch.name = name;
    if (typeof department === 'string' && department.trim().length) patch.department = department;
    if (year !== undefined && year !== null) patch.year = year;
    if (interests !== undefined && Array.isArray(interests)) patch.interests = interests;

    if (password !== undefined) {
      if (typeof password !== 'string' || password.length < 6) {
        return res.status(400).json({ error: 'Invalid password' });
      }
      patch.password_hash = await hashPassword(password);
    }

    if (!Object.keys(patch).length){
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const { data, error } = await supabase
      .from('users')
      .update(patch)
      .eq('id', userId)
      .select('id, name, email, role, department, year, interests')
      .single();
    if (error) return res.status(500).json({ error: 'Internal Server Error' });
    if (!data) return res.status(404).json({ error: 'User not found' });

    return res.json({ user: data });
  }
  catch(err){
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export { signup, login ,update };
