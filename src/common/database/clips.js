import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getClips(startIndex = 0, limit = 6, orderBy = ORDER_BY.NEW) {
  try {
    const { data, error } = await supabase
      .from('clips')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
  }
}

async function getClipsBySearchTerm(
  searchTerm,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const query = searchTerm.toLowerCase().trim();

    if (query.length === 0) {
      return {
        data: [],
        hasMore: false,
      };
    }

    const { data, error } = await supabase
      .from('clips')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
  }
}

async function getClipsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('clips')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .eq('user_id', userId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
  }
}

export { getClips, getClipsBySearchTerm, getClipsByUserId };
