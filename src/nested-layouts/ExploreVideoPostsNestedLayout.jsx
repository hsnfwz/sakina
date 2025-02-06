import { useEffect, useContext, useRef, useState } from 'react';
import { ExploreContext, ScrollContext } from '../common/contexts';
import Masonry from '../components/Masonry';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedVideoPosts } from '../common/database/posts';
import { useElementIntersection } from '../common/hooks';

function ExploreVideoPostsNestedLayout() {
  const {
    exploreAcceptedVideoPosts,
    setExploreAcceptedVideoPosts,
    exploreHasMoreAcceptedVideoPosts,
    setExploreHasMoreAcceptedVideoPosts,
    exploreHasInitializedAcceptedVideoPosts,
    setExploreHasInitializedAcceptedVideoPosts,
  } = useContext(ExploreContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreHasInitializedAcceptedVideoPosts) {
        await getExploreAcceptedPosts();
      }

      window.scroll({
        top: scrollRef.current.exploreAcceptedVideoPosts.scrollY,
        behavior: 'instant',
      });

      const handleScroll = () =>
        (scrollRef.current.exploreAcceptedVideoPosts.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && exploreHasMoreAcceptedVideoPosts) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);
    const { data, hasMore } = await getAcceptedVideoPosts(
      exploreAcceptedVideoPosts.length
    );

    if (data.length > 0) {
      setExploreAcceptedVideoPosts([...exploreAcceptedVideoPosts, ...data]);
    }

    setExploreHasMoreAcceptedVideoPosts(hasMore);
    setIsLoading(false);
    if (!exploreHasInitializedAcceptedVideoPosts)
      setExploreHasInitializedAcceptedVideoPosts(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {exploreAcceptedVideoPosts.length > 0 && (
        <Masonry elementRef={elementRef} data={exploreAcceptedVideoPosts} />
      )}
      {!exploreHasMoreAcceptedVideoPosts && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreVideoPostsNestedLayout;
