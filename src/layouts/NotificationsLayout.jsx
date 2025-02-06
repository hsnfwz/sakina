import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../common/contexts.js';
import { Link, Outlet, useLocation } from 'react-router';

function NotificationsLayout() {
  const { user } = useContext(UserContext);
  const location = useLocation();

  const [acceptedPostNotifications, setAcceptedPostNotifications] = useState(
    []
  );
  const [
    hasMoreAcceptedPostNotifications,
    setHasMoreAcceptedPostNotifications,
  ] = useState(true);
  const [
    hasInitializedAcceptedPostNotifications,
    setHasInitializedAcceptedPostNotifications,
  ] = useState(false);

  const [pendingPostNotifications, setPendingPostNotifications] = useState([]);
  const [hasMorePendingPostNotifications, setHasMorePendingPostNotifications] =
    useState(true);
  const [
    hasInitializedPendingPostNotifications,
    setHasInitializedPendingPostNotifications,
  ] = useState(false);

  const [rejectedPostNotifications, setRejectedPostNotifications] = useState(
    []
  );
  const [
    hasMoreRejectedPostNotifications,
    setHasMoreRejectedPostNotifications,
  ] = useState(true);
  const [
    hasInitializedRejectedPostNotifications,
    setHasInitializedRejectedPostNotifications,
  ] = useState(false);

  const scrollRef = useRef({
    pendingPostNotifications: {
      scrollX: 0,
      scrollY: 0,
    },
    acceptedPostNotifications: {
      scrollX: 0,
      scrollY: 0,
    },
    rejectedPostNotifications: {
      scrollX: 0,
      scrollY: 0,
    },
  });

  const [likesPostNotifications, setLikes] = useState([]);
  const [viewsPostNotifications, setViews] = useState([]);
  const [commentsPostNotifications, setComments] = useState([]);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex">
        <Link
          className={`${location.pathname === `/notifications` || location.pathname.includes('pending-posts') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`pending-posts`}
          state={{ profile: user }}
        >
          Pending Posts
        </Link>
        <Link
          className={`${location.pathname.includes('accepted-posts') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`accepted-posts`}
          state={{ profile: user }}
        >
          Accepted Posts
        </Link>
        <Link
          className={`${location.pathname.includes('rejected-posts') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`rejected-posts`}
          state={{ profile: user }}
        >
          Rejected Posts
        </Link>
        <Link
          className={`${location.pathname.includes('views') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`views`}
          state={{ profile: user }}
        >
          Views
        </Link>
        <Link
          className={`${location.pathname.includes('likes') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`likes`}
          state={{ profile: user }}
        >
          Likes
        </Link>
        <Link
          className={`${location.pathname.includes('followers') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`followers`}
          state={{ profile: user }}
        >
          Followers
        </Link>
        <Link
          className={`${location.pathname.includes('comments') ? 'border-b-sky-500' : 'border-b-transparent'} border-b-2 p-2 hover:border-b-sky-500`}
          to={`comments`}
          state={{ profile: user }}
        >
          Comments
        </Link>
      </div>
      <Outlet
        context={{
          acceptedPostNotifications,
          setAcceptedPostNotifications,
          hasMoreAcceptedPostNotifications,
          setHasMoreAcceptedPostNotifications,
          hasInitializedAcceptedPostNotifications,
          setHasInitializedAcceptedPostNotifications,

          pendingPostNotifications,
          setPendingPostNotifications,
          hasMorePendingPostNotifications,
          setHasMorePendingPostNotifications,
          hasInitializedPendingPostNotifications,
          setHasInitializedPendingPostNotifications,

          rejectedPostNotifications,
          setRejectedPostNotifications,
          hasMoreRejectedPostNotifications,
          setHasMoreRejectedPostNotifications,
          hasInitializedRejectedPostNotifications,
          setHasInitializedRejectedPostNotifications,

          scrollRef,

          likesPostNotifications,
          setLikes,
          viewsPostNotifications,
          setViews,
          commentsPostNotifications,
          setComments,
        }}
      />
    </div>
  );
}

export default NotificationsLayout;
