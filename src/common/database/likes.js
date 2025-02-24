import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getLike(profileId, postId) {
  try {
    const { data, error } = await supabase
      .from('likes')
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

async function addLike(profileId, postId) {
  try {
    const { data, error } = await supabase
      .from('likes')
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

async function removeLike(id) {
  try {
    const { error } = await supabase.from('likes').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export { getLike, addLike, removeLike };
