import { supabase } from '../supabase';

async function getDiscussionViewByUserIdAndDiscussionId(userId, discussionId) {
  try {
    const { data, error } = await supabase
      .from('discussion_views')
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

async function addDiscussionView(payload) {
  try {
    const { data, error } = await supabase
      .from('discussion_views')
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

async function updateDiscussionView(id, payload) {
  try {
    const { data, error } = await supabase
      .from('discussion_views')
      .update(payload)
      .eq('id', id)
      .select('*');

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

async function removeDiscussionView(id) {
  try {
    const { data, error } = await supabase
      .from('discussion_views')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export {
  getDiscussionViewByUserIdAndDiscussionId,
  addDiscussionView,
  updateDiscussionView,
  removeDiscussionView,
};
