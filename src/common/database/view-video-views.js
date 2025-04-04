import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getVideoViewsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('view_video_views')
      .select(
        '*, video_user:video_user_id(*), video_views_user:video_views_user_id(*) video:video_id(*)'
      )
      .eq('orientation', 'HORIZONTAL')
      .eq('is_hidden', false)
      .eq('video_views_user_id', userId)
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

async function getClipViewsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('view_video_views')
      .select(
        '*, video_user:video_user_id(*), video_views_user:video_views_user_id(*) video:video_id(*)'
      )
      .eq('orientation', 'VERTICAL')
      .eq('is_hidden', false)
      .eq('video_views_user_id', userId)
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

export { getVideoViewsByUserId, getClipViewsByUserId };
