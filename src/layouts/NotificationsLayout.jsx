import { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../common/contexts.js';
import { Outlet } from 'react-router';
import NavPanel from '../components/NavPanel.jsx';

function NotificationsLayout() {
  const { user } = useContext(UserContext);

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
      <NavPanel links={[
        {
          pathname: '/notifications',
          to: 'pending-posts',
          state: {
            profile: user,
          },
          label: 'Pending Posts',
          show: true,
        },
        {
          to: 'accepted-posts',
          state: {
            profile: user,
          },
          label: 'Accepted Posts',
          show: true,
        },
        {
          to: 'rejected-posts',
          state: {
            profile: user,
          },
          label: 'Rejected Posts',
          show: true,
        },
        {
          to: 'views',
          state: {
            profile: user,
          },
          label: 'Views',
          show: true,
        },
        {
          to: 'likes',
          state: {
            profile: user,
          },
          label: 'Likes',
          show: true,
        },
        {
          to: 'followers',
          state: {
            profile: user,
          },
          label: 'Followers',
          show: true,
        },
        {
          to: 'comments',
          state: {
            profile: user,
          },
          label: 'Comments',
          show: true,
        },
      ]} />
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
