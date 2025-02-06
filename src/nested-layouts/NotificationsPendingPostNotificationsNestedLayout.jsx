import { useEffect, useContext, useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getPendingPostsNotificationsByProfileId } from '../common/database/notifications';
import { UserContext, NotificationsContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { getDate } from '../common/helpers';
import SVGSolidCircle from '../components/svgs/solid/SVGSolidCircle';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck';

function NotificationsPendingPostNotificationsNestedLayout() {
  const { user } = useContext(UserContext);
  const { newNotification, setNewNotification } =
    useContext(NotificationsContext);

  const {
    pendingPostNotifications,
    setPendingPostNotifications,
    hasMorePendingPostNotifications,
    setHasMorePendingPostNotifications,
    hasInitializedPendingPostNotifications,
    setHasInitializedPendingPostNotifications,
    scrollRef,
  } = useOutletContext();

  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      await getNotifications();

      window.scroll({
        top: scrollRef.current.pendingPostNotifications.scrollY,
        behavior: 'instant',
      });
    }

    if (!hasInitializedPendingPostNotifications) {
      initialize();

      const handleScroll = () =>
        (scrollRef.current.pendingPostNotifications.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (newNotification && newNotification.type === 'PENDING') {
      refreshNotifications();
    }
  }, [newNotification]);

  useEffect(() => {
    if (intersectingElement && hasMorePendingPostNotifications) {
      getNotifications();
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoading(true);

    const { data, hasMore } = await getPendingPostsNotificationsByProfileId(
      user.id,
      pendingPostNotifications.length
    );

    if (data.length > 0) {
      setPendingPostNotifications([...pendingPostNotifications, ...data]);
    }

    setHasMorePendingPostNotifications(hasMore);

    if (!hasInitializedPendingPostNotifications) {
      setHasInitializedPendingPostNotifications(true);
    }

    setIsLoading(false);
  }

  async function refreshNotifications() {
    setIsLoading(true);
    setPendingPostNotifications([newNotification, ...pendingPostNotifications]);
    setIsLoading(false);
    setNewNotification(null);
  }

  return (
    <div>
      {pendingPostNotifications.length > 0 && (
        <div className="flex flex-col divide-y-2 divide-neutral-700">
          {pendingPostNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={
                index === pendingPostNotifications.length - 1
                  ? elementRef
                  : null
              }
              className="flex flex-col gap-2 py-4"
            >
              {notification.is_read && (
                <div className="fill-neutral-700">
                  <SVGOutlineDoubleCheck />
                </div>
              )}
              {!notification.is_read && (
                <div className="fill-sky-500">
                  <SVGSolidCircle />
                </div>
              )}
              <p className="text-neutral-700">
                {getDate(notification.created_at, true)}
              </p>
              <p>
                Your post is pending approval and will be reviewed within 24
                hours.
              </p>
              <Link
                to={`/profile/${user.username}/pending-posts`}
                className="underline hover:text-sky-500"
              >
                View PostNotification
              </Link>
            </div>
          ))}
        </div>
      )}
      {isLoading && <Loading />}
      {!hasMorePendingPostNotifications && <Loaded />}
    </div>
  );
}

export default NotificationsPendingPostNotificationsNestedLayout;
