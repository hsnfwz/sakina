import { supabase } from "../supabase";

async function removeStorageVideoObject(fileName) {
  try {
    const { data, error } = await supabase.storage
      .from('videos')
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function removeStorageThumbnailObject(fileName) {
  try {
    const { data, error } = await supabase.storage
      .from('thumbnails')
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function removeStorageAvatarObject(fileName) {
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .remove([fileName]);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

export {
  removeStorageAvatarObject,
  removeStorageThumbnailObject,
  removeStorageVideoObject,
};
