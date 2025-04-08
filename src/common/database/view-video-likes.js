import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getVideoLikesByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('view_video_likes')
      .select(
        '*, video_user:video_user_id(*), video_likes_user:video_likes_user_id(*), video:video_id(*)'
      )
      .eq('orientation', 'HORIZONTAL')
      .eq('is_hidden', false)
      .eq('video_likes_user_id', userId)
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

async function getClipLikesByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('view_video_likes')
      .select(
        '*, video_user:video_user_id(*), video_likes_user:video_likes_user_id(*), video:video_id(*)'
      )
      .eq('orientation', 'VERTICAL')
      .eq('is_hidden', false)
      .eq('video_likes_user_id', userId)
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

export { getVideoLikesByUserId, getClipLikesByUserId };
