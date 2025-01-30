import { useEffect, useState } from "react";
import {
  getPendingPosts,
  supabase,
  getPostImagesVideos,
} from "../common/supabase.js";
import Button from "../components/Button.jsx";
import ImageView from "../components/ImageView.jsx";
import Loading from "../components/Loading.jsx";
import VideoView from "../components/VideoView.jsx";

function AdminLayout() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  async function getPosts() {
    setLoadingPosts(true);
    const { data } = await getPendingPosts();
    setPosts(data);
    setLoadingPosts(false);
  }

  async function refreshPosts(post) {
    const _post = { ...post };
    await getPostImagesVideos([_post]);
    console.log(posts, _post);
    setPosts([...posts, _post]);
  }

  useEffect(() => {
    async function initialize() {
      await getPosts();
    }

    initialize();
  }, []);

  useEffect(() => {
    const postsInsertChannel = supabase
      .channel("posts-insert")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          // console.log('INSERT', payload);
          // await getPosts();

          await refreshPosts(payload.new);
        },
      )
      .subscribe();

    const postsUpdateChannel = supabase
      .channel("posts-update")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        async (payload) => {
          console.log("UPDATE", payload);
          await getPosts();
        },
      )
      .subscribe();

    return () => {
      postsInsertChannel.unsubscribe();
      postsUpdateChannel.unsubscribe();
    };
  }, []);

  async function handleAccept(post) {
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .update({ status: "ACCEPTED" })
      .eq("id", post.id)
      .select();

    if (postsError) {
      console.log(postsError);
    }

    const { data: notificationsData, error: notificationsError } =
      await supabase
        .from("notifications")
        .insert({
          user_id: post.user_id,
          message: "Your post has been accepted!",
          message_type: "POST_ACCEPTED",
          message_data: post.id,
        })
        .select();

    if (notificationsError) {
      console.log(notificationsError);
    }
  }

  async function handleReject(post) {
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .update({ status: "REJECTED" })
      .eq("id", post.id)
      .select();

    if (postsError) {
      console.log(postsError);
    }

    const { data: notificationsData, error: notificationsError } =
      await supabase
        .from("notifications")
        .insert({
          user_id: post.user_id,
          message: "Your post has been rejected.",
          message_type: "POST_REJECTED",
        })
        .select();

    if (notificationsError) {
      console.log(notificationsError);
    }
  }

  return (
    <div>
      {loadingPosts && <Loading />}
      {!loadingPosts && (
        <div className="flex aspect-auto w-full max-w-[300px] flex-col gap-8">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col gap-4">
              {post.type === "IMAGE" && (
                <ImageView
                  images={post.images}
                  isMasonryView={false}
                  autoPlayCarousel={false}
                />
              )}
              {post.type === "VIDEO" && (
                <VideoView
                  images={post.images}
                  videos={post.videos}
                  isMasonryView={false}
                />
              )}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl">{post.title}</h1>
                {post.description && <p>{post.description}</p>}
              </div>
              <div className="flex gap-2">
                <Button
                  handleClick={async () => await handleAccept(post)}
                  isOutline={true}
                >
                  Accept
                </Button>
                <Button handleClick={async () => await handleReject(post)}>
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
