import { useEffect, useContext, useRef, useState } from 'react';
import { Link } from 'react-router';
import { ExploreContext, ScrollContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getProfiles } from '../common/supabase';
import { useElementIntersection } from '../common/hooks';

function ExploreProfilesNestedLayout() {
  const {
    exploreProfiles,
    setExploreProfiles,
    exploreHasMoreProfiles,
    setExploreHasMoreProfiles,
    exploreHasInitializedProfiles,
    setExploreHasInitializedProfiles,
  } = useContext(ExploreContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreHasInitializedProfiles) {
        await getExploreProfiles();
      }

      window.scroll({
        top: scrollRef.current.exploreProfiles.scrollY,
        behavior: 'instant',
      });

      const handleScroll = () =>
        (scrollRef.current.exploreProfiles.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }

    initialize();
  }, []);

  useEffect(() => {
    if (intersectingElement && exploreHasMoreProfiles) {
      getExploreProfiles();
    }
  }, [intersectingElement]);

  async function getExploreProfiles() {
    setIsLoading(true);
    const { data, hasMore } = await getProfiles(exploreProfiles.length);

    if (data.length > 0) {
      setExploreProfiles([...exploreProfiles, ...data]);
    }

    setExploreHasMoreProfiles(hasMore);
    setIsLoading(false);
    if (!exploreHasInitializedProfiles) setExploreHasInitializedProfiles(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {exploreProfiles.length > 0 && (
        <>
          {exploreProfiles.map((profile, index) => (
            <Link
              key={index}
              to={`/profile/${profile.username}`}
              className="flex flex-col gap-4 rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              ref={index === exploreProfiles.length - 1 ? elementRef : null}
              state={{ profile }}
            >
              <h1>{profile.username}</h1>
              {profile.display_name && <h2>{profile.display_name}</h2>}
            </Link>
          ))}
        </>
      )}
      {!exploreHasMoreProfiles && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreProfilesNestedLayout;
