import { supabase } from '../supabase';

async function addPostView(profileId, postId) {
  try {
    const { data, error } = await supabase
      .from('post_views')
      .insert({ user_id: profileId, post_id: postId })
      .select('*');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

export { addPostView };
