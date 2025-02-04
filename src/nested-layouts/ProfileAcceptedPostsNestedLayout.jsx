import { useContext, useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useOutletContext } from 'react-router';
import {
  getAcceptedPostsByProfileId,
  getProfileByUsername,
} from '../common/supabase.js';
import { ExploreContext, UserContext } from '../common/contexts.js';

import Loading from '../components/Loading.jsx';
import Masonry from '../components/Masonry.jsx';
import Loaded from '../components/Loaded.jsx';

function ProfileAcceptedPostsNestedLayout() {
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
    profileAcceptedPosts,
    setProfileAcceptedPosts,
    profileIsLoadingAcceptedPosts,
    setProfileIsLoadingAcceptedPosts,
    profileHasMoreAcceptedPosts,
    setProfileHasMoreAcceptedPosts,
    profileHasInitializedAcceptedPosts,
    setProfileHasInitializedAcceptedPosts,
    profileScrollYAcceptedPosts,
    setProfileScrollYAcceptedPosts,
    profileElementRefAcceptedPosts,
    profileIntersectingElementAcceptedPosts,
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
      if (!profileHasInitializedAcceptedPosts) {
        getAcceptedPosts();
      }

      setTimeout(() => {
        window.scroll({
          top: profileScrollYAcceptedPosts,
          behavior: 'instant',
        });
      }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

      window.addEventListener('scroll', () => {
        scrollYRef.current = window.scrollY;
      });

      return () => {
        setProfileScrollYAcceptedPosts(scrollYRef.current);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (
      profileIntersectingElementAcceptedPosts &&
      profileHasMoreAcceptedPosts
    ) {
      getAcceptedPosts();
    }
  }, [profileIntersectingElementAcceptedPosts]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getAcceptedPosts() {
    setProfileIsLoadingAcceptedPosts(true);
    const { data, hasMore } = await getAcceptedPostsByProfileId(
      profile.id,
      profileAcceptedPosts.length
    );
    if (data.length > 0) {
      setProfileAcceptedPosts([...profileAcceptedPosts, ...data]);
    }
    setProfileHasMoreAcceptedPosts(hasMore);
    setProfileIsLoadingAcceptedPosts(false);
    if (!profileHasInitializedAcceptedPosts) {
      setProfileHasInitializedAcceptedPosts(true);
    }
  }

  return (
    <div>
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && (
        <>
          {profileAcceptedPosts.length > 0 && (
            <>
              <Masonry
                data={profileAcceptedPosts}
                elementRef={profileElementRefAcceptedPosts}
              />

              {!profileHasMoreAcceptedPosts && <Loaded />}
            </>
          )}
          {profileIsLoadingAcceptedPosts && <Loading />}
          {!profileIsLoadingAcceptedPosts &&
            profileAcceptedPosts.length === 0 && <Loaded />}
        </>
      )}
    </div>
  );
}

export default ProfileAcceptedPostsNestedLayout;
