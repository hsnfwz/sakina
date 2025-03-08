import { useEffect, useContext, useRef, useState } from 'react';
import { DataContext, ScrollContext } from '../common/contexts';
import Loaded from '../components/Loaded';
import Loading from '../components/Loading';
import { getProfiles } from '../common/database/profiles';
import { useElementIntersection } from '../common/hooks';
import SearchBar from '../components/SearchBar';
import { searchProfiles } from '../common/database/profiles.js';
import { SEARCH_TYPE } from '../common/enums.js';
import ProfilePreview from '../components/ProfilePreview.jsx';

function ExploreProfilesNestedLayout() {
  const { exploreProfiles, setExploreProfiles } = useContext(DataContext);

  const { scrollRef } = useContext(ScrollContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      if (!exploreProfiles.hasInitializedData) {
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
    if (intersectingElement && exploreProfiles.hasMoreData) {
      getExploreProfiles();
    }
  }, [intersectingElement]);

  async function getExploreProfiles() {
    setIsLoading(true);

    const { data, hasMore } = await getProfiles(exploreProfiles.data.length);

    const _exploreProfiles = { ...exploreProfiles };

    if (data.length > 0) {
      _exploreProfiles.data = [...exploreProfiles.data, ...data];
    }

    _exploreProfiles.hasMoreData = hasMore;

    if (!exploreProfiles.hasInitializedData) {
      _exploreProfiles.hasInitializedData = true;
    }

    setExploreProfiles(_exploreProfiles);

    setIsLoading(false);
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <SearchBar searchType={SEARCH_TYPE.PROFILES} search={searchProfiles} />
      {exploreProfiles.data.map((profile, index) => (
        <ProfilePreview key={index} profile={profile} />
      ))}
      {!exploreProfiles.hasMoreData && <Loaded />}
      {isLoading && <Loading />}
    </div>
  );
}

export default ExploreProfilesNestedLayout;
