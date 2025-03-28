import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useParams, Link } from 'react-router';
import { getUserByUsername } from '../common/database/users.js';
import { BUTTON_COLOR } from '../common/enums.js';
import {
  addFollower,
  removeFollower,
  getFollowerBySenderProfileIdAndReceiverProfileId,
} from '../common/database/followers.js';
import { addNotification } from '../common/database/notifications.js';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import Loading from '../components/Loading.jsx';
import Button from '../components/Button.jsx';

function User() {
  const location = useLocation();
  const { username } = useParams();
  const { authUser, isLoadingAuthUser } = useContext(AuthContext);
  const {
    activeUser,
    setActiveUser,
    setUserVideos,
    setUserClips,
    setUserDiscussions,
  } = useContext(DataContext);

  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isLoadingFollower, setIsLoadingFollower] = useState(false);
  const [isLoadingFollow, setIsLoadingFollow] = useState(false);
  const [follower, setFollower] = useState(null);

  const [isLoadingImage, setIsLoadingImage] = useState(true);

  useEffect(() => {
    if (!location.state?.user) {
      getUser();
    }

    if (location.state?.user) {
      if (!activeUser) {
        setActiveUser(location.state.user);
      }

      if (activeUser && activeUser.username !== location.state.user.username) {
        resetUser();
        getUser();
      }
    }
  }, [location]);

  useEffect(() => {
    if (activeUser) {
      // getFollower();
    }
  }, [activeUser]);

  async function getUser() {
    setIsLoadingUser(true);
    const { data } = await getUserByUsername(username);
    setActiveUser(data[0]);
    setIsLoadingUser(false);
  }

  async function getFollower() {
    setIsLoadingFollower(true);

    const { data } = await getFollowerBySenderProfileIdAndReceiverProfileId(
      authUser.id,
      activeUser.id
    );

    setFollower(data[0]);

    setIsLoadingFollower(false);
  }

  async function handleFollow() {
    setIsLoadingFollow(true);

    const { data } = await addFollower(authUser.id, activeUser.id);
    setFollower(data[0]);

    await addNotification(authUser.id, activeUser.id, 'FOLLOW');

    setIsLoadingFollow(false);
  }

  async function handleUnfollow() {
    setIsLoadingFollow(true);

    await removeFollower(follower.id);
    setFollower(null);

    setIsLoadingFollow(false);
  }

  function resetUser() {
    setUserVideos({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setUserClips({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
    setUserDiscussions({
      data: [],
      hasMore: true,
      hasInitialized: false,
    });
  }

  if (activeUser) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full max-w-[128px] rounded-full border-2 border-transparent">
            {activeUser.avatar_file_name && (
              <img
                src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${activeUser.avatar_file_name}`}
                alt={activeUser.avatar_file_name}
                width={128}
                height={128}
                className={`aspect-square w-full rounded-full object-center ${isLoadingImage ? 'hidden' : 'block'}`}
                onLoad={() => setIsLoadingImage(false)}
              />
            )}
            {activeUser.avatar_file_name && (
              <div
                className={`aspect-square animate-pulse rounded-full bg-neutral-200 ${isLoadingImage ? 'block' : 'hidden'}`}
              ></div>
            )}
            {!activeUser.avatar_file_name && (
              <div className="aspect-square max-h-[128px] w-full max-w-[128px] rounded-full bg-neutral-200"></div>
            )}
          </div>
          <h1>
            {activeUser.username}
            {activeUser.name && <span> - {activeUser.name}</span>}
          </h1>
          {activeUser.bio && <p>{activeUser.bio}</p>}
          {/* {authUser && authUser.id !== activeUser.id && !follower && (
            <Button
              color={BUTTON_COLOR.BLUE}
              handleClick={handleFollow}
              isDisabled={isLoadingFollow}
            >
              Follow
            </Button>
          )}
          {authUser && authUser.id !== activeUser.id && follower && (
            <Button
              color={BUTTON_COLOR.BLUE}
              handleClick={handleUnfollow}
              isDisabled={isLoadingFollow}
            >
              Unfollow
            </Button>
          )} */}
        </div>

        <nav className="flex w-full bg-sky-500 text-white">
          <Link className="px-4 py-2 text-xs" to="videos">
            Videos
          </Link>
          <Link className="px-4 py-2 text-xs" to="clips">
            Clips
          </Link>
          <Link className="px-4 py-2 text-xs" to="discussions">
            Discussions
          </Link>
        </nav>

        <Outlet />
      </div>
    );
  }
}

export default User;
