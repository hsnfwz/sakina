import { createClient } from "@supabase/supabase-js";

const ORDER_BY = Object.freeze({
  NEW: {
    columnName: "created_at",
    isAscending: false,
  },
  OLD: {
    columnName: "created_at",
    isAscending: true,
  },
  TOP: {
    columnName: "likes_count",
    isAscending: false,
  },
});

async function getAcceptedPostsByProfileId(
  profileId,
  startIndex = 0,
  limit = 6,
  orderBy = ORDER_BY.NEW,
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "ACCEPTED")
      .eq("user_id", profileId)
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
  orderBy = ORDER_BY.NEW,
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "PENDING")
      .eq("user_id", profileId)
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
  orderBy = ORDER_BY.NEW,
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "REJECTED")
      .eq("user_id", profileId)
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
  orderBy = ORDER_BY.NEW,
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "ARCHIVED")
      .eq("user_id", profileId)
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
  orderBy = ORDER_BY.NEW,
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "ACCEPTED")
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
  orderBy = ORDER_BY.OLD,
) {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "PENDING")
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
    supabase.from("images").select("*").in("post_id", postIds),
    supabase.from("videos").select("*").in("post_id", postIds),
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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_PROJECT_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
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
};
