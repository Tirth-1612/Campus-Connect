import { supabase } from '../database.js';

export async function getUsersCount(req, res){
  try{
    const { count, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ count: count || 0 });
  } catch(err){
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
