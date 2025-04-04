import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';
import { getTodayAndLastWeekDateISO } from '../helpers';

async function getDiscussions(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('discussions')
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

async function getWeeklyDiscussions(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.LATEST
) {
  try {
    const { today, lastWeek } = getTodayAndLastWeekDateISO();

    const { data, error } = await supabase
      .from('discussions')
      .select('*, user:user_id(*)')
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

async function getDiscussionsBySearchTerm(
  searchTerm,
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
      .from('discussions')
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

async function getDiscussionsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('discussions')
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

async function getDiscussionById(id) {
  try {
    const { data, error } = await supabase
      .from('discussions')
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

async function getHiddenDiscussionsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select('*, user:user_id(*)')
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

async function addDiscussion(payload) {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .insert(payload)
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

async function updateDiscussionById(id, payload) {
  try {
    const { data, error } = await supabase
      .from('discussions')
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

async function getCommentsByParentDiscussionId(
  parentDiscussionId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .eq('parent_discussion_id', parentDiscussionId)
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

async function getPendingPostsCount() {
  try {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'estimated', head: true })
      .eq('status', 'PENDING');

    if (error) throw error;

    return {
      count,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedPostsByReceiverProfileIds(
  receiverProfileIds,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('is_archived', false)
      .eq('is_anonymous', false)
      .in('user_id', receiverProfileIds)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

export {
  getDiscussions,
  getWeeklyDiscussions,
  getDiscussionsBySearchTerm,
  getDiscussionsByUserId,
  getDiscussionById,
  getHiddenDiscussionsByUserId,
  addDiscussion,
  updateDiscussionById,
  getCommentsByParentDiscussionId,
  getPendingPostsCount,
  getAcceptedPostsByReceiverProfileIds,
};
