import { useEffect, useContext, useRef, useState } from 'react';
import { ExploreContext, ScrollContext } from '../common/contexts';
import Masonry from '../components/Masonry';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedImagePosts } from '../common/database/posts';
import { useElementIntersection } from '../common/hooks';

function ExploreImagePostsNestedLayout() {
  const {
    exploreAcceptedImagePosts,
    setExploreAcceptedImagePosts,
    exploreHasMoreAcceptedImagePosts,
    setExploreHasMoreAcceptedImagePosts,
    exploreHasInitializedAcceptedImagePosts,
    setExploreHasInitializedAcceptedImagePosts,
  } = useContext(ExploreContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreHasInitializedAcceptedImagePosts) {
        await getExploreAcceptedPosts();
      }

      window.scroll({
        top: scrollRef.current.exploreAcceptedImagePosts.scrollY,
        behavior: 'instant',
      });

      const handleScroll = () =>
        (scrollRef.current.exploreAcceptedImagePosts.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && exploreHasMoreAcceptedImagePosts) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);
    const { data, hasMore } = await getAcceptedImagePosts(
      exploreAcceptedImagePosts.length
    );

    if (data.length > 0) {
      setExploreAcceptedImagePosts([...exploreAcceptedImagePosts, ...data]);
    }

    setExploreHasMoreAcceptedImagePosts(hasMore);
    setIsLoading(false);
    if (!exploreHasInitializedAcceptedImagePosts)
      setExploreHasInitializedAcceptedImagePosts(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {exploreAcceptedImagePosts.length > 0 && (
        <Masonry elementRef={elementRef} data={exploreAcceptedImagePosts} />
      )}
      {!exploreHasMoreAcceptedImagePosts && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreImagePostsNestedLayout;
