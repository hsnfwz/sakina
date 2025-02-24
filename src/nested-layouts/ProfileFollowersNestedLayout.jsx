import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useOutletContext } from 'react-router';
import {
  getFollowersByProfileId,
  getProfileByUsername,
} from '../common/database/profiles.js';
import { ExploreContext, UserContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileFollowersNestedLayout() {
  const { username } = useParams();
  const location = useLocation();
  const { user } = useContext(UserContext);

  const scrollYRef = useRef(0);

  let contextValues;
  if (username === user.username) {
    contextValues = useContext(ExploreContext);
  } else {
    contextValues = useOutletContext();
  }

  const {
    profileFollowers,
    setProfileFollowers,
    profileIsLoadingFollowers,
    setProfileIsLoadingFollowers,
    profileHasMoreFollowers,
    setProfileHasMoreFollowers,
    profileHasInitializedFollowers,
    setProfileHasInitializedFollowers,
    profileScrollYFollowers,
    setProfileScrollYFollowers,
    profileElementRefFollowers,
    profileIntersectingElementFollowers,
  } = contextValues;

  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    if (location.state?.profile) {
      setProfile(location.state.profile);
    } else if (!location.state?.profile && !profile) {
      getProfile();
    }
  }, [location]);

  useEffect(() => {
    if (profile) {
      if (!profileHasInitializedFollowers) {
        getFollowers();
      }

      setTimeout(() => {
        window.scroll({ top: profileScrollYFollowers, behavior: 'instant' });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYFollowers(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (profileIntersectingElementFollowers && profileHasMoreFollowers) {
      getFollowers();
    }
  }, [profileIntersectingElementFollowers]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getFollowers() {
    setProfileIsLoadingFollowers(true);
    const { data, hasMore } = await getFollowersByProfileId(
      profile.id,
      profileFollowers.length
    );
    if (data.length > 0) {
      setProfileFollowers([...profileFollowers, ...data]);
    }
    setProfileHasMoreFollowers(hasMore);
    setProfileIsLoadingFollowers(false);
    if (!profileHasInitializedFollowers) {
      setProfileHasInitializedFollowers(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && (
        <>
          {profileFollowers.length > 0 && (
            <>
              <Masonry
                data={profileFollowers}
                elementRef={profileElementRefFollowers}
                scrollY={profileScrollYFollowers}
                setScrollY={setProfileScrollYFollowers}
              />

              {!profileHasMoreFollowers && <Loaded />}
            </>
          )}
          {profileIsLoadingFollowers && <Loading />}
          {!profileIsLoadingFollowers && profileFollowers.length === 0 && (
            <Loaded />
          )}
        </>
      )}
    </div>
  );
}

export default ProfileFollowersNestedLayout;
