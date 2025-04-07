import { supabase } from '../supabase';

async function getVideoLikeByUserIdAndVideoId(userId, videoId) {
  try {
    const { data, error } = await supabase
      .from('video_likes')
      .select('id')
      .eq('video_id', videoId)
      .eq('user_id', userId);

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.log(error);

    return null;
  }
}

async function addVideoLike(payload) {
  try {
    const { data, error } = await supabase
      .from('video_likes')
      .insert(payload)
      .select('id');

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.log(error);

    return null;
  }
}

async function removeVideoLike(id) {
  try {
    const { data, error } = await supabase
      .from('video_likes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export { getVideoLikeByUserIdAndVideoId, addVideoLike, removeVideoLike };
