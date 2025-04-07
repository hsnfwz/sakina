import { supabase } from '../supabase';

async function getVideoViewByUserIdAndVideoId(userId, videoId) {
  try {
    const { data, error } = await supabase
      .from('video_views')
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

async function addVideoView(payload) {
  try {
    const { data, error } = await supabase
      .from('video_views')
      .insert(payload)
      .select('id');

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.log(error);

    return null;
  }
}

async function updateVideoView(id, payload) {
  try {
    const { data, error } = await supabase
      .from('video_views')
      .update(payload)
      .eq('id', id)
      .select('*');

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.log(error);

    return null;
  }
}

async function removeVideoView(id) {
  try {
    const { data, error } = await supabase
      .from('video_views')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export {
  getVideoViewByUserIdAndVideoId,
  addVideoView,
  updateVideoView,
  removeVideoView,
};
