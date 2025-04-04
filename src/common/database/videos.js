import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';
import { getTodayAndLastWeekDateISO } from '../helpers';

async function getVideos(
  orientation = 'HORIZONTAL',
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', orientation)
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

async function getWeeklyVideos(
  orientation = 'HORIZONTAL',
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.LATEST
) {
  try {
    const { today, lastWeek } = getTodayAndLastWeekDateISO();

    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', orientation)
      .eq('is_hidden', false)
      .gte('updated_at', lastWeek)
      .lte('updated_at', today)
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

async function getVideosBySearchTerm(
  searchTerm,
  orientation = 'HORIZONTAL',
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
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
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', orientation)
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

async function getVideosByUserId(
  userId,
  orientation = 'HORIZONTAL',
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', orientation)
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

async function getVideoById(id) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .eq('id', id);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
    };
  }
}

async function getHiddenVideosByUserId(
  userId,
  orientation = 'HORIZONTAL',
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', orientation)
      .eq('is_hidden', true)
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

async function updateVideoById(id, payload) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);

    return {
      data: null,
    };
  }
}

export {
  getVideos,
  getWeeklyVideos,
  getVideosBySearchTerm,
  getVideosByUserId,
  getVideoById,
  getHiddenVideosByUserId,
  updateVideoById,
};
