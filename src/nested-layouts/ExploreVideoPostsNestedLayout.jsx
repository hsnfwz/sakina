import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext, ScrollContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedVideoPosts } from '../common/database/posts';
import { useElementIntersection } from '../common/hooks';
import SearchBar from '../components/SearchBar';
import { SEARCH_TYPE } from '../common/enums';
import { searchAcceptedVideoPosts } from '../common/database/posts';
import PostVideoPreview from '../components/PostVideoPreview';

function ExploreVideoPostsNestedLayout() {
  const { exploreAcceptedVideoPosts, setExploreAcceptedVideoPosts } =
    useContext(DataContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreAcceptedVideoPosts.hasInitializedData) {
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
    if (intersectingElement && exploreAcceptedVideoPosts.hasMoreData) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getAcceptedVideoPosts(
      exploreAcceptedVideoPosts.data.length
    );

    const _exploreAcceptedVideoPosts = { ...exploreAcceptedVideoPosts };

    if (data.length > 0) {
      _exploreAcceptedVideoPosts.data = [
        ...exploreAcceptedVideoPosts.data,
        ...data,
      ];
    }

    _exploreAcceptedVideoPosts.hasMoreData = hasMore;

    if (!exploreAcceptedVideoPosts.hasInitializedData) {
      _exploreAcceptedVideoPosts.hasInitializedData = true;
    }

    setExploreAcceptedVideoPosts(_exploreAcceptedVideoPosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <SearchBar
        searchType={SEARCH_TYPE.POST_VIDEOS}
        search={searchAcceptedVideoPosts}
      />
      {exploreAcceptedVideoPosts.data.map((post, index) => (
        <PostVideoPreview key={index} postVideo={post} />
      ))}
      {!exploreAcceptedVideoPosts.hasMoreData && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreVideoPostsNestedLayout;
