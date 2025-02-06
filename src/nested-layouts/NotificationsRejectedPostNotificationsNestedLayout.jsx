import { useEffect, useContext, useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getRejectedPostsNotificationsByProfileId } from '../common/database/notifications';
import { UserContext, NotificationsContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { getDate } from '../common/helpers';
import SVGSolidCircle from '../components/svgs/solid/SVGSolidCircle';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck';

function NotificationsRejectedPostNotificationsNestedLayout() {
  const { user } = useContext(UserContext);
  const { newNotification, setNewNotification } =
    useContext(NotificationsContext);

  const {
    rejectedPostNotifications,
    setRejectedPostNotifications,
    hasMoreRejectedPostNotifications,
    setHasMoreRejectedPostNotifications,
    hasInitializedRejectedPostNotifications,
    setHasInitializedRejectedPostNotifications,
    scrollRef,
  } = useOutletContext();

  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      await getNotifications();

      window.scroll({
        top: scrollRef.current.rejectedPostNotifications.scrollY,
        behavior: 'instant',
      });
    }

    if (!hasInitializedRejectedPostNotifications) {
      initialize();

      const handleScroll = () =>
        (scrollRef.current.rejectedPostNotifications.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (newNotification && newNotification.type === 'REJECTED') {
      refreshNotifications();
    }
  }, [newNotification]);

  useEffect(() => {
    if (intersectingElement && hasMoreRejectedPostNotifications) {
      getNotifications();
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoading(true);

    const { data, hasMore } = await getRejectedPostsNotificationsByProfileId(
      user.id,
      rejectedPostNotifications.length
    );

    if (data.length > 0) {
      setRejectedPostNotifications([...rejectedPostNotifications, ...data]);
    }

    setHasMoreRejectedPostNotifications(hasMore);

    if (!hasInitializedRejectedPostNotifications) {
      setHasInitializedRejectedPostNotifications(true);
    }

    setIsLoading(false);
  }

  async function refreshNotifications() {
    setIsLoading(true);
    setRejectedPostNotifications([
      newNotification,
      ...rejectedPostNotifications,
    ]);
    setIsLoading(false);
    setNewNotification(null);
  }

  return (
    <div>
      {rejectedPostNotifications.length > 0 && (
        <div className="flex flex-col divide-y-2 divide-neutral-700">
          {rejectedPostNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={
                index === rejectedPostNotifications.length - 1
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
                Your post has been rejected for not following platform rules and
                guidelines. You have 24 hours to make any changes and resubmit
                for approval before the post is permanently deleted from your
                account.
              </p>
              <Link
                to={`/profile/${user.username}/rejected-posts`}
                className="underline hover:text-sky-500"
              >
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
      {isLoading && <Loading />}
      {!hasMoreRejectedPostNotifications && <Loaded />}
    </div>
  );
}

export default NotificationsRejectedPostNotificationsNestedLayout;
