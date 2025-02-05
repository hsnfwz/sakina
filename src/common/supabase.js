import { createClient } from '@supabase/supabase-js';
import { ORDER_BY } from './enums';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function getPostById(postId) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('is_archived', false)
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
      .select('*, user:user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('is_archived', false)
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
      .select('*, user:user_id(*)')
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
      .select('*, user:user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('is_archived', false)
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
      .select('*, user:user_id(*)')
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

async function removeStorageObjectsByPostId(postId) {
  try {
    const [resultImages, resultVideos] = await Promise.all([
      supabase.from('images').select('name').eq('post_id', postId),
      supabase.from('videos').select('name').eq('post_id', postId),
    ]);

    if (resultImages.error) throw resultImages.error;
    if (resultVideos.error) throw resultVideos.error;

    const imageFileNames = resultImages.data.map((image) => image.name);
    const videoFileNames = resultVideos.data.map((video) => video.name);

    if (imageFileNames.length > 0) {
      const { data, error } = await supabase.storage
        .from('images')
        .remove(imageFileNames);

      if (error) throw error;
    }

    if (videoFileNames.length > 0) {
      const { data, error } = await supabase.storage
        .from('videos')
        .remove(videoFileNames);

      if (error) throw error;
    }
  } catch (error) {
    console.log(error);
  }
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
      .select('*, user:user_id(*)')
      .eq('is_archived', false)
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
      .select('*, user:user_id(*)')
      .eq('is_archived', false)
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
  parentQuestionCommentId = null,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    let result;

    if (parentQuestionCommentId === null) {
      result = await supabase
        .from('question_comments')
        .select(
          '*, user:user_id(*), question:question_id(*, user:user_id(*)), parentQuestionComment:parent_question_comment_id(*, user:user_id(*))'
        )
        .eq('question_id', questionId)
        .eq('is_archived', false)
        .is('parent_question_comment_id', parentQuestionCommentId)
        .order(orderBy.columnName, { ascending: orderBy.isAscending })
        .range(startIndex, startIndex + limit - 1);
    } else {
      result = await supabase
        .from('question_comments')
        .select(
          '*, user:user_id(*), question:question_id(*, user:user_id(*)), parentQuestionComment:parent_question_comment_id(*, user:user_id(*))'
        )
        .eq('question_id', questionId)
        .eq('parent_question_comment_id', parentQuestionCommentId)
        .order(orderBy.columnName, { ascending: orderBy.isAscending })
        .range(startIndex, startIndex + limit - 1);
    }

    const { data, error } = result;

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getQuestionCommentById(questionCommentId) {
  try {
    const { data, error } = await supabase
      .from('question_comments')
      .select(
        '*, user:user_id(*), question:question_id(*, user:user_id(*)), parentQuestionComment:parent_question_comment_id(*, user:user_id(*))'
      )
      .eq('is_archived', false)
      .eq('id', questionCommentId);

    if (error) throw error;

    return {
      data,
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

async function addQuestionLike(profileId, questionId) {
  try {
    const { data, error } = await supabase
      .from('question_likes')
      .insert({ user_id: profileId, question_id: questionId })
      .select('*');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function removeQuestionLike(id) {
  try {
    const { error } = await supabase
      .from('question_likes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function archiveQuestion(id) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .update({ is_archived: true })
      .eq('id', id)
      .select('*, user:user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function unarchiveQuestion(id) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .update({ is_archived: false })
      .eq('id', id)
      .select('*, user:user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function removeQuestion(id) {
  try {
    const { error } = await supabase.from('questions').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

async function getQuestionLike(profileId, questionId) {
  try {
    const { data, error } = await supabase
      .from('question_likes')
      .select('*')
      .eq('user_id', profileId)
      .eq('question_id', questionId);

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

async function archivePost(id) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ is_archived: true })
      .eq('id', id)
      .select('*, user:user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function unarchivePost(id) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .update({ is_archived: false })
      .eq('id', id)
      .select('*, user:user_id(*)');

    if (error) throw error;

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function removePost(id) {
  try {
    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.log(error);
  }
}

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

export {
  supabase,
  removeStorageObjectsByPostId,
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
  getQuestionCommentById,
  getAcceptedPostsNotificationsByProfileId,
  getPendingPostsNotificationsByProfileId,
  getNotificationsCountByProfileId,
  getRejectedPostsNotificationsByProfileId,
  removeQuestion,
  removeQuestionLike,
  addQuestionLike,
  archiveQuestion,
  unarchiveQuestion,
  getQuestionLike,
  removePost,
  removePostLike,
  addPostLike,
  archivePost,
  unarchivePost,
  getPostLike,
};
