import { useContext, useEffect, useState } from "react";
import { supabase } from "../common/supabase.js";

import { useElementIntersection } from "../common/hooks.js";
import Loading from "../components/Loading.jsx";

import Masonry from "../components/Masonry.jsx";

import { Link, useLocation, useParams } from "react-router";
import { UserContext } from "../common/contexts.js";

function ProfileLayout() {
  const { user } = useContext(UserContext);

  const { username } = useParams();
  const location = useLocation();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [posts, setPosts] = useState([]);
  const [postsCount, setPostsCount] = useState(0);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingPostsCount, setLoadingPostsCount] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const [archivedPosts, setArchivedPosts] = useState([]);
  const [archivedPostsCount, setArchivedPostsCount] = useState(0);
  const [loadingArchivedPosts, setLoadingArchivedPosts] = useState(false);
  const [loadingArchivedPostsCount, setLoadingArchivedPostsCount] =
    useState(false);
  const [hasMoreArchivedPosts, setHasMoreArchivedPosts] = useState(true);

  const [viewedPosts, setViewedPosts] = useState([]);
  const [viewedPostsCount, setViewedPostsCount] = useState(0);
  const [loadingViewedPosts, setLoadingViewedPosts] = useState(false);
  const [loadingViewedPostsCount, setLoadingViewedPostsCount] = useState(false);
  const [hasMoreViewedPosts, setHasMoreViewedPosts] = useState(true);

  const [elementRef, isIntersecting] = useElementIntersection();

  useEffect(() => {
    async function initialize() {
      const abortController = new AbortController();

      if (location.state) {
        setProfile(location.state.profile);
      }

      if (!location.state && !profile) {
        setLoadingProfile(true);
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username);

        if (error) {
          console.log(error);
        } else {
          setProfile(data[0]);
        }
        setLoadingProfile(false);
      }

      return () => {
        abortController.abort();
      };
    }

    initialize();
  }, [location]);

  useEffect(() => {
    async function initialize() {
      const abortController = new AbortController();

      if (location.hash === "#posts") {
        setLoadingPosts(true);
        await getPosts(abortController);
        setLoadingPosts(false);
      }

      if (user.id === profile.id) {
        if (location.hash === "#archived-posts") {
          setLoadingArchivedPosts(true);
          await getArchivedPosts(abortController);
          setLoadingArchivedPosts(false);
        }

        if (location.hash === "#viewed-posts") {
          setLoadingViewedPosts(true);
          await getViewedPosts(abortController);
          setLoadingViewedPosts(false);
        }
      }

      return () => {
        abortController.abort();
      };
    }

    if (profile) initialize();
  }, [profile, location]);

  useEffect(() => {
    async function initialize() {
      const abortController = new AbortController();

      if (location.hash === "#posts" && hasMorePosts) {
        setLoadingPosts(true);
        await getPosts(abortController);
        setLoadingPosts(false);
      }

      if (user.id === profile.id) {
        if (location.hash === "#archived-posts" && hasMoreArchivedPosts) {
          setLoadingArchivedPosts(true);
          await getArchivedPosts(abortController);
          setLoadingArchivedPosts(false);
        }

        if (location.hash === "#viewed-posts" && hasMoreViewedPosts) {
          setLoadingViewedPosts(true);
          await getViewedPosts(abortController);
          setLoadingViewedPosts(false);
        }
      }

      return () => {
        abortController.abort();
      };
    }

    if (profile) initialize();
  }, [profile, isIntersecting]);

  useEffect(() => {
    async function initialize() {
      const abortController = new AbortController();

      setLoadingPostsCount(true);
      await getPostsCount(abortController);
      setLoadingPostsCount(false);

      if (user.id === profile.id) {
        setLoadingArchivedPostsCount(true);
        setLoadingViewedPostsCount(true);
        await getArchivedPostsCount(abortController);
        setLoadingArchivedPostsCount(false);
        await getViewedPostsCount(abortController);
        setLoadingViewedPostsCount(false);
      }

      return () => abortController.abort();
    }

    if (profile) initialize();
  }, [profile]);

  async function getPostsCount(abortController) {
    const { count, error } = await supabase
      .from("posts")
      .select("id", { head: true, count: "estimated" })
      .eq("is_archived", false)
      .eq("status", "ACCEPTED")
      .eq("user_id", profile.id)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      setPostsCount(count);
    }
  }

  async function getArchivedPostsCount(abortController) {
    const { count, error } = await supabase
      .from("posts")
      .select("id", { head: true, count: "estimated" })
      .eq("is_archived", true)
      .eq("status", "ACCEPTED")
      .eq("user_id", profile.id)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      setArchivedPostsCount(count);
    }
  }

  async function getViewedPostsCount(abortController) {
    const { count, error } = await supabase
      .from("views")
      .select("id", { head: true, count: "estimated" })
      .eq("user_id", profile.id)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      setViewedPostsCount(count);
    }
  }

  async function getPosts(abortController) {
    const limit = 6;

    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("is_archived", false)
      .eq("status", "ACCEPTED")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .range(posts.length, limit + posts.length - 1)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      setPosts([...posts, ...data]);

      if (data.length < limit) {
        setHasMorePosts(false);
      }
    }
  }

  async function getArchivedPosts(abortController) {
    const limit = 6;

    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("is_archived", true)
      .eq("status", "ACCEPTED")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .range(archivedPosts.length, limit + archivedPosts.length - 1)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      setArchivedPosts([...archivedPosts, ...data]);

      if (data.length < limit) {
        setHasMoreArchivedPosts(false);
      }
    }
  }

  async function getViewedPosts(abortController) {
    const limit = 6;

    const { data, error } = await supabase
      .from("views")
      .select("*, post_id(*, user_id(*))")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .range(viewedPosts.length, limit + viewedPosts.length - 1)
      .abortSignal(abortController.signal);

    if (error) {
      console.log(error);
    } else {
      const _viewedPosts = data.map((row) => row.post_id);

      setViewedPosts([...viewedPosts, ..._viewedPosts]);

      if (data.length < limit) {
        setHasMoreViewedPosts(false);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {loadingProfile && <Loading />}
      {!loadingProfile && profile && (
        <>
          <div className="flex flex-col items-center gap-4">
            {profile.avatar_file && (
              <img
                src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${profile.avatar_file}`}
                alt={profile.avatar_file}
                width=""
                height=""
                className="aspect-square w-full max-w-[80px] rounded-full bg-black object-cover"
              />
            )}
            {!profile.avatar_file && (
              <div className="aspect-square w-full max-w-[80px] rounded-full bg-neutral-700"></div>
            )}

            <h1>
              {profile.username}
              {profile.display_name && <span> - {profile.display_name}</span>}
            </h1>
            {profile.bio && <p>{profile.bio}</p>}
            {/* {user && user.id !== searchUser.id && (
        <button
          type="button"
          onClick={async () => {
            const { data, error } = await supabase
              .from("followers")
              .insert({
                sender_user_id: user.id,
                receiver_user_id: searchUser.id,
              })
              .select();

            if (error) {
              console.log(error);
            }
          }}
        >
          Follow
        </button>
      )} */}
          </div>

          <div className="flex gap-2">
            <Link
              className={`rounded-lg p-2 ${location.hash === "#posts" ? "pointer-events-none bg-sky-500 text-white" : "bg-neutral-700"} `}
              to="#posts"
            >
              {postsCount} Posts
            </Link>
            {user && profile && user.id === profile.id && (
              <Link
                className={`rounded-lg p-2 ${location.hash === "#archived-posts" ? "pointer-events-none bg-sky-500 text-white" : "bg-neutral-700"} `}
                to="#archived-posts"
              >
                {archivedPostsCount} Archived Posts
              </Link>
            )}
            {user && profile && user.id === profile.id && (
              <Link
                className={`rounded-lg p-2 ${location.hash === "#viewed-posts" ? "pointer-events-none bg-sky-500 text-white" : "bg-neutral-700"} `}
                to="#viewed-posts"
              >
                {viewedPostsCount} Viewed Posts
              </Link>
            )}
          </div>

          {location.hash === "#posts" && (
            <>
              {loadingPosts && <Loading />}
              {!loadingPosts && !loadingPostsCount && postsCount === 0 && (
                <p className="text-center">You have no posts.</p>
              )}
              {!loadingPostsCount && postsCount > 0 && (
                <>
                  <Masonry posts={posts} elementRef={elementRef} />
                  {!hasMorePosts && (
                    <p className="text-center">That's everything for now!</p>
                  )}
                </>
              )}
            </>
          )}

          {location.hash === "#archived-posts" && (
            <>
              {loadingArchivedPosts && <Loading />}
              {!loadingArchivedPosts &&
                !loadingArchivedPostsCount &&
                archivedPostsCount === 0 && (
                  <p className="text-center">You have no archived posts.</p>
                )}
              {!loadingArchivedPostsCount && archivedPostsCount > 0 && (
                <>
                  <Masonry posts={archivedPosts} elementRef={elementRef} />
                  {!hasMoreArchivedPosts && (
                    <p className="text-center">That's everything for now!</p>
                  )}
                </>
              )}
            </>
          )}

          {location.hash === "#viewed-posts" && (
            <>
              {loadingViewedPosts && <Loading />}
              {!loadingViewedPosts &&
                !loadingViewedPostsCount &&
                viewedPostsCount === 0 && (
                  <p className="text-center">You have no viewed posts.</p>
                )}
              {!loadingViewedPostsCount && viewedPostsCount > 0 && (
                <>
                  <Masonry posts={viewedPosts} elementRef={elementRef} />
                  {!hasMoreViewedPosts && (
                    <p className="text-center">That's everything for now!</p>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ProfileLayout;
