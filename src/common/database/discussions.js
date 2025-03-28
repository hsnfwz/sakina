import { supabase } from '../supabase';
import { ORDER_BY } from '../enums';

async function getDiscussions(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
  }
}

async function getDiscussionsBySearchTerm(
  searchTerm,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const query = searchTerm.toLowerCase().trim();

    if (query.length === 0) {
      return {
        data: [],
        hasMore: false,
      };
    }

    const { data, error } = await supabase
      .from('discussions')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
  }
}

async function getDiscussionsByUserId(
  userId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('discussions')
      .select('*, user:user_id(*)')
      .eq('is_hidden', false)
      .eq('user_id', userId)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);

    return {
      data: [],
      hasMore: false,
    };
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

async function getImagePostFiles(posts) {
  const postIds = posts.map((post) => post.id);

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .in('post_id', postIds);

  if (error) throw error;

  posts.forEach((post) => {
    post.images = [];

    data.forEach((image) => {
      if (post.id === image.post_id) {
        post.images.push(image);
      }
    });
  });
}

async function getVideoPostFiles(posts) {
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

async function getPostById(id) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('is_archived', false)
      .eq('id', id);

    if (error) throw error;

    await getPostImagesVideos(data);

    return {
      data,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedPostById(id) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('is_archived', false)
      .eq('id', id);

    if (error) throw error;

    await getPostImagesVideos(data);

    return {
      data,
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
      .eq('is_archived', false)
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
      .select('*, user:user_id(*)')
      .eq('status', 'REJECTED')
      .eq('is_archived', false)
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
      .select('*, user:user_id(*)')
      .eq('is_archived', true)
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

async function getAcceptedImagePosts(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('type', 'IMAGE')
      .eq('is_archived', false)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    await getImagePostFiles(data);

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getAcceptedVideoPosts(
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:user_id(*)')
      .eq('status', 'ACCEPTED')
      .eq('type', 'VIDEO')
      .eq('is_archived', false)
      .order(orderBy.columnName, { ascending: orderBy.isAscending })
      .range(startIndex, startIndex + limit - 1);

    if (error) throw error;

    await getVideoPostFiles(data);

    return {
      data,
      hasMore: data.length === limit,
    };
  } catch (error) {
    console.log(error);
  }
}

async function getPendingPostsCount() {
  try {
    const { count, error } = await supabase
      .from('posts')
      .select('*', { count: 'estimated', head: true })
      .eq('status', 'PENDING');

    if (error) throw error;

    return {
      count,
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
      .select('*, post:post_id(*)')
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

async function getAcceptedPostsByReceiverProfileIds(
  receiverProfileIds,
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
      .eq('is_anonymous', false)
      .in('user_id', receiverProfileIds)
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

export {
  getDiscussions,
  getDiscussionsBySearchTerm,
  getDiscussionsByUserId,
  removeStorageObjectsByPostId,
  getArchivedPostsByProfileId,
  getPendingPostsByProfileId,
  getRejectedPostsByProfileId,
  getPostById,
  getAcceptedPostById,
  removePost,
  archivePost,
  unarchivePost,
  getAcceptedImagePosts,
  getAcceptedVideoPosts,
  getPendingPostsCount,
  getViewedPostsByProfileId,
  getAcceptedPostsByReceiverProfileIds,
};
