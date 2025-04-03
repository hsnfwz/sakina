import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getDiscussionViewsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEWEST
) {
  try {
    const { data, error } = await supabase
      .from('view_discussion_views')
      .select(
        '*, discussion_user:discussion_user_id(*), discussion_views_user:discussion_views_user_id(*) discussion:discussion_id(*)'
      )
      .eq('is_hidden', false)
      .eq('discussion_views_user_id', userId)
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

export { getDiscussionViewsByUserId };
