import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../common/contexts.js';
import { Link, Outlet, useLocation } from 'react-router';

function NotificationsLayout() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const [
    isLoadingAcceptedPostsNotifications,
    setIsLoadingAcceptedPostsNotifications,
  ] = useState(false);
  const [acceptedPostsNotifications, setAcceptedPostsNotifications] = useState(
    []
  );
  const [
    acceptedPostsNotificationsHasMore,
    setAcceptedPostsNotificationsHasMore,
  ] = useState(true);
  const [
    acceptedPostsNotificationsHasInitialized,
    setAcceptedPostsNotificationsHasInitialized,
  ] = useState(false);
  const [
    acceptedPostsNotificationsScrollY,
    setAcceptedPostsNotificationsScrollY,
  ] = useState(0);

  const [
    isLoadingPendingPostsNotifications,
    setIsLoadingPendingPostsNotifications,
  ] = useState(false);
  const [pendingPostsNotifications, setPendingPostsNotifications] = useState(
    []
  );
  const [
    pendingPostsNotificationsHasMore,
    setPendingPostsNotificationsHasMore,
  ] = useState(true);
  const [
    pendingPostsNotificationsHasInitialized,
    setPendingPostsNotificationsHasInitialized,
  ] = useState(false);
  const [
    pendingPostsNotificationsScrollY,
    setPendingPostsNotificationsScrollY,
  ] = useState(0);

  const [
    isLoadingRejectedPostsNotifications,
    setIsLoadingRejectedPostsNotifications,
  ] = useState(false);
  const [rejectedPostsNotifications, setRejectedPostsNotifications] = useState(
    []
  );
  const [
    rejectedPostsNotificationsHasMore,
    setRejectedPostsNotificationsHasMore,
  ] = useState(true);
  const [
    rejectedPostsNotificationsHasInitialized,
    setRejectedPostsNotificationsHasInitialized,
  ] = useState(false);
  const [
    rejectedPostsNotificationsScrollY,
    setRejectedPostsNotificationsScrollY,
  ] = useState(0);

  const [likesPostsNotifications, setLikesNotifications] = useState([]);
  const [viewsPostsNotifications, setViewsNotifications] = useState([]);
  const [commentsPostsNotifications, setCommentsNotifications] = useState([]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:hidden">
        <Link
          className={`${location.pathname === `/notifications` || location.pathname.includes('accepted-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`accepted-posts`}
          state={{ profile: user }}
        >
          Accepted Posts
        </Link>
        <Link
          className={`${location.pathname.includes('pending-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`pending-posts`}
          state={{ profile: user }}
        >
          Pending Posts
        </Link>
        <Link
          className={`${location.pathname.includes('rejected-posts') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`rejected-posts`}
          state={{ profile: user }}
        >
          Rejected Posts
        </Link>
        <Link
          className={`${location.pathname.includes('views') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`views`}
          state={{ profile: user }}
        >
          Views
        </Link>
        <Link
          className={`${location.pathname.includes('likes') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`likes`}
          state={{ profile: user }}
        >
          Likes
        </Link>
        <Link
          className={`${location.pathname.includes('followers') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`followers`}
          state={{ profile: user }}
        >
          Followers
        </Link>
        <Link
          className={`${location.pathname.includes('comments') ? 'bg-sky-500 text-white' : 'bg-transparent text-sky-500'} rounded-lg border-2 border-transparent p-2 hover:border-sky-500`}
          to={`comments`}
          state={{ profile: user }}
        >
          Comments
        </Link>
      </div>

      <Outlet
        context={{
          isLoadingAcceptedPostsNotifications,
          setIsLoadingAcceptedPostsNotifications,
          acceptedPostsNotifications,
          setAcceptedPostsNotifications,
          acceptedPostsNotificationsHasMore,
          setAcceptedPostsNotificationsHasMore,
          acceptedPostsNotificationsHasInitialized,
          setAcceptedPostsNotificationsHasInitialized,
          acceptedPostsNotificationsScrollY,
          setAcceptedPostsNotificationsScrollY,

          isLoadingPendingPostsNotifications,
          setIsLoadingPendingPostsNotifications,
          pendingPostsNotifications,
          setPendingPostsNotifications,
          pendingPostsNotificationsHasMore,
          setPendingPostsNotificationsHasMore,
          pendingPostsNotificationsHasInitialized,
          setPendingPostsNotificationsHasInitialized,
          pendingPostsNotificationsScrollY,
          setPendingPostsNotificationsScrollY,

          isLoadingRejectedPostsNotifications,
          setIsLoadingRejectedPostsNotifications,
          rejectedPostsNotifications,
          setRejectedPostsNotifications,
          rejectedPostsNotificationsHasMore,
          setRejectedPostsNotificationsHasMore,
          rejectedPostsNotificationsHasInitialized,
          setRejectedPostsNotificationsHasInitialized,
          rejectedPostsNotificationsScrollY,
          setRejectedPostsNotificationsScrollY,

          likesPostsNotifications,
          setLikesNotifications,
          viewsPostsNotifications,
          setViewsNotifications,
          commentsPostsNotifications,
          setCommentsNotifications,
        }}
      />
    </div>
  );
}

export default NotificationsLayout;
