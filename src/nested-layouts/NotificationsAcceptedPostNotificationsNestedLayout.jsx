import { useEffect, useContext, useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getAcceptedPostsNotificationsByProfileId } from '../common/database/notifications';
import { UserContext, NotificationsContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { getDate } from '../common/helpers';
import SVGSolidCircle from '../components/svgs/solid/SVGSolidCircle';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck';

function NotificationsAcceptedPostNotificationsNestedLayout() {
  const { user } = useContext(UserContext);
  const { newNotification, setNewNotification } =
    useContext(NotificationsContext);

  const {
    acceptedPostNotifications,
    setAcceptedPostNotifications,
    hasMoreAcceptedPostNotifications,
    setHasMoreAcceptedPostNotifications,
    hasInitializedAcceptedPostNotifications,
    setHasInitializedAcceptedPostNotifications,
    scrollRef,
  } = useOutletContext();

  const [elementRef, intersectingElement] = useElementIntersection();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function initialize() {
      await getNotifications();

      window.scroll({
        top: scrollRef.current.acceptedPostNotifications.scrollY,
        behavior: 'instant',
      });
    }

    if (!hasInitializedAcceptedPostNotifications) {
      initialize();

      const handleScroll = () =>
        (scrollRef.current.acceptedPostNotifications.scrollY = window.scrollY);

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (newNotification && newNotification.type === 'ACCEPTED') {
      refreshNotifications();
    }
  }, [newNotification]);

  useEffect(() => {
    if (intersectingElement && hasMoreAcceptedPostNotifications) {
      getNotifications();
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoading(true);

    const { data, hasMore } = await getAcceptedPostsNotificationsByProfileId(
      user.id,
      acceptedPostNotifications.length
    );

    if (data.length > 0) {
      setAcceptedPostNotifications([...acceptedPostNotifications, ...data]);
    }

    setHasMoreAcceptedPostNotifications(hasMore);

    if (!hasInitializedAcceptedPostNotifications) {
      setHasInitializedAcceptedPostNotifications(true);
    }

    setIsLoading(false);
  }

  async function refreshNotifications() {
    setIsLoading(true);
    setAcceptedPostNotifications([
      newNotification,
      ...acceptedPostNotifications,
    ]);
    setIsLoading(false);
    setNewNotification(null);
  }

  return (
    <div>
      {acceptedPostNotifications.length > 0 && (
        <div className="flex flex-col divide-y-2 divide-neutral-700">
          {acceptedPostNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={
                index === acceptedPostNotifications.length - 1
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
              <p>Your post has been accepted!</p>
              <Link
                to={`/post/${notification.post_id.id}`}
                className="underline hover:text-sky-500"
              >
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
      {isLoading && <Loading />}
      {!hasMoreAcceptedPostNotifications && <Loaded />}
    </div>
  );
}

export default NotificationsAcceptedPostNotificationsNestedLayout;
