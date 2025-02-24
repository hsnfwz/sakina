import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useOutletContext } from 'react-router';
import { getProfileByUsername } from '../common/database/profiles.js';
import { getArchivedPostsByProfileId } from '../common/database/posts.js';
import { ExploreContext, UserContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileArchivedPostsNestedLayout() {
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
    profileArchivedPosts,
    setProfileArchivedPosts,
    profileIsLoadingArchivedPosts,
    setProfileIsLoadingArchivedPosts,
    profileHasMoreArchivedPosts,
    setProfileHasMoreArchivedPosts,
    profileHasInitializedArchivedPosts,
    setProfileHasInitializedArchivedPosts,
    profileScrollYArchivedPosts,
    setProfileScrollYArchivedPosts,
    profileElementRefArchivedPosts,
    profileIntersectingElementArchivedPosts,
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
      if (!profileHasInitializedArchivedPosts) {
        getArchivedPosts();
      }

      setTimeout(() => {
        window.scroll({
          top: profileScrollYArchivedPosts,
          behavior: 'instant',
        });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYArchivedPosts(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (
      profileIntersectingElementArchivedPosts &&
      profileHasMoreArchivedPosts
    ) {
      getArchivedPosts();
    }
  }, [profileIntersectingElementArchivedPosts]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getArchivedPosts() {
    setProfileIsLoadingArchivedPosts(true);
    const { data, hasMore } = await getArchivedPostsByProfileId(
      profile.id,
      profileArchivedPosts.length
    );
    if (data.length > 0) {
      setProfileArchivedPosts([...profileArchivedPosts, ...data]);
    }
    setProfileHasMoreArchivedPosts(hasMore);
    setProfileIsLoadingArchivedPosts(false);
    if (!profileHasInitializedArchivedPosts) {
      setProfileHasInitializedArchivedPosts(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && user && profile.id === user.id && (
        <>
          {profileArchivedPosts.length > 0 && (
            <>
              <Masonry
                data={profileArchivedPosts}
                elementRef={profileElementRefArchivedPosts}
                scrollY={profileScrollYArchivedPosts}
                setScrollY={setProfileScrollYArchivedPosts}
              />

              {!profileHasMoreArchivedPosts && <Loaded />}
            </>
          )}
          {profileIsLoadingArchivedPosts && <Loading />}
          {!profileIsLoadingArchivedPosts &&
            profileArchivedPosts.length === 0 && <Loaded />}
        </>
      )}
    </div>
  );
}

export default ProfileArchivedPostsNestedLayout;
