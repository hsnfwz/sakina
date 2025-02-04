import { useEffect, useContext, useState, useRef } from 'react';
import { Link, useOutletContext } from 'react-router';
import { getPendingPostsNotificationsByProfileId } from '../common/supabase';
import { UserContext, NotificationsContext } from '../common/contexts';
import { useElementIntersection } from '../common/hooks';
import Loading from '../components/Loading';
import Loaded from '../components/Loaded';
import Button from '../components/Button';
import { getDate } from '../common/helpers';
import SVGSolidCircle from '../components/svgs/solid/SVGSolidCircle';
import SVGOutlineDoubleCheck from '../components/svgs/outline/SVGOutlineDoubleCheck';

function NotificationsPendingPostsNestedLayout() {
  const { user } = useContext(UserContext);
  const [elementRef, intersectingElement] = useElementIntersection();

  const { newNotification } = useContext(NotificationsContext);

  const {
    isLoadingPendingPostsNotifications,
    setIsLoadingPendingPostsNotifications,
    pendingPostsNotificationsHasInitialized,
    setPendingPostsNotificationsHasInitialized,
    pendingPostsNotificationsHasMore,
    setPendingPostsNotificationsHasMore,
    pendingPostsNotifications,
    setPendingPostsNotifications,
    pendingPostsNotificationsScrollY,
    setPendingPostsNotificationsScrollY,
  } = useOutletContext();

  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!pendingPostsNotificationsHasInitialized) {
      getNotifications();
    }

    setTimeout(() => {
      window.scroll({
        top: pendingPostsNotificationsScrollY,
        behavior: 'instant',
      });
    }, 0); // listens for the first 'tick' before scrolling - need this so we can scroll once masonry is loaded

    window.addEventListener('scroll', () => {
      scrollYRef.current = window.scrollY;
    });

    return () => {
      setPendingPostsNotificationsScrollY(scrollYRef.current);
    };
  }, []);

  useEffect(() => {
    if (newNotification && newNotification.type === 'PENDING') {
      refreshNotifications();
    }
  }, [newNotification]);

  useEffect(() => {
    if (intersectingElement && pendingPostsNotificationsHasMore) {
      getNotifications();
    }
  }, [intersectingElement]);

  async function getNotifications() {
    setIsLoadingPendingPostsNotifications(true);

    const { data, hasMore } = await getPendingPostsNotificationsByProfileId(
      user.id,
      pendingPostsNotifications.length
    );

    if (data.length > 0) {
      setPendingPostsNotifications([...pendingPostsNotifications, ...data]);
    }

    setPendingPostsNotificationsHasMore(hasMore);

    if (!pendingPostsNotificationsHasInitialized) {
      setPendingPostsNotificationsHasInitialized(true);
    }

    setIsLoadingPendingPostsNotifications(false);
  }

  async function refreshNotifications() {
    setIsLoadingPendingPostsNotifications(true);
    setPendingPostsNotifications([
      newNotification,
      ...pendingPostsNotifications,
    ]);
    setIsLoadingPendingPostsNotifications(false);
  }

  return (
    <div>
      {pendingPostsNotifications.length > 0 && (
        <div className="flex flex-col divide-y-2 divide-neutral-700">
          {pendingPostsNotifications.map((notification, index) => (
            <div
              key={notification.id}
              ref={
                index === pendingPostsNotifications.length - 1
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
                View Post
              </Link>
            </div>
          ))}
        </div>
      )}
      {isLoadingPendingPostsNotifications && <Loading />}
      {!pendingPostsNotificationsHasMore && <Loaded />}
    </div>
  );
}

export default NotificationsPendingPostsNestedLayout;
