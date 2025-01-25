import { useEffect, useState } from "react";
import { supabase } from "../common/supabase.js";

import Loading from "../components/Loading.jsx";
import Masonry from "../components/Masonry.jsx";

import { useElementIntersection } from "../common/hooks.js";
import SearchBar from "../components/SearchBar.jsx";

function ExploreLayout() {
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const [elementRef, isIntersecting] = useElementIntersection();

  useEffect(() => {
    async function initialize() {
      const abortController = new AbortController();

      setIsLoadingPosts(true);
      await getPosts(abortController);
      setIsLoadingPosts(false);

      return () => {
        abortController.abort();
      };
    }

    if (hasMorePosts) initialize();
  }, [isIntersecting]);

  async function getPosts(abortController) {
    const limit = 6;

    const { data, error } = await supabase
      .from("posts")
      .select("*, user_id(*)")
      .eq("status", "ACCEPTED")
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

  return (
    <div className="flex w-full flex-col gap-4">
      <SearchBar />

      {/* recently joined */}
      {/* recently added */}

      {/* trending users */}
      {/* trending posts */}

      {posts.length > 0 && (
        <div className="flex flex-col gap-4">
          <Masonry posts={posts} elementRef={elementRef} />
          {!hasMorePosts && <p>That's everything for now!</p>}
        </div>
      )}

      {isLoadingPosts && <Loading />}
    </div>
  );
}

export default ExploreLayout;
