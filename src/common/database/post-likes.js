import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getPostLike(profileId, postId) {
  try {
    const { data, error } = await supabase
      .from('post_likes')
      .select('*')
      .eq('user_id', profileId)
      .eq('post_id', postId);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function addPostLike(profileId, postId) {
  try {
    const { data, error } = await supabase
      .from('post_likes')
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

async function removePostLike(id) {
  try {
    const { error } = await supabase.from('post_likes').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export { getPostLike, addPostLike, removePostLike };
