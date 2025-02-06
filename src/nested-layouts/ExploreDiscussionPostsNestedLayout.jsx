import { useEffect, useContext, useRef, useState } from 'react';
import { ExploreContext, ScrollContext } from '../common/contexts';
import Masonry from '../components/Masonry';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getAcceptedDiscussionPosts } from '../common/database/posts';
import { useElementIntersection } from '../common/hooks';
import { Link } from 'react-router';
import { getDate } from '../common/helpers';

function ExploreDiscussionPostsNestedLayout() {
  const {
    exploreAcceptedDiscussions,
    setExploreAcceptedDiscussions,
    exploreHasMoreAcceptedDiscussions,
    setExploreHasMoreAcceptedDiscussions,
    exploreHasInitializedAcceptedDiscussions,
    setExploreHasInitializedAcceptedDiscussions,
  } = useContext(ExploreContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreHasInitializedAcceptedDiscussions) {
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
    if (intersectingElement && exploreHasMoreAcceptedDiscussions) {
      getExploreAcceptedPosts();
    }
  }, [intersectingElement]);

  async function getExploreAcceptedPosts() {
    setIsLoading(true);
    const { data, hasMore } = await getAcceptedDiscussionPosts(
      exploreAcceptedDiscussions.length
    );

    if (data.length > 0) {
      setExploreAcceptedDiscussions([...exploreAcceptedDiscussions, ...data]);
    }

    setExploreHasMoreAcceptedDiscussions(hasMore);
    setIsLoading(false);
    if (!exploreHasInitializedAcceptedDiscussions)
      setExploreHasInitializedAcceptedDiscussions(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {exploreAcceptedDiscussions.length > 0 && (
        <div>
          {exploreAcceptedDiscussions.map((post, index) => (
            <Link
              key={index}
              to={`/post/${post.id}`}
              className="flex gap-4 rounded-lg border-2 border-neutral-700 bg-black p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
            >
              <div className="flex flex-col gap-4">
                {post.is_anonymous && <p className="text-xs">Anonymous</p>}
                {!post.is_anonymous && (
                  <Link
                    to={`/profile/${post.user.username}#posts`}
                    state={{ profile: post.user }}
                    className={`text-xs underline hover:text-sky-500`}
                  >
                    {post.user.username}
                  </Link>
                )}
                <p className="text-xs text-neutral-700">
                  {getDate(post.created_at, true)}
                </p>
                <h1 className="text-2xl">{post.title}</h1>
                {post.description && <p>{post.description}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
      {!exploreHasMoreAcceptedDiscussions && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreDiscussionPostsNestedLayout;
