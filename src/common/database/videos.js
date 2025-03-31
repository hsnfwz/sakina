import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getClips(startIndex = 0, limit = 6, orderBy = ORDER_BY.NEW) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'VERTICAL')
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
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'VERTICAL')
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
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'VERTICAL')
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

async function getClipById(id) {
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

async function getHiddenClipsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'VERTICAL')
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

async function updateClipById(id, payload) {
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

async function getVideos(startIndex = 0, limit = 6, orderBy = ORDER_BY.NEW) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'HORIZONTAL')
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

async function getVideosBySearchTerm(
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
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'HORIZONTAL')
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
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'HORIZONTAL')
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
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, user:user_id(*)')
      .eq('orientation', 'HORIZONTAL')
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
  getVideosBySearchTerm,
  getVideosByUserId,
  getVideoById,
  getHiddenVideosByUserId,
  updateVideoById,
  getClips,
  getClipsBySearchTerm,
  getClipsByUserId,
  getClipById,
  getHiddenClipsByUserId,
  updateClipById,
};
