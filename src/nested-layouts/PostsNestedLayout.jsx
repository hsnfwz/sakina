import { useEffect, useContext, useRef, useState } from 'react';
import { ExploreContext } from '../common/contexts';
import Masonry from '../components/Masonry';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedPosts } from '../common/supabase';

function PostsNestedLayout() {
  const {
    acceptedPosts,
    setAcceptedPosts,
    elementRefAcceptedPosts,
    intersectingElementAcceptedPosts,
    scrollYAcceptedPosts,
    setScrollYAcceptedPosts,
    hasMoreAcceptedPosts,
    setHasMoreAcceptedPosts,
    isLoadingAcceptedPosts,
    setIsLoadingAcceptedPosts,
    hasInitializedAcceptedPosts,
    setHasInitializedAcceptedPosts,
  } = useContext(ExploreContext);

  const handleScroll = () => setScrollYAcceptedPosts(window.scrollY);

  useEffect(() => {
    if (!hasInitializedAcceptedPosts) {
      getExploreAcceptedPosts();
    }

    setTimeout(() => {
      window.scroll({ top: scrollYAcceptedPosts, behavior: 'instant' });
      window.addEventListener('scroll', handleScroll);
    }, 0);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

export default PostsNestedLayout;
