import { useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router';
import { ExploreContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getProfiles } from '../common/supabase';

function ExploreProfilesNestedLayout() {
  const {
    profiles,
    setProfiles,
    elementRefProfiles,
    intersectingElementProfiles,
    scrollYProfiles,
    setScrollYProfiles,
    hasMoreProfiles,
    setHasMoreProfiles,
    isLoadingProfiles,
    setIsLoadingProfiles,
    hasInitializedProfiles,
    setHasInitializedProfiles,
  } = useContext(ExploreContext);

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!hasInitializedProfiles) {
      getExploreProfiles();
    }
    window.scroll({ top: scrollYProfiles, behavior: 'instant' });

    window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY;
    });

    return () => {
      setScrollYProfiles(scrollYRef.current);
    };
  }, []);

  useEffect(() => {
    if (intersectingElementProfiles && hasMoreProfiles) {
      getExploreProfiles();
    }
  }, [intersectingElementProfiles]);

  async function getExploreProfiles() {
    setIsLoadingProfiles(true);
    const { data, hasMore } = await getProfiles(profiles.length);

    if (data.length > 0) {
      setProfiles([...profiles, ...data]);
    }

    setHasMoreProfiles(hasMore);
    setIsLoadingProfiles(false);
    if (!hasInitializedProfiles) setHasInitializedProfiles(true);
  }

  return (
    <div>
      {profiles.length > 0 && (
        <div className="flex flex-col gap-4">
          {profiles.map((profile, index) => (
            <Link
              key={index}
              to={`/profile/${profile.username}`}
              className="flex flex-col gap-4 rounded-lg border-2 border-neutral-700 p-2 hover:border-white focus:border-2 focus:border-white focus:outline-none focus:ring-0"
              ref={index === profiles.length - 1 ? elementRefProfiles : null}
              state={{ profile }}
            >
              <h1>{profile.username}</h1>
              {profile.display_name && <h2>{profile.display_name}</h2>}
            </Link>
          ))}
          {!hasMoreProfiles && <Loaded />}
        </div>
      )}
      {isLoadingProfiles && <Loading />}
    </div>
  );
}

export default ExploreProfilesNestedLayout;
