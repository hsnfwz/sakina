import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import { getProfileByUsername } from '../common/database/users.js';
import Loading from '../components/Loading.jsx';
import Button from '../components/Button.jsx';
import NavPanel from '../components/NavPanel.jsx';
import { BUTTON_COLOR } from '../common/enums.js';
import {
  addFollower,
  removeFollower,
  getFollowerBySenderProfileIdAndReceiverProfileId,
} from '../common/database/followers.js';
import { addNotification } from '../common/database/notifications.js';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';

function Profile() {
  const location = useLocation();
  const { username } = useParams();

  const { authUser } = useContext(AuthContext);
  const {
    activeProfile,
    setActiveProfile,
    setProfileAcceptedPosts,
    setProfilePendingPosts,
    setProfileRejectedPosts,
    setProfileArchivedPosts,
    setProfileViewedPosts,
    setProfileAcceptedComments,
    setProfilePendingComments,
    setProfileRejectedComments,
    setProfileArchivedComments,
    setProfileViewedComments,
    setProfileFollowers,
    setProfileFollowing,
  } = useContext(DataContext);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingFollower, setIsLoadingFollower] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [follower, setFollower] = useState(null);

  useEffect(() => {
    if (!location.state?.profile) {
      getProfile();
    }

    if (location.state?.profile) {
      if (!activeProfile) {
        setActiveProfile(location.state.profile);
      }

      if (
        activeProfile &&
        activeProfile.username !== location.state.profile.username
      ) {
        resetProfile();
        getProfile();
      }
    }
  }, [location]);

  useEffect(() => {
    if (activeProfile) {
      getFollower();
    }
  }, [activeProfile]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setActiveProfile(data[0]);
    setIsLoadingProfile(false);
  }

  async function getFollower() {
    setIsLoadingFollower(true);

    const { data } = await getFollowerBySenderProfileIdAndReceiverProfileId(
      authUser.id,
      activeProfile.id
    );

    setFollower(data[0]);

    setIsLoadingFollower(false);
  }

  function resetProfile() {
    setProfileAcceptedPosts({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfilePendingPosts({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileRejectedPosts({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileArchivedPosts({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileViewedPosts({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileAcceptedComments({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfilePendingComments({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileRejectedComments({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileArchivedComments({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileViewedComments({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileFollowers({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setProfileFollowing({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
  }

  async function handleFollow() {
    setIsLoadingFollow(true);

    const { data } = await addFollower(authUser.id, activeProfile.id);
    setFollower(data[0]);

    await addNotification(authUser.id, activeProfile.id, 'FOLLOW');

    setIsLoadingFollow(false);
  }

  async function handleUnfollow() {
    setIsLoadingFollow(true);

    await removeFollower(follower.id);
    setFollower(null);

    setIsLoadingFollow(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && activeProfile && (
        <>
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full max-w-[128px] rounded-full border-2 border-transparent">
              {activeProfile.avatar && (
                <img
                  src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${activeProfile.avatar.name}`}
                  alt={activeProfile.avatar.name}
                  width={activeProfile.avatar.width}
                  height={activeProfile.avatar.height}
                  className="aspect-square w-full max-w-[128px] rounded-full bg-black object-cover"
                />
              )}
              {!activeProfile.avatar && (
                <div className="aspect-square w-full max-w-[128px] rounded-full bg-neutral-700"></div>
              )}
            </div>
            <h1>
              {activeProfile.username}
              {activeProfile.name && <span> - {activeProfile.name}</span>}
            </h1>
            {activeProfile.bio && <p>{activeProfile.bio}</p>}
            {authUser && authUser.id !== activeProfile.id && !follower && (
              <Button
                buttonColor={BUTTON_COLOR.BLUE}
                handleClick={handleFollow}
                isDisabled={isLoadingFollow}
              >
                Follow
              </Button>
            )}
            {authUser && authUser.id !== activeProfile.id && follower && (
              <Button
                buttonColor={BUTTON_COLOR.BLUE}
                handleClick={handleUnfollow}
                isDisabled={isLoadingFollow}
              >
                Unfollow
              </Button>
            )}
          </div>
          <NavPanel
            links={[
              {
                pathname: `/profile/${username}`,
                to: 'accepted-posts',
                state: {
                  profile: activeProfile,
                },
                label: 'Accepted Posts',
                show: true,
              },
              {
                to: 'pending-posts',
                state: {
                  profile: activeProfile,
                },
                label: 'Pending Posts',
                show: authUser && activeProfile.id === authUser.id,
              },
              {
                to: 'rejected-posts',
                state: {
                  profile: activeProfile,
                },
                label: 'Rejected Posts',
                show: authUser && activeProfile.id === authUser.id,
              },
              {
                to: 'archived-posts',
                state: {
                  profile: activeProfile,
                },
                label: 'Archived Posts',
                show: authUser && activeProfile.id === authUser.id,
              },
              {
                to: 'viewed-posts',
                state: {
                  profile: activeProfile,
                },
                label: 'Viewed Posts',
                show: authUser && activeProfile.id === authUser.id,
              },
              {
                to: 'followers',
                state: {
                  profile: activeProfile,
                },
                label: 'Followers',
                show: true,
              },
              {
                to: 'following',
                state: {
                  profile: activeProfile,
                },
                label: 'Following',
                show: true,
              },
            ]}
          />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default Profile;
