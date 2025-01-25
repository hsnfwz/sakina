import { useEffect, useState } from "react";
import { supabase } from "../common/supabase.js";
import ImageView from "../components/ImageView.jsx";
import Loading from "../components/Loading.jsx";
import VideoView from "../components/VideoView.jsx";

function AdminLayout() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  async function getPosts() {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "PENDING")
      .order("created_at", { ascending: true });

    if (error) {
      console.log(error);
    } else {
      setPosts(data);
    }
    setLoadingPosts(false);
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
          await getPosts();
        },
      )
      .subscribe();

    const postsUpdateChannel = supabase
      .channel("posts-update")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        async (payload) => {
          await getPosts();
        },
      )
      .subscribe();

    return () => {
      postsInsertChannel.unsubscribe();
      postsUpdateChannel.unsubscribe();
    };
  }, []);

  return (
    <div>
      <h1>Admin</h1>

      {loadingPosts && <Loading />}

      {!loadingPosts && (
        <div className="flex aspect-auto w-full max-w-[300px] flex-col gap-8">
          {posts.map((post) => (
            <div key={post.id} className="flex flex-col gap-4">
              {post.type === "IMAGE" && (
                <ImageView
                  fileNames={JSON.parse(post.files)}
                  isMasonryView={false}
                  autoPlayCarousel={false}
                />
              )}
              {post.type !== "IMAGE" && (
                <VideoView
                  fileNames={JSON.parse(post.files)}
                  isMasonryView={false}
                  videoType={post.type}
                />
              )}
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl">{post.title}</h1>
                {post.description && <p>{post.description}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  className="flex w-full items-center justify-center rounded-lg bg-neutral-200 p-2 disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                  onClick={async () => {
                    const { data: postsData, error: postsError } =
                      await supabase
                        .from("posts")
                        .update({ status: "ACCEPTED" })
                        .eq("id", post.id)
                        .select();

                    if (postsError) {
                      console.log(postsError);
                    }

                    const {
                      data: notificationsData,
                      error: notificationsError,
                    } = await supabase
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
                  }}
                >
                  Accept
                </button>
                <button
                  className="flex w-full items-center justify-center rounded-lg bg-neutral-200 p-2 disabled:pointer-events-none disabled:opacity-50"
                  type="button"
                  onClick={async () => {
                    const { data: postsData, error: postsError } =
                      await supabase
                        .from("posts")
                        .update({ status: "REJECTED" })
                        .eq("id", post.id)
                        .select();

                    if (postsError) {
                      console.log(postsError);
                    }

                    const {
                      data: notificationsData,
                      error: notificationsError,
                    } = await supabase
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
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminLayout;
