import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useOutletContext } from 'react-router';
import { getProfileByUsername } from '../common/database/profiles.js';
import { getPendingPostsByProfileId } from '../common/database/posts.js';
import { ExploreContext, UserContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfilePendingPostsNestedLayout() {
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
    profilePendingPosts,
    setProfilePendingPosts,
    profileIsLoadingPendingPosts,
    setProfileIsLoadingPendingPosts,
    profileHasMorePendingPosts,
    setProfileHasMorePendingPosts,
    profileHasInitializedPendingPosts,
    setProfileHasInitializedPendingPosts,
    profileScrollYPendingPosts,
    setProfileScrollYPendingPosts,
    profileElementRefPendingPosts,
    profileIntersectingElementPendingPosts,
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
      if (!profileHasInitializedPendingPosts) {
        getPendingPosts();
      }

      setTimeout(() => {
        window.scroll({ top: profileScrollYPendingPosts, behavior: 'instant' });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYPendingPosts(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (profileIntersectingElementPendingPosts && profileHasMorePendingPosts) {
      getPendingPosts();
    }
  }, [profileIntersectingElementPendingPosts]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getPendingPosts() {
    setProfileIsLoadingPendingPosts(true);
    const { data, hasMore } = await getPendingPostsByProfileId(
      profile.id,
      profilePendingPosts.length
    );
    if (data.length > 0) {
      setProfilePendingPosts([...profilePendingPosts, ...data]);
    }
    setProfileHasMorePendingPosts(hasMore);
    setProfileIsLoadingPendingPosts(false);
    if (!profileHasInitializedPendingPosts) {
      setProfileHasInitializedPendingPosts(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && user && profile.id === user.id && (
        <>
          {profilePendingPosts.length > 0 && (
            <>
              <Masonry
                data={profilePendingPosts}
                elementRef={profileElementRefPendingPosts}
                scrollY={profileScrollYPendingPosts}
                setScrollY={setProfileScrollYPendingPosts}
              />

              {!profileHasMorePendingPosts && <Loaded />}
            </>
          )}
          {profileIsLoadingPendingPosts && <Loading />}
          {!profileIsLoadingPendingPosts &&
            profilePendingPosts.length === 0 && <Loaded />}
        </>
      )}
    </div>
  );
}

export default ProfilePendingPostsNestedLayout;
