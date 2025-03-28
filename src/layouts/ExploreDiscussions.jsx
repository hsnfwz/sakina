import { useEffect, useContext, useRef, useState } from 'react';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getDiscussions } from '../common/database/discussions.js';
import { useElementIntersection } from '../common/hooks';
import PostDiscussionPreview from '../components/PostDiscussionPreview.jsx';
import { DataContext } from '../common/context/DataContextProvider.jsx';

function ExploreDiscussions() {
  const { exploreDiscussions, setExploreDiscussions } = useContext(DataContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreDiscussions.hasInitialized) {
        await getExploreAcceptedPosts();
      }

      window.scroll({
        top: scrollRef.current.exploreDiscussions.scrollY,
        behavior: 'instant',
      });

      const handleScroll = () =>
        (scrollRef.current.exploreDiscussions.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && exploreDiscussions.hasMore) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getDiscussions(
      exploreDiscussions.data.length
    );

    const _exploreDiscussions = {
      ...exploreDiscussions,
    };

    if (data.length > 0) {
      _exploreDiscussions.data = [...exploreDiscussions.data, ...data];
    }

    _exploreDiscussions.hasMore = hasMore;

    if (!exploreDiscussions.hasInitialized) {
      _exploreDiscussions.hasInitialized = true;
    }

    setExploreDiscussions(_exploreDiscussions);

    setIsLoading(false);
  }

  return (
    <div className="mx-auto mb-[60px] flex w-full max-w-(--breakpoint-md) flex-col gap-4 py-4">
      {exploreDiscussions.data.map((post, index) => (
        <PostDiscussionPreview key={index} postDiscussion={post} />
      ))}
      {!exploreDiscussions.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreDiscussions;
