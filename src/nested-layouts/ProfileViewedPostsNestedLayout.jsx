import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router';
import { getProfileByUsername } from '../common/database/profiles.js';
import { getViewedPostsByProfileId } from '../common/database/posts.js';
import { DataContext, AuthContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileViewedPostsNestedLayout() {
  const { username } = useParams();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const scrollYRef = useRef(0);

  const {
    profileViewedPosts,
    setProfileViewedPosts,
    profileIsLoadingViewedPosts,
    setProfileIsLoadingViewedPosts,
    profileHasMoreViewedPosts,
    setProfileHasMoreViewedPosts,
    profileHasInitializedViewedPosts,
    setProfileHasInitializedViewedPosts,
    profileScrollYViewedPosts,
    setProfileScrollYViewedPosts,
    profileElementRefViewedPosts,
    profileIntersectingElementViewedPosts,
  } = useContext(DataContext);

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
      if (!profileHasInitializedViewedPosts) {
        getViewedPosts();
      }

      setTimeout(() => {
        window.scroll({ top: profileScrollYViewedPosts, behavior: 'instant' });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYViewedPosts(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (profileIntersectingElementViewedPosts && profileHasMoreViewedPosts) {
      getViewedPosts();
    }
  }, [profileIntersectingElementViewedPosts]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getViewedPosts() {
    setProfileIsLoadingViewedPosts(true);
    const { data, hasMore } = await getViewedPostsByProfileId(
      profile.id,
      profileViewedPosts.length
    );
    if (data.length > 0) {
      setProfileViewedPosts([...profileViewedPosts, ...data]);
    }
    setProfileHasMoreViewedPosts(hasMore);
    setProfileIsLoadingViewedPosts(false);
    if (!profileHasInitializedViewedPosts) {
      setProfileHasInitializedViewedPosts(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && user && profile.id === user.id && (
        <>
          {/* {profileViewedPosts.length > 0 && (
            <>
              <Masonry
                data={profileViewedPosts}
                elementRef={profileElementRefViewedPosts}
                scrollY={profileScrollYViewedPosts}
                setScrollY={setProfileScrollYViewedPosts}
              />

              {!profileHasMoreViewedPosts && <Loaded />}
            </>
          )} */}
          {profileIsLoadingViewedPosts && <Loading />}
          {!profileIsLoadingViewedPosts && profileViewedPosts.length === 0 && (
            <Loaded />
          )}
        </>
      )}
    </div>
  );
}

export default ProfileViewedPostsNestedLayout;
