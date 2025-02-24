import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useOutletContext } from 'react-router';
import {
  getFollowingByProfileId,
  getProfileByUsername,
} from '../common/database/profiles.js';
import { ExploreContext, UserContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileFollowingNestedLayout() {
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
    profileFollowing,
    setProfileFollowing,
    profileIsLoadingFollowing,
    setProfileIsLoadingFollowing,
    profileHasMoreFollowing,
    setProfileHasMoreFollowing,
    profileHasInitializedFollowing,
    setProfileHasInitializedFollowing,
    profileScrollYFollowing,
    setProfileScrollYFollowing,
    profileElementRefFollowing,
    profileIntersectingElementFollowing,
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
      if (!profileHasInitializedFollowing) {
        getFollowing();
      }

      setTimeout(() => {
        window.scroll({ top: profileScrollYFollowing, behavior: 'instant' });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYFollowing(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (profileIntersectingElementFollowing && profileHasMoreFollowing) {
      getFollowing();
    }
  }, [profileIntersectingElementFollowing]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getFollowing() {
    setProfileIsLoadingFollowing(true);
    const { data, hasMore } = await getFollowingByProfileId(
      profile.id,
      profileFollowing.length
    );
    if (data.length > 0) {
      setProfileFollowing([...profileFollowing, ...data]);
    }
    setProfileHasMoreFollowing(hasMore);
    setProfileIsLoadingFollowing(false);
    if (!profileHasInitializedFollowing) {
      setProfileHasInitializedFollowing(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && (
        <>
          {profileFollowing.length > 0 && (
            <>
              <Masonry
                data={profileFollowing}
                elementRef={profileElementRefFollowing}
                scrollY={profileScrollYFollowing}
                setScrollY={setProfileScrollYFollowing}
              />

              {!profileHasMoreFollowing && <Loaded />}
            </>
          )}
          {profileIsLoadingFollowing && <Loading />}
          {!profileIsLoadingFollowing && profileFollowing.length === 0 && (
            <Loaded />
          )}
        </>
      )}
    </div>
  );
}

export default ProfileFollowingNestedLayout;
