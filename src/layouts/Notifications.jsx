import { useEffect, useContext, useState, useRef } from 'react';
import { Link } from 'react-router';
import { getNotificationsByUserId } from '../common/database/notifications.js';
import { AuthContext } from '../common/context/AuthContextProvider.jsx';
import { DataContext } from '../common/context/DataContextProvider.jsx';
import { useElementIntersection } from '../common/hooks.js';
import { getDate } from '../common/helpers.js';
import { BUTTON_COLOR } from '../common/enums.js';
import Loading from '../components/Loading.jsx';
import Loaded from '../components/Loaded.jsx';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck.jsx';
import Button from '../components/Button.jsx';
import Header from '../components/Header.jsx';

function Notifications() {
  const { authUser } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [elementRef, intersectingElement] = useElementIntersection();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (authUser) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [authUser]);

  useEffect(() => {
    // setNotificationsCount(0);
    if (authUser && !notifications.hasInitialized) {
      _getNotifications();
    }
  }, [authUser]);

  useEffect(() => {
    if (intersectingElement && notifications.hasMore) {
      _getNotifications();
    }
  }, [intersectingElement]);

  async function _getNotifications() {
    setIsLoading(true);

    const { data, hasMore } = await getNotificationsByUserId(
      authUser.id,
      notifications.data.length
    );

    const _notifications = { ...notifications };

    if (data.length > 0) {
      _notifications.data = [...notifications.data, ...data];
    }

    _notifications.hasMore = hasMore;
    _notifications.hasInitialized = true;

    // setNewNotificationsCount(0);

    setNotifications(_notifications);

    setIsLoading(false);
  }

  // async function refreshNotifications() {
  //   setIsLoading(true);

  //   const _notifications = { ...notifications };

  //   const { data } = await getNotificationsByProfileId(
  //     authUser.id,
  //     0,
  //     newNotificationsCount
  //   );

  //   _notifications.data = [...data, ...notifications.data];

  //   setNewNotificationsCount(0);

  //   setNotifications(_notifications);

  //   setIsLoading(false);
  // }

  if (show) {
    return (
      <div className="flex w-full flex-col gap-4">
        {/* {notifications.hasInitialized && newNotificationsCount > 0 && (
          <Button
            color={BUTTON_COLOR.BLUE}
            handleClick={refreshNotifications}
            isDisabled={isLoading}
          >
            Refresh ({newNotificationsCount})
          </Button>
        )} */}
        <Header>Notifications</Header>
        {notifications.data.length > 0 && (
          <div className="flex flex-col divide-y-2 divide-neutral-100">
            {notifications.data.map((notification, index) => (
              <div
                key={notification.id}
                ref={
                  index === notifications.data.length - 1 ? elementRef : null
                }
                className="flex flex-col gap-2 py-4"
              >
                {notification.is_read && (
                  <div className="fill-neutral-700">
                    <SVGOutlineDoubleCheck />
                  </div>
                )}

                <p className="text-neutral-700">
                  {getDate(notification.created_at, true)}
                </p>

                {notification.type === 'PENDING' && (
                  <p>
                    Your post is pending approval and will be reviewed within 24
                    hours.
                  </p>
                )}

                {notification.type === 'ACCEPTED' && (
                  <p>Your post has been accepted!</p>
                )}

                {notification.type === 'REJECTED' && (
                  <p>
                    Your post has been rejected for not following platform rules
                    and guidelines. You have 24 hours to make any changes and
                    resubmit for approval before the post is permanently deleted
                    from your account.
                  </p>
                )}

                {notification.type === 'FOLLOW' && (
                  <p>
                    <Link
                      className="underline hover:text-neutral-700"
                      to={`/users/${notification.sender.username}`}
                    >
                      {notification.sender.username}
                    </Link>{' '}
                    started following you.
                  </p>
                )}

                {notification.type === 'VIEW_POST' && (
                  <p>
                    <Link
                      className="underline hover:text-neutral-700"
                      to={`/users/${notification.sender.username}`}
                    >
                      {notification.sender.username}
                    </Link>{' '}
                    viewed your post.
                  </p>
                )}

                {notification.type === 'LIKE_POST' && (
                  <p>
                    <Link
                      className="underline hover:text-neutral-700"
                      to={`/users/${notification.sender.username}`}
                    >
                      {notification.sender.username}
                    </Link>{' '}
                    liked your post.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {isLoading && <Loading />}
        {!notifications.hasMore && <Loaded />}
      </div>
    );
  }
}

export default Notifications;
