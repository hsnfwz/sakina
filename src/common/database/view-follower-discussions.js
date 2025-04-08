import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getFollowerDiscussionsBySenderUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('view_follower_discussions')
      .select(
        '*, discussion_user:discussion_user_id(*), followers_sender_user:followers_sender_user_id(*), followers_receiver_user:followers_receiver_user_id(*)'
      )
      .eq('is_hidden', false)
      .eq('is_anonymous', false)
      .eq('followers_sender_user_id', userId)
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

export { getFollowerDiscussionsBySenderUserId };
