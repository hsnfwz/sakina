import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getCommentsByPostId(
  postId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        '*, user:user_id(*), post:post_id(*, user:user_id(*)), parentComment:parent_comment_id(*, user:user_id(*))'
      )
      .eq('post_id', postId)
      .eq('is_archived', false)
      .is('parent_comment_id', null)
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

async function getCommentsByParentCommentId(
  parentCommentId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        '*, user:user_id(*), post:post_id(*, user:user_id(*)), parentComment:parent_comment_id(*, user:user_id(*))'
      )
      .eq('parent_comment_id', parentCommentId)
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

async function getCommentById(id) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(
        '*, user:user_id(*), post:post_id(*, user:user_id(*)), parentComment:parent_comment_id(*, user:user_id(*))'
      )
      .eq('is_archived', false)
      .eq('id', id);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

export {
  getCommentsByPostId,
  getCommentsByParentCommentId,
  getCommentById,
};
