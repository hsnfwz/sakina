import { useContext, useEffect, useState } from "react";
import { useElementIntersection } from "../common/hooks.js";
import { getAcceptedPosts } from "../common/supabase.js";
import Loading from "../components/Loading.jsx";
import Masonry from "../components/Masonry.jsx";

import { ScrollDataContext } from "../common/contexts.js";

function ExploreLayout() {
  const { scrollData, setScrollData } = useContext(ScrollDataContext);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [elementRef, intersectingElement] = useElementIntersection();

  useEffect(() => {
    async function initialize() {
      await getPosts();
    }

    if (scrollData.type !== "POSTS") initialize();
  }, []);

  useEffect(() => {
    async function initialize() {
      await getPosts();
    }

    if (intersectingElement && scrollData.hasMoreData) initialize();
  }, [intersectingElement]);

  async function getPosts() {
    setIsLoadingPosts(true);

    let _scrollData;

    if (scrollData.type !== "POSTS") {
      _scrollData = {
        type: "POSTS",
        data: [],
        hasMoreData: true,
        scrollY: 0,
      };
    } else {
      _scrollData = { ...scrollData };
    }

    const { data, hasMore } = await getAcceptedPosts(_scrollData.length);
    _scrollData.data = [..._scrollData.data, ...data];
    _scrollData.hasMoreData = hasMore;

    setScrollData(_scrollData);
    setIsLoadingPosts(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {scrollData.type === "POSTS" && scrollData.data.length > 0 && (
        <div className="flex flex-col gap-4">
          <Masonry elementRef={elementRef} />
          {!scrollData.hasMoreData && (
            <p className="text-center text-neutral-700">
              That's everything for now!
            </p>
          )}
        </div>
      )}
      {isLoadingPosts && <Loading />}
    </div>
  );
}

export default ExploreLayout;
