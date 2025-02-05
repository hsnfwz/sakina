import { useEffect, useContext, useRef, useState } from 'react';
import { ExploreContext, ScrollContext } from '../common/contexts';
import Masonry from '../components/Masonry';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedPosts } from '../common/supabase';

function ExplorePostsNestedLayout() {
  const {
    acceptedPosts,
    setAcceptedPosts,
    elementRefAcceptedPosts,
    intersectingElementAcceptedPosts,
    hasMoreAcceptedPosts,
    setHasMoreAcceptedPosts,
    isLoadingAcceptedPosts,
    setIsLoadingAcceptedPosts,
    hasInitializedAcceptedPosts,
    setHasInitializedAcceptedPosts,
  } = useContext(ExploreContext);

  const { scrollRef } = useContext(ScrollContext);

  const handleScroll = () =>
    (scrollRef.current.exploreAcceptedPosts.scrollY = window.scrollY);

  useEffect(() => {
    async function initialize() {
      if (!hasInitializedAcceptedPosts) {
        await getExploreAcceptedPosts();
      }

      window.scroll({
        top: scrollRef.current.exploreAcceptedPosts.scrollY,
        behavior: 'instant',
      });
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElementAcceptedPosts && hasMoreAcceptedPosts) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElementAcceptedPosts]);

  async function getExploreAcceptedPosts() {
    setIsLoadingAcceptedPosts(true);
    const { data, hasMore } = await getAcceptedPosts(acceptedPosts.length);

    if (data.length > 0) {
      setAcceptedPosts([...acceptedPosts, ...data]);
    }

    setHasMoreAcceptedPosts(hasMore);
    setIsLoadingAcceptedPosts(false);
    if (!hasInitializedAcceptedPosts) setHasInitializedAcceptedPosts(true);
  }

  return (
    <div>
      {acceptedPosts.length > 0 && (
        <div className="flex flex-col gap-4">
          <Masonry elementRef={elementRefAcceptedPosts} data={acceptedPosts} />
          {!hasMoreAcceptedPosts && <Loaded />}
        </div>
      )}
      {isLoadingAcceptedPosts && <Loading />}
    </div>
  );
}

export default ExplorePostsNestedLayout;
