import { createClient } from '@supabase/supabase-js';
import { ORDER_BY } from './enums';

async function getPostById(postId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('id', postId);

    if (error) throw error;

    await getPostImagesVideos(data);

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedPostById(postId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('id', postId);

    if (error) throw error;

    await getPostImagesVideos(data);

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedPostsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'ACCEPTED')
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

async function getPendingPostsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'PENDING')
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

async function getRejectedPostsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'REJECTED')
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

async function getArchivedPostsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'ARCHIVED')
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

async function getAcceptedPosts(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'ACCEPTED')
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

async function getPendingPosts(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.OLD
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user_id(*)')
      .eq('status', 'PENDING')
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

async function getPostImagesVideos(posts) {
  const postIds = posts.map((post) => post.id);

  const [resultImages, resultVideos] = await Promise.all([
    supabase.from('images').select('*').in('post_id', postIds),
    supabase.from('videos').select('*').in('post_id', postIds),
  ]);

  if (resultImages.error) throw resultImages.error;
  if (resultVideos.error) throw resultVideos.error;

  posts.forEach((post) => {
    post.images = [];
    post.videos = [];

    resultImages.data.forEach((image) => {
      if (post.id === image.post_id) {
        post.images.push(image);
      }
    });
    resultVideos.data.forEach((video) => {
      if (post.id === video.post_id) {
        post.videos.push(video);
      }
    });
  });
}

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

async function searchPosts(
  searchTerm,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const query = searchTerm.toLowerCase().trim();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'ACCEPTED')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    await getPostImagesVideos(data);

    return data;
  } catch (error) {
    console.log(error);
  }
}

async function searchQuestions(
  searchTerm,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const query = searchTerm.toLowerCase().trim();

    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
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

async function getQuestions(startIndex = 0, limit = 6, orderBy = ORDER_BY.NEW) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*, user_id(*)')
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

async function getQuestionById(questionId) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*, user_id(*)')
      .eq('id', questionId);

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getQuestionComments(
  questionId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('question_comments')
      .select('*')
      .eq('question_id', questionId)
      .is('parent_question_comment_id', null)
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

async function getReplyComments(
  questionId,
  parentQuestionCommentId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('question_comments')
      .select('*')
      .eq('question_id', questionId)
      .eq('parent_question_comment_id', parentQuestionCommentId)
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

async function getNotificationsCountByProfileId(profileId) {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'estimated', head: true })
      .eq('is_read', false)
      .eq('receiver_user_id', profileId);

    if (error) throw error;

    return {
      count,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedPostsNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender_user_id(*), post_id(*)')
      .eq('type', 'ACCEPTED')
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

async function getPendingPostsNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender_user_id(*), post_id(*)')
      .eq('type', 'PENDING')
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

async function getRejectedPostsNotificationsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*, sender_user_id(*), post_id(*)')
      .eq('type', 'REJECTED')
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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export {
  supabase,
  getPostImagesVideos,
  getAcceptedPosts,
  getPendingPosts,
  getAcceptedPostsByProfileId,
  getArchivedPostsByProfileId,
  getPendingPostsByProfileId,
  getRejectedPostsByProfileId,
  searchPosts,
  searchProfiles,
  searchQuestions,
  getProfiles,
  getQuestions,
  getPostById,
  getFollowersByProfileId,
  getFollowingByProfileId,
  getProfileByUsername,
  getViewedPostsByProfileId,
  getAcceptedPostById,
  getQuestionById,
  getQuestionComments,
  getReplyComments,
  getAcceptedPostsNotificationsByProfileId,
  getPendingPostsNotificationsByProfileId,
  getNotificationsCountByProfileId,
  getRejectedPostsNotificationsByProfileId,
};
