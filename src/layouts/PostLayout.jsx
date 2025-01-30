import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { UserContext } from "../common/contexts";
import { supabase } from "../common/supabase";
import IconButton from "../components/IconButton";
import ImageView from "../components/ImageView";
import Loading from "../components/Loading";
import VideoView from "../components/VideoView";

function PostLayout() {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const [loadingPost, setLoadingPost] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [like, setLike] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    async function initialize() {
      if (user && post) {
        const likesResult = await supabase
          .from("likes")
          .select("*")
          .eq("user_id", user.id)
          .eq("post_id", post.id);

        if (likesResult.error) {
          console.log(likesResult.error);
        } else {
          setLike(likesResult.data[0]);
        }

        const viewsResult = await supabase
          .from("views")
          .select("id", { head: true, count: "estimated" })
          .eq("user_id", user.id)
          .eq("post_id", post.id);

        if (viewsResult.error) {
          console.log(viewsResult.error);
        } else {
          if (viewsResult.count === 0 && user.id !== post.user_id.id) {
            clearTimeout(timerRef.current);
            timerRef.current = setTimeout(async () => {
              await supabase
                .from("views")
                .insert({ user_id: user.id, post_id: post.id });
            }, 3000);
          }
        }
      }
    }

    initialize();
  }, [user, post]);

  useEffect(() => {
    async function initialize() {
      setLoadingPost(true);
      if (location.state?.post) {
        setPost(location.state.post);
      } else {
        const { data, error } = await supabase
          .from("posts")
          .select("*, user_id(*)")
          .eq("id", id);

        if (error) {
          console.log(error);
        } else {
          const postIds = data.map((post) => post.id);

          const resultImages = await supabase
            .from("images")
            .select("*")
            .in("post_id", postIds);

          if (resultImages.error) console.log(resultImages.error);

          const resultVideos = await supabase
            .from("videos")
            .select("*")
            .in("post_id", postIds);

          if (resultVideos.error) console.log(resultVideos.error);

          data.forEach((post) => {
            post.files = {
              images: [],
              videos: [],
            };
            resultImages.data.forEach((file) => {
              if (post.id === file.post_id) {
                post.images.push(file);
              }
            });
            resultVideos.data.forEach((file) => {
              if (post.id === file.post_id) {
                post.videos.push(file);
              }
            });
          });

          setPost(data[0]);
        }
      }
      setLoadingPost(false);
    }

    window.scroll({ top: 0, behavior: "instant" });
    initialize();
  }, []);

  return (
    <div className="aspect-auto w-full max-w-[300px]">
      {loadingPost && <Loading />}

      {!loadingPost && post && (
        <div>
          {post.type === "IMAGE" && (
            <ImageView
              images={post.images}
              isMasonryView={false}
              autoPlayCarousel={false}
            />
          )}
          {post.type !== "IMAGE" && (
            <VideoView
              images={post.images}
              videos={post.videos}
              isMasonryView={false}
              showControls={true}
            />
          )}

          <h1 className="text-2xl">{post.title}</h1>
          {post.description && <p>{post.description}</p>}

          {user && user.id !== post.user_id.id && (
            <IconButton
              IsDisabled={disabled}
              handleClick={async () => {
                setDisabled(true);
                if (like) {
                  const { data, error } = await supabase
                    .from("likes")
                    .delete()
                    .eq("id", like.id);

                  if (error) {
                    console.log(error);
                  } else {
                    setLike(null);
                  }
                } else {
                  const { data, error } = await supabase
                    .from("likes")
                    .insert({
                      user_id: user.id,
                      post_id: post.id,
                    })
                    .select("*");

                  if (error) {
                    console.log(error);
                  } else {
                    setLike(data[0]);
                  }
                }
                setDisabled(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth={2}
                className={`${like ? "fill-black" : "fill-white stroke-black"}`}
              >
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </IconButton>
          )}

          {user && user.id === post.user_id.id && (
            <div className="flex gap-2">
              <IconButton
                isDisabled={disabled}
                handleClick={async () => {
                  setDisabled(true);
                  const { data, error } = await supabase
                    .from("posts")
                    .update({
                      status:
                        post.status === "ARCHIVED" ? "ACCEPTED" : "ARCHIVED",
                    })
                    .eq("id", post.id)
                    .select("*, user_id(*)");

                  if (error) {
                    console.log(error);
                  } else {
                    setPost(data[0]);
                  }
                  setDisabled(false);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  className={`${post.status === "ARCHIVED" ? "fill-black stroke-white" : "fill-white stroke-black"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                  />
                </svg>
              </IconButton>
              <IconButton>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </IconButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostLayout;
