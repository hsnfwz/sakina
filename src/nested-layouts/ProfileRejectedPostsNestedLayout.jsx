import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useOutletContext } from 'react-router';
import { getProfileByUsername } from '../common/database/profiles.js';
import { getRejectedPostsByProfileId } from '../common/database/posts.js';
import { ExploreContext, UserContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileRejectedPostsNestedLayout() {
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
    profileRejectedPosts,
    setProfileRejectedPosts,
    profileIsLoadingRejectedPosts,
    setProfileIsLoadingRejectedPosts,
    profileHasMoreRejectedPosts,
    setProfileHasMoreRejectedPosts,
    profileHasInitializedRejectedPosts,
    setProfileHasInitializedRejectedPosts,
    profileScrollYRejectedPosts,
    setProfileScrollYRejectedPosts,
    profileElementRefRejectedPosts,
    profileIntersectingElementRejectedPosts,
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
    if (profile && user && profile.id === user.id) {
      if (!profileHasInitializedRejectedPosts) {
        getRejectedPosts();
      }

      setTimeout(() => {
        window.scroll({
          top: profileScrollYRejectedPosts,
          behavior: 'instant',
        });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYRejectedPosts(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (
      profileIntersectingElementRejectedPosts &&
      profileHasMoreRejectedPosts
    ) {
      getRejectedPosts();
    }
  }, [profileIntersectingElementRejectedPosts]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getRejectedPosts() {
    setProfileIsLoadingRejectedPosts(true);
    const { data, hasMore } = await getRejectedPostsByProfileId(
      profile.id,
      profileRejectedPosts.length
    );
    if (data.length > 0) {
      setProfileRejectedPosts([...profileRejectedPosts, ...data]);
    }
    setProfileHasMoreRejectedPosts(hasMore);
    setProfileIsLoadingRejectedPosts(false);
    if (!profileHasInitializedRejectedPosts) {
      setProfileHasInitializedRejectedPosts(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && user && profile.id === user.id && (
        <>
          {profileRejectedPosts.length > 0 && (
            <>
              <Masonry
                data={profileRejectedPosts}
                elementRef={profileElementRefRejectedPosts}
                scrollY={profileScrollYRejectedPosts}
                setScrollY={setProfileScrollYRejectedPosts}
              />

              {!profileHasMoreRejectedPosts && <Loaded />}
            </>
          )}
          {profileIsLoadingRejectedPosts && <Loading />}
          {!profileIsLoadingRejectedPosts &&
            profileRejectedPosts.length === 0 && <Loaded />}
        </>
      )}
    </div>
  );
}

export default ProfileRejectedPostsNestedLayout;
