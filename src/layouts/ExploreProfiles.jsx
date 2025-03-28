import { useEffect, useContext, useRef, useState } from 'react';
import { ScrollContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getUsers } from '../common/database/users.js';
import { useElementIntersection } from '../common/hooks';
import SearchBar from '../components/SearchBar';
import { SEARCH_TYPE } from '../common/enums.js';
import ProfilePreview from '../components/ProfilePreview.jsx';
import { DataContext } from '../common/context/DataContextProvider.jsx';

function ExploreProfiles() {
  const { exploreProfiles, setExploreProfiles } = useContext(DataContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreProfiles.hasInitialized) {
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
    if (intersectingElement && exploreProfiles.hasMore) {
      getExploreProfiles();
    }
  }, [intersectingElement]);

  async function getExploreProfiles() {
    setIsLoading(true);

    const { data, hasMore } = await getUsers(exploreProfiles.data.length);

    const _exploreProfiles = { ...exploreProfiles };

    if (data.length > 0) {
      _exploreProfiles.data = [...exploreProfiles.data, ...data];
    }

    _exploreProfiles.hasMore = hasMore;

    if (!exploreProfiles.hasInitialized) {
      _exploreProfiles.hasInitialized = true;
    }

    setExploreProfiles(_exploreProfiles);

    setIsLoading(false);
  }

  return (
    <div className="mx-auto mb-[60px] flex w-full max-w-(--breakpoint-md) flex-col gap-4 py-4">
      {exploreProfiles.data.map((profile, index) => (
        <ProfilePreview key={index} profile={profile} />
      ))}
      {!exploreProfiles.hasMore && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreProfiles;
