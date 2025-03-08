import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext, ScrollContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedDiscussionPosts } from '../common/database/posts';
import { useElementIntersection } from '../common/hooks';
import { SEARCH_TYPE } from '../common/enums.js';
import { searchAcceptedDiscussionPosts } from '../common/database/posts';
import SearchBar from '../components/SearchBar.jsx';
import PostDiscussionPreview from '../components/PostDiscussionPreview.jsx';

function ExploreDiscussionPostsNestedLayout() {
  const { exploreAcceptedDiscussionPosts, setExploreAcceptedDiscussionPosts } =
    useContext(DataContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreAcceptedDiscussionPosts.hasInitializedData) {
        await getExploreAcceptedPosts();
      }

      window.scroll({
        top: scrollRef.current.exploreAcceptedDiscussionPosts.scrollY,
        behavior: 'instant',
      });

      const handleScroll = () =>
        (scrollRef.current.exploreAcceptedDiscussionPosts.scrollY =
          window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && exploreAcceptedDiscussionPosts.hasMoreData) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getAcceptedDiscussionPosts(
      exploreAcceptedDiscussionPosts.data.length
    );

    const _exploreAcceptedDiscussionPosts = {
      ...exploreAcceptedDiscussionPosts,
    };

    if (data.length > 0) {
      _exploreAcceptedDiscussionPosts.data = [
        ...exploreAcceptedDiscussionPosts.data,
        ...data,
      ];
    }

    _exploreAcceptedDiscussionPosts.hasMoreData = hasMore;

    if (!exploreAcceptedDiscussionPosts.hasInitializedData) {
      _exploreAcceptedDiscussionPosts.hasInitializedData = true;
    }

    setExploreAcceptedDiscussionPosts(_exploreAcceptedDiscussionPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <SearchBar
        searchType={SEARCH_TYPE.POST_DISCUSSIONS}
        search={searchAcceptedDiscussionPosts}
      />
      {exploreAcceptedDiscussionPosts.data.map((post, index) => (
        <PostDiscussionPreview key={index} postDiscussion={post} />
      ))}
      {!exploreAcceptedDiscussionPosts.hasMoreData && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreDiscussionPostsNestedLayout;
