import { supabase } from '../database.js';

async function insertDynamic(table, data) {
  try {
    const { data: inserted, error } = await supabase
      .from(table)
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return inserted;
  } catch (error) {
    console.error(`insertDynamic failed for ${table}:`, error);
    return null;
  }
}

async function selectAll(table, filters = {}) {
  try {
    let query = supabase.from(table).select('*');
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null) query = query.eq(k, v);
    });
    query = query.order('created_at', { ascending: false });
    const { data, error } = await query;
    if (error) {
      if (error.code === 'PGRST205' || error.message?.includes('does not exist')) {
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error(`selectAll failed for ${table}:`, error);
    return [];
  }
}

export { insertDynamic, selectAll };
