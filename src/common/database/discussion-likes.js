import { supabase } from '../supabase';

async function getDiscussionLikeByUserIdAndDiscussionId(userId, discussionId) {
  try {
    const { data, error } = await supabase
      .from('discussion_likes')
      .select('id')
      .eq('discussion_id', discussionId)
      .eq('user_id', userId);

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

async function addDiscussionLike(payload) {
  try {
    const { data, error } = await supabase
      .from('discussion_likes')
      .insert(payload)
      .select('id');

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

async function removeDiscussionLike(id) {
  try {
    const { data, error } = await supabase
      .from('discussion_likes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export {
  getDiscussionLikeByUserIdAndDiscussionId,
  addDiscussionLike,
  removeDiscussionLike,
};
