import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext, ScrollContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import {
  getAcceptedImagePosts,
  searchAcceptedImagePosts,
} from '../common/database/posts';
import { useElementIntersection } from '../common/hooks';
import { SEARCH_TYPE } from '../common/enums';
import SearchBar from '../components/SearchBar';
import PostImagePreview from '../components/PostImagePreview';

function ExploreImagePostsNestedLayout() {
  const { exploreAcceptedImagePosts, setExploreAcceptedImagePosts } =
    useContext(DataContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreAcceptedImagePosts.hasInitializedData) {
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
    if (intersectingElement && exploreAcceptedImagePosts.hasMoreData) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);

    const { data, hasMore } = await getAcceptedImagePosts(
      exploreAcceptedImagePosts.data.length
    );

    const _exploreAcceptedImagePosts = { ...exploreAcceptedImagePosts };

    if (data.length > 0) {
      _exploreAcceptedImagePosts.data = [
        ...exploreAcceptedImagePosts.data,
        ...data,
      ];
    }

    _exploreAcceptedImagePosts.hasMoreData = hasMore;

    if (!exploreAcceptedImagePosts.hasInitializedData) {
      _exploreAcceptedImagePosts.hasInitializedData = true;
    }

    setExploreAcceptedImagePosts(_exploreAcceptedImagePosts);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <SearchBar
        searchType={SEARCH_TYPE.POST_IMAGES}
        search={searchAcceptedImagePosts}
      />
      {exploreAcceptedImagePosts.data.map((post, index) => (
        <PostImagePreview key={index} postImage={post} />
      ))}
      {!exploreAcceptedImagePosts.hasMoreData && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreImagePostsNestedLayout;
