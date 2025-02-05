import { useContext, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router';
import { getProfileByUsername, supabase } from '../common/supabase.js';
import { UserContext } from '../common/contexts.js';
import Loading from '../components/Loading.jsx';
import Button from '../components/Button.jsx';
import { useElementIntersection } from '../common/hooks.js';

function ProfileNestedLayout() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const { username } = useParams();

  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [profileAcceptedPosts, setProfileAcceptedPosts] = useState([]);
  const [profileIsLoadingAcceptedPosts, setProfileIsLoadingAcceptedPosts] =
    useState(false);
  const [profileHasMoreAcceptedPosts, setProfileHasMoreAcceptedPosts] =
    useState(true);
  const [
    profileHasInitializedAcceptedPosts,
    setProfileHasInitializedAcceptedPosts,
  ] = useState(false);
  const [profileScrollYAcceptedPosts, setProfileScrollYAcceptedPosts] =
    useState(0);
  const [
    profileElementRefAcceptedPosts,
    profileIntersectingElementAcceptedPosts,
  ] = useElementIntersection();

  const [profilePendingPosts, setProfilePendingPosts] = useState([]);
  const [profileIsLoadingPendingPosts, setProfileIsLoadingPendingPosts] =
    useState(false);
  const [profileHasMorePendingPosts, setProfileHasMorePendingPosts] =
    useState(true);
  const [
    profileHasInitializedPendingPosts,
    setProfileHasInitializedPendingPosts,
  ] = useState(false);
  const [profileScrollYPendingPosts, setProfileScrollYPendingPosts] =
    useState(0);
  const [
    profileElementRefPendingPosts,
    profileIntersectingElementPendingPosts,
  ] = useElementIntersection();

  const [profileRejectedPosts, setProfileRejectedPosts] = useState([]);
  const [profileIsLoadingRejectedPosts, setProfileIsLoadingRejectedPosts] =
    useState(false);
  const [profileHasMoreRejectedPosts, setProfileHasMoreRejectedPosts] =
    useState(true);
  const [
    profileHasInitializedRejectedPosts,
    setProfileHasInitializedRejectedPosts,
  ] = useState(false);
  const [profileScrollYRejectedPosts, setProfileScrollYRejectedPosts] =
    useState(0);
  const [
    profileElementRefRejectedPosts,
    profileIntersectingElementRejectedPosts,
  ] = useElementIntersection();

  const [profileArchivedPosts, setProfileArchivedPosts] = useState([]);
  const [profileIsLoadingArchivedPosts, setProfileIsLoadingArchivedPosts] =
    useState(false);
  const [profileHasMoreArchivedPosts, setProfileHasMoreArchivedPosts] =
    useState(true);
  const [
    profileHasInitializedArchivedPosts,
    setProfileHasInitializedArchivedPosts,
  ] = useState(false);
  const [profileScrollYArchivedPosts, setProfileScrollYArchivedPosts] =
    useState(0);
  const [
    profileElementRefArchivedPosts,
    profileIntersectingElementArchivedPosts,
  ] = useElementIntersection();

  const [profileViewedPosts, setProfileViewedPosts] = useState([]);
  const [profileIsLoadingViewedPosts, setProfileIsLoadingViewedPosts] =
    useState(false);
  const [profileHasMoreViewedPosts, setProfileHasMoreViewedPosts] =
    useState(true);
  const [
    profileHasInitializedViewedPosts,
    setProfileHasInitializedViewedPosts,
  ] = useState(false);
  const [profileScrollYViewedPosts, setProfileScrollYViewedPosts] = useState(0);
  const [profileElementRefViewedPosts, profileIntersectingElementViewedPosts] =
    useElementIntersection();

  const [profileFollowers, setProfileFollowers] = useState([]);
  const [profileIsLoadingFollowers, setProfileIsLoadingFollowers] =
    useState(false);
  const [profileHasMoreFollowers, setProfileHasMoreFollowers] = useState(true);
  const [profileHasInitializedFollowers, setProfileHasInitializedFollowers] =
    useState(false);
  const [profileScrollYFollowers, setProfileScrollYFollowers] = useState(0);
  const [profileElementRefFollowers, profileIntersectingElementFollowers] =
    useElementIntersection();

  const [profileFollowing, setProfileFollowing] = useState([]);
  const [profileIsLoadingFollowing, setProfileIsLoadingFollowing] =
    useState(false);
  const [profileHasMoreFollowing, setProfileHasMoreFollowing] = useState(true);
  const [profileHasInitializedFollowing, setProfileHasInitializedFollowing] =
    useState(false);
  const [profileScrollYFollowing, setProfileScrollYFollowing] = useState(0);
  const [profileElementRefFollowing, profileIntersectingElementFollowing] =
    useElementIntersection();

  useEffect(() => {
    if (location.state?.profile) {
      setProfile(location.state.profile);
    } else if (!location.state?.profile && !profile) {
      getProfile();
    }
  }, [location]);

  async function getProfile() {
    setIsLoadingProfile(true);
    const { data } = await getProfileByUsername(username);
    setProfile(data[0]);
    setIsLoadingProfile(false);
  }

  return (
    <div className="flex flex-col gap-4">
      {isLoadingProfile && <Loading />}
      {!isLoadingProfile && profile && (
        <>
          <div className="flex flex-col items-center gap-4">
            {profile.avatar_file && (
              <img
                src={`https://abitiahhgmflqcdphhww.supabase.co/storage/v1/object/public/avatars/${profile.avatar_file}`}
                alt={profile.avatar_file}
                width=""
                height=""
                className="aspect-square w-full max-w-[80px] rounded-full bg-black object-cover"
              />
            )}
            {!profile.avatar_file && (
              <div className="aspect-square w-full max-w-[80px] rounded-full bg-neutral-700"></div>
            )}
            <h1>
              {profile.username}
              {profile.display_name && <span> - {profile.display_name}</span>}
            </h1>
            {profile.bio && <p>{profile.bio}</p>}
            {user && user.id !== profile.id && (
              <Button
                handleClick={async () => {
                  const { data, error } = await supabase
                    .from('followers')
                    .insert({
                      sender_user_id: user.id,
                      receiver_user_id: profile.id,
                    })
                    .select();

                  if (error) {
                    console.log(error);
                  }
                }}
              >
                Follow
              </Button>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:hidden">
            <Link
              className={`${location.pathname === `/profile/${username}` || location.pathname.includes('accepted-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`accepted-posts`}
              state={{ profile }}
            >
              Posts
            </Link>
            {user && profile.id === user.id && (
              <>
                <Link
                  className={`${location.pathname.includes('pending-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
                  to={`pending-posts`}
                  state={{ profile }}
                >
                  Pending Posts
                </Link>
                <Link
                  className={`${location.pathname.includes('rejected-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
                  to={`rejected-posts`}
                  state={{ profile }}
                >
                  Rejected Posts
                </Link>
                <Link
                  className={`${location.pathname.includes('archived-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
                  to={`archived-posts`}
                  state={{ profile }}
                >
                  Archived Posts
                </Link>
                <Link
                  className={`${location.pathname.includes('viewed-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
                  to={`viewed-posts`}
                  state={{ profile }}
                >
                  Viewed Posts
                </Link>
              </>
            )}
            <Link
              className={`${location.pathname.includes('followers') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`followers`}
              state={{ profile }}
            >
              Followers
            </Link>
            <Link
              className={`${location.pathname.includes('following') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
              to={`following`}
              state={{ profile }}
            >
              Following
            </Link>
          </div>
          <Outlet
            context={{
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
            }}
          />
        </>
      )}
    </div>
  );
}

export default ProfileNestedLayout;
