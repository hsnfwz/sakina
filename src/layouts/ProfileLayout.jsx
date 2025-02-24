import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router';
import { supabase } from '../common/supabase.js';
import { getProfileByUsername } from '../common/database/profiles.js'
import { UserContext } from '../common/contexts.js';
import Loading from '../components/Loading.jsx';
import Button from '../components/Button.jsx';
import { useElementIntersection } from '../common/hooks.js';
import NavPanel from '../components/NavPanel.jsx';

function ProfileLayout() {
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

    const [profileAcceptedComments, setProfileAcceptedComments] = useState([]);
  const [profileIsLoadingAcceptedComments, setProfileIsLoadingAcceptedComments] =
    useState(false);
  const [profileHasMoreAcceptedComments, setProfileHasMoreAcceptedComments] =
    useState(true);
  const [
    profileHasInitializedAcceptedComments,
    setProfileHasInitializedAcceptedComments,
  ] = useState(false);
  const [profileScrollYAcceptedComments, setProfileScrollYAcceptedComments] =
    useState(0);
  const [
    profileElementRefAcceptedComments,
    profileIntersectingElementAcceptedComments,
  ] = useElementIntersection();

  const [profilePendingComments, setProfilePendingComments] = useState([]);
  const [profileIsLoadingPendingComments, setProfileIsLoadingPendingComments] =
    useState(false);
  const [profileHasMorePendingComments, setProfileHasMorePendingComments] =
    useState(true);
  const [
    profileHasInitializedPendingComments,
    setProfileHasInitializedPendingComments,
  ] = useState(false);
  const [profileScrollYPendingComments, setProfileScrollYPendingComments] =
    useState(0);
  const [
    profileElementRefPendingComments,
    profileIntersectingElementPendingComments,
  ] = useElementIntersection();

  const [profileRejectedComments, setProfileRejectedComments] = useState([]);
  const [profileIsLoadingRejectedComments, setProfileIsLoadingRejectedComments] =
    useState(false);
  const [profileHasMoreRejectedComments, setProfileHasMoreRejectedComments] =
    useState(true);
  const [
    profileHasInitializedRejectedComments,
    setProfileHasInitializedRejectedComments,
  ] = useState(false);
  const [profileScrollYRejectedComments, setProfileScrollYRejectedComments] =
    useState(0);
  const [
    profileElementRefRejectedComments,
    profileIntersectingElementRejectedComments,
  ] = useElementIntersection();

  const [profileArchivedComments, setProfileArchivedComments] = useState([]);
  const [profileIsLoadingArchivedComments, setProfileIsLoadingArchivedComments] =
    useState(false);
  const [profileHasMoreArchivedComments, setProfileHasMoreArchivedComments] =
    useState(true);
  const [
    profileHasInitializedArchivedComments,
    setProfileHasInitializedArchivedComments,
  ] = useState(false);
  const [profileScrollYArchivedComments, setProfileScrollYArchivedComments] =
    useState(0);
  const [
    profileElementRefArchivedComments,
    profileIntersectingElementArchivedComments,
  ] = useElementIntersection();

  const [profileViewedComments, setProfileViewedComments] = useState([]);
  const [profileIsLoadingViewedComments, setProfileIsLoadingViewedComments] =
    useState(false);
  const [profileHasMoreViewedComments, setProfileHasMoreViewedComments] =
    useState(true);
  const [
    profileHasInitializedViewedComments,
    setProfileHasInitializedViewedComments,
  ] = useState(false);
  const [profileScrollYViewedComments, setProfileScrollYViewedComments] = useState(0);
  const [profileElementRefViewedComments, profileIntersectingElementViewedComments] =
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
          <NavPanel links={[
            {
              pathname: `/profile/${username}`,
              to: 'accepted-posts',
              state: {
                profile,
              },
              label: 'Accepted Posts',
              show: true,
            },
            {
              to: 'pending-posts',
              state: {
                profile,
              },
              label: 'Pending Posts',
              show: user && profile.id === user.id,
            },
            {
              to: 'rejected-posts',
              state: {
                profile,
              },
              label: 'Rejected Posts',
              show: user && profile.id === user.id,
            },
            {
              to: 'archived-posts',
              state: {
                profile,
              },
              label: 'Archived Posts',
              show: user && profile.id === user.id,
            },
            {
              to: 'viewed-posts',
              state: {
                profile,
              },
              label: 'Viewed Posts',
              show: user && profile.id === user.id,
            },
            {
              to: 'followers',
              state: {
                profile,
              },
              label: 'Followers',
              show: true,
            },
            {
              to: 'following',
              state: {
                profile,
              },
              label: 'Following',
              show: true,
            },
          ]} />
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

              profileAcceptedComments,
                        setProfileAcceptedComments,
                        profileIsLoadingAcceptedComments,
                        setProfileIsLoadingAcceptedComments,
                        profileHasMoreAcceptedComments,
                        setProfileHasMoreAcceptedComments,
                        profileHasInitializedAcceptedComments,
                        setProfileHasInitializedAcceptedComments,
                        profileScrollYAcceptedComments,
                        setProfileScrollYAcceptedComments,
                        profileElementRefAcceptedComments,
                        profileIntersectingElementAcceptedComments,
                        profilePendingComments,
                        setProfilePendingComments,
                        profileIsLoadingPendingComments,
                        setProfileIsLoadingPendingComments,
                        profileHasMorePendingComments,
                        setProfileHasMorePendingComments,
                        profileHasInitializedPendingComments,
                        setProfileHasInitializedPendingComments,
                        profileScrollYPendingComments,
                        setProfileScrollYPendingComments,
                        profileElementRefPendingComments,
                        profileIntersectingElementPendingComments,
                        profileRejectedComments,
                        setProfileRejectedComments,
                        profileIsLoadingRejectedComments,
                        setProfileIsLoadingRejectedComments,
                        profileHasMoreRejectedComments,
                        setProfileHasMoreRejectedComments,
                        profileHasInitializedRejectedComments,
                        setProfileHasInitializedRejectedComments,
                        profileScrollYRejectedComments,
                        setProfileScrollYRejectedComments,
                        profileElementRefRejectedComments,
                        profileIntersectingElementRejectedComments,
                        profileArchivedComments,
                        setProfileArchivedComments,
                        profileIsLoadingArchivedComments,
                        setProfileIsLoadingArchivedComments,
                        profileHasMoreArchivedComments,
                        setProfileHasMoreArchivedComments,
                        profileHasInitializedArchivedComments,
                        setProfileHasInitializedArchivedComments,
                        profileScrollYArchivedComments,
                        setProfileScrollYArchivedComments,
                        profileElementRefArchivedComments,
                        profileIntersectingElementArchivedComments,
                        profileViewedComments,
                        setProfileViewedComments,
                        profileIsLoadingViewedComments,
                        setProfileIsLoadingViewedComments,
                        profileHasMoreViewedComments,
                        setProfileHasMoreViewedComments,
                        profileHasInitializedViewedComments,
                        setProfileHasInitializedViewedComments,
                        profileScrollYViewedComments,
                        setProfileScrollYViewedComments,
                        profileElementRefViewedComments,
                        profileIntersectingElementViewedComments,

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

export default ProfileLayout;
