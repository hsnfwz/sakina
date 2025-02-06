import { createClient } from '@supabase/supabase-js';
import { ORDER_BY } from './enums';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function searchProfiles(
  searchTerm,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const query = searchTerm.toLowerCase().trim();

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .or(`display_name.ilike.%${query}%,username.ilike.%${query}%`)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getProfiles(startIndex = 0, limit = 6, orderBy = ORDER_BY.NEW) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
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

async function getProfileByUsername(username) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getFollowersByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, sender_user_id(*)')
      .eq('receiver_user_id', profileId)
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

async function getFollowingByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('followers')
      .select('*, receiver_user_id(*)')
      .eq('sender_user_id', profileId)
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

async function getViewedPostsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('views')
      .select('*, post_id(*)')
      .eq('user_id', profileId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    await getPostImagesVideos(data);

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

export {
  supabase,
  searchProfiles,
  getProfiles,
  getFollowersByProfileId,
  getFollowingByProfileId,
  getProfileByUsername,
  getViewedPostsByProfileId,
};
